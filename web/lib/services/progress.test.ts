import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { gradeCard } from "./review";
import { gradeSubmission } from "./tasks";
import { focusAreas, perTopicProgress, progressFor, readinessFor, retentionSeries, signalDisplay } from "./progress";

declare global {
  var __verilearnDb: Db | undefined;
}

const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("progress signals", () => {
  it("reports honest empty signals before any activity", () => {
    const { signals } = progressFor(USER);
    expect(signals.retention.value).toBeNull();
    expect(signals.retention.confidence).toBe("none");
    expect(signals.transfer.value).toBeNull();
    expect(signals.blindSpot.value).toBeNull();
  });

  it("has exactly the four canonical signals and no vanity fields", () => {
    const { signals } = progressFor(USER);
    expect(Object.keys(signals).sort()).toEqual(["blindSpot", "calibration", "retention", "transfer"]);
  });

  it("computes retention from real graded reviews", () => {
    // grade 3 good, 1 again → retention 75%
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c4", "guessing", "again", SEED_NOW);
    const { signals, reviewCount } = progressFor(USER);
    expect(reviewCount).toBe(4);
    expect(signals.retention.value).toBeCloseTo(0.75, 5);
    expect(signals.retention.confidence).not.toBe("none");
  });

  it("ANALYTICS-06: progressFor surfaces the named calibration direction once past the threshold", () => {
    // 6 confident-but-wrong reviews → overconfident (needs ≥ MIN_RECORDS=5)
    const ids = ["rc_topic_dijkstra_c1", "rc_topic_dijkstra_c2", "rc_topic_dijkstra_c3", "rc_topic_dijkstra_c4", "rc_topic_dijkstra_c1", "rc_topic_dijkstra_c2"];
    ids.forEach((id, i) => gradeCard(USER, id, "sure", "again", SEED_NOW + i));
    const { calibration } = progressFor(USER);
    expect(calibration).not.toBeNull();
    expect(calibration!.direction).toBe("overconfident");
    expect(calibration!.count).toBeGreaterThanOrEqual(5);
  });

  it("ANALYTICS-06: calibration is null below the minimum record threshold (honest empty)", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    expect(progressFor(USER).calibration).toBeNull();
  });

  it("readiness is low-confidence with no review history (never fabricated)", () => {
    const r = readinessFor(USER, "topic_dijkstra", SEED_NOW);
    expect(r.lowConfidence).toBe(true);
    expect(r.reviewed).toBe(0);
    expect(r.covered).toBeGreaterThan(0); // dijkstra has eligible claims
    expect(r.pct).toBe(0); // covered>0 → a number, and 0 with no history
  });

  it("readiness predicts a real pass-likelihood once covered claims are reviewed", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c4", "sure", "good", SEED_NOW);
    const r = readinessFor(USER, "topic_dijkstra", SEED_NOW);
    expect(r.lowConfidence).toBe(false); // 4 distinct eligible claims ≥ MIN
    expect(r.reviewed).toBe(4);
    expect(r.pct!).toBeGreaterThan(0);
    expect(r.pct!).toBeLessThanOrEqual(100);
  });

  it("TASK-13: a passed task on the topic raises predicted readiness", () => {
    // Establish a review-backed readiness baseline (no graded tasks yet).
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c4", "sure", "good", SEED_NOW);
    const before = readinessFor(USER, "topic_dijkstra", SEED_NOW).pct!;

    // Pass the topic's rubric task → transfer evidence lifts readiness.
    const g = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(g.passed).toBe(true);
    const after = readinessFor(USER, "topic_dijkstra", SEED_NOW).pct!;
    expect(after).toBeGreaterThan(before);
  });

  it("readiness is topic-scoped (other topics' reviews don't count)", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", SEED_NOW);
    expect(readinessFor(USER, "topic_merkle", SEED_NOW).reviewed).toBe(0);
  });

  it("per-topic progress is honest-empty before reviews and real after", () => {
    const before = perTopicProgress(USER).find((t) => t.topicId === "topic_dijkstra")!;
    expect(before.retention).toBeNull();
    expect(before.verifiedPercent).toBeGreaterThan(0); // ledger-computed regardless

    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", SEED_NOW);
    const after = perTopicProgress(USER).find((t) => t.topicId === "topic_dijkstra")!;
    expect(after.retention).toBeCloseTo(0.5, 5); // 1 of 2 recalled
  });

  it("focus areas rank the weakest measured signal and sort worst-first", () => {
    // Make Dijkstra weak (all lapses) so it should rank ahead of no-data topics.
    gradeCard(USER, "rc_topic_dijkstra_c1", "guessing", "again", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", SEED_NOW);
    const focus = focusAreas(USER);
    expect(focus[0].topicId).toBe("topic_dijkstra");
    expect(focus[0].tone).toBe("red");
    // topics with no data read honestly, never a fabricated verdict
    const merkle = focus.find((f) => f.topicId === "topic_merkle")!;
    expect(merkle.reason).toBe("not enough data yet");
  });

  it("ANALYTICS-05: weekly retention series is honest-empty until ≥2 weeks carry data", () => {
    const WEEK = 7 * 86_400_000;
    // No reviews yet → not enough history, every bucket null.
    const empty = retentionSeries(USER, SEED_NOW, 6);
    expect(empty.hasEnough).toBe(false);
    expect(empty.points.length).toBe(6);
    expect(empty.points.every((p) => p.retention === null)).toBe(true);

    // Review across two distinct weeks → the series becomes trustworthy.
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW - WEEK); // last week: correct
    gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", SEED_NOW - 100); // this week: lapse
    const filled = retentionSeries(USER, SEED_NOW, 6);
    expect(filled.hasEnough).toBe(true);
    const withData = filled.points.filter((p) => p.retention !== null);
    expect(withData.length).toBe(2);
    expect(retentionSeries("intruder", SEED_NOW, 6).hasEnough).toBe(false);
  });

  it("ANALYTICS-01: retention carries a real trend delta vs. 7 days ago", () => {
    const day = 86_400_000;
    const realNow = Date.now();
    // 8 days ago (outside the trend window... no, INSIDE the prior window: <= cutoff): a weak run.
    gradeCard(USER, "rc_topic_dijkstra_c1", "guessing", "again", realNow - 8 * day);
    gradeCard(USER, "rc_topic_dijkstra_c2", "guessing", "again", realNow - 8 * day + 1);
    // Recent (after the cutoff): a strong run.
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", realNow);
    gradeCard(USER, "rc_topic_dijkstra_c4", "sure", "good", realNow);

    const { signals } = progressFor(USER);
    // current = all 4 grades (2 correct of 4 = 0.5); prior = the 2 old grades (0 of 2 = 0).
    expect(signals.retention.value).toBeCloseTo(0.5, 5);
    expect(signals.retention.delta).toBeCloseTo(0.5, 5); // improved from 0 to 0.5
  });

  it("ANALYTICS-01: delta is null with no prior-window history to compare against", () => {
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", Date.now());
    const { signals } = progressFor(USER);
    expect(signals.retention.value).not.toBeNull();
    expect(signals.retention.delta).toBeNull();
  });

  it("ANALYTICS-01: transfer's delta uses each task's real gradedAt, excluding un-timestamped legacy grades from the prior window only", () => {
    const db = globalThis.__verilearnDb!;
    const day = 86_400_000;
    const realNow = Date.now();

    // A synthetic already-graded PASS with NO gradedAt (pre-dates this feature) —
    // counted in the current window, excluded from the prior window (honest, not fabricated).
    db.tasks.set("task_legacy", {
      id: "task_legacy",
      userId: USER,
      topicId: "topic_dijkstra",
      type: "explain",
      prompt: "legacy",
      rubric: { id: "r_legacy", taskId: "task_legacy", criteria: [{ id: "c", text: "x", weight: 1, sourceId: "src_clrs" }] },
      passed: true,
    });

    // A real, timestamped FAIL from 8 days ago (inside the prior window).
    gradeSubmission(USER, "task_dijkstra_1", "I don't really know the reason for that.");
    const oldTask = db.tasks.get("task_dijkstra_1")!;
    oldTask.gradedAt = realNow - 8 * day;

    const { signals } = progressFor(USER);
    // current: 2 tasks (legacy pass + old fail) → 1/2 = 0.5
    expect(signals.transfer.value).toBeCloseTo(0.5, 5);
    // prior: only the timestamped one counts → 0/1 = 0 — the legacy pass never leaks in
    expect(signals.transfer.delta).toBeCloseTo(0.5, 5);
  });

  it("signalDisplay renders empty and populated states honestly", () => {
    expect(signalDisplay(null, "none")).toEqual({ text: "—", sub: "Not enough data yet" });
    expect(signalDisplay(0.83, "ok").text).toBe("83%");
    expect(signalDisplay(0.5, "low").sub).toMatch(/low confidence/i);
  });
});
