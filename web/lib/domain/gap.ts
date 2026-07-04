/**
 * Gap Map — the misconception lifecycle state machine.
 *
 * A Gap is the product's durable "memory of what you got wrong": a named weak
 * spot with a lifecycle `open → watching → closed`, with `reopened` as the
 * corrective transition back into the attention zone. This module owns the pure,
 * deterministic transitions of that lifecycle; the board, threads, severity
 * scoring, and persistence live elsewhere.
 *
 * The DEFINING mechanic (GAP-06) is **auto-reopen**: a `closed` gap springs back
 * to `reopened` the moment the learner later lapses on the linked claim. No
 * manual close can immunize a gap against this — closure tracks evidence, not
 * vanity. This is the domain's reason to exist.
 *
 * Boundaries respected here (see PRD domain 27):
 *   - A gap is epistemic-about-the-LEARNER, never about the ledger: nothing here
 *     reads or writes a claim's trust state. Claim/topic ids are opaque links.
 *   - History is append-only and grows monotonically; no transition ever rewrites
 *     or drops a prior event (GAP-03, GAP-06).
 *   - Status must track evidence: {@link closeGap} demands mastery evidence and
 *     refuses to close a gap by fiat.
 *
 * Traces to: GAP-01 (intake → Open), GAP-05 (evidence-driven Open→Watching→Closed),
 * GAP-06 (auto-reopen on lapse — the headline), GAP-07 (multi-origin), GAP-09
 * (manual/evidenced close is provisional), GAP-19 (illegal/stale transitions never
 * fabricate a false state). Rating vocabulary reused from the Retain/FSRS engine
 * (REVIEW-04/REVIEW-07).
 *
 * Purity: every transition takes the caller-supplied `now` (epoch ms) and ids as
 * parameters. No Date.now / Math.random / new Date — reproducible by construction.
 */

import type { Rating } from "./fsrs";

// ----------------------------------------------------------------------------
// Vocabulary
// ----------------------------------------------------------------------------

/** How a gap was caught. The origin trail is immutable and honest (GAP-07). */
export type GapOrigin = "review" | "task" | "test" | "conflict" | "drill";

/** Severity / heat band. Computed from behavior, escalates on reopen (GAP-06/11). */
export type GapSeverity = "low" | "med" | "high";

/**
 * Lifecycle status. `reopened` is the corrective transition back to the active
 * zone after a regression; it is distinct from `open` so a regression can never
 * hide (GAP-06, GAP-16 "announced as reopened, never conveyed by color alone").
 */
export type GapStatus = "open" | "watching" | "closed" | "reopened";

/** Why a status transition happened — the append-only audit reason. */
export type GapTransitionReason =
  | "created"
  | "to-watching"
  | "closed"
  | "reopened-lapse"
  | "reopened-review-again";

/** One immutable entry in a gap's status history (append-only). */
export interface GapEvent {
  /** epoch ms (caller-supplied; keeps the module pure/deterministic) */
  at: number;
  /** status before this event; `null` only for the creation event */
  from: GapStatus | null;
  /** status after this event */
  to: GapStatus;
  reason: GapTransitionReason;
  /** free-form context, e.g. "manual", "sustained x2", "rated Again" */
  detail?: string;
}

/** A tracked misconception with a lifecycle and an append-only history. */
export interface Gap {
  id: string;
  /** claim this weak spot is about (opaque link into the ledger; never mutated) */
  claimId: string;
  topicId: string;
  origin: GapOrigin;
  /**
   * Every origin that has ever hit this SAME tracked gap (GAP-07's explicit
   * cross-origin merge policy) — `origin` is the founding channel and stays
   * immutable, but a claim already tracked from one origin (say, `review`)
   * that's later missed on a test doesn't fork into a second gap; the
   * per-claim lookup reuses the one gap, and this set records that the test
   * channel ALSO hit it, monotonically growing, never shrinking.
   */
  contributingOrigins: readonly GapOrigin[];
  severity: GapSeverity;
  status: GapStatus;
  history: readonly GapEvent[];
}

/**
 * Evidence of mastery required to {@link closeGap}. Sustained correct performance
 * (correct recalls / drill catches) — closure is earned, not asserted (GAP-05).
 */
export interface MasteryEvidence {
  /** count of sustained successful reviews/drill catches backing this close */
  successfulReviews: number;
  detail?: string;
}

/** A review outcome for a linked claim (feeds {@link applyReviewOutcome}). */
export interface ReviewOutcome {
  claimId: string;
  rating: Rating;
  now: number;
}

// ----------------------------------------------------------------------------
// Constants
// ----------------------------------------------------------------------------

/**
 * Default minimum sustained successful reviews required to close a gap. Domain-
 * configured, not learner-set (GAP-05 business rule); overridable per-call for
 * tenant thresholds while staying pure.
 */
export const MASTERY_THRESHOLD = 2;

const SEVERITY_ORDER: readonly GapSeverity[] = ["low", "med", "high"];

// ----------------------------------------------------------------------------
// Errors
// ----------------------------------------------------------------------------

/**
 * Thrown by {@link closeGap} when the supplied evidence does not meet the mastery
 * threshold. Enforces "status must track evidence, not assertion" — a gap can
 * never be closed by fiat.
 */
export class GapEvidenceError extends Error {
  constructor(have: number, need: number) {
    super(
      `Gap close rejected: mastery evidence insufficient (${have} sustained review(s), need ${need}). ` +
        `Closure must track evidence, not assertion.`,
    );
    this.name = "GapEvidenceError";
  }
}

// ----------------------------------------------------------------------------
// Internal helpers (pure)
// ----------------------------------------------------------------------------

/** Escalate severity by one band, capped at `high` (repeated reopens run hot). */
function bumpSeverity(s: GapSeverity): GapSeverity {
  const i = SEVERITY_ORDER.indexOf(s);
  return SEVERITY_ORDER[Math.min(i + 1, SEVERITY_ORDER.length - 1)];
}

/**
 * Return a NEW gap with the transition applied and one event appended. The input
 * gap is never mutated; history only ever grows.
 */
function transition(
  gap: Gap,
  to: GapStatus,
  reason: GapTransitionReason,
  now: number,
  opts: { detail?: string; severity?: GapSeverity } = {},
): Gap {
  const event: GapEvent = {
    at: now,
    from: gap.status,
    to,
    reason,
    ...(opts.detail !== undefined ? { detail: opts.detail } : {}),
  };
  return {
    ...gap,
    status: to,
    severity: opts.severity ?? gap.severity,
    history: [...gap.history, event],
  };
}

/** Is the gap in an active state a review lapse can pull back to `reopened`? */
function isReopenable(status: GapStatus): boolean {
  return status === "closed" || status === "watching";
}

// ----------------------------------------------------------------------------
// Transitions
//
// DOCUMENTED ILLEGAL-TRANSITION RULE:
//   Every transition below that is not permitted from the gap's current status
//   is a NO-OP: it returns the *same* gap reference unchanged and appends nothing
//   to history. This keeps offline retries and stale/optimistic writes safe — a
//   duplicate or out-of-order call can never fabricate a false state (GAP-19).
//   The ONE exception is closeGap, which additionally THROWS GapEvidenceError
//   when invoked (legally, from `watching`) without sufficient mastery evidence.
// ----------------------------------------------------------------------------

/** Input to seed a brand-new gap (GAP-01 / GAP-07 intake). */
export interface OpenGapInput {
  id: string;
  claimId: string;
  topicId: string;
  origin: GapOrigin;
  /** initial heat band; defaults to `med` */
  severity?: GapSeverity;
}

/**
 * Create a new gap in `open` with a seeded `created` history event
 * (`from: null`). This is the single intake point for every origin (GAP-07);
 * auto-created and learner-created gaps differ only by `origin`.
 */
export function openGap(input: OpenGapInput, now: number): Gap {
  const severity = input.severity ?? "med";
  return {
    id: input.id,
    claimId: input.claimId,
    topicId: input.topicId,
    origin: input.origin,
    contributingOrigins: [input.origin],
    severity,
    status: "open",
    history: [{ at: now, from: null, to: "open", reason: "created" }],
  };
}

/**
 * Record that `origin` hit this already-tracked gap (GAP-07). A no-op — the
 * SAME gap reference — when that origin has already been recorded, so a
 * repeat hit from the founding channel never grows the set. `origin` itself
 * is never reassigned; this only ever appends to the provenance set.
 */
export function noteOriginHit(gap: Gap, origin: GapOrigin): Gap {
  if (gap.contributingOrigins.includes(origin)) return gap;
  return { ...gap, contributingOrigins: [...gap.contributingOrigins, origin] };
}

/**
 * Advance `open` (or `reopened`) → `watching` on evidence of a first correct
 * recall (GAP-05). The gap is being watched but not yet trusted.
 *
 * Illegal from `watching`/`closed` → no-op (returns the gap unchanged).
 */
export function toWatching(gap: Gap, now: number): Gap {
  if (gap.status !== "open" && gap.status !== "reopened") return gap;
  return transition(gap, "watching", "to-watching", now);
}

/**
 * Close a `watching` gap once sustained mastery evidence is present (GAP-05).
 * A gap never closes directly from `open` — it must pass through `watching`.
 * Closure is provisional: it remains subject to auto-reopen (GAP-06).
 *
 * @throws {GapEvidenceError} if called on a `watching` gap without enough evidence.
 * @returns the same gap unchanged if called from any non-`watching` status
 *          (illegal transition, e.g. closing an already-closed gap).
 */
export function closeGap(
  gap: Gap,
  evidence: MasteryEvidence,
  now: number,
  threshold: number = MASTERY_THRESHOLD,
): Gap {
  // Illegal transition (already closed / still open / reopened) → no-op.
  if (gap.status !== "watching") return gap;
  // Legal transition, but closure must be earned.
  if (evidence.successfulReviews < threshold) {
    throw new GapEvidenceError(evidence.successfulReviews, threshold);
  }
  return transition(gap, "closed", "closed", now, {
    detail: evidence.detail ?? `sustained x${evidence.successfulReviews}`,
  });
}

/**
 * THE HEADLINE MECHANIC (GAP-06). A later lapse on the linked claim auto-reopens
 * a `closed` (or still-`watching`) gap to `reopened`, escalating its severity and
 * appending to history. Nothing is overwritten — the prior closed period is
 * preserved. No manual close can suppress this.
 *
 * Illegal from `open`/`reopened` (already in the attention zone) → no-op.
 */
export function onLapse(gap: Gap, now: number, detail = "lapse"): Gap {
  if (!isReopenable(gap.status)) return gap;
  return transition(gap, "reopened", "reopened-lapse", now, {
    detail,
    severity: bumpSeverity(gap.severity),
  });
}

/**
 * Apply a spaced-review outcome for a claim to its gap (GAP-06 / REVIEW-07).
 * A rating of `again` is a lapse → auto-reopens a `closed`/`watching` gap. Any
 * non-`again` rating (`hard`/`good`/`easy`) is NOT a lapse and never reopens.
 *
 * A no-op (returns the gap unchanged) when the outcome is for a different claim,
 * when the rating is not `again`, or when the gap is not in a reopenable state.
 */
export function applyReviewOutcome(gap: Gap, outcome: ReviewOutcome): Gap {
  // Guard: the outcome must be about this gap's linked claim.
  if (outcome.claimId !== gap.claimId) return gap;
  // Only a lapse (Again) reopens; a good review leaves the gap where it is.
  if (outcome.rating !== "again") return gap;
  if (!isReopenable(gap.status)) return gap;
  return transition(gap, "reopened", "reopened-review-again", outcome.now, {
    detail: "rated Again",
    severity: bumpSeverity(gap.severity),
  });
}
