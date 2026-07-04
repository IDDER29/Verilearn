import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listAllCertificates, publicVerify, reinstateCertificateForAdmin, revokeCertificateForAdmin } from "./certificates";
import type { CertificateRecord } from "@/lib/store/entities";

declare global {
  var __verilearnDb: Db | undefined;
}

const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

function issue(overrides: Partial<CertificateRecord> = {}): CertificateRecord {
  const cert: CertificateRecord = {
    id: "cert_1",
    topicId: "topic_dijkstra",
    learnerId: USER,
    issuedAt: SEED_NOW,
    testScorePct: 92,
    revoked: false,
    verifyCode: "VL-ABC123",
    ...overrides,
  };
  globalThis.__verilearnDb!.certificates.set(cert.id, cert);
  return cert;
}

describe("publicVerify (API-03)", () => {
  it("resolves a live certificate as valid, with topic + score but no learner PII", () => {
    issue();
    const r = publicVerify("VL-ABC123");
    expect(r.valid).toBe(true);
    expect(r.reason).toBe("valid");
    expect(r.topicTitle).toBe("Dijkstra's algorithm");
    expect(r.testScorePct).toBe(92);
    expect(r.issuedAt).toBe(SEED_NOW);
    // never leaks the learner's identity from a public, unauthenticated endpoint
    expect(r).not.toHaveProperty("learnerId");
    expect(JSON.stringify(r)).not.toContain(USER);
  });

  it("fails closed on a revoked certificate — never valid, reason surfaced", () => {
    issue({ revoked: true, revokedReason: "claim downgraded" });
    const r = publicVerify("VL-ABC123");
    expect(r.valid).toBe(false);
    expect(r.reason).toBe("revoked");
    expect(r.topicTitle).toBeUndefined(); // no incidental detail on a failed verify
  });

  it("fails closed on an unknown code — never a fabricated match", () => {
    const r = publicVerify("VL-DOES-NOT-EXIST");
    expect(r.valid).toBe(false);
    expect(r.reason).toBe("unknown");
  });

  it("echoes the queried code back regardless of outcome", () => {
    expect(publicVerify("VL-ANYTHING").verifyCode).toBe("VL-ANYTHING");
  });
});

const REVIEWER1 = "user_ts_reviewer1";
const REVIEWER2 = "user_ts_reviewer2";
const SEEDED_CERT = "cert_binsearch_1";

describe("admin certificate console (ADMIN-15/22)", () => {
  it("listAllCertificates resolves real topic titles and learner names, newest first", () => {
    issue({ id: "cert_2", issuedAt: SEED_NOW + 1000 });
    const list = listAllCertificates();
    expect(list[0].id).toBe("cert_2"); // newest first
    const seeded = list.find((c) => c.id === SEEDED_CERT)!;
    expect(seeded.topicTitle).toBe("Binary search");
    expect(seeded.learnerName).toBe("Adeline");
  });

  it("refuses revoke/reinstate for a role without cert:revoke (the RBAC gate is real, not decorative)", () => {
    const res = revokeCertificateForAdmin(USER, "learner", SEEDED_CERT, "fraud", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(globalThis.__verilearnDb!.certificates.get(SEEDED_CERT)!.revoked).toBe(false);
  });

  it("a trust_safety_lead can revoke a live certificate with a reason", () => {
    const res = revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "Suspected collusion", SEED_NOW);
    expect(res.ok).toBe(true);
    const cert = globalThis.__verilearnDb!.certificates.get(SEEDED_CERT)!;
    expect(cert.revoked).toBe(true);
    expect(cert.revokedReason).toBe("Suspected collusion");
    expect(cert.revokedBy).toBe(REVIEWER1);
    // the public verify surface reflects it immediately
    expect(publicVerify(cert.verifyCode).valid).toBe(false);
  });

  it("rejects a revoke with no reason, and rejects revoking an already-revoked cert", () => {
    expect(revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "  ", SEED_NOW).ok).toBe(false);
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    const again = revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud again", SEED_NOW);
    expect(again.ok).toBe(false);
  });

  it("refuses to reinstate a certificate by the SAME reviewer who revoked it (the ReinstateError gate)", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    const res = reinstateCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "actually fine", SEED_NOW + 1);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/other than whoever revoked/i);
    expect(globalThis.__verilearnDb!.certificates.get(SEEDED_CERT)!.revoked).toBe(true); // unchanged
  });

  it("a DIFFERENT trust_safety_lead reviewer can genuinely reinstate", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    const res = reinstateCertificateForAdmin(REVIEWER2, "trust_safety_lead", SEEDED_CERT, "Investigated — was a false positive", SEED_NOW + 1);
    expect(res.ok).toBe(true);
    const cert = globalThis.__verilearnDb!.certificates.get(SEEDED_CERT)!;
    expect(cert.revoked).toBe(false);
    expect(cert.reinstatedBy).toBe(REVIEWER2);
    expect(cert.revokedReason).toBe("fraud"); // history kept, never erased
    expect(publicVerify(cert.verifyCode).valid).toBe(true);
  });
});
