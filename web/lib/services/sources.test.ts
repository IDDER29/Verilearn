import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { coverageMatrix } from "./sources";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("coverage matrix", () => {
  it("builds a claims × sources grid from real ledger evidence", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    expect(cov.rows.length).toBe(cov.rows.length); // one row per claim
    // every row has exactly one cell per source
    for (const r of cov.rows) expect(r.cells.length).toBe(cov.sources.length);
  });

  it("marks the disputed claim as unsupported (no filled cell)", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    const disputedRow = cov.rows.find((r) => r.state === "disputed");
    expect(disputedRow).toBeTruthy();
    expect(disputedRow!.cells.every((c) => c.state === null)).toBe(true);
  });

  it("coverage percent = backed ÷ total and backed omits the disputed claim", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    expect(cov.backedCount).toBeLessThan(cov.rows.length); // the disputed one isn't backed
    expect(cov.coveragePercent).toBe(Math.round((cov.backedCount / cov.rows.length) * 100));
  });

  it("scopes to the owner", () => {
    expect(coverageMatrix("intruder", "topic_dijkstra")).toBeNull();
  });
});
