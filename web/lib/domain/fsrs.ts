/**
 * FSRS spaced-repetition scheduler (the retention engine's scheduling core).
 *
 * A faithful FSRS-4.5-style model: every card carries per-card stability &
 * difficulty plus its due/last-review/reps/lapses/state, and scheduling is
 * driven by a learner target-retention parameter. This module owns ONLY the
 * math of "given a rating, what is the card's next stability, difficulty, and
 * due date" — it does not own card eligibility, the confidence gate, drills,
 * or calibration (those live elsewhere in the REVIEW domain).
 *
 * Pure & deterministic: all timestamps and ids are caller-supplied. No
 * Date.now(), no Math.random(), no new Date() — identical inputs always yield
 * identical output, which is what makes the schedule reproducible and testable.
 *
 * Traces to PRD domain 26 REVIEW:
 *  - REVIEW-01 (review session loop / retention engine)
 *  - REVIEW-03 (cards resurface survived ledger claims — this module schedules them)
 *  - REVIEW-04 (rate Again/Hard/Good/Easy; each yields a next interval; one advance
 *    per rating; interval respects target retention & max interval)
 * See also the domain's "FSRS owns scheduling" invariant and the "FSRS engine"
 * key technical requirement (versioned weights, stability/difficulty state,
 * interval from target retention, max-interval cap).
 */

// ----------------------------------------------------------------------------
// Public model
// ----------------------------------------------------------------------------

/** FSRS card lifecycle phase. */
export type FsrsState = "new" | "learning" | "review" | "relearning";

/** The four recall ratings a learner gives after reveal (REVIEW-04). */
export type Rating = "again" | "hard" | "good" | "easy";

/** All ratings in Again→Hard→Good→Easy order (interval-increasing order). */
export const RATINGS: readonly Rating[] = ["again", "hard", "good", "easy"] as const;

/** Per-card scheduling state persisted between reviews. */
export interface FsrsCard {
  /** Memory stability in days (interval that yields ~target retention). */
  stability: number;
  /** Memory difficulty, always clamped to [1, 10]. */
  difficulty: number;
  /** Epoch ms the card next comes due. */
  due: number;
  /** Epoch ms of the last review, or null if never reviewed. */
  lastReview: number | null;
  /** Number of times reviewed. */
  reps: number;
  /** Number of times lapsed (rated Again after graduating). */
  lapses: number;
  state: FsrsState;
}

/** Tunable scheduler parameters (REVIEW-13: target retention, max interval). */
export interface FsrsParams {
  /** 17 FSRS-4.5 model weights. */
  weights: readonly number[];
  /** Desired probability of recall at review time, clamped (0,1). Default 0.9. */
  requestRetention: number;
  /** Hard cap on the longest scheduled interval, in days. */
  maximumInterval: number;
}

/** Projected next interval (in days) for each rating — the Again/Hard/Good/Easy labels. */
export type NextIntervals = Record<Rating, number>;

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

const MS_PER_DAY = 86_400_000;

/** Forgetting-curve exponent. R(t) = (1 + FACTOR·t/S)^DECAY. */
const DECAY = -0.5;
/** FACTOR = 0.9^(1/DECAY) − 1 = 19/81, so interval == stability at 90% retention. */
const FACTOR = 19 / 81;

/** Fixed sub-day relearning step used after a lapse — always < 1 day. */
const RELEARN_STEP_DAYS = 5 / 1440; // 5 minutes

/** Stability is kept within these bounds (days). */
const MIN_STABILITY = 0.01;
const MAX_STABILITY = 36_500;

/**
 * Sensible default FSRS-4.5 weights. Indices:
 *  w0..w3  initial stability for Again/Hard/Good/Easy
 *  w4,w5   initial difficulty
 *  w6      difficulty delta      w7 difficulty mean-reversion
 *  w8..w10 recall-stability growth
 *  w11..w14 forget-stability (post-lapse)
 *  w15     hard penalty          w16 easy bonus
 */
export const DEFAULT_FSRS_WEIGHTS: readonly number[] = [
  0.4197, 1.1869, 3.0412, 15.2441, 7.1434, 0.6477, 1.0007, 0.0674, 1.6597,
  0.1712, 1.1178, 2.0225, 0.0904, 0.3025, 2.1214, 0.2498, 2.9466,
];

/** Default scheduler parameters. */
export const DEFAULT_FSRS_PARAMS: FsrsParams = {
  weights: DEFAULT_FSRS_WEIGHTS,
  requestRetention: 0.9,
  maximumInterval: 36_500,
};

/** Rating → FSRS grade G (1..4). */
const RATING_G: Record<Rating, number> = { again: 1, hard: 2, good: 3, easy: 4 };

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

/**
 * Initial-card factory. A brand-new card has no memory state yet — its first
 * review seeds stability/difficulty from the model weights. `now` is the moment
 * it becomes available (it is immediately due).
 */
export function newCard(now: number): FsrsCard {
  return {
    stability: 0,
    difficulty: 0,
    due: now,
    lastReview: null,
    reps: 0,
    lapses: 0,
    state: "new",
  };
}

// ----------------------------------------------------------------------------
// Core math (all pure)
// ----------------------------------------------------------------------------

function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
function clampD(d: number): number {
  return clamp(d, 1, 10);
}
function clampS(s: number): number {
  return clamp(s, MIN_STABILITY, MAX_STABILITY);
}

function resolveParams(params?: Partial<FsrsParams>): FsrsParams {
  const merged = { ...DEFAULT_FSRS_PARAMS, ...(params ?? {}) };
  // Retention must stay strictly inside (0,1) or the interval math is undefined.
  merged.requestRetention = clamp(merged.requestRetention, 0.5, 0.99);
  merged.maximumInterval = Math.max(1, merged.maximumInterval);
  return merged;
}

/** Retrievability of a card with stability S after `elapsedDays`. */
function retrievabilityAt(stability: number, elapsedDays: number): number {
  return Math.pow(1 + FACTOR * (elapsedDays / stability), DECAY);
}

/** Days until stability decays to the requested retention. */
function intervalDaysFor(stability: number, requestRetention: number): number {
  return (stability / FACTOR) * (Math.pow(requestRetention, 1 / DECAY) - 1);
}

function initStability(w: readonly number[], g: number): number {
  return w[g - 1];
}
function initDifficulty(w: readonly number[], g: number): number {
  return w[4] - w[5] * (g - 3);
}

/** Difficulty update with mean-reversion toward the "Good" baseline. */
function nextDifficulty(w: readonly number[], d: number, g: number): number {
  const delta = d - w[6] * (g - 3);
  // Mean-reversion target is the initial difficulty for Good (g=3) == w4.
  return w[7] * w[4] + (1 - w[7]) * delta;
}

/** Stability after a successful recall (Hard/Good/Easy). */
function recallStability(
  w: readonly number[],
  d: number,
  s: number,
  r: number,
  g: number,
): number {
  const hardPenalty = g === 2 ? w[15] : 1;
  const easyBonus = g === 4 ? w[16] : 1;
  const growth =
    Math.exp(w[8]) *
    (11 - d) *
    Math.pow(s, -w[9]) *
    (Math.exp(w[10] * (1 - r)) - 1) *
    hardPenalty *
    easyBonus;
  return s * (1 + growth);
}

/** Stability after a lapse (Again) — reset low. */
function forgetStability(
  w: readonly number[],
  d: number,
  s: number,
  r: number,
): number {
  return (
    w[11] *
    Math.pow(d, -w[12]) *
    (Math.pow(s + 1, w[13]) - 1) *
    Math.exp(w[14] * (1 - r))
  );
}

interface Step {
  stability: number;
  difficulty: number;
  intervalDays: number;
  state: FsrsState;
  lapses: number;
  reps: number;
}

/** Compute the full post-rating step without mutating the card. */
function step(card: FsrsCard, rating: Rating, now: number, p: FsrsParams): Step {
  const w = p.weights;
  const g = RATING_G[rating];
  const isNew = card.state === "new" || card.reps === 0;

  let stability: number;
  let difficulty: number;

  if (isNew) {
    difficulty = clampD(initDifficulty(w, g));
    stability = clampS(initStability(w, g));
  } else {
    const elapsed =
      card.lastReview == null
        ? 0
        : Math.max(0, (now - card.lastReview) / MS_PER_DAY);
    const r = retrievabilityAt(card.stability, elapsed);
    difficulty = clampD(nextDifficulty(w, card.difficulty, g));
    stability =
      g === 1
        ? clampS(forgetStability(w, difficulty, card.stability, r))
        : clampS(recallStability(w, difficulty, card.stability, r, g));
  }

  let intervalDays: number;
  if (g === 1) {
    // Lapse: a fixed short relearning step, guaranteed < 1 day.
    intervalDays = RELEARN_STEP_DAYS;
  } else {
    intervalDays = clamp(
      intervalDaysFor(stability, p.requestRetention),
      1,
      p.maximumInterval,
    );
  }

  return {
    stability,
    difficulty,
    intervalDays,
    state: g === 1 ? "relearning" : "review",
    lapses: card.lapses + (g === 1 ? 1 : 0),
    reps: card.reps + 1,
  };
}

// ----------------------------------------------------------------------------
// Public scheduling API
// ----------------------------------------------------------------------------

/**
 * Advance a card by one rating at time `now` and return the updated card.
 * Pure — the input card is not mutated. `again` lapses the card (low stability,
 * lapse++, state→relearning, due < 1 day); Hard/Good/Easy graduate it to review
 * with an increasing interval driven by stability and target retention.
 */
export function schedule(
  card: FsrsCard,
  rating: Rating,
  now: number,
  params?: Partial<FsrsParams>,
): FsrsCard {
  const p = resolveParams(params);
  const s = step(card, rating, now, p);
  return {
    stability: s.stability,
    difficulty: s.difficulty,
    due: now + Math.round(s.intervalDays * MS_PER_DAY),
    lastReview: now,
    reps: s.reps,
    lapses: s.lapses,
    state: s.state,
  };
}

/**
 * Current probability of recall for a card at time `now`. Decays monotonically
 * as `now` moves past the last review. A never-reviewed card reads as 1.
 */
export function retrievability(card: FsrsCard, now: number): number {
  if (card.lastReview == null) return 1;
  const elapsed = Math.max(0, (now - card.lastReview) / MS_PER_DAY);
  if (card.stability <= 0) return elapsed === 0 ? 1 : 0;
  return retrievabilityAt(card.stability, elapsed);
}

/**
 * Projected next interval (in days) for all four ratings — the numbers shown on
 * the Again/Hard/Good/Easy buttons (REVIEW-04). Strictly increasing across
 * again → hard → good → easy. Does not mutate the card.
 */
export function nextIntervals(
  card: FsrsCard,
  now: number,
  params?: Partial<FsrsParams>,
): NextIntervals {
  const p = resolveParams(params);
  return {
    again: step(card, "again", now, p).intervalDays,
    hard: step(card, "hard", now, p).intervalDays,
    good: step(card, "good", now, p).intervalDays,
    easy: step(card, "easy", now, p).intervalDays,
  };
}
