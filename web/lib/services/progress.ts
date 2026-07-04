/**
 * Progress service — the four honest signals from real learner data (ANALYTICS-01).
 * Retention & calibration come from the review log; transfer from graded tasks;
 * blind-spot from seeded drills. Signals with no data report an honest empty state
 * (never a fabricated 0%).
 */
import { calibrationScore, type CalibrationDirection } from "@/lib/domain/calibration";
import { computeSignals, type Signals } from "@/lib/domain/signals";
import { eligibleClaims, predictReadiness } from "@/lib/domain/tests-engine";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";
import type { ReviewLogEntry } from "@/lib/store/entities";
import { listTopicSummaries } from "./topics";
import { openGapCountForClaims } from "./gaps";
import { blindSpotOutcomes } from "./drills";
import { now } from "@/lib/ids";

/** Trend-delta comparison window for the four signals (ANALYTICS-01): "vs. 7 days ago". */
const TREND_WINDOW_MS = 7 * 86_400_000;

export interface RetentionPoint {
  /** Epoch ms at the start of the week bucket. */
  weekStart: number;
  /** Short axis label, e.g. "w3". */
  label: string;
  /** Recall rate for reviews in this week (0..1), or null when the week has no reviews. */
  retention: number | null;
  reviews: number;
}

export interface RetentionSeries {
  points: RetentionPoint[];
  /** True once ≥2 weeks carry data — below that a trend line would be dishonest. */
  hasEnough: boolean;
  weeks: number;
}

/**
 * Real time-bucketed retention series (ANALYTICS-05): recall rate per week over
 * the trailing `weeks`, straight from the review log. A week with no reviews is
 * `null` (a gap in the line, not a fabricated 0), and `hasEnough` is false until
 * at least two weeks carry data so the UI can show an honest "not enough history".
 */
export function retentionSeries(userId: string, at: number, weeks = 6): RetentionSeries {
  const WEEK = 7 * 86_400_000;
  const log = getDb().reviewLog.filter((r) => r.userId === userId);
  const points: RetentionPoint[] = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const start = at - (i + 1) * WEEK;
    const end = at - i * WEEK;
    const inWeek = log.filter((r) => r.at > start && r.at <= end);
    const correct = inWeek.filter((r) => r.correct).length;
    points.push({
      weekStart: start,
      label: `w${weeks - i}`,
      retention: inWeek.length ? correct / inWeek.length : null,
      reviews: inWeek.length,
    });
  }
  return { points, hasEnough: points.filter((p) => p.retention !== null).length >= 2, weeks };
}

export interface ProgressView {
  signals: Signals;
  reviewCount: number;
  topicCount: number;
  /** Named direction of miscalibration + score, or null under MIN_RECORDS (ANALYTICS-06). */
  calibration: { score: number; direction: CalibrationDirection; count: number } | null;
}

/** Build a calibration summary (or null under MIN_RECORDS) from a slice of the review log. */
function calibrationSummaryFor(log: readonly Pick<ReviewLogEntry, "confidence" | "correct">[]) {
  const cal = calibrationScore(log.map((r) => ({ confidence: r.confidence, correct: r.correct })));
  return cal.status === "ok" ? { score: cal.score, direction: cal.direction, count: cal.count } : null;
}

export function progressFor(userId: string): ProgressView {
  const db = getDb();
  const log = db.reviewLog.filter((r) => r.userId === userId);
  const calibration = calibrationSummaryFor(log);

  const allTasks = [...db.tasks.values()].filter((t) => t.userId === userId && t.passed !== undefined);
  const tasks = allTasks.map((t) => t.passed as boolean);

  // Prior-window comparison (ANALYTICS-01 trend delta): the same signals as of
  // TREND_WINDOW_MS ago, from whatever review/task history existed by then.
  // Tasks graded before `gradedAt` existed have no timestamp to compare against
  // and are excluded from the prior window only (never fabricated as "already there").
  const cutoff = now() - TREND_WINDOW_MS;
  const priorLog = log.filter((r) => r.at <= cutoff);
  const priorTasks = allTasks.filter((t) => t.gradedAt !== undefined && t.gradedAt <= cutoff).map((t) => t.passed as boolean);

  const signals = computeSignals(
    {
      reviews: log.map((r) => r.correct),
      tasks,
      calibration,
      drills: blindSpotOutcomes(userId),
    },
    {
      reviews: priorLog.map((r) => r.correct),
      tasks: priorTasks,
      calibration: calibrationSummaryFor(priorLog),
      drills: blindSpotOutcomes(userId, cutoff),
    },
  );

  return { signals, reviewCount: log.length, topicCount: topicsOf(db, userId).length, calibration };
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

  // Rubric-graded tasks on this topic are transfer evidence (TASK-13): pass-rate
  // over graded tasks, or undefined when none are graded (no effect on the forecast).
  const gradedTasks = [...db.tasks.values()].filter((t) => t.userId === userId && t.topicId === topicId && t.passed !== undefined);
  const taskPassRate = gradedTasks.length > 0 ? gradedTasks.filter((t) => t.passed).length / gradedTasks.length : undefined;

  const forecast = predictReadiness({
    retention,
    calibration,
    coveredClaims: eligible.length,
    reviewedClaims,
    disputedInScope,
    taskPassRate,
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
