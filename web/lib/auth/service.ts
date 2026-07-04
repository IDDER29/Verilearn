/**
 * Auth service: sign-up, sign-in, and session authentication over the store.
 * Composes password hashing, the age gate, signed sessions, and the RBAC default
 * role. Traces to AUTH-03 (email/password sign-up), AUTH (session), SEC-11 (age gate).
 */
import type { Db } from "@/lib/store/db";
import { userByEmail } from "@/lib/store/db";
import { defaultPrefs, type Session, type User } from "@/lib/store/entities";
import { ageGate } from "./age";
import { hashPassword, verifyPassword } from "./password";
import { SESSION_TTL_MS, SHORT_SESSION_TTL_MS, signToken, verifyToken } from "./session";

export type AuthErrorCode =
  | "email_taken"
  | "invalid_email"
  | "weak_password"
  | "invalid_credentials"
  | "age_gate_blocked"
  | "locked_out";

/** Failed-sign-in lockout/backoff thresholds (AUTH-06/AUTH-23). */
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60_000; // 15 minutes

export class AuthError extends Error {
  constructor(public code: AuthErrorCode, message: string) {
    super(message);
    this.name = "AuthError";
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SignUpInput {
  email: string;
  password: string;
  displayName: string;
  birthYear?: number;
}

export interface AuthResult {
  user: User;
  token: string;
}

function createSession(
  db: Db,
  userId: string,
  secret: string,
  now: number,
  tokenNonce: string,
  userAgent?: string,
  ttlMs: number = SESSION_TTL_MS,
): { token: string; session: Session } {
  const exp = now + ttlMs;
  const token = signToken({ userId, exp }, secret) + "." + tokenNonce;
  // store the signed body (without nonce) keyed for revocation lookup
  const session: Session = { token, userId, expiresAt: exp, createdAt: now, userAgent };
  db.sessions.set(token, session);
  return { token, session };
}

export function signUp(db: Db, input: SignUpInput, opts: { now: number; secret: string; userId: string; tokenNonce: string; userAgent?: string }): AuthResult {
  const email = input.email.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new AuthError("invalid_email", "Enter a valid email address.");
  if (input.password.length < 8) throw new AuthError("weak_password", "Password must be at least 8 characters.");
  if (userByEmail(db, email)) throw new AuthError("email_taken", "An account with that email already exists.");

  const gate = ageGate(input.birthYear, opts.now);
  if (!gate.allowed) throw new AuthError("age_gate_blocked", gate.reason ?? "Sign-up not permitted.");

  const user: User = {
    id: opts.userId,
    email,
    passwordHash: hashPassword(input.password),
    displayName: input.displayName.trim() || email.split("@")[0],
    role: "learner",
    ageBand: gate.band,
    plan: "free",
    createdAt: opts.now,
    prefs: (() => {
      const p = defaultPrefs();
      // Minor-safe defaults (SEC-11): no community visibility or email for minors.
      if (gate.minorSafeDefaults) {
        p.privacy.communityVisible = false;
        p.privacy.emailUpdates = false;
      }
      return p;
    })(),
  };
  db.users.set(user.id, user);
  const { token } = createSession(db, user.id, opts.secret, opts.now, opts.tokenNonce, opts.userAgent);
  return { user, token };
}

export function signIn(
  db: Db,
  input: { email: string; password: string },
  opts: { now: number; secret: string; tokenNonce: string; userAgent?: string; rememberMe?: boolean },
): AuthResult {
  const email = input.email.trim().toLowerCase();
  const attempt = db.loginAttempts.get(email);
  if (attempt?.lockedUntil && attempt.lockedUntil > opts.now) {
    const minutes = Math.ceil((attempt.lockedUntil - opts.now) / 60_000);
    throw new AuthError("locked_out", `Too many failed sign-in attempts. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`);
  }

  const user = userByEmail(db, email);
  // Uniform failure regardless of which factor was wrong (no user-enumeration).
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    const failCount = (attempt?.failCount ?? 0) + 1;
    const lockedUntil = failCount >= MAX_FAILED_ATTEMPTS ? opts.now + LOCKOUT_MS : undefined;
    db.loginAttempts.set(email, { failCount, lockedUntil });
    if (lockedUntil) {
      throw new AuthError("locked_out", `Too many failed sign-in attempts. Try again in ${Math.ceil(LOCKOUT_MS / 60_000)} minutes.`);
    }
    throw new AuthError("invalid_credentials", "Email or password is incorrect.");
  }

  db.loginAttempts.delete(email); // reset backoff on a successful sign-in
  const ttlMs = opts.rememberMe ? SESSION_TTL_MS : SHORT_SESSION_TTL_MS;
  const { token } = createSession(db, user.id, opts.secret, opts.now, opts.tokenNonce, opts.userAgent, ttlMs);
  return { user, token };
}

/**
 * Change the signed-in user's email (SETTINGS-03). Requires the current
 * password (the same re-auth bar as any identity-changing action), rejects an
 * invalid format, and rejects an email already taken by a DIFFERENT account
 * (a no-op re-submit of one's own current email is not an error). Sessions
 * key off `userId`, never email, so this never invalidates the caller's own
 * session. No verification email is sent — there is no email-sending
 * infrastructure in this app (Deferred); the change is immediate and real.
 */
export function changeEmail(db: Db, userId: string, input: { currentPassword: string; newEmail: string }): { email: string } {
  const user = db.users.get(userId);
  if (!user) throw new AuthError("invalid_credentials", "Account not found.");
  if (!verifyPassword(input.currentPassword, user.passwordHash)) {
    throw new AuthError("invalid_credentials", "Current password is incorrect.");
  }
  const email = input.newEmail.trim().toLowerCase();
  if (!EMAIL_RE.test(email)) throw new AuthError("invalid_email", "Enter a valid email address.");
  const existing = userByEmail(db, email);
  if (existing && existing.id !== userId) throw new AuthError("email_taken", "An account with that email already exists.");
  user.email = email;
  return { email };
}

/** Resolve the current user from a session token (verifies signature, expiry, and existence). */
export function authenticate(db: Db, token: string | undefined, secret: string, now: number): User | null {
  if (!token) return null;
  const body = token.split(".").slice(0, 2).join(".");
  const payload = verifyToken(body, secret, now);
  if (!payload) return null;
  const session = db.sessions.get(token);
  if (!session || session.expiresAt <= now) return null;
  return db.users.get(payload.userId) ?? null;
}

export function signOut(db: Db, token: string): void {
  db.sessions.delete(token);
}

export interface SessionView {
  token: string;
  createdAt: number;
  expiresAt: number;
  current: boolean;
  device: string;
}

/**
 * List a user's own live (non-expired) sessions (AUTH-12) — the user-facing
 * view of the revocable server-side session store, newest first.
 */
export function sessionsFor(db: Db, userId: string, currentToken: string, now: number): SessionView[] {
  return [...db.sessions.values()]
    .filter((s) => s.userId === userId && s.expiresAt > now)
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((s) => ({
      token: s.token,
      createdAt: s.createdAt,
      expiresAt: s.expiresAt,
      current: s.token === currentToken,
      device: describeUserAgent(s.userAgent),
    }));
}

/** Revoke one of the user's own sessions by token. Refuses to touch another user's session. */
export function signOutSession(db: Db, userId: string, token: string): boolean {
  const session = db.sessions.get(token);
  if (!session || session.userId !== userId) return false;
  db.sessions.delete(token);
  return true;
}

/** "Sign out everywhere else": revoke every one of the user's sessions except `keepToken`. Returns the count revoked. */
export function signOutOtherSessions(db: Db, userId: string, keepToken: string): number {
  let count = 0;
  for (const [token, s] of db.sessions) {
    if (s.userId === userId && token !== keepToken) {
      db.sessions.delete(token);
      count++;
    }
  }
  return count;
}

/** "Sign out everywhere" including the caller's own session. Returns the count revoked. */
export function signOutAllSessions(db: Db, userId: string): number {
  let count = 0;
  for (const [token, s] of db.sessions) {
    if (s.userId === userId) {
      db.sessions.delete(token);
      count++;
    }
  }
  return count;
}

/** Deterministic browser/OS label parsed from a real User-Agent string — never fabricated. */
export function describeUserAgent(ua: string | undefined): string {
  if (!ua) return "Unknown device";
  const isIOS = /iPhone|iPad|iPod/.test(ua);
  const isAndroid = /Android/.test(ua);
  const isMac = /Macintosh/.test(ua);
  const isWindows = /Windows/.test(ua);
  const isLinux = /Linux/.test(ua) && !isAndroid;
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua) && !/Chromium/.test(ua)
        ? "Chrome"
        : /Firefox\//.test(ua)
          ? "Firefox"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Browser";
  const os = isIOS ? "iOS" : isAndroid ? "Android" : isMac ? "macOS" : isWindows ? "Windows" : isLinux ? "Linux" : "an unknown OS";
  return `${browser} on ${os}`;
}
