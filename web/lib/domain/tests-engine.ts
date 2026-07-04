/**
 * Tests engine — formal test eligibility, deterministic question selection,
 * scoring against a pass bar, predicted readiness, and the server-authoritative
 * clock guard.
 *
 * Traces to: PRD domain 28 (Tests, Certs & Credential Verification).
 *  - TEST-01 predicted readiness from retention + calibration, honestly flagged
 *    low-confidence on thin data ("not enough data yet" rather than a fabricated
 *    0% / 100%); disputed claims in scope suppress an artificially high number.
 *  - TEST-02 the spine rule: questions are drawn ONLY from claims in a
 *    Verified·execution / Verified·source / Sourced trust state (via
 *    {@link isTestEligible}). A disputed / unsupported / interpretive claim can
 *    NEVER appear on a graded test.
 *  - TEST-19 / TEST-22 server-authoritative clock: expiry is decided from
 *    caller-supplied server timestamps, never a client reset.
 *
 * Pure & deterministic: no Date.now / Math.random / new Date. All timestamps and
 * ids are supplied by the caller; question selection is by claim-id order, not
 * random — so a given input always yields the same test. Trust state is read
 * from the {@link TrustLedger} (the single source of truth, fail-closed).
 */

import type { Claim, TrustState } from "./types";
import { isTestEligible } from "./types";
import type { TrustLedger } from "./trust";

/** Default pass bar (TEST business rule: default ≥75%, per-test configurable). */
export const DEFAULT_PASS_BAR = 75;

/** Below this many reviewed covered claims, readiness is flagged low-confidence. */
export const MIN_READINESS_RECORDS = 3;

// ----------------------------------------------------------------------------
// Eligibility (TEST-02) — the spine rule
// ----------------------------------------------------------------------------

/**
 * The subset of {@link claims} whose CURRENT ledger trust state is test-eligible
 * (Verified·execution, Verified·source, or Sourced). Disputed, Unsupported, and
 * Interpretive claims are filtered out — a disputed claim can never appear on a
 * test. Input order is preserved.
 */
export function eligibleClaims(
  claims: readonly Claim[],
  ledger: TrustLedger,
): Claim[] {
  return claims.filter((c) => isTestEligible(ledger.stateOf(c.id)));
}

// ----------------------------------------------------------------------------
// Test construction (TEST-02) — deterministic, ledger-bound
// ----------------------------------------------------------------------------

/** One generated test item, bound to exactly one eligible claim + its source. */
export interface TestQuestion {
  claimId: string;
  topicId: string;
  sectionId: string;
  /** The eligible trust state the claim held when the item was generated. */
  trustState: TrustState;
  /** Canonical source id backing the claim, when the ledger evidence carries one. */
  sourceId?: string;
}

export interface BuildTestInput {
  claims: readonly Claim[];
  ledger: TrustLedger;
  /** Target question count. */
  count: number;
  /** Server timestamp (epoch ms) at which the test is started. */
  now: number;
}

export interface BuiltTest {
  questions: TestQuestion[];
  /** The requested question count. */
  requestedCount: number;
  /** How many eligible claims were available to draw from. */
  eligibleCount: number;
  /**
   * True when fewer eligible claims existed than requested — coverage is reduced
   * and disclosed rather than padded with ineligible claims (honest failure).
   */
  reducedCoverage: boolean;
  /** Server-authoritative start time; the clock runs from here (TEST-19/22). */
  startedAt: number;
}

/**
 * Build a test drawing questions ONLY from eligible claims. Selection is
 * deterministic: eligible claims are ordered by claim id (ascending) and the
 * first {@link BuildTestInput.count} are taken — never random. Never substitutes
 * an ineligible claim to reach the count; if too few are eligible it returns
 * fewer questions with {@link BuiltTest.reducedCoverage} set.
 */
export function buildTest(input: BuildTestInput): BuiltTest {
  const { claims, ledger, count, now } = input;
  const eligible = eligibleClaims(claims, ledger);

  const ordered = [...eligible].sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  const take = Math.max(0, Math.floor(count));
  const selected = ordered.slice(0, take);

  const questions: TestQuestion[] = selected.map((c) => ({
    claimId: c.id,
    topicId: c.topicId,
    sectionId: c.sectionId,
    trustState: ledger.stateOf(c.id),
    sourceId: ledger.evidenceOf(c.id)?.sourceId,
  }));

  return {
    questions,
    requestedCount: take,
    eligibleCount: eligible.length,
    reducedCoverage: eligible.length < take,
    startedAt: now,
  };
}

// ----------------------------------------------------------------------------
// Scoring (TEST-05 / pass bar business rule)
// ----------------------------------------------------------------------------

/** One graded answer. A skipped (unanswered) item scores as incorrect (TEST-22). */
export interface TestAnswer {
  /** True iff the learner's answer matched the correct answer. */
  correct: boolean;
  /** Distinguishes an actively-wrong answer from a skip in reporting. */
  skipped?: boolean;
}

export interface TestScore {
  correct: number;
  total: number;
  /** Percentage correct, rounded to a whole number (0..100). */
  pct: number;
  /** True when {@link pct} meets or exceeds the pass bar (a tie at the bar passes). */
  passed: boolean;
  /** The pass bar applied. */
  passBar: number;
}

/**
 * Score a set of answers against a pass bar (default {@link DEFAULT_PASS_BAR}).
 * A score exactly at the bar passes. An empty answer set scores 0% and fails.
 */
export function scoreTest(
  answers: readonly TestAnswer[],
  passBar: number = DEFAULT_PASS_BAR,
): TestScore {
  const total = answers.length;
  const correct = answers.reduce((n, a) => n + (a.correct ? 1 : 0), 0);
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return {
    correct,
    total,
    pct,
    passed: total > 0 && pct >= passBar,
    passBar,
  };
}

// ----------------------------------------------------------------------------
// Predicted readiness (TEST-01)
// ----------------------------------------------------------------------------

/** Inputs to the readiness forecast, gathered over the covered claim set. */
export interface ReadinessSignals {
  /** Mean FSRS retention/retrievability over covered claims (0..1). */
  retention: number;
  /** Aggregate calibration score over covered claims (0..1). */
  calibration: number;
  /** Total eligible claims the test covers. */
  coveredClaims: number;
  /** How many covered claims have actual review history feeding the signals. */
  reviewedClaims: number;
  /** Disputed claims sitting in covered sections — they suppress readiness. */
  disputedInScope?: number;
}

export interface ReadinessForecast {
  /** 0..100 predicted likelihood of passing — a forecast, never a guarantee. */
  readiness: number;
  /** True when data is too thin to trust the number ("not enough data yet"). */
  lowConfidence: boolean;
  /** One-line human basis for the forecast. */
  basis: string;
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/**
 * Forecast pass-likelihood (0..100) from retention + calibration over the
 * covered claim set. Honest low-confidence handling (TEST-01):
 *  - no covered claims → 0 and low-confidence ("not enough data yet"), never a
 *    fabricated 0%/100% dressed up as certainty;
 *  - covered claims that were never reviewed drag readiness DOWN via coverage
 *    (freshly verified but unreviewed → low AND flagged);
 *  - disputed claims in scope suppress an artificially high readiness.
 * The result is always within 0..100.
 */
export function predictReadiness(signals: ReadinessSignals): ReadinessForecast {
  const covered = Math.max(0, Math.floor(signals.coveredClaims));
  const disputed = Math.max(0, Math.floor(signals.disputedInScope ?? 0));

  if (covered === 0) {
    return { readiness: 0, lowConfidence: true, basis: "not enough data yet" };
  }

  // Reviewed can't meaningfully exceed the covered set for the coverage ratio.
  const reviewed = Math.min(Math.max(0, Math.floor(signals.reviewedClaims)), covered);
  const retention = clamp01(signals.retention);
  const calibration = clamp01(signals.calibration);
  const coverage = reviewed / covered; // 0..1 fraction with real review history

  // Blend retention (weighted heavier) with calibration, scaled to 0..100.
  let readiness = (retention * 0.6 + calibration * 0.4) * 100;
  // Thin review history reduces trust in — and the level of — the forecast.
  readiness *= coverage;
  // Disputed claims in scope suppress an artificially high number.
  if (disputed > 0) readiness *= covered / (covered + disputed);

  const bounded = Math.min(100, Math.max(0, Math.round(readiness)));
  const lowConfidence = reviewed < MIN_READINESS_RECORDS;

  return {
    readiness: bounded,
    lowConfidence,
    basis: lowConfidence
      ? "low confidence — not enough review history on the covered claims yet"
      : "from your retention & calibration on the covered claims",
  };
}

// ----------------------------------------------------------------------------
// Server-authoritative clock guard (TEST-19 / TEST-22)
// ----------------------------------------------------------------------------

/**
 * Whether a running attempt has expired, decided purely from server timestamps.
 * The clock is authoritative and cannot be reset by reload/tab-close/clock
 * manipulation. Expiry is inclusive: at exactly the duration boundary the
 * attempt is expired (input locks, auto-submit fires).
 */
export function isExpired(startedAt: number, durationMs: number, now: number): boolean {
  return now - startedAt >= durationMs;
}
