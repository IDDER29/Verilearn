import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { loadWorkspaceData } from "./workspace";
import { resolveConflict } from "./conflicts";

declare global {
  var __verilearnDb: Db | undefined;
}

const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("loadWorkspaceData", () => {
  it("loads the requested topic with real ledger-derived claim detail", () => {
    const data = loadWorkspaceData(USER, "topic_dijkstra")!;
    expect(data.topicId).toBe("topic_dijkstra");
    expect(data.claimCount).toBe(data.claims.length);
    expect(data.claims.every((c) => typeof c.state === "string")).toBe(true);
  });

  it("falls back to the user's first topic when no topicId is given", () => {
    const data = loadWorkspaceData(USER)!;
    expect(data).toBeTruthy();
    expect(data.topicId).toBeTruthy();
  });

  it("returns null for an unknown topic or one owned by someone else", () => {
    expect(loadWorkspaceData(USER, "nope")).toBeNull();
    expect(loadWorkspaceData("intruder", "topic_dijkstra")).toBeNull();
  });

  describe("disputedClaims reflects the REAL live ledger state (LEARN-12)", () => {
    it("surfaces the seeded disputed claim", () => {
      const data = loadWorkspaceData(USER, "topic_dijkstra")!;
      expect(data.disputedClaims).toHaveLength(1);
      expect(data.disputedClaims[0].text).toBe("It works on any weighted graph.");
    });

    it("goes empty the moment the dispute is genuinely resolved — never a stale flag on reload", () => {
      resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
      const data = loadWorkspaceData(USER, "topic_dijkstra")!;
      expect(data.disputedClaims).toHaveLength(0);
    });

    it("a resolved claim moves into resolvedClaims (TRUST-13 reopen candidates)", () => {
      resolveConflict(USER, "topic_dijkstra", "topic_dijkstra_c6", { constraint: "only non-negative edge weights" });
      const data = loadWorkspaceData(USER, "topic_dijkstra")!;
      expect(data.resolvedClaims.some((r) => r.claimId === "topic_dijkstra_c6")).toBe(true);
    });
  });
});
