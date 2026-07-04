import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { banUserForAdmin } from "./moderation";
import { decideAppealForAdmin, listAppealsForAdmin, submitAppealForBannedUser } from "./appeals";
import { listAuditLogForAdmin } from "./audit";

declare global {
  var __verilearnDb: Db | undefined;
}

const LEARNER = "user_adeline";
const LEARNER_EMAIL = "adeline@example.com";
const REVIEWER1 = "user_ts_reviewer1";
const REVIEWER2 = "user_ts_reviewer2";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("ban appeal flow (AUTH-18)", () => {
  it("refuses an appeal for an account that isn't banned", () => {
    const res = submitAppealForBannedUser(LEARNER_EMAIL, "Please look into this", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/isn't banned/i);
  });

  it("refuses an unknown email, without confirming which accounts exist", () => {
    const res = submitAppealForBannedUser("nobody@example.com", "Please look into this", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/no account found/i);
  });

  it("a banned learner can submit an appeal with a message", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "Suspected fraud", SEED_NOW);
    const res = submitAppealForBannedUser(LEARNER_EMAIL, "This was a mistake — please review", SEED_NOW + 1);
    expect(res.ok).toBe(true);
    const appeals = listAppealsForAdmin("trust_safety_lead");
    expect(appeals).toHaveLength(1);
    expect(appeals[0].userId).toBe(LEARNER);
    expect(appeals[0].status).toBe("pending");
    expect(appeals[0].userEmail).toBe(LEARNER_EMAIL);
  });

  it("rejects an empty message and a second appeal while one is pending", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    expect(submitAppealForBannedUser(LEARNER_EMAIL, "   ", SEED_NOW).ok).toBe(false);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW);
    const again = submitAppealForBannedUser(LEARNER_EMAIL, "please review again", SEED_NOW + 1);
    expect(again.ok).toBe(false);
    expect(again.error).toMatch(/already have an appeal/i);
  });

  it("listAppealsForAdmin is empty for a role without user:ban (the RBAC gate is real)", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW + 1);
    expect(listAppealsForAdmin("learner")).toEqual([]);
  });

  it("approving an appeal genuinely unbans the account and logs an audit entry", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW + 1);
    const appealId = listAppealsForAdmin("trust_safety_lead")[0].id;

    const res = decideAppealForAdmin(REVIEWER2, "trust_safety_lead", appealId, true, "Investigated — false positive", SEED_NOW + 2);
    expect(res.ok).toBe(true);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBe(false);
    const appeal = listAppealsForAdmin("trust_safety_lead")[0];
    expect(appeal.status).toBe("approved");
    expect(appeal.decidedBy).toBe(REVIEWER2);

    const audit = listAuditLogForAdmin("trust_safety_lead", { action: "user_unban" });
    expect(audit).toHaveLength(1);
    expect(audit[0].targetId).toBe(LEARNER);
  });

  it("denying an appeal leaves the ban in place, decision recorded", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW + 1);
    const appealId = listAppealsForAdmin("trust_safety_lead")[0].id;

    const res = decideAppealForAdmin(REVIEWER2, "trust_safety_lead", appealId, false, "Evidence supports the ban", SEED_NOW + 2);
    expect(res.ok).toBe(true);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBe(true);
    expect(listAppealsForAdmin("trust_safety_lead")[0].status).toBe("denied");
  });

  it("the reviewer-other-than-whoever-banned rule holds even for an appeal (ADMIN-16's gate)", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW + 1);
    const appealId = listAppealsForAdmin("trust_safety_lead")[0].id;

    const res = decideAppealForAdmin(REVIEWER1, "trust_safety_lead", appealId, true, "actually fine", SEED_NOW + 2);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/other than whoever banned/i);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBe(true); // unchanged
    expect(listAppealsForAdmin("trust_safety_lead")[0].status).toBe("pending"); // unchanged too
  });

  it("rejects an empty decision reason, an unknown appeal, and re-deciding an already-decided one", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    submitAppealForBannedUser(LEARNER_EMAIL, "please review", SEED_NOW + 1);
    const appealId = listAppealsForAdmin("trust_safety_lead")[0].id;

    expect(decideAppealForAdmin(REVIEWER2, "trust_safety_lead", appealId, true, "  ", SEED_NOW + 2).ok).toBe(false);
    expect(decideAppealForAdmin(REVIEWER2, "trust_safety_lead", "nope", true, "reason", SEED_NOW + 2).ok).toBe(false);
    decideAppealForAdmin(REVIEWER2, "trust_safety_lead", appealId, false, "denied", SEED_NOW + 2);
    const again = decideAppealForAdmin(REVIEWER2, "trust_safety_lead", appealId, true, "changed my mind", SEED_NOW + 3);
    expect(again.ok).toBe(false);
    expect(again.error).toMatch(/already been decided/i);
  });
});
