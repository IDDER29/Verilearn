import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listAuditLogForAdmin } from "./audit";
import { reinstateCertificateForAdmin, revokeCertificateForAdmin } from "./certificates";
import { banUserForAdmin, unbanUserForAdmin } from "./moderation";
import { quarantineClaimForAdmin, unquarantineClaimForAdmin } from "./quarantine";

declare global {
  var __verilearnDb: Db | undefined;
}

const LEARNER = "user_adeline";
const REVIEWER1 = "user_ts_reviewer1";
const REVIEWER2 = "user_ts_reviewer2";
const SEEDED_CERT = "cert_binsearch_1";
const DIJKSTRA = "topic_dijkstra";
const VERIFIED_CLAIM = "topic_dijkstra_c1";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("central audit log (ADMIN-20)", () => {
  it("starts empty — no privileged action has happened yet in a fresh seed", () => {
    expect(listAuditLogForAdmin("trust_safety_lead")).toEqual([]);
  });

  it("is empty for a role without audit:read (the RBAC gate is real, not decorative)", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    expect(listAuditLogForAdmin("learner")).toEqual([]);
  });

  it("records a certificate revoke and reinstate, resolved with real actor/target labels", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "Suspected collusion", SEED_NOW);
    reinstateCertificateForAdmin(REVIEWER2, "trust_safety_lead", SEEDED_CERT, "False positive", SEED_NOW + 1);

    const rows = listAuditLogForAdmin("trust_safety_lead");
    expect(rows).toHaveLength(2);
    expect(rows[0].action).toBe("cert_reinstate"); // newest first
    expect(rows[0].actorName).toBe("Marcus (T&S)");
    expect(rows[0].targetLabel).toBe("VL-BINSEARCH1");
    expect(rows[1].action).toBe("cert_revoke");
    expect(rows[1].reason).toBe("Suspected collusion");
  });

  it("records a ban and unban", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "Repeated harassment reports", SEED_NOW);
    unbanUserForAdmin(REVIEWER2, "trust_safety_lead", LEARNER, "Investigated — false positive", SEED_NOW + 1);

    const rows = listAuditLogForAdmin("trust_safety_lead", { targetType: "user" });
    expect(rows.map((r) => r.action)).toEqual(["user_unban", "user_ban"]);
    expect(rows[1].targetLabel).toBe("Adeline");
    expect(rows[1].actorName).toBe("Priya (T&S)");
  });

  it("records a quarantine and clear, with the real claim text as the target label", () => {
    quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "Suspected fabricated citation", SEED_NOW);
    unquarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, SEED_NOW + 1);

    const rows = listAuditLogForAdmin("trust_safety_lead", { targetType: "claim" });
    expect(rows.map((r) => r.action)).toEqual(["claim_unquarantine", "claim_quarantine"]);
    expect(rows[1].targetId).toBe(VERIFIED_CLAIM);
  });

  it("does NOT record anything for a rejected/no-op attempt", () => {
    const res = revokeCertificateForAdmin(LEARNER, "learner", SEEDED_CERT, "fraud", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(listAuditLogForAdmin("trust_safety_lead")).toEqual([]);
  });

  it("filters by actor and by action independently", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    banUserForAdmin(REVIEWER2, "trust_safety_lead", LEARNER, "abuse", SEED_NOW + 1);

    expect(listAuditLogForAdmin("trust_safety_lead", { actorId: REVIEWER1 }).map((r) => r.action)).toEqual(["cert_revoke"]);
    expect(listAuditLogForAdmin("trust_safety_lead", { action: "user_ban" }).map((r) => r.actorId)).toEqual([REVIEWER2]);
  });

  it("a compliance_dpo and a platform_admin can both read the log too (audit:read is shared, not T&S-exclusive)", () => {
    revokeCertificateForAdmin(REVIEWER1, "trust_safety_lead", SEEDED_CERT, "fraud", SEED_NOW);
    expect(listAuditLogForAdmin("compliance_dpo")).toHaveLength(1);
    expect(listAuditLogForAdmin("platform_admin")).toHaveLength(1);
  });
});
