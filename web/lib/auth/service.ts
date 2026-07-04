/**
 * Auth service: sign-up, sign-in, and session authentication over the store.
 * Composes password hashing, the age gate, signed sessions, and the RBAC default
 * role. Traces to AUTH-03 (email/password sign-up), AUTH (session), SEC-11 (age gate).
 */
import type { Db } from "@/lib/store/db";
import { userByEmail } from "@/lib/store/db";
import type { Session, User } from "@/lib/store/entities";
import { ageGate } from "./age";
import { hashPassword, verifyPassword } from "./password";
import { SESSION_TTL_MS, signToken, verifyToken } from "./session";

export type AuthErrorCode =
  | "email_taken"
  | "invalid_email"
  | "weak_password"
  | "invalid_credentials"
  | "age_gate_blocked";

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

function createSession(db: Db, userId: string, secret: string, now: number, tokenNonce: string): { token: string; session: Session } {
  const exp = now + SESSION_TTL_MS;
  const token = signToken({ userId, exp }, secret) + "." + tokenNonce;
  // store the signed body (without nonce) keyed for revocation lookup
  const session: Session = { token, userId, expiresAt: exp };
  db.sessions.set(token, session);
  return { token, session };
}

export function signUp(db: Db, input: SignUpInput, opts: { now: number; secret: string; userId: string; tokenNonce: string }): AuthResult {
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
  };
  db.users.set(user.id, user);
  const { token } = createSession(db, user.id, opts.secret, opts.now, opts.tokenNonce);
  return { user, token };
}

export function signIn(db: Db, input: { email: string; password: string }, opts: { now: number; secret: string; tokenNonce: string }): AuthResult {
  const user = userByEmail(db, input.email);
  // Uniform failure regardless of which factor was wrong (no user-enumeration).
  if (!user || !verifyPassword(input.password, user.passwordHash)) {
    throw new AuthError("invalid_credentials", "Email or password is incorrect.");
  }
  const { token } = createSession(db, user.id, opts.secret, opts.now, opts.tokenNonce);
  return { user, token };
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
