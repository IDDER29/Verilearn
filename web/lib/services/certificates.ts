/**
 * Public certificate verification — the read service behind the /api/verify
 * HTTP surface (API-03). Wraps the fail-closed `verifyCertificate` domain logic
 * with a lookup by the certificate's public `verifyCode` and a PII-safe response
 * shape: no learner name/email is ever returned from a public, unauthenticated
 * endpoint — only the topic and pass evidence a third party legitimately needs.
 */
import { verifyCertificate } from "@/lib/domain/certificates";
import { getDb } from "@/lib/store/db";

export interface PublicVerifyResult {
  verifyCode: string;
  valid: boolean;
  reason: "valid" | "unknown" | "revoked";
  detail: string;
  /** Present only when valid — the topic title, pass score, and issuance date. */
  topicTitle?: string;
  testScorePct?: number;
  issuedAt?: number;
}

/** Look up a certificate by its public verify code (not the internal record id). */
function findByVerifyCode(verifyCode: string) {
  for (const cert of getDb().certificates.values()) {
    if (cert.verifyCode === verifyCode) return cert;
  }
  return undefined;
}

/**
 * Public, unauthenticated verification (API-03/TEST-11/TEST-21): resolves a
 * verify code against the live certificate store. Fail-closed — an unknown code
 * or a revoked cert never reads as valid — and never throws.
 */
export function publicVerify(verifyCode: string): PublicVerifyResult {
  const cert = findByVerifyCode(verifyCode);
  const result = verifyCertificate(cert);
  if (!result.valid || !cert) {
    return { verifyCode, valid: result.valid, reason: result.reason, detail: result.detail };
  }
  const topicTitle = getDb().topics.get(cert.topicId)?.title;
  return {
    verifyCode,
    valid: true,
    reason: result.reason,
    detail: result.detail,
    topicTitle,
    testScorePct: cert.testScorePct,
    issuedAt: cert.issuedAt,
  };
}
