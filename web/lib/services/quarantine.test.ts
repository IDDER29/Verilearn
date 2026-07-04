import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { isQuarantined, listAllClaimsForAdmin, quarantineClaimForAdmin, unquarantineClaimForAdmin } from "./quarantine";
import { listTestableTopics } from "./tests";
import { readinessFor } from "./progress";
import { buildSession } from "./testsession";
import { getDueCards } from "./review";

declare global {
  var __verilearnDb: Db | undefined;
}

const LEARNER = "user_adeline";
const REVIEWER1 = "user_ts_reviewer1";
const DIJKSTRA = "topic_dijkstra";
// A verified, otherwise test/review-eligible claim (not the seeded disputed one).
const VERIFIED_CLAIM = "topic_dijkstra_c1";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("claim quarantine admin console (ADMIN-14)", () => {
  it("listAllClaimsForAdmin surfaces every claim's real live state, honest-unquarantined by default", () => {
    const rows = listAllClaimsForAdmin();
    const c1 = rows.find((r) => r.claimId === VERIFIED_CLAIM)!;
    expect(c1.state).toBe("verified_execution");
    expect(c1.quarantined).toBe(false);
  });

  it("refuses quarantine/clear for a role without integrity:quarantine (the RBAC gate is real)", () => {
    const res = quarantineClaimForAdmin(LEARNER, "learner", VERIFIED_CLAIM, DIJKSTRA, "under review", SEED_NOW);
    expect(res.ok).toBe(false);
    expect(isQuarantined(VERIFIED_CLAIM)).toBe(false);
  });

  it("a trust_safety_lead can quarantine a claim with a reason, without touching its real trust state", () => {
    const res = quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "Suspected fabricated citation", SEED_NOW);
    expect(res.ok).toBe(true);
    expect(isQuarantined(VERIFIED_CLAIM)).toBe(true);
    const row = listAllClaimsForAdmin().find((r) => r.claimId === VERIFIED_CLAIM)!;
    expect(row.state).toBe("verified_execution"); // ledger state untouched
    expect(row.quarantined).toBe(true);
  });

  it("rejects an empty reason, an unknown claim, and double-quarantining", () => {
    expect(quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "  ", SEED_NOW).ok).toBe(false);
    expect(quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", "nope", DIJKSTRA, "reason", SEED_NOW).ok).toBe(false);
    quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
    expect(quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "again", SEED_NOW).ok).toBe(false);
  });

  it("clearing a quarantine restores full eligibility without any reviewer-distinctness requirement", () => {
    quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
    const res = unquarantineClaimForAdmin("trust_safety_lead", VERIFIED_CLAIM);
    expect(res.ok).toBe(true);
    expect(isQuarantined(VERIFIED_CLAIM)).toBe(false);
  });

  it("refuses to clear a claim that isn't quarantined", () => {
    expect(unquarantineClaimForAdmin("trust_safety_lead", VERIFIED_CLAIM).ok).toBe(false);
  });

  describe("quarantine actually holds the claim out of every gated learner surface", () => {
    it("Tests: excluded from listTestableTopics' eligible count", () => {
      const before = listTestableTopics(LEARNER).find((t) => t.topicId === DIJKSTRA)!;
      quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
      const after = listTestableTopics(LEARNER).find((t) => t.topicId === DIJKSTRA)!;
      expect(after.eligibleCount).toBe(before.eligibleCount - 1);
      expect(after.excludedCount).toBe(before.excludedCount + 1);
    });

    it("Test building: excluded from buildSession's question set", () => {
      const before = buildSession(LEARNER, DIJKSTRA)!;
      quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
      const after = buildSession(LEARNER, DIJKSTRA)!;
      expect(after.questionCount).toBe(before.questionCount - 1);
    });

    it("Progress readiness: excluded from readinessFor's covered claims", () => {
      const before = readinessFor(LEARNER, DIJKSTRA, SEED_NOW);
      quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
      const after = readinessFor(LEARNER, DIJKSTRA, SEED_NOW);
      expect(after.covered).toBe(before.covered - 1);
    });

    it("Review: a review card on a quarantined claim drops out of the due deck", () => {
      const db = globalThis.__verilearnDb!;
      // rc_topic_dijkstra_c1 is the seeded review card for VERIFIED_CLAIM, already due.
      const before = getDueCards(LEARNER, SEED_NOW).some((c) => c.claimId === VERIFIED_CLAIM);
      expect(before).toBe(true);
      quarantineClaimForAdmin(REVIEWER1, "trust_safety_lead", VERIFIED_CLAIM, DIJKSTRA, "fraud", SEED_NOW);
      const after = getDueCards(LEARNER, SEED_NOW).some((c) => c.claimId === VERIFIED_CLAIM);
      expect(after).toBe(false);
      expect(db.reviewCards.get(`rc_${VERIFIED_CLAIM}`)).toBeTruthy(); // the card itself isn't deleted
    });
  });
});
