import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { coverageMatrix } from "./sources";
import { listNotifications } from "./notifications";
import { buildSession, submitTest } from "./testsession";

declare global {
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
    const before = globalThis.__verilearnDb!.certificates.size; // a seeded cert already exists (ADMIN-15/22 fixture)
    const pass = submitTest(USER, "topic_dijkstra", 5, 5);
    expect(pass.passed).toBe(true);
    expect(pass.certificateId).toBeTruthy();
    expect(globalThis.__verilearnDb!.certificates.size).toBe(before + 1);

    const fail = submitTest(USER, "topic_dijkstra", 2, 5);
    expect(fail.passed).toBe(false);
    expect(fail.certificateId).toBeUndefined();
    expect(globalThis.__verilearnDb!.certificates.size).toBe(before + 1); // unchanged
  });

  it("missed claims become tracked gaps tagged origin=test, ignoring foreign ids (TEST-06)", () => {
    const db = globalThis.__verilearnDb!;
    const before = [...db.gaps.values()].filter((g) => g.userId === USER).length;
    const r = submitTest(USER, "topic_dijkstra", 4, 5, ["topic_dijkstra_c3", "not_a_real_claim"]);
    expect(r.ok).toBe(true);
    expect(r.gapsOpened).toBe(1); // the bogus id is ignored; one real miss tracked
    const gaps = [...db.gaps.values()].filter((g) => g.userId === USER);
    expect(gaps.length).toBe(before + 1);
    const opened = gaps.find((g) => g.gap.claimId === "topic_dijkstra_c3")!;
    expect(opened.gap.origin).toBe("test");
    expect(opened.gap.status).toBe("open");
  });

  it("re-missing an already-tracked claim does not duplicate its gap (TEST-06)", () => {
    const db = globalThis.__verilearnDb!;
    // seed already tracks a gap on topic_dijkstra_c6 (open); missing it must not add another
    const before = [...db.gaps.values()].filter((g) => g.userId === USER).length;
    const r = submitTest(USER, "topic_dijkstra", 4, 5, ["topic_dijkstra_c6"]);
    expect(r.gapsOpened).toBe(0); // already open — no new/regressed gap
    expect([...db.gaps.values()].filter((g) => g.userId === USER).length).toBe(before);
  });
});
