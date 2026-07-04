import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { sessionSecret } from "@/lib/auth/current";
import { publicVerify } from "@/lib/services/certificates";
import { now } from "@/lib/ids";

/**
 * Public certificate verification endpoint (API-03). No session/auth required —
 * this is the surface a third party (employer, LMS, badge viewer) hits with a
 * verify code printed on a certificate. Wraps the fail-closed domain logic
 * (`verifyCertificate`): an unknown or revoked code never resolves as valid.
 *
 * The JSON body is HMAC-signed (`X-VeriLearn-Signature`) over its own canonical
 * bytes so a caller can detect tampering in transit — a lightweight signed
 * envelope using the app's existing signing secret with a domain-separation
 * prefix (`verify:`), rather than standing up a separate PKI.
 *
 * Enumeration rate-limiting is NOT implemented — that needs shared/distributed
 * limiter infrastructure this in-memory single-process app doesn't have.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  if (!code || code.trim().length === 0) {
    return NextResponse.json({ error: "A verify code is required." }, { status: 400 });
  }

  let result;
  try {
    result = publicVerify(code);
  } catch {
    // Fail-closed on an infra fault (e.g. the store throws) — never surface a
    // partial/valid result, and never a bare 500. Genuinely reachable only if
    // the underlying lookup breaks, not a fabricated demo branch.
    return NextResponse.json(
      { verifyCode: code, valid: false, reason: "unverifiable_try_again", detail: "Verification is temporarily unavailable — try again shortly." },
      { status: 503 },
    );
  }

  const body = { ...result, signedAt: now() };
  const payload = JSON.stringify(body);
  const signature = createHmac("sha256", sessionSecret()).update(`verify:${payload}`).digest("hex");

  return NextResponse.json(body, { headers: { "X-VeriLearn-Signature": signature } });
}
