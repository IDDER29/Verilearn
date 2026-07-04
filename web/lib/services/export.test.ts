import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { buildDataExport } from "./export";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("data export (SETTINGS-13)", () => {
  it("bundles profile, topics with claim ledger, reviews, gaps, tasks, certs", () => {
    const ex = buildDataExport(USER, SEED_NOW)!;
    expect(ex.user.email).toBe("adeline@example.com");
    expect(ex.prefs).toBeTruthy();
    expect(ex.topics.length).toBeGreaterThan(0);
    // each topic carries its per-claim trust state (the honest ledger)
    const dijkstra = (ex.topics as Array<{ id: string; claims: Array<{ trustState: string }> }>).find((t) => t.id === "topic_dijkstra")!;
    expect(dijkstra.claims.every((c) => typeof c.trustState === "string")).toBe(true);
    expect(dijkstra.claims.some((c) => c.trustState === "disputed")).toBe(true);
  });

  it("is owner-scoped and serializable to JSON", () => {
    const ex = buildDataExport(USER, SEED_NOW)!;
    expect(() => JSON.stringify(ex)).not.toThrow();
    expect(buildDataExport("nobody", SEED_NOW)).toBeNull();
  });
});
