import { beforeEach, describe, expect, it } from "vitest";
import { closeGap, openGap, toWatching } from "@/lib/domain/gap";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { calibrationFor, gradeCard, getDueCards, retentionFor } from "./review";

// The service reads the process singleton via getDb(); seed that singleton.
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

describe("review service", () => {
  it("returns cards due now or earlier, soonest first", () => {
    const due = getDueCards(USER, SEED_NOW);
    expect(due.length).toBe(3); // 3 of the 4 seeded cards are due <= SEED_NOW
    for (let i = 1; i < due.length; i++) expect(due[i].fsrs.due).toBeGreaterThanOrEqual(due[i - 1].fsrs.due);
  });

  it("scopes cards to the owner", () => {
    expect(getDueCards("intruder", SEED_NOW)).toHaveLength(0);
  });

  it("a 'good' grade reschedules forward and logs calibration", () => {
    const before = globalThis.__verilearnDb!.reviewLog.length;
    const r = gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    expect(r.ok).toBe(true);
    expect(r.nextDue!).toBeGreaterThan(SEED_NOW);
    expect(globalThis.__verilearnDb!.reviewLog.length).toBe(before + 1);
  });

  it("an 'again' lapse on an untracked claim opens a new gap (origin review)", () => {
    const db = globalThis.__verilearnDb!;
    const gapsBefore = db.gaps.size;
    const r = gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", SEED_NOW);
    expect(r.ok).toBe(true);
    expect(db.gaps.size).toBe(gapsBefore + 1);
    const opened = [...db.gaps.values()].find((g) => g.gap.claimId === "topic_dijkstra_c2");
    expect(opened?.gap.origin).toBe("review");
  });

  it("an 'again' lapse auto-reopens a previously closed gap for that claim (GAP-06)", () => {
    const db = globalThis.__verilearnDb!;
    // set up a CLOSED gap on the claim behind card c3
    let g = openGap({ id: "gap_c3", claimId: "topic_dijkstra_c3", topicId: "topic_dijkstra", origin: "review" }, SEED_NOW);
    g = toWatching(g, SEED_NOW + 1);
    g = closeGap(g, { successfulReviews: 3 }, SEED_NOW + 2);
    db.gaps.set(g.id, { userId: USER, gap: g });

    const r = gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "again", SEED_NOW + 100);
    expect(r.gapReopened).toBe(true);
    expect(db.gaps.get("gap_c3")!.gap.status).toBe("reopened");
  });

  it("accumulates calibration + retention across grades", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", SEED_NOW);
    const ret = retentionFor(USER);
    expect(ret.total).toBe(2);
    expect(ret.correct).toBe(1);
    // calibration exists (may be insufficient_data under 5 records — both shapes are valid)
    expect(calibrationFor(USER)).toBeTruthy();
  });
});
