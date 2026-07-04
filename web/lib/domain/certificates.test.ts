import { describe, expect, it } from "vitest";
import {
  Certificate,
  CertificateIssuanceError,
  issueCertificate,
  revokeCertificate,
  shouldRevokeOnClaimDowngrade,
  verifyCertificate,
} from "./certificates";
import type { TestScore } from "./tests-engine";

function score(partial: Partial<TestScore> = {}): TestScore {
  return { correct: 9, total: 12, pct: 75, passed: true, passBar: 75, ...partial };
}

function issued(overrides: Partial<Parameters<typeof issueCertificate>[0]> = {}): Certificate {
  return issueCertificate({
    topicId: "t1",
    learnerId: "learner-1",
    testResult: score(),
    now: 1_000,
    id: "cert-1",
    verifyCode: "VC-ABC",
    ...overrides,
  });
}

describe("issueCertificate (TEST-10)", () => {
  it("issues a live cert for a passing result, recording scope, score, and code", () => {
    const cert = issued();
    expect(cert).toMatchObject({
      id: "cert-1",
      topicId: "t1",
      learnerId: "learner-1",
      issuedAt: 1_000,
      testScorePct: 75,
      revoked: false,
      verifyCode: "VC-ABC",
    });
    expect(cert.revokedReason).toBeUndefined();
  });

  it("counts a tie exactly at the bar as a pass and issues", () => {
    const cert = issued({ testResult: score({ pct: 75, passed: true, passBar: 75 }) });
    expect(cert.testScorePct).toBe(75);
    expect(cert.revoked).toBe(false);
  });

  it("cannot issue on a failed test — throws instead of a hollow cert", () => {
    expect(() =>
      issued({ testResult: score({ pct: 60, passed: false }) }),
    ).toThrow(CertificateIssuanceError);
  });
});

describe("verifyCertificate — fail-closed (TEST-11 / TEST-21)", () => {
  it("resolves an unknown/undefined cert to invalid, never a default valid", () => {
    const res = verifyCertificate(undefined);
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("unknown");
    expect(res.detail).toMatch(/not a valid/i);
  });

  it("resolves a revoked cert to invalid with the reason category", () => {
    const cert = revokeCertificate(issued(), "claim-downgraded", 2_000);
    const res = verifyCertificate(cert);
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("revoked");
    expect(res.detail).toMatch(/claim-downgraded/);
  });

  it("resolves a revoked cert with no reason to a plain revoked verdict", () => {
    const cert: Certificate = { ...issued(), revoked: true };
    const res = verifyCertificate(cert);
    expect(res.valid).toBe(false);
    expect(res.reason).toBe("revoked");
    expect(res.detail).toBe("revoked");
  });

  it("resolves a live, unrevoked cert to valid", () => {
    const res = verifyCertificate(issued());
    expect(res.valid).toBe(true);
    expect(res.reason).toBe("valid");
  });

  it("never throws", () => {
    expect(() => verifyCertificate(undefined)).not.toThrow();
    expect(() => verifyCertificate(issued())).not.toThrow();
  });
});

describe("revokeCertificate", () => {
  it("sets revoked fields and does not mutate the input", () => {
    const cert = issued();
    const revoked = revokeCertificate(cert, "fraud", 5_000);
    expect(revoked).toMatchObject({ revoked: true, revokedReason: "fraud", revokedAt: 5_000 });
    // original is untouched
    expect(cert.revoked).toBe(false);
    expect(cert.revokedReason).toBeUndefined();
  });

  it("restamps an already-revoked cert with the new reason/time", () => {
    const first = revokeCertificate(issued(), "fraud", 5_000);
    const second = revokeCertificate(first, "claim-downgraded", 9_000);
    expect(second.revokedReason).toBe("claim-downgraded");
    expect(second.revokedAt).toBe(9_000);
  });
});

describe("shouldRevokeOnClaimDowngrade (TEST-13)", () => {
  it("revokes a live cert when a material claim is downgraded", () => {
    expect(shouldRevokeOnClaimDowngrade(issued(), true)).toBe(true);
  });

  it("does not revoke when there was no downgrade", () => {
    expect(shouldRevokeOnClaimDowngrade(issued(), false)).toBe(false);
  });

  it("does not re-trigger on an already-revoked cert", () => {
    const revoked = revokeCertificate(issued(), "fraud", 5_000);
    expect(shouldRevokeOnClaimDowngrade(revoked, true)).toBe(false);
  });
});
