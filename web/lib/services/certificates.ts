/**
 * Public certificate verification — the read service behind the /api/verify
 * HTTP surface (API-03). Wraps the fail-closed `verifyCertificate` domain logic
 * with a lookup by the certificate's public `verifyCode` and a PII-safe response
 * shape: no learner name/email is ever returned from a public, unauthenticated
 * endpoint — only the topic and pass evidence a third party legitimately needs.
 *
 * The admin half (ADMIN-15/22) is the first real, wired use of the RBAC `can()`
 * gate anywhere in this app: every prior feature relied on ownership scoping
 * (`topic.ownerId === userId`) because every seeded account has been a learner.
 * `revokeCertificateForAdmin`/`reinstateCertificateForAdmin` check the actor's
 * role against the `cert:revoke` permission before touching anything.
 */
import { ReinstateError, reinstateCertificate, revokeCertificate, verifyCertificate } from "@/lib/domain/certificates";
import { can, type Role } from "@/lib/domain/rbac";
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

export interface AdminCertificateView {
  id: string;
  topicId: string;
  topicTitle: string;
  learnerId: string;
  learnerName: string;
  issuedAt: number;
  testScorePct: number;
  revoked: boolean;
  revokedReason?: string;
  revokedAt?: number;
  revokedBy?: string;
  reinstatedAt?: number;
  reinstatedBy?: string;
  reinstatedReason?: string;
  verifyCode: string;
}

/** All certificates, newest-issued first — the admin console's read model (ADMIN-15/22). PII is fine here: this is an internal, RBAC-gated tool, not the public verify surface. */
export function listAllCertificates(): AdminCertificateView[] {
  const db = getDb();
  return [...db.certificates.values()]
    .sort((a, b) => b.issuedAt - a.issuedAt)
    .map((c) => ({
      ...c,
      topicTitle: db.topics.get(c.topicId)?.title ?? "Unknown topic",
      learnerName: db.users.get(c.learnerId)?.displayName ?? "Unknown learner",
    }));
}

export interface AdminCertActionResult {
  ok: boolean;
  error?: string;
}

/** Revoke a certificate (ADMIN-15). RBAC-gated: only a `cert:revoke`-holding role may act. */
export function revokeCertificateForAdmin(actorId: string, actorRole: Role, certId: string, reason: string, now: number): AdminCertActionResult {
  if (!can(actorRole, "cert:revoke")) return { ok: false, error: "You don't have permission to revoke certificates." };
  const db = getDb();
  const cert = db.certificates.get(certId);
  if (!cert) return { ok: false, error: "Certificate not found." };
  if (!reason.trim()) return { ok: false, error: "A reason is required." };
  if (cert.revoked) return { ok: false, error: "This certificate is already revoked." };
  db.certificates.set(certId, revokeCertificate(cert, reason.trim(), now, actorId));
  return { ok: true };
}

/**
 * Reinstate a wrongly-revoked certificate (ADMIN-22). RBAC-gated the same as
 * revoke; the domain's `reinstateCertificate` additionally refuses a reviewer
 * who is the same actor that revoked it (`ReinstateError`) — surfaced here as
 * an honest rejection, never silently bypassed.
 */
export function reinstateCertificateForAdmin(actorId: string, actorRole: Role, certId: string, reason: string, now: number): AdminCertActionResult {
  if (!can(actorRole, "cert:revoke")) return { ok: false, error: "You don't have permission to reinstate certificates." };
  const db = getDb();
  const cert = db.certificates.get(certId);
  if (!cert) return { ok: false, error: "Certificate not found." };
  try {
    db.certificates.set(certId, reinstateCertificate(cert, actorId, reason, now));
    return { ok: true };
  } catch (e) {
    if (e instanceof ReinstateError) return { ok: false, error: e.message };
    throw e;
  }
}
