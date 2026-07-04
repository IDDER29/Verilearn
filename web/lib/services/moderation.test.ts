import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { banUserForAdmin, listAllUsersForAdmin, unbanUserForAdmin } from "./moderation";

declare global {
  var __verilearnDb: Db | undefined;
}

const LEARNER = "user_adeline";
const REVIEWER1 = "user_ts_reviewer1";
const REVIEWER2 = "user_ts_reviewer2";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("moderation admin console (ADMIN-16)", () => {
  it("listAllUsersForAdmin surfaces every seeded account, honest-unbanned by default", () => {
    const list = listAllUsersForAdmin();
    expect(list.some((u) => u.id === LEARNER)).toBe(true);
    expect(list.find((u) => u.id === LEARNER)!.banned).toBe(false);
  });

  it("refuses ban/unban for a role without user:ban (the RBAC gate is real)", () => {
    const res = banUserForAdmin(LEARNER, "learner", LEARNER, "abuse", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBeFalsy();
  });

  it("a trust_safety_lead can ban an account with a reason, and it takes effect on the record", () => {
    const res = banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "Repeated harassment reports", SEED_NOW);
    expect(res.ok).toBe(true);
    const user = globalThis.__verilearnDb!.users.get(LEARNER)!;
    expect(user.banned).toBe(true);
    expect(user.bannedReason).toBe("Repeated harassment reports");
    expect(user.bannedBy).toBe(REVIEWER1);
  });

  it("banning ends every one of the account's live sessions immediately", () => {
    const db = globalThis.__verilearnDb!;
    db.sessions.set("tok_1", { token: "tok_1", userId: LEARNER, expiresAt: SEED_NOW + 100_000, createdAt: SEED_NOW });
    db.sessions.set("tok_2", { token: "tok_2", userId: LEARNER, expiresAt: SEED_NOW + 100_000, createdAt: SEED_NOW });
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    expect(db.sessions.has("tok_1")).toBe(false);
    expect(db.sessions.has("tok_2")).toBe(false);
  });

  it("rejects an empty reason, banning yourself, banning an unknown account, and double-banning", () => {
    expect(banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "  ", SEED_NOW).ok).toBe(false);
    expect(banUserForAdmin(REVIEWER1, "trust_safety_lead", REVIEWER1, "self", SEED_NOW).ok).toBe(false);
    expect(banUserForAdmin(REVIEWER1, "trust_safety_lead", "nope", "reason", SEED_NOW).ok).toBe(false);
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    expect(banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "again", SEED_NOW).ok).toBe(false);
  });

  it("refuses to unban by the SAME reviewer who banned (the reviewer-other-than-actor gate)", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    const res = unbanUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "changed my mind", SEED_NOW + 1);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/other than whoever banned/i);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBe(true); // unchanged
  });

  it("a DIFFERENT trust_safety_lead reviewer can genuinely unban", () => {
    banUserForAdmin(REVIEWER1, "trust_safety_lead", LEARNER, "fraud", SEED_NOW);
    const res = unbanUserForAdmin(REVIEWER2, "trust_safety_lead", LEARNER, "Investigated — false positive", SEED_NOW + 1);
    expect(res.ok).toBe(true);
    expect(globalThis.__verilearnDb!.users.get(LEARNER)!.banned).toBe(false);
  });
});
