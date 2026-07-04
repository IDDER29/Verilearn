import { beforeEach, describe, expect, it } from "vitest";
import { createDb, ledgerFor, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listConflicts, listRankedConflicts, listResolvedConflicts, raiseDispute, reopenConflict, resolveAsInterpretive, resolveConflict } from "./conflicts";
import { isTestEligible } from "@/lib/domain/types";

declare global {
  var __verilearnDb: Db | undefined;
}

const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("conflicts service", () => {
  it("lists disputed claims across the learner's topics", () => {
    const conflicts = listConflicts(USER);
    expect(conflicts.length).toBeGreaterThanOrEqual(2); // Dijkstra + Merkle each seed a disputed claim
    expect(conflicts.every((c) => c.state === "disputed")).toBe(true);
  });

  it("scopes conflicts to the owner", () => {
    expect(listConflicts("intruder")).toHaveLength(0);
  });

  it("resolving re-verifies the claim (disputed → verified) and removes the conflict", () => {
    const before = listConflicts(USER).length;
    const r = resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
    expect(r.ok).toBe(true);
    expect(r.newState).toBe("verified_source");
    // ledger + coverage updated
    const topic = globalThis.__verilearnDb!.topics.get("topic_dijkstra")!;
    expect(ledgerFor(topic).stateOf("topic_dijkstra_c6")).toBe("verified_source");
    expect(listConflicts(USER).length).toBe(before - 1);
  });

  it("requires a constraint and rejects non-disputed / foreign claims", () => {
    expect(resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "" }).ok).toBe(false);
    expect(resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c1", { constraint: "x" }).ok).toBe(false); // not disputed
    expect(resolveConflict("intruder", "topic_dijkstra", "topic_dijkstra_c6", { constraint: "x" }).ok).toBe(false);
  });

  it("ranks conflicts across topics by importance — most-broken topic first (TRUST-06)", () => {
    const ranked = listRankedConflicts(USER);
    expect(ranked.length).toBe(listConflicts(USER).length); // same set, enriched + ordered
    expect(ranked.every((c) => c.state === "disputed")).toBe(true);
    // every item carries its topic's verified% and the list is sorted non-decreasing by it
    for (let i = 1; i < ranked.length; i++) {
      expect(ranked[i].topicVerifiedPercent).toBeGreaterThanOrEqual(ranked[i - 1].topicVerifiedPercent);
    }
    expect(listRankedConflicts("intruder")).toHaveLength(0);
  });

  it("lists a claim as resolved only after a disputed→resolved transition (TRUST-13)", () => {
    expect(listResolvedConflicts(USER, "topic_dijkstra")).toHaveLength(0);
    resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
    const resolved = listResolvedConflicts(USER, "topic_dijkstra");
    expect(resolved.map((r) => r.claimId)).toContain("topic_dijkstra_c6");
    expect(listResolvedConflicts("intruder", "topic_dijkstra")).toHaveLength(0);
  });

  it("reopening a resolved conflict reverts the claim to disputed via the system verifier (TRUST-13)", () => {
    resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
    const topic = globalThis.__verilearnDb!.topics.get("topic_dijkstra")!;
    expect(ledgerFor(topic).stateOf("topic_dijkstra_c6")).toBe("verified_source");

    const r = reopenConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", "the source doesn't cover directed graphs");
    expect(r.ok).toBe(true);
    expect(r.newState).toBe("disputed");
    // written by the system verifier — never the learner
    const evs = topic.events.filter((e) => e.claimId === "topic_dijkstra_c6");
    const last = evs[evs.length - 1];
    expect(last.producedBy).toBe("system:verifier");
    expect(last.state).toBe("disputed");
    // back in the open-conflicts pool, out of the resolved list
    expect(listConflicts(USER).some((c) => c.claimId === "topic_dijkstra_c6")).toBe(true);
    expect(listResolvedConflicts(USER, "topic_dijkstra").map((c) => c.claimId)).not.toContain("topic_dijkstra_c6");
  });

  it("maps ≥2 competing positions to an interpretive state, out of test pools (TRUST-10)", () => {
    const r = resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c6", [
      { stance: "correct only on non-negative weights" },
      { stance: "'weighted' implies non-negative in this course's context" },
    ]);
    expect(r.ok).toBe(true);
    expect(r.newState).toBe("interpretive");
    const topic = globalThis.__verilearnDb!.topics.get("topic_dijkstra")!;
    expect(ledgerFor(topic).stateOf("topic_dijkstra_c6")).toBe("interpretive");
    expect(isTestEligible("interpretive")).toBe(false); // stays out of single-answer tests
    // written by the system verifier, and no longer an open conflict
    const evs = topic.events.filter((e) => e.claimId === "topic_dijkstra_c6");
    expect(evs[evs.length - 1].producedBy).toBe("system:verifier");
    expect(listConflicts(USER).some((c) => c.claimId === "topic_dijkstra_c6")).toBe(false);
  });

  it("interpretive resolution needs ≥2 positions and a disputed, owned claim (TRUST-10)", () => {
    expect(resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c6", [{ stance: "only one side" }]).ok).toBe(false);
    expect(resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c6", [{ stance: "a" }, { stance: "  " }]).ok).toBe(false); // 2nd blank
    expect(resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c1", [{ stance: "a" }, { stance: "b" }]).ok).toBe(false); // not disputed
    expect(resolveAsInterpretive("intruder", "topic_dijkstra", "topic_dijkstra_c6", [{ stance: "a" }, { stance: "b" }]).ok).toBe(false); // foreign
  });

  it("TASK-11: raises a new dispute on a currently-eligible claim via the system verifier", () => {
    const topic = globalThis.__verilearnDb!.topics.get("topic_dijkstra")!;
    expect(ledgerFor(topic).stateOf("topic_dijkstra_c1")).not.toBe("disputed");
    expect(listConflicts(USER).some((c) => c.claimId === "topic_dijkstra_c1")).toBe(false);

    const r = raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c1", "I think this criterion is graded too strictly");
    expect(r.ok).toBe(true);
    expect(r.newState).toBe("disputed");

    const evs = topic.events.filter((e) => e.claimId === "topic_dijkstra_c1");
    expect(evs[evs.length - 1].producedBy).toBe("system:verifier"); // never the learner
    expect(listConflicts(USER).some((c) => c.claimId === "topic_dijkstra_c1")).toBe(true);
  });

  it("TASK-11: rate-limits new disputes to 3 per learner per hour, independent of other learners", () => {
    const db = globalThis.__verilearnDb!;
    // A different learner's recent disputes must not count against this learner's limit.
    db.disputeLog.push({ userId: "someone_else", at: SEED_NOW }, { userId: "someone_else", at: SEED_NOW }, { userId: "someone_else", at: SEED_NOW });

    expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c1", "reason 1").ok).toBe(true);
    expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c2", "reason 2").ok).toBe(true);
    expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c3", "reason 3").ok).toBe(true);
    // 4th within the hour is rate-limited, even against a different, still-eligible claim.
    const limited = raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c4", "reason 4");
    expect(limited.ok).toBe(false);
    expect(limited.error).toMatch(/wait/i);
  });

  it("raiseDispute requires a reason and rejects an already-disputed / unknown / foreign claim", () => {
    expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c1", "   ").ok).toBe(false); // no reason
    expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c6", "already open").ok).toBe(false); // already disputed
    expect(raiseDispute(USER, "topic_dijkstra", "no_such_claim", "x").ok).toBe(false); // unknown claim
    expect(raiseDispute("intruder", "topic_dijkstra", "topic_dijkstra_c1", "x").ok).toBe(false); // foreign
  });

  it("reopen requires a reason and rejects already-open / foreign claims (TRUST-13)", () => {
    resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
    expect(reopenConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", "   ").ok).toBe(false); // no reason
    expect(reopenConflict("intruder", "topic_dijkstra", "topic_dijkstra_c6", "x").ok).toBe(false); // foreign
    // an already-disputed (never-resolved) claim cannot be reopened
    expect(reopenConflict(USER, "topic_merkle", "topic_merkle_c4", "x").ok).toBe(false);
  });

  describe("GAP-21: conflict-origin gap wiring", () => {
    it("raising a dispute opens a new conflict-origin gap for the claim", () => {
      const db = globalThis.__verilearnDb!;
      expect([...db.gaps.values()].some((g) => g.gap.claimId === "topic_dijkstra_c1")).toBe(false);

      raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c1", "not convinced");

      const rec = [...db.gaps.values()].find((g) => g.gap.claimId === "topic_dijkstra_c1")!;
      expect(rec).toBeTruthy();
      expect(rec.gap.origin).toBe("conflict");
      expect(rec.gap.status).toBe("open");
    });

    it("resolving a conflict advances its tracked gap toward closure (like a correct recall)", () => {
      const db = globalThis.__verilearnDb!;
      // The seed already tracks an open, conflict-origin gap for c6 (gap_1).
      expect(db.gaps.get("gap_1")!.gap.status).toBe("open");

      const r = resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
      expect(r.ok).toBe(true);
      expect(db.gaps.get("gap_1")!.gap.status).toBe("watching");
    });

    it("reopening a resolved conflict reopens its tracked gap too", () => {
      const db = globalThis.__verilearnDb!;
      resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
      expect(db.gaps.get("gap_1")!.gap.status).toBe("watching");

      const r = reopenConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", "the source doesn't cover directed graphs");
      expect(r.ok).toBe(true);
      expect(db.gaps.get("gap_1")!.gap.status).toBe("reopened");
    });

    it("an interpretive resolution also advances the tracked gap toward closure", () => {
      const db = globalThis.__verilearnDb!;
      raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c2", "not convinced");
      const rec = [...db.gaps.values()].find((g) => g.gap.claimId === "topic_dijkstra_c2")!;
      expect(rec.gap.status).toBe("open");

      const r = resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c2", [{ stance: "a" }, { stance: "b" }]);
      expect(r.ok).toBe(true);
      expect(db.gaps.get(rec.gap.id)!.gap.status).toBe("watching");
    });

    it("a rejected dispute/resolution attempt never touches gap state", () => {
      const db = globalThis.__verilearnDb!;
      const before = db.gaps.get("gap_1")!.gap.status;
      resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "" }); // rejected: no constraint
      expect(db.gaps.get("gap_1")!.gap.status).toBe(before);
    });
  });

  describe("BILL-12: archived topics are read-only", () => {
    it("refuses to raise, resolve, interpret, or reopen a dispute on an archived topic", () => {
      const db = globalThis.__verilearnDb!;
      db.topics.get("topic_dijkstra")!.archived = true;

      expect(raiseDispute(USER, "topic_dijkstra", "topic_dijkstra_c1", "not convinced").ok).toBe(false);
      expect(resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "x" }).ok).toBe(false);
      expect(resolveAsInterpretive(USER, "topic_dijkstra", "topic_dijkstra_c6", [{ stance: "a" }, { stance: "b" }]).ok).toBe(false);
      expect(reopenConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", "reason").ok).toBe(false);
    });
  });
});
