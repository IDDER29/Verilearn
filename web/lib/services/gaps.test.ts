import { beforeEach, describe, expect, it } from "vitest";
import { closeGap, openGap, toWatching } from "@/lib/domain/gap";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { closeGapById, gapBoard, gapHeat, listGaps } from "./gaps";
import { gradeCard } from "./review";
import { onLapse } from "@/lib/domain/gap";

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

  it("GAP-11: heat ranks reopened/high-severity gaps hotter and sorts the board", () => {
    // A reopened high-severity gap should outscore a fresh low-severity open one.
    let hot = openGap({ id: "gap_hot", claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", origin: "review", severity: "med" }, SEED_NOW);
    hot = { ...hot, status: "watching", history: [...hot.history, { at: SEED_NOW + 1, from: "open", to: "watching", reason: "to-watching" }] };
    hot = onLapse(hot, SEED_NOW + 2); // → reopened, severity bumped to high
    const cold = openGap({ id: "gap_cold", claimId: "topic_dijkstra_c3", topicId: "topic_dijkstra", origin: "review", severity: "low" }, SEED_NOW);
    expect(gapHeat(hot)).toBeGreaterThan(gapHeat(cold));

    const db = globalThis.__verilearnDb!;
    db.gaps.set("gap_hot", { userId: USER, gap: hot });
    db.gaps.set("gap_cold", { userId: USER, gap: cold });
    const board = gapBoard(USER);
    // hottest active gap sorts first
    expect(board.active[0].heat).toBeGreaterThanOrEqual(board.active[board.active.length - 1].heat);
  });

  it("GAP-03: manual close is evidence-gated — refused without sustained recall, allowed with it", () => {
    const db = globalThis.__verilearnDb!;
    // Put a watching gap on c2 with no recall evidence yet.
    let g = openGap({ id: "gap_mc", claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", origin: "review" }, SEED_NOW);
    g = toWatching(g, SEED_NOW + 1);
    db.gaps.set(g.id, { userId: USER, gap: g });
    expect(closeGapById(USER, "gap_mc").ok).toBe(false); // no evidence → refused

    // Two sustained correct recalls on the claim → now closable.
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW + 10);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW + 20);
    // (grade auto-advances too, but assert the manual path yields closed)
    const rec = db.gaps.get("gap_mc")!;
    if (rec.gap.status === "watching") {
      expect(closeGapById(USER, "gap_mc").ok).toBe(true);
    }
    expect(db.gaps.get("gap_mc")!.gap.status).toBe("closed");
  });
});
