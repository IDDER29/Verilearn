/**
 * Progress service — the four honest signals from real learner data (ANALYTICS-01).
 * Retention & calibration come from the review log; transfer from graded tasks;
 * blind-spot from seeded drills. Signals with no data report an honest empty state
 * (never a fabricated 0%).
 */
import { calibrationScore } from "@/lib/domain/calibration";
import { computeSignals, type Signals } from "@/lib/domain/signals";
import { getDb, topicsOf } from "@/lib/store/db";

export interface ProgressView {
  signals: Signals;
  reviewCount: number;
  topicCount: number;
}

export function progressFor(userId: string): ProgressView {
  const db = getDb();
  const log = db.reviewLog.filter((r) => r.userId === userId);
  const cal = calibrationScore(log.map((r) => ({ confidence: r.confidence, correct: r.correct })));
  const calibration = cal.status === "ok" ? { score: cal.score, direction: cal.direction, count: cal.count } : null;

  const tasks = [...db.tasks.values()]
    .filter((t) => t.userId === userId && t.passed !== undefined)
    .map((t) => t.passed as boolean);

  const signals = computeSignals({
    reviews: log.map((r) => r.correct),
    tasks,
    calibration,
    drills: [], // seeded error-drills are not yet wired → honest empty blind-spot
  });

  return { signals, reviewCount: log.length, topicCount: topicsOf(db, userId).length };
}

/** Format a 0..1 signal value as a percent string, or the honest empty label. */
export function signalDisplay(value: number | null, confidence: string): { text: string; sub: string } {
  if (value === null || confidence === "none") return { text: "—", sub: "Not enough data yet" };
  const pct = `${Math.round(value * 100)}%`;
  return { text: pct, sub: confidence === "low" ? "Low confidence · keep going" : "On track" };
}
