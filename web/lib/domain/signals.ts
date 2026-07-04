/**
 * The four honest signals — Retention, Transfer, Calibration, Drill-detection
 * (blind-spot). The pure aggregation core behind the Progress surface.
 *
 * Traces to: PRD domain 32 (Analytics).
 *   - ANALYTICS-01: exactly four honest signals — Retention, Transfer,
 *     Calibration, Drill-detection — each carrying a value and a plain-language
 *     provenance naming *what* fed it. NO vanity metric (streaks, points,
 *     minutes-watched, badges) may appear at their weight — this module's result
 *     has exactly those four fields and no others.
 *   - ANALYTICS-08 / ANALYTICS-09: honest empty and low-confidence states. A
 *     signal with no contributing events reports `value: null` /
 *     `confidence: "none"` ("not enough data yet"), never a fabricated 0%. Below
 *     a minimum sample it renders `confidence: "low"` rather than a precise but
 *     unearned number.
 *   - Business rule "this domain aggregates; it does not mint": raw data-points
 *     are produced elsewhere (Review/FSRS, Tasks, the confidence gate, seeded
 *     error-drills). This module only rolls them into signals and traces them.
 *
 * Pure & deterministic: `computeSignals` takes only caller-supplied inputs — no
 * clock, no random, no I/O. Calibration is passed in as a precomputed summary
 * (score + direction + count) so no heavy calibration logic is imported; only
 * the {@link CalibrationDirection} vocabulary type is reused from ./calibration.
 */

import type { CalibrationDirection } from "./calibration";

// ----------------------------------------------------------------------------
// Vocabulary
// ----------------------------------------------------------------------------

/**
 * How much data stands behind a signal.
 *   - `none` — no contributing events; the value is `null` (honest empty state).
 *   - `low`  — some data, but below {@link LOW_CONFIDENCE_SAMPLE}; the value is
 *              shown with a low-confidence caveat, never as precise truth.
 *   - `ok`   — at or above the minimum sample; the value stands on its own.
 */
export type SignalConfidence = "none" | "low" | "ok";

/** One honest signal: a value (null when empty), its confidence, and provenance. */
export interface Signal {
  /** 0..1 aggregate, or `null` when there is nothing to report (never a fake 0). */
  value: number | null;
  confidence: SignalConfidence;
  /** Plain-language trace naming what fed the signal (ANALYTICS-01/02). */
  provenance: string;
}

/**
 * Precomputed calibration summary handed in from ./calibration — just the
 * number + direction + sample size, so this module stays free of calibration
 * math. `null` means the confidence gate produced no data-points.
 */
export interface CalibrationSummary {
  /** 0..1 calibration score (higher = better calibrated). */
  score: number;
  /** Named direction of miscalibration (over/under/well). */
  direction: CalibrationDirection;
  /** How many committed confidence data-points produced the score. */
  count: number;
}

/**
 * Raw inputs the four signals aggregate. Every field is optional; an omitted or
 * empty field yields an honest empty signal rather than a fabricated zero.
 */
export interface SignalsInput {
  /** Review recall outcomes (`true` = recalled). Retention ← FSRS reviews. */
  reviews?: readonly boolean[];
  /** Applied-task rubric outcomes (`true` = passed). Transfer ← rubric-graded tasks. */
  tasks?: readonly boolean[];
  /** Calibration summary from the confidence gate, or `null` if none. */
  calibration?: CalibrationSummary | null;
  /** Seeded-error-drill outcomes (`true` = caught the error). Blind-spot ← drills. */
  drills?: readonly boolean[];
}

/**
 * The four honest signals. This object has EXACTLY these keys — no streaks,
 * points, minutes, or badges are permitted at signal weight (ANALYTICS-01).
 */
export interface Signals {
  retention: Signal;
  transfer: Signal;
  calibration: Signal;
  blindSpot: Signal;
}

/** The four honest signal keys, in canonical order. Exactly four, forever. */
export const SIGNAL_KEYS = ["retention", "transfer", "calibration", "blindSpot"] as const;

/**
 * Minimum contributing data-points before a signal is `ok` rather than `low`.
 * Below this (but above zero) the value is caveated; at zero it is empty.
 * Kept in step with the calibration domain's own MIN_RECORDS for consistency
 * across signals (ANALYTICS-09: thresholds consistent across roll-ups).
 */
export const LOW_CONFIDENCE_SAMPLE = 5;

// ----------------------------------------------------------------------------
// Core
// ----------------------------------------------------------------------------

/** The honest empty state: no data, so no value — never a fabricated 0%. */
function empty(provenance: string): Signal {
  return { value: null, confidence: "none", provenance };
}

/** Map a sample size to a non-empty confidence band. */
function bandFor(n: number): Exclude<SignalConfidence, "none"> {
  return n < LOW_CONFIDENCE_SAMPLE ? "low" : "ok";
}

/**
 * Build a success-rate signal (successes / total) from boolean outcomes.
 * Empty → null/none; sparse → low; otherwise ok. `label` names the source.
 */
function rateSignal(outcomes: readonly boolean[] | undefined, label: string): Signal {
  const total = outcomes?.length ?? 0;
  if (total === 0) return empty(`${label}: no data yet`);
  let hits = 0;
  for (const ok of outcomes!) if (ok) hits += 1;
  return {
    value: hits / total,
    confidence: bandFor(total),
    provenance: `${label}: ${hits}/${total}`,
  };
}

/** Build the calibration signal from the precomputed summary (score + direction). */
function calibrationSignal(summary: CalibrationSummary | null | undefined): Signal {
  const label = "calibration ← confidence gate";
  if (!summary || summary.count === 0) return empty(`${label}: no data yet`);
  return {
    value: summary.score,
    confidence: bandFor(summary.count),
    provenance: `${label}: ${summary.direction} (n=${summary.count})`,
  };
}

/**
 * Compute the four honest signals from raw inputs. Pure and deterministic:
 * identical inputs always yield an identical result. Each signal degrades to an
 * honest empty (`null`/`none`) or low-confidence state independently, so a
 * missing source never blanks or fabricates the others (ANALYTICS-01/08/09).
 */
export function computeSignals(inputs: SignalsInput = {}): Signals {
  return {
    retention: rateSignal(inputs.reviews, "retention ← FSRS review recall"),
    transfer: rateSignal(inputs.tasks, "transfer ← rubric-graded applied tasks"),
    calibration: calibrationSignal(inputs.calibration),
    blindSpot: rateSignal(inputs.drills, "blind-spot ← seeded error-drill catch rate"),
  };
}
