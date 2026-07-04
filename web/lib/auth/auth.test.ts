import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/store/db";
import { ageGate } from "./age";
import { hashPassword, verifyPassword } from "./password";
import { signToken, verifyToken } from "./session";
import {
  AuthError,
  authenticate,
  changeEmail,
  describeUserAgent,
  sessionsFor,
  signIn,
  signOutAllSessions,
  signOutOtherSessions,
  signOutSession,
  signUp,
} from "./service";

const SECRET = "test-secret";
const NOW = 1_782_432_000_000; // 2026-07-01

describe("password hashing", () => {
  it("round-trips and rejects wrong passwords", () => {
    const h = hashPassword("correcthorse");
    expect(verifyPassword("correcthorse", h)).toBe(true);
    expect(verifyPassword("wrong", h)).toBe(false);
  });
  it("salts: two hashes of the same password differ", () => {
    expect(hashPassword("samepass1")).not.toBe(hashPassword("samepass1"));
  });
  it("rejects short passwords", () => {
    expect(() => hashPassword("short")).toThrow();
  });
});

describe("session tokens", () => {
  it("verifies a valid token and rejects tampered/expired ones", () => {
    const t = signToken({ userId: "u1", exp: NOW + 1000 }, SECRET);
    expect(verifyToken(t, SECRET, NOW)?.userId).toBe("u1");
    expect(verifyToken(t, "other-secret", NOW)).toBeNull();
    expect(verifyToken(t, SECRET, NOW + 2000)).toBeNull(); // expired
    expect(verifyToken(t.slice(0, -2) + "xx", SECRET, NOW)).toBeNull(); // tampered sig
  });
});

describe("age gate (COPPA)", () => {
  it("blocks under-13 pending parental consent", () => {
    const r = ageGate(2020, NOW); // age ~6
    expect(r.allowed).toBe(false);
    expect(r.requiresParentalConsent).toBe(true);
    expect(r.band).toBe("minor");
  });
  it("allows 13–17 with minor-safe defaults", () => {
    const r = ageGate(2010, NOW); // age ~16
    expect(r.allowed).toBe(true);
    expect(r.band).toBe("minor");
    expect(r.minorSafeDefaults).toBe(true);
  });
  it("allows adults", () => {
    const r = ageGate(1990, NOW);
    expect(r.allowed).toBe(true);
    expect(r.band).toBe("adult");
    expect(r.minorSafeDefaults).toBe(false);
  });
  it("requires a valid DOB", () => {
    expect(ageGate(undefined, NOW).allowed).toBe(false);
  });
});

describe("sign-up / sign-in", () => {
  const base = { now: NOW, secret: SECRET, userId: "u_new", tokenNonce: "n1" };

  it("signs up an adult and authenticates the session", () => {
    const db = createDb();
    const { user, token } = signUp(db, { email: "New@Example.com ", password: "hunter2pass", displayName: "New", birthYear: 1995 }, base);
    expect(user.email).toBe("new@example.com"); // normalized
    expect(user.role).toBe("learner");
    expect(authenticate(db, token, SECRET, NOW)?.id).toBe(user.id);
  });

  it("rejects duplicate email, invalid email, weak password, and under-13", () => {
    const db = createDb();
    signUp(db, { email: "a@b.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    expect(() => signUp(db, { email: "a@b.com", password: "hunter2pass", displayName: "A2", birthYear: 1990 }, { ...base, userId: "u2" })).toThrow(AuthError);
    expect(() => signUp(db, { email: "nope", password: "hunter2pass", displayName: "x", birthYear: 1990 }, { ...base, userId: "u3" })).toThrow(/valid email/i);
    expect(() => signUp(db, { email: "c@d.com", password: "short", displayName: "x", birthYear: 1990 }, { ...base, userId: "u4" })).toThrow(/8 characters/i);
    expect(() => signUp(db, { email: "e@f.com", password: "hunter2pass", displayName: "x", birthYear: 2021 }, { ...base, userId: "u5" })).toThrow(/consent/i);
  });

  it("signs in with correct credentials and rejects wrong ones uniformly", () => {
    const db = createDb();
    signUp(db, { email: "log@in.com", password: "hunter2pass", displayName: "L", birthYear: 1990 }, base);
    expect(signIn(db, { email: "log@in.com", password: "hunter2pass" }, { now: NOW, secret: SECRET, tokenNonce: "n2" }).user.email).toBe("log@in.com");
    expect(() => signIn(db, { email: "log@in.com", password: "bad" }, { now: NOW, secret: SECRET, tokenNonce: "n3" })).toThrow(/incorrect/i);
    expect(() => signIn(db, { email: "ghost@in.com", password: "whatever1" }, { now: NOW, secret: SECRET, tokenNonce: "n4" })).toThrow(/incorrect/i);
  });

  it("'remember me' controls session TTL: unchecked gets a short-lived session, checked gets the full 30-day one", () => {
    const db = createDb();
    signUp(db, { email: "ttl@in.com", password: "hunter2pass", displayName: "T", birthYear: 1990 }, base);
    const short = signIn(db, { email: "ttl@in.com", password: "hunter2pass" }, { now: NOW, secret: SECRET, tokenNonce: "n2" });
    const long = signIn(db, { email: "ttl@in.com", password: "hunter2pass" }, { now: NOW, secret: SECRET, tokenNonce: "n3", rememberMe: true });
    const shortSession = db.sessions.get(short.token)!;
    const longSession = db.sessions.get(long.token)!;
    expect(longSession.expiresAt - NOW).toBeGreaterThan(shortSession.expiresAt - NOW);
    expect(shortSession.expiresAt - NOW).toBe(86_400_000); // 1 day
    expect(longSession.expiresAt - NOW).toBe(30 * 86_400_000); // 30 days
  });
});

describe("change email (SETTINGS-03)", () => {
  const base = { now: NOW, secret: SECRET, userId: "u_owner", tokenNonce: "n1" };

  it("changes the email when the current password is correct and the new address is free", () => {
    const db = createDb();
    const { user } = signUp(db, { email: "old@in.com", password: "hunter2pass", displayName: "O", birthYear: 1990 }, base);
    const { email } = changeEmail(db, user.id, { currentPassword: "hunter2pass", newEmail: "New@In.com " });
    expect(email).toBe("new@in.com"); // normalized, same as sign-up
    expect(db.users.get(user.id)!.email).toBe("new@in.com");
  });

  it("does not invalidate the caller's existing session (keyed by userId, not email)", () => {
    const db = createDb();
    const { user, token } = signUp(db, { email: "keep@in.com", password: "hunter2pass", displayName: "K", birthYear: 1990 }, base);
    changeEmail(db, user.id, { currentPassword: "hunter2pass", newEmail: "moved@in.com" });
    expect(authenticate(db, token, SECRET, NOW)?.id).toBe(user.id);
  });

  it("rejects the wrong current password", () => {
    const db = createDb();
    const { user } = signUp(db, { email: "a@in.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    expect(() => changeEmail(db, user.id, { currentPassword: "wrong-pass", newEmail: "b@in.com" })).toThrow(/incorrect/i);
    expect(db.users.get(user.id)!.email).toBe("a@in.com"); // unchanged
  });

  it("rejects an invalid email format", () => {
    const db = createDb();
    const { user } = signUp(db, { email: "a@in.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    expect(() => changeEmail(db, user.id, { currentPassword: "hunter2pass", newEmail: "not-an-email" })).toThrow(/valid email/i);
  });

  it("rejects an email already taken by a different account", () => {
    const db = createDb();
    signUp(db, { email: "taken@in.com", password: "hunter2pass", displayName: "T", birthYear: 1990 }, { ...base, userId: "u_taken" });
    const { user } = signUp(db, { email: "a@in.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    expect(() => changeEmail(db, user.id, { currentPassword: "hunter2pass", newEmail: "taken@in.com" })).toThrow(/already exists/i);
  });

  it("allows re-submitting one's own current email as a no-op, not an error", () => {
    const db = createDb();
    const { user } = signUp(db, { email: "a@in.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    const { email } = changeEmail(db, user.id, { currentPassword: "hunter2pass", newEmail: "A@In.com" });
    expect(email).toBe("a@in.com");
  });
});

describe("failed sign-in lockout/backoff (AUTH-06/AUTH-23)", () => {
  const base = { now: NOW, secret: SECRET, userId: "u_lock", tokenNonce: "n1" };

  it("locks out after 5 failed attempts and rejects even a correct password while locked", () => {
    const db = createDb();
    signUp(db, { email: "lockme@in.com", password: "hunter2pass", displayName: "L", birthYear: 1990 }, base);
    for (let i = 0; i < 4; i++) {
      expect(() => signIn(db, { email: "lockme@in.com", password: "bad" }, { now: NOW, secret: SECRET, tokenNonce: `f${i}` })).toThrow(/incorrect/i);
    }
    // 5th failure trips the lock
    expect(() => signIn(db, { email: "lockme@in.com", password: "bad" }, { now: NOW, secret: SECRET, tokenNonce: "f5" })).toThrow(/too many/i);
    // Even the correct password is rejected while locked out.
    expect(() => signIn(db, { email: "lockme@in.com", password: "hunter2pass" }, { now: NOW + 1000, secret: SECRET, tokenNonce: "f6" })).toThrow(/too many/i);
  });

  it("unlocks after the lockout window passes, and a success resets the counter", () => {
    const db = createDb();
    signUp(db, { email: "unlock@in.com", password: "hunter2pass", displayName: "U", birthYear: 1990 }, base);
    for (let i = 0; i < 5; i++) {
      try {
        signIn(db, { email: "unlock@in.com", password: "bad" }, { now: NOW, secret: SECRET, tokenNonce: `f${i}` });
      } catch {
        /* expected */
      }
    }
    // Still within the 15-minute window.
    expect(() => signIn(db, { email: "unlock@in.com", password: "hunter2pass" }, { now: NOW + 60_000, secret: SECRET, tokenNonce: "g1" })).toThrow(/too many/i);
    // After the window, sign-in succeeds again.
    const r = signIn(db, { email: "unlock@in.com", password: "hunter2pass" }, { now: NOW + 16 * 60_000, secret: SECRET, tokenNonce: "g2" });
    expect(r.user.email).toBe("unlock@in.com");
    // A prior success clears the fail counter — one bad attempt afterward doesn't relock.
    expect(() => signIn(db, { email: "unlock@in.com", password: "bad" }, { now: NOW + 17 * 60_000, secret: SECRET, tokenNonce: "g3" })).toThrow(/incorrect/i);
  });

  it("lockout is scoped per email — a locked-out account doesn't block a different one", () => {
    const db = createDb();
    signUp(db, { email: "victim@in.com", password: "hunter2pass", displayName: "V", birthYear: 1990 }, base);
    signUp(db, { email: "bystander@in.com", password: "hunter2pass", displayName: "B", birthYear: 1990 }, { ...base, userId: "u_bystander" });
    for (let i = 0; i < 5; i++) {
      try {
        signIn(db, { email: "victim@in.com", password: "bad" }, { now: NOW, secret: SECRET, tokenNonce: `f${i}` });
      } catch {
        /* expected */
      }
    }
    expect(signIn(db, { email: "bystander@in.com", password: "hunter2pass" }, { now: NOW, secret: SECRET, tokenNonce: "g1" }).user.email).toBe("bystander@in.com");
  });
});

describe("session management (AUTH-12)", () => {
  const base = { now: NOW, secret: SECRET, userId: "u_sess", tokenNonce: "n1" };

  it("describeUserAgent parses real UA strings deterministically, never fabricating unknowns", () => {
    expect(describeUserAgent(undefined)).toBe("Unknown device");
    expect(describeUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36")).toBe("Chrome on Windows");
    expect(describeUserAgent("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15")).toBe("Safari on macOS");
    expect(describeUserAgent("Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile Safari/605.1.15")).toBe("Safari on iOS");
    expect(describeUserAgent("Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/124.0 Mobile Safari/537.36")).toBe("Chrome on Android");
  });

  it("lists only the caller's own live sessions, newest first, flagging the current one", () => {
    const db = createDb();
    signUp(db, { email: "multi@dev.com", password: "hunter2pass", displayName: "M", birthYear: 1990 }, { ...base, userAgent: "UA-laptop" });
    const { token: laptop } = signUp(db, { email: "solo@dev.com", password: "hunter2pass", displayName: "S", birthYear: 1990 }, { ...base, userId: "u_solo" });
    const { token: t1 } = signIn(db, { email: "multi@dev.com", password: "hunter2pass" }, { now: NOW + 1000, secret: SECRET, tokenNonce: "n2", userAgent: "UA-phone" });
    void laptop;

    const list = sessionsFor(db, "u_sess", t1, NOW + 2000);
    expect(list.length).toBe(2); // this user's two sessions only — not u_solo's
    expect(list[0].current).toBe(true); // newest (t1) first
    expect(list[0].token).toBe(t1);
    expect(list.every((s) => s.token !== undefined)).toBe(true);
  });

  it("signOutSession revokes only the caller's own session, refusing another user's token", () => {
    const db = createDb();
    const { token: mine } = signUp(db, { email: "own@dev.com", password: "hunter2pass", displayName: "O", birthYear: 1990 }, base);
    const { token: theirs } = signUp(db, { email: "other@dev.com", password: "hunter2pass", displayName: "T", birthYear: 1990 }, { ...base, userId: "u_other" });

    expect(signOutSession(db, "u_sess", theirs)).toBe(false); // cannot revoke someone else's session
    expect(db.sessions.has(theirs)).toBe(true);
    expect(signOutSession(db, "u_sess", mine)).toBe(true);
    expect(db.sessions.has(mine)).toBe(false);
  });

  it("signOutOtherSessions revokes every session but the caller's, leaving other users untouched", () => {
    const db = createDb();
    const { token: t1 } = signUp(db, { email: "many@dev.com", password: "hunter2pass", displayName: "M", birthYear: 1990 }, base);
    const { token: t2 } = signIn(db, { email: "many@dev.com", password: "hunter2pass" }, { now: NOW + 10, secret: SECRET, tokenNonce: "n2" });
    const { token: t3 } = signIn(db, { email: "many@dev.com", password: "hunter2pass" }, { now: NOW + 20, secret: SECRET, tokenNonce: "n3" });
    const { token: otherUser } = signUp(db, { email: "bystander@dev.com", password: "hunter2pass", displayName: "B", birthYear: 1990 }, { ...base, userId: "u_bystander" });

    const revoked = signOutOtherSessions(db, "u_sess", t1);
    expect(revoked).toBe(2);
    expect(db.sessions.has(t1)).toBe(true);
    expect(db.sessions.has(t2)).toBe(false);
    expect(db.sessions.has(t3)).toBe(false);
    expect(db.sessions.has(otherUser)).toBe(true); // untouched
  });

  it("signOutAllSessions revokes every session including the caller's own", () => {
    const db = createDb();
    const { token: t1 } = signUp(db, { email: "all@dev.com", password: "hunter2pass", displayName: "A", birthYear: 1990 }, base);
    signIn(db, { email: "all@dev.com", password: "hunter2pass" }, { now: NOW + 10, secret: SECRET, tokenNonce: "n2" });

    const revoked = signOutAllSessions(db, "u_sess");
    expect(revoked).toBe(2);
    expect(sessionsFor(db, "u_sess", t1, NOW + 1000)).toHaveLength(0);
  });
});
