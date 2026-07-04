/**
 * Progress service — the four honest signals from real learner data (ANALYTICS-01).
 * Retention & calibration come from the review log; transfer from graded tasks;
 * blind-spot from seeded drills. Signals with no data report an honest empty state
 * (never a fabricated 0%).
 */
import { calibrationScore } from "@/lib/domain/calibration";
import { computeSignals, type Signals } from "@/lib/domain/signals";
import { eligibleClaims, predictReadiness } from "@/lib/domain/tests-engine";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";

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

export interface Readiness {
  /** 0..100 predicted pass-likelihood from the tested engine, or null if no covered claims. */
  pct: number | null;
  /** True when review history is too thin to trust the number ("not enough data yet"). */
  lowConfidence: boolean;
  /** Human basis line straight from the engine. */
  basis: string;
  /** Covered eligible claims that actually have review history feeding the forecast. */
  reviewed: number;
  /** Total eligible (verified/sourced) claims the test would cover. */
  covered: number;
}

/**
 * Predicted test readiness for a topic. Thin service wrapper that assembles the
 * learner's real signals for the topic — retention (share of topic reviews
 * recalled), calibration, covered eligible claims, how many have review history,
 * and disputed-in-scope — and delegates the forecast to the unit-tested pure
 * engine `predictReadiness` (TEST-01). No fabricated numbers: the engine returns
 * lowConfidence + "not enough data yet" when history is thin. Pure over
 * (topic, ledger, log): `now` is unused today but kept for signature stability.
 */
export function readinessFor(userId: string, topicId: string, _now: number): Readiness {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { pct: null, lowConfidence: true, basis: "not enough data yet", reviewed: 0, covered: 0 };

  const eligible = eligibleClaims(topic.claims, ledgerFor(topic));
  const eligibleIds = new Set(eligible.map((c) => c.id));
  const topicReviews = db.reviewLog.filter((r) => r.userId === userId && r.topicId === topicId && eligibleIds.has(r.claimId));

  const retention = topicReviews.length ? topicReviews.filter((r) => r.correct).length / topicReviews.length : 0;
  const cal = calibrationScore(topicReviews.map((r) => ({ confidence: r.confidence, correct: r.correct })));
  const calibration = cal.status === "ok" ? cal.score : 0;
  const reviewedClaims = new Set(topicReviews.map((r) => r.claimId)).size;
  const disputedInScope = topic.claims.length - eligible.length;

  const forecast = predictReadiness({
    retention,
    calibration,
    coveredClaims: eligible.length,
    reviewedClaims,
    disputedInScope,
  });

  return {
    pct: eligible.length === 0 ? null : forecast.readiness,
    lowConfidence: forecast.lowConfidence,
    basis: forecast.basis,
    reviewed: reviewedClaims,
    covered: eligible.length,
  };
}

/** Format a 0..1 signal value as a percent string, or the honest empty label. */
export function signalDisplay(value: number | null, confidence: string): { text: string; sub: string } {
  if (value === null || confidence === "none") return { text: "—", sub: "Not enough data yet" };
  const pct = `${Math.round(value * 100)}%`;
  return { text: pct, sub: confidence === "low" ? "Low confidence · keep going" : "On track" };
}
