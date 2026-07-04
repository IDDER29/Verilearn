import { describe, expect, it } from "vitest";
import { createDb } from "@/lib/store/db";
import { ageGate } from "./age";
import { hashPassword, verifyPassword } from "./password";
import { signToken, verifyToken } from "./session";
import { AuthError, authenticate, signIn, signUp } from "./service";

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
});
