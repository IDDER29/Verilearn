import { beforeEach, describe, expect, it } from "vitest";
import { createDb, ledgerFor, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listConflicts, resolveConflict } from "./conflicts";

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
});
