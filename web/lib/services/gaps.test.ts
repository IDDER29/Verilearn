import { beforeEach, describe, expect, it } from "vitest";
import { closeGap, openGap, toWatching } from "@/lib/domain/gap";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { gapBoard, listGaps } from "./gaps";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("gap map service", () => {
  it("lists the seeded gap with resolved claim + topic text", () => {
    const gaps = listGaps(USER);
    expect(gaps.length).toBeGreaterThan(0);
    const g = gaps[0];
    expect(g.claimText).not.toBe(g.claimId); // resolved to real claim prose
    expect(g.topicTitle).toBeTruthy();
    // GAP-04: read-only trust state of the linked claim is surfaced.
    expect(g.claimState).not.toBeNull();
  });

  it("groups gaps into active / watching / closed columns", () => {
    const db = globalThis.__verilearnDb!;
    // Add a watching gap and a closed gap for coverage.
    let w = openGap({ id: "gap_w", claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", origin: "review" }, SEED_NOW);
    w = toWatching(w, SEED_NOW + 1);
    db.gaps.set(w.id, { userId: USER, gap: w });

    let c = openGap({ id: "gap_c", claimId: "topic_dijkstra_c3", topicId: "topic_dijkstra", origin: "task" }, SEED_NOW);
    c = toWatching(c, SEED_NOW + 1);
    c = closeGap(c, { successfulReviews: 3 }, SEED_NOW + 2);
    db.gaps.set(c.id, { userId: USER, gap: c });

    const board = gapBoard(USER);
    expect(board.watching.some((g) => g.id === "gap_w")).toBe(true);
    expect(board.closed.some((g) => g.id === "gap_c")).toBe(true);
    expect(board.counts.total).toBe(board.counts.active + board.counts.watching + board.counts.closed);
  });

  it("scopes gaps to the owner", () => {
    expect(listGaps("intruder")).toHaveLength(0);
  });
});
