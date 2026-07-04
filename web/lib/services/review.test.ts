import { beforeEach, describe, expect, it } from "vitest";
import { closeGap, openGap, toWatching } from "@/lib/domain/gap";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { calibrationFor, gradeCard, getDueCards, retentionFor, sessionSummaryFor, SESSION_WINDOW_MS } from "./review";

// The service reads the process singleton via getDb(); seed that singleton.
declare global {
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

  it("REVIEW-15: holds out a due card whose claim has become contested", () => {
    const db = globalThis.__verilearnDb!;
    const dueBefore = getDueCards(USER, SEED_NOW);
    expect(dueBefore.length).toBe(3);
    const target = dueBefore[0];
    const topic = db.topics.get(target.topicId)!;
    // The Skeptic disputes the underlying claim → live ledger state becomes disputed.
    topic.events.push({
      id: "ve_dispute_test",
      claimId: target.claimId,
      state: "disputed",
      producedBy: "system:verifier",
      producerVersion: "test",
      at: SEED_NOW,
      evidence: { method: "skeptic", detail: "contested", confidence: 0.3, resolved: false },
    });
    const dueAfter = getDueCards(USER, SEED_NOW);
    expect(dueAfter.length).toBe(2); // the contested claim's card is held out
    expect(dueAfter.some((c) => c.claimId === target.claimId)).toBe(false);
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

  it("summarises the most-recent session: counts, correct, and next-due", () => {
    // Grade three cards within one session window.
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "unsure", "hard", SEED_NOW + 1000);
    gradeCard(USER, "rc_topic_dijkstra_c3", "guessing", "again", SEED_NOW + 2000);

    const s = sessionSummaryFor(USER, SEED_NOW + 3000);
    expect(s.reviewed).toBe(3);
    expect(s.correct).toBe(2); // again is the only lapse
    expect(s.ratingCounts).toEqual({ again: 1, hard: 1, good: 1, easy: 0 });
    expect(s.streakDays).toBeGreaterThanOrEqual(1);
    // c1/c2 rescheduled forward, so at least one card is upcoming.
    expect(s.nextDue).not.toBeNull();
    expect(s.dueSoonCount).toBeGreaterThanOrEqual(1);
  });

  it("excludes grades older than the session window from the summary", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW); // old
    const later = SEED_NOW + SESSION_WINDOW_MS + 60_000;
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", later); // new session
    const s = sessionSummaryFor(USER, later);
    expect(s.reviewed).toBe(1); // only the recent grade counts
  });

  it("GAP-05: correct recalls advance a tracked gap open→watching→closed", () => {
    const db = globalThis.__verilearnDb!;
    // Track an OPEN gap on the claim behind card c2.
    const g = openGap({ id: "gap_adv", claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", origin: "review" }, SEED_NOW);
    db.gaps.set(g.id, { userId: USER, gap: g });

    // First correct recall → watching.
    const r1 = gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW + 10);
    expect(r1.gapAdvanced).toBe(true);
    expect(db.gaps.get("gap_adv")!.gap.status).toBe("watching");

    // Second sustained correct recall → closed (MASTERY_THRESHOLD = 2).
    const r2 = gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW + 20);
    expect(r2.gapClosed).toBe(true);
    expect(db.gaps.get("gap_adv")!.gap.status).toBe("closed");
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
