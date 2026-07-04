import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { gradeCard } from "./review";
import { focusAreas, perTopicProgress, progressFor, readinessFor, signalDisplay } from "./progress";

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

  it("signalDisplay renders empty and populated states honestly", () => {
    expect(signalDisplay(null, "none")).toEqual({ text: "—", sub: "Not enough data yet" });
    expect(signalDisplay(0.83, "ok").text).toBe("83%");
    expect(signalDisplay(0.5, "low").sub).toMatch(/low confidence/i);
  });
});
