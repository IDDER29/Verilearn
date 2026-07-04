/**
 * Source-anchored rubric grading.
 *
 * Traces to: PRD domain 24 (Tasks & Rubric-based Assessment).
 *   - TASK-03: per-criterion hit/missing result with a weighted percentage and a
 *     fixed pass bar of >= 75% (inclusive). The threshold is a product invariant,
 *     not learner-/plan-/instructor-configurable.
 *   - TASK-04: every criterion is anchored to a canonical source (`sourceId`) and,
 *     optionally, to the verified/sourced claim it derives from. A criterion whose
 *     underlying claim is Disputed / Unsupported / Interpretive may not grade a
 *     learner as wrong for disagreeing (see {@link assertRubricGradeable}).
 *   - TASK-05: revise-to-pass — re-grading the same rubric version with more hits
 *     can flip `passed` from false to true.
 *
 * Pure & deterministic: no clock/random input. `grade` takes a caller-supplied
 * hit map; the injected {@link CriterionMatcher} (default {@link keywordMatcher})
 * turns a submission into hits deterministically. Every criterion in the result
 * carries its `sourceId` so a grade is always traceable back to evidence.
 */

import type { TrustState } from "./types";
import { isTestEligible } from "./types";

/** Pass bar: >= 75% of the (weighted) rubric. Product invariant (TASK-03). */
export const PASS_THRESHOLD = 0.75;

/**
 * A single rubric criterion, anchored to a canonical source (honest grading).
 * `sourceId` is REQUIRED: a criterion that cannot name the source it grades
 * against is malformed and is rejected rather than silently graded.
 */
export interface Criterion {
  id: string;
  text: string;
  /** Relative weight in the rubric; must be finite and > 0. */
  weight: number;
  /** Canonical source id this criterion traces to (TASK-04). */
  sourceId: string;
  /** Optional claim this criterion derives from (for trust-state gating). */
  claimId?: string;
  /** Optional keywords for the default {@link keywordMatcher}. */
  keywords?: string[];
}

/** A rubric is an ordered list of criteria for one task. */
export interface Rubric {
  id: string;
  taskId: string;
  /** Ordered — result partitions preserve this order. */
  criteria: Criterion[];
}

/** A learner-authored answer to be graded. */
export interface Submission {
  id: string;
  answer: string;
}

/** Per-criterion hit map: criterionId -> whether the answer satisfied it. */
export type CriterionHits = Record<string, boolean>;

/**
 * Injected match strategy: decides whether a submission satisfies a criterion.
 * The real NLP match is out of scope; callers inject their grader and tests use
 * the deterministic {@link keywordMatcher}.
 */
export type CriterionMatcher = (criterion: Criterion, submission: Submission) => boolean;

export interface GradeResult {
  /** Weighted score as a percentage 0..100 (rounded for display). */
  scorePct: number;
  /** True iff the weighted ratio is >= {@link PASS_THRESHOLD} (inclusive). */
  passed: boolean;
  /** Criteria the submission missed, in rubric order — each retains its sourceId. */
  missing: Criterion[];
  /** Criteria the submission hit, in rubric order — each retains its sourceId. */
  hit: Criterion[];
}

export class MalformedRubricError extends Error {
  constructor(message: string) {
    super(`Malformed rubric: ${message}`);
    this.name = "MalformedRubricError";
  }
}

export class UngradeableCriterionError extends Error {
  constructor(criterionId: string, state: TrustState) {
    super(
      `Criterion "${criterionId}" is anchored to a "${state}" claim and cannot grade a learner as wrong for disagreeing.`,
    );
    this.name = "UngradeableCriterionError";
  }
}

/** Guard: every criterion must be well-formed and source-anchored. */
function assertWellFormed(rubric: Rubric): void {
  if (rubric.criteria.length === 0) {
    throw new MalformedRubricError("a rubric must have at least one criterion.");
  }
  const seen = new Set<string>();
  for (const c of rubric.criteria) {
    if (!c.sourceId) {
      throw new MalformedRubricError(`criterion "${c.id}" is not anchored to a source.`);
    }
    if (!Number.isFinite(c.weight) || c.weight <= 0) {
      throw new MalformedRubricError(`criterion "${c.id}" has a non-positive weight.`);
    }
    if (seen.has(c.id)) {
      throw new MalformedRubricError(`duplicate criterion id "${c.id}".`);
    }
    seen.add(c.id);
  }
}

/**
 * Grade a submission's per-criterion hits against a rubric (TASK-03).
 *
 * `criterionHits` maps criterion id -> hit; a criterion absent from the map is
 * treated as *missing* (fail-closed). A hit for an id not in the rubric is
 * rejected as malformed rather than shown (TASK-03 failure case). The score is
 * weighted by each criterion's `weight`, and `passed` uses the exact ratio so a
 * borderline 75% passes on the inclusive bar even where rounding would differ.
 */
export function grade(rubric: Rubric, criterionHits: CriterionHits): GradeResult {
  assertWellFormed(rubric);

  const ids = new Set(rubric.criteria.map((c) => c.id));
  for (const id of Object.keys(criterionHits)) {
    if (!ids.has(id)) {
      throw new MalformedRubricError(`hit references unknown criterion "${id}".`);
    }
  }

  const hit: Criterion[] = [];
  const missing: Criterion[] = [];
  let total = 0;
  let earned = 0;

  for (const c of rubric.criteria) {
    total += c.weight;
    if (criterionHits[c.id] === true) {
      earned += c.weight;
      hit.push(c);
    } else {
      missing.push(c);
    }
  }

  const ratio = total === 0 ? 0 : earned / total;
  // Inclusive bar; epsilon absorbs floating-point drift at exactly 75%.
  const passed = ratio >= PASS_THRESHOLD - 1e-9;

  return {
    scorePct: Math.round(ratio * 100),
    passed,
    missing,
    hit,
  };
}

/**
 * Run an injected matcher over every criterion to produce a hit map.
 * Deterministic given a deterministic matcher (default {@link keywordMatcher}).
 */
export function hitsFor(
  rubric: Rubric,
  submission: Submission,
  matcher: CriterionMatcher = keywordMatcher,
): CriterionHits {
  assertWellFormed(rubric);
  const hits: CriterionHits = {};
  for (const c of rubric.criteria) {
    hits[c.id] = matcher(c, submission);
  }
  return hits;
}

/** Convenience: compute hits with a matcher, then grade in one call. */
export function gradeSubmission(
  rubric: Rubric,
  submission: Submission,
  matcher: CriterionMatcher = keywordMatcher,
): GradeResult {
  return grade(rubric, hitsFor(rubric, submission, matcher));
}

/**
 * Default deterministic matcher: a criterion is hit iff every one of its
 * `keywords` appears (case-insensitively) in the answer. A criterion with no
 * keywords cannot be auto-matched and reads as missing (fail-closed). This is a
 * stand-in for real NLP grading, kept pure so tests are reproducible.
 */
export const keywordMatcher: CriterionMatcher = (criterion, submission) => {
  const keywords = criterion.keywords;
  if (!keywords || keywords.length === 0) return false;
  const haystack = submission.answer.toLowerCase();
  return keywords.every((k) => haystack.includes(k.toLowerCase()));
};

/** Minimum word count for a submission to be worth grading at all (TASK-22). */
export const MIN_SUBSTANCE_WORDS = 5;

export interface SubstanceCheck {
  ok: boolean;
  reason?: "too_short" | "copies_prompt";
}

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function normalizeForComparison(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * TASK-22 minimum-substance gate: rejects a submission that's too short to
 * grade meaningfully (below {@link MIN_SUBSTANCE_WORDS}), or that's just the
 * task prompt copied back verbatim — a trivial gaming attempt, not an answer.
 * Distinct from (and checked in addition to) the plain empty-string rejection.
 */
export function checkSubstance(answer: string, prompt: string): SubstanceCheck {
  if (wordCount(answer) < MIN_SUBSTANCE_WORDS) return { ok: false, reason: "too_short" };
  if (normalizeForComparison(answer) === normalizeForComparison(prompt)) return { ok: false, reason: "copies_prompt" };
  return { ok: true };
}

/**
 * TASK-04 / TASK-09 gate: a rubric may only grade against criteria whose
 * underlying claim is test-eligible (Verified·execution, Verified·source, or
 * Sourced). Throws {@link UngradeableCriterionError} for any criterion anchored
 * to a Disputed / Unsupported / Interpretive claim, so the learner is never
 * graded as wrong for disagreeing with an uncertified claim. Criteria without a
 * `claimId`, or ids absent from `trustByClaimId`, are treated as unresolved and
 * therefore not gradeable.
 */
export function assertRubricGradeable(
  rubric: Rubric,
  trustByClaimId: Record<string, TrustState>,
): void {
  assertWellFormed(rubric);
  for (const c of rubric.criteria) {
    const state: TrustState | undefined = c.claimId ? trustByClaimId[c.claimId] : undefined;
    if (state === undefined || !isTestEligible(state)) {
      throw new UngradeableCriterionError(c.id, state ?? "unsupported");
    }
  }
}
