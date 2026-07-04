import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { coverageMatrix } from "./sources";
import { listNotifications } from "./notifications";
import { buildSession, submitTest } from "./testsession";

declare global {
  // eslint-disable-next-line no-var
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("sources coverage matrix", () => {
  it("builds a claims × sources grid; the disputed claim is an unbacked row", () => {
    const m = coverageMatrix(USER, "topic_dijkstra")!;
    expect(m.rows).toHaveLength(6);
    expect(m.sources.length).toBe(3);
    const disputedRow = m.rows.find((r) => r.claimId === "topic_dijkstra_c6")!;
    expect(disputedRow.state).toBe("disputed");
    expect(disputedRow.cells.every((c) => c.state === null)).toBe(true); // unbacked
    expect(m.backedCount).toBe(5);
    expect(m.coveragePercent).toBe(83);
  });
  it("scopes to the owner", () => {
    expect(coverageMatrix("intruder", "topic_dijkstra")).toBeNull();
  });
});

describe("notifications", () => {
  it("derives verification/review/conflict items from real state", () => {
    const items = listNotifications(USER);
    expect(items.some((i) => i.kind === "verification")).toBe(true);
    expect(items.some((i) => i.kind === "conflict")).toBe(true);
    expect(items.every((i) => i.href.startsWith("/"))).toBe(true);
  });
});

describe("test session (prove loop)", () => {
  it("builds a session from eligible claims only (disputed excluded)", () => {
    const s = buildSession(USER, "topic_dijkstra")!;
    expect(s.questionCount).toBe(5); // 6 claims − 1 disputed
    expect(s.passBar).toBe(75);
  });

  it("a passing score issues + persists a certificate; a failing one does not", () => {
    const pass = submitTest(USER, "topic_dijkstra", 5, 5);
    expect(pass.passed).toBe(true);
    expect(pass.certificateId).toBeTruthy();
    expect(globalThis.__verilearnDb!.certificates.size).toBe(1);

    const fail = submitTest(USER, "topic_dijkstra", 2, 5);
    expect(fail.passed).toBe(false);
    expect(fail.certificateId).toBeUndefined();
    expect(globalThis.__verilearnDb!.certificates.size).toBe(1); // unchanged
  });
});
