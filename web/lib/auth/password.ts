/**
 * Password hashing with scrypt + a per-password random salt, and a timing-safe
 * verify. Stored form is "salt:derived" (both hex). Traces to AUTH-03, SEC (authN).
 * (Managed IdP/MFA is Deferred to R2/R3 — this is the local credential adapter.)
 */
import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const KEYLEN = 64;

export function hashPassword(password: string): string {
  if (password.length < 8) throw new Error("Password must be at least 8 characters.");
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(password, salt, KEYLEN).toString("hex");
  return `${salt}:${derived}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [salt, derivedHex] = stored.split(":");
  if (!salt || !derivedHex) return false;
  const expected = Buffer.from(derivedHex, "hex");
  const actual = scryptSync(password, salt, KEYLEN);
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}
