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
import { listTopicSummaries } from "./topics";
import { openGapCountForClaims } from "./gaps";

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
  // Open/reopened gaps on covered claims are unresolved misconceptions in scope —
  // they suppress readiness alongside disputed claims (GAP-11 → Tests link).
  const openGaps = openGapCountForClaims(userId, eligibleIds);
  const disputedInScope = topic.claims.length - eligible.length + openGaps;

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

export interface TopicProgress {
  topicId: string;
  title: string;
  /** Share of the topic's reviews recalled (0..1), or null with no reviews. */
  retention: number | null;
  /** Share of the topic's graded tasks passed (0..1), or null with none graded. */
  transfer: number | null;
  /** Calibration score on the topic's reviews (0..1), or null under MIN_RECORDS. */
  calibration: number | null;
  /** Ledger-computed percent verified. */
  verifiedPercent: number;
}

/** Per-topic breakdown of the honest signals, for the Progress "By topic" table (ANALYTICS-06). */
export function perTopicProgress(userId: string): TopicProgress[] {
  const db = getDb();
  return listTopicSummaries(userId).map((s) => {
    const log = db.reviewLog.filter((r) => r.userId === userId && r.topicId === s.id);
    const retention = log.length ? log.filter((r) => r.correct).length / log.length : null;
    const cal = calibrationScore(log.map((r) => ({ confidence: r.confidence, correct: r.correct })));
    const calibration = cal.status === "ok" ? cal.score : null;
    const tasks = [...db.tasks.values()].filter((t) => t.userId === userId && t.topicId === s.id && t.passed !== undefined);
    const transfer = tasks.length ? tasks.filter((t) => t.passed).length / tasks.length : null;
    return { topicId: s.id, title: s.title, retention, transfer, calibration, verifiedPercent: s.verifiedPercent };
  });
}

export interface FocusItem {
  topicId: string;
  title: string;
  /** The weakest measured dimension driving the recommendation. */
  reason: string;
  tone: "red" | "amber" | "green";
  /** Lowest measured signal 0..1 (1 when nothing measurable yet). */
  weakest: number;
}

/**
 * Rank topics by where the learner should focus (ANALYTICS "Where to focus").
 * Each topic's weakest measured signal drives the tone/reason; topics with no
 * data yet sort last and read "not enough data yet" rather than a fake verdict.
 */
export function focusAreas(userId: string): FocusItem[] {
  const dims: { key: keyof TopicProgress; label: string }[] = [
    { key: "calibration", label: "calibration" },
    { key: "retention", label: "retention" },
    { key: "transfer", label: "transfer" },
  ];
  return perTopicProgress(userId)
    .map((t) => {
      const measured = dims
        .map((d) => ({ label: d.label, value: t[d.key] as number | null }))
        .filter((m): m is { label: string; value: number } => m.value !== null);
      if (measured.length === 0) {
        return { topicId: t.topicId, title: t.title, reason: "not enough data yet", tone: "amber" as const, weakest: 1 };
      }
      const worst = measured.reduce((a, b) => (b.value < a.value ? b : a));
      const tone: FocusItem["tone"] = worst.value < 0.5 ? "red" : worst.value < 0.7 ? "amber" : "green";
      const verdict = tone === "red" ? "needs work" : tone === "amber" ? "watch" : "solid";
      return { topicId: t.topicId, title: t.title, reason: `${worst.label} ${verdict} · ${Math.round(worst.value * 100)}%`, tone, weakest: worst.value };
    })
    .sort((a, b) => a.weakest - b.weakest);
}

/** Format a 0..1 signal value as a percent string, or the honest empty label. */
export function signalDisplay(value: number | null, confidence: string): { text: string; sub: string } {
  if (value === null || confidence === "none") return { text: "—", sub: "Not enough data yet" };
  const pct = `${Math.round(value * 100)}%`;
  return { text: pct, sub: confidence === "low" ? "Low confidence · keep going" : "On track" };
}
