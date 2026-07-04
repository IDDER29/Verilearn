import { beforeEach, describe, expect, it } from "vitest";
import { createDb, ledgerFor, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listConflicts, listRankedConflicts, listResolvedConflicts, reopenConflict, resolveAsInterpretive, resolveConflict } from "./conflicts";
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

  it("reopen requires a reason and rejects already-open / foreign claims (TRUST-13)", () => {
    resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
    expect(reopenConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", "   ").ok).toBe(false); // no reason
    expect(reopenConflict("intruder", "topic_dijkstra", "topic_dijkstra_c6", "x").ok).toBe(false); // foreign
    // an already-disputed (never-resolved) claim cannot be reopened
    expect(reopenConflict(USER, "topic_merkle", "topic_merkle_c4", "x").ok).toBe(false);
  });
});
