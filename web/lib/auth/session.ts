/**
 * Stateless signed session tokens (HMAC-SHA256 over a JSON payload) with expiry.
 * Traces to AUTH (durable session). The signing secret comes from env in the app;
 * tests inject one. A managed session store / rotation is Deferred.
 */
import { createHmac, timingSafeEqual } from "node:crypto";

export interface SessionPayload {
  userId: string;
  /** epoch ms expiry */
  exp: number;
}

const b64url = (b: Buffer) => b.toString("base64url");

export function signToken(payload: SessionPayload, secret: string): string {
  const body = b64url(Buffer.from(JSON.stringify(payload)));
  const sig = b64url(createHmac("sha256", secret).update(body).digest());
  return `${body}.${sig}`;
}

export function verifyToken(token: string | undefined, secret: string, now: number): SessionPayload | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = b64url(createHmac("sha256", secret).update(body).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as SessionPayload;
    if (typeof payload.exp !== "number" || payload.exp <= now) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_TTL_MS = 30 * 86_400_000; // 30 days
