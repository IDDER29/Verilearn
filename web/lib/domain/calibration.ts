/**
 * Confidence ↔ correctness calibration.
 *
 * Traces to: PRD domain 26 (Review / FSRS), REVIEW-02 (commit-before-reveal —
 * the confidence level is committed BEFORE the answer is revealed, which is the
 * only thing that makes calibration honest rather than a post-hoc
 * rationalization) and REVIEW-05 (the calibration check names the *direction*
 * of miscalibration — overconfident vs. underconfident — not just right/wrong,
 * and shows "not enough data yet" when data-points are too few).
 *
 * Pure & deterministic: this module derives an aggregate calibration score from
 * a fixed set of {confidence, correct} data-points. It takes no clock/random
 * input — every input is a caller-supplied record, so results are reproducible.
 */

/** The confidence a learner commits BEFORE the answer is revealed (REVIEW-02). */
export type Confidence = "sure" | "unsure" | "guessing";

/** One calibration data-point: a committed confidence paired with the outcome. */
export interface CalibrationRecord {
  confidence: Confidence;
  /** Actual recall outcome (derived from the FSRS rating, per a fixed mapping). */
  correct: boolean;
}

/** Direction of miscalibration named to the learner (REVIEW-05). */
export type CalibrationDirection = "overconfident" | "underconfident" | "well_calibrated";

/** Implied probability of a correct recall for each committed confidence level. */
export const IMPLIED_PROBABILITY: Record<Confidence, number> = {
  sure: 0.9,
  unsure: 0.6,
  guessing: 0.3,
};

/**
 * Absolute gap between mean implied probability and actual accuracy beyond which
 * the aggregate is called mis-calibrated in one direction or the other. Inside
 * the band the learner is "well_calibrated".
 */
export const CALIBRATION_THRESHOLD = 0.1;

/** Below this many genuine commit-then-reveal data-points we refuse to score. */
export const MIN_RECORDS = 5;

/** Per-confidence-bucket accuracy breakdown. */
export interface BucketAccuracy {
  /** Number of records committed at this confidence level. */
  count: number;
  /** Implied probability the learner asserted by picking this level. */
  impliedProbability: number;
  /** Fraction actually recalled correctly (0..1), or null if the bucket is empty. */
  accuracy: number | null;
}

export interface InsufficientData {
  status: "insufficient_data";
  /** How many records were supplied (all below {@link MIN_RECORDS}). */
  count: number;
  required: number;
}

export interface CalibrationResult {
  status: "ok";
  /** Total data-points scored. */
  count: number;
  /**
   * 0..1 calibration score (higher = better calibrated). Brier-style: derived
   * from the mean squared error between each record's implied probability and
   * its outcome, then inverted so 1 is perfect and 0 is worst.
   */
  score: number;
  /** Named direction of miscalibration relative to actual accuracy (REVIEW-05). */
  direction: CalibrationDirection;
  /** Mean implied probability across all committed levels. */
  meanImpliedProbability: number;
  /** Overall fraction recalled correctly (0..1). */
  actualAccuracy: number;
  /** Per-bucket accuracy for sure / unsure / guessing. */
  buckets: Record<Confidence, BucketAccuracy>;
}

const CONFIDENCE_LEVELS: readonly Confidence[] = ["sure", "unsure", "guessing"];

/**
 * Compute the aggregate calibration signal for a set of committed
 * confidence/outcome records.
 *
 * Returns {@link InsufficientData} when fewer than {@link MIN_RECORDS} records
 * are supplied (honest low-confidence state — REVIEW-05 "not enough data yet"),
 * otherwise a full {@link CalibrationResult}.
 */
export function calibrationScore(
  records: readonly CalibrationRecord[],
): CalibrationResult | InsufficientData {
  if (records.length < MIN_RECORDS) {
    return { status: "insufficient_data", count: records.length, required: MIN_RECORDS };
  }

  // Brier-style mean squared error between implied probability and outcome.
  let squaredErrorSum = 0;
  let impliedSum = 0;
  let correctCount = 0;

  // Per-bucket tallies.
  const bucketTotals: Record<Confidence, number> = { sure: 0, unsure: 0, guessing: 0 };
  const bucketCorrect: Record<Confidence, number> = { sure: 0, unsure: 0, guessing: 0 };

  for (const r of records) {
    const implied = IMPLIED_PROBABILITY[r.confidence];
    const outcome = r.correct ? 1 : 0;
    squaredErrorSum += (implied - outcome) ** 2;
    impliedSum += implied;
    if (r.correct) correctCount += 1;
    bucketTotals[r.confidence] += 1;
    if (r.correct) bucketCorrect[r.confidence] += 1;
  }

  const n = records.length;
  const brier = squaredErrorSum / n; // 0 (perfect) .. 1 (worst)
  const score = 1 - brier; // invert → 1 (perfect) .. 0 (worst)
  const meanImpliedProbability = impliedSum / n;
  const actualAccuracy = correctCount / n;

  const gap = meanImpliedProbability - actualAccuracy;
  let direction: CalibrationDirection;
  if (gap > CALIBRATION_THRESHOLD) {
    // Asserted more confidence than warranted by real accuracy.
    direction = "overconfident";
  } else if (gap < -CALIBRATION_THRESHOLD) {
    // Real accuracy exceeds asserted confidence.
    direction = "underconfident";
  } else {
    direction = "well_calibrated";
  }

  const buckets = {} as Record<Confidence, BucketAccuracy>;
  for (const level of CONFIDENCE_LEVELS) {
    const count = bucketTotals[level];
    buckets[level] = {
      count,
      impliedProbability: IMPLIED_PROBABILITY[level],
      accuracy: count === 0 ? null : bucketCorrect[level] / count,
    };
  }

  return {
    status: "ok",
    count: n,
    score,
    direction,
    meanImpliedProbability,
    actualAccuracy,
    buckets,
  };
}
