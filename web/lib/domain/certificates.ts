/**
 * Certificates — issuance, fail-closed public verification, and SME-driven
 * revocation (with downgrade propagation).
 *
 * Traces to: PRD domain 28 (Tests, Certs & Credential Verification).
 *  - TEST-10 a certificate is issued ONLY for a passing test (at/above the bar);
 *    issuance is automatic from a valid pass — no human "grants" a cert — and a
 *    failing result can never produce one (issueCertificate throws).
 *  - TEST-11 / TEST-21 public verification is FAIL-CLOSED: an unknown/undefined
 *    or revoked certificate resolves to an unambiguous negative — never a default
 *    or partial "valid". verifyCertificate never throws and never defaults to
 *    valid.
 *  - TEST-13 revocation invariant: a certificate cannot outlive the ledger truth
 *    beneath it. When a claim the cert materially depended on is downgraded below
 *    eligibility, the cert is revoked; revocation records actor-supplied reason
 *    and timestamp. shouldRevokeOnClaimDowngrade models that propagation trigger.
 *
 * Pure & deterministic: no Date.now / Math.random / new Date. Timestamps, ids,
 * and the verify code are all supplied by the caller (see trust.ts / tests-engine.ts).
 */

import type { TestScore } from "./tests-engine";

/**
 * A portable credential attesting a verified-only Mastery pass. `revoked` is the
 * live source-of-truth status resolved on the public verify page; a revoked cert
 * carries the reason category and the revocation timestamp.
 */
export interface Certificate {
  id: string;
  topicId: string;
  /** The topic's title at issuance, snapshotted so a durable credential still names what was certified even if the topic is later deleted (account erasure, bulk topic delete). */
  topicTitle: string;
  learnerId: string;
  /** The learner's display name at issuance, snapshotted so the admin console can still identify whose certificate this is after the account is erased (account erasure keeps certificates alive). */
  learnerName: string;
  /** Server timestamp (epoch ms) the cert was issued — caller-supplied. */
  issuedAt: number;
  /** The passing score percentage recorded at issuance. */
  testScorePct: number;
  revoked: boolean;
  /** Reason category, present once revoked. */
  revokedReason?: string;
  /** Server timestamp (epoch ms) of revocation, present once revoked. */
  revokedAt?: number;
  /** Actor id that revoked it — the reinstatement reviewer-other-than-actor gate keys off this (ADMIN-22). */
  revokedBy?: string;
  /** Present once reinstated. The prior revocation fields above are kept as history, never erased. */
  reinstatedAt?: number;
  reinstatedBy?: string;
  reinstatedReason?: string;
  /** Stable, tamper-evident code backing the public verify-URL / QR. */
  verifyCode: string;
}

/** Thrown when issuance is attempted on a result that did not pass the bar. */
export class CertificateIssuanceError extends Error {
  constructor(pct: number, passBar: number) {
    super(
      `Cannot issue a certificate: test scored ${pct}% which is below the ${passBar}% pass bar — a cert is issued only for a passing result.`,
    );
    this.name = "CertificateIssuanceError";
  }
}

export interface IssueCertificateInput {
  topicId: string;
  /** The topic's title at issuance — snapshotted onto the cert (see {@link Certificate.topicTitle}). */
  topicTitle: string;
  learnerId: string;
  /** The learner's display name at issuance — snapshotted onto the cert (see {@link Certificate.learnerName}). */
  learnerName: string;
  /** The graded test result; the cert issues only when this passed. */
  testResult: TestScore;
  /** Server timestamp (epoch ms) of issuance. */
  now: number;
  /** Caller-supplied stable id. */
  id: string;
  /** Caller-supplied tamper-evident verify code. */
  verifyCode: string;
}

/**
 * Issue a certificate for a passing test. Throws {@link CertificateIssuanceError}
 * when the result did not pass — a failing test can never produce a certificate.
 * The freshly-issued cert is never revoked.
 */
export function issueCertificate(input: IssueCertificateInput): Certificate {
  const { topicId, topicTitle, learnerId, learnerName, testResult, now, id, verifyCode } = input;
  if (!testResult.passed) {
    throw new CertificateIssuanceError(testResult.pct, testResult.passBar);
  }
  return {
    id,
    topicId,
    topicTitle,
    learnerId,
    learnerName,
    issuedAt: now,
    testScorePct: testResult.pct,
    revoked: false,
    verifyCode,
  };
}

/** The outcome of a public verification — a plain yes/no with a reason. */
export interface VerificationResult {
  valid: boolean;
  /** Machine-friendly reason category explaining the verdict. */
  reason: "valid" | "unknown" | "revoked";
  /** Human-readable detail for the public page. */
  detail: string;
}

/**
 * Fail-closed public verification (TEST-11 / TEST-21). Resolves live against the
 * presented certificate object:
 *  - `undefined` (unknown / forged / retention-deleted id) → invalid `unknown`;
 *  - a revoked cert → invalid `revoked`, surfacing the reason category;
 *  - a live, unrevoked cert → valid.
 * Never throws and never defaults to valid — the absence of a positive signal is
 * always a negative result.
 */
export function verifyCertificate(cert: Certificate | undefined): VerificationResult {
  if (!cert) {
    return { valid: false, reason: "unknown", detail: "not a valid VeriLearn certificate" };
  }
  if (cert.revoked) {
    return {
      valid: false,
      reason: "revoked",
      detail: cert.revokedReason
        ? `revoked — ${cert.revokedReason}`
        : "revoked",
    };
  }
  return { valid: true, reason: "valid", detail: "valid VeriLearn certificate" };
}

/**
 * Revoke a certificate, recording the actor-supplied reason category, the
 * revocation timestamp, and the revoking actor. Returns a new certificate
 * object (the input is not mutated). Revoking an already-revoked cert is
 * idempotent-friendly: it restamps with the new reason/time/actor.
 */
export function revokeCertificate(cert: Certificate, reason: string, now: number, revokedBy: string): Certificate {
  return {
    ...cert,
    revoked: true,
    revokedReason: reason,
    revokedAt: now,
    revokedBy,
  };
}

/** Thrown when a reinstatement attempt violates the ADMIN-22 guarantees. */
export class ReinstateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ReinstateError";
  }
}

/**
 * Reinstate a wrongly-revoked certificate (ADMIN-22). Requires:
 *  - the cert is actually revoked (nothing to reinstate otherwise);
 *  - a non-empty reason;
 *  - a reviewer DISTINCT from whoever revoked it — a revocation can never be
 *    quietly self-reversed by the same actor, the reviewer-other-than-actor gate.
 * The prior revocation fields are kept as history, not erased — reinstatement
 * adds a new fact rather than rewriting the past, the same append-only spirit
 * as the trust ledger and gap history elsewhere in this codebase.
 */
export function reinstateCertificate(cert: Certificate, reviewerId: string, reason: string, now: number): Certificate {
  if (!cert.revoked) {
    throw new ReinstateError("This certificate isn't revoked — nothing to reinstate.");
  }
  if (!reason.trim()) {
    throw new ReinstateError("A reason is required to reinstate a certificate.");
  }
  if (cert.revokedBy && reviewerId === cert.revokedBy) {
    throw new ReinstateError("The reviewer reinstating a certificate must be someone other than whoever revoked it.");
  }
  return {
    ...cert,
    revoked: false,
    reinstatedAt: now,
    reinstatedBy: reviewerId,
    reinstatedReason: reason.trim(),
  };
}

/**
 * Revocation-propagation trigger (TEST-13). Given a certificate and whether a
 * claim it materially depended on was downgraded below eligibility, decide
 * whether the cert should now be revoked. Returns `true` only when the claim was
 * downgraded AND the cert is not already revoked — a cert cannot outlive the
 * ledger truth beneath it, and an already-revoked cert needs no further action.
 */
export function shouldRevokeOnClaimDowngrade(cert: Certificate, downgraded: boolean): boolean {
  return downgraded && !cert.revoked;
}
