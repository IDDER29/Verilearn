import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { publicVerify } from "./certificates";
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
