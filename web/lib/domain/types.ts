/**
 * VeriLearn domain types — the shared vocabulary of the verification-first model.
 * Pure data; no framework dependencies. Traces to PRD domains VERIFY, TRUST, LEARN,
 * TASK, REVIEW, GAP, TEST, ANALYTICS.
 */

// ----------------------------------------------------------------------------
// Trust ledger (TRUST-01: five states, one per claim, each source-traceable)
// ----------------------------------------------------------------------------

/**
 * The trust vocabulary. `verified_execution` and `verified_source` are the two
 * "Verified" variants; grouped by {@link isVerified}. A claim is never allowed to
 * present as verified without resolvable evidence (fail-closed).
 */
export type TrustState =
  | "verified_execution" // proven by running code in the execution sandbox
  | "verified_source" // matched to a cited, resolvable reference
  | "sourced" // cited but not independently proven
  | "disputed" // contested by the Skeptic → becomes a Conflict
  | "unsupported" // no source found; also the fail-closed fallback
  | "interpretive"; // genuinely contested; positions mapped, not certified

export type VerificationMethod = "execution" | "citation" | "skeptic" | "none";

/** How a verification decision was reached, and the source it traces to. */
export interface Evidence {
  method: VerificationMethod;
  /** Canonical source id this evidence resolves to (required for `citation`). */
  sourceId?: string;
  detail: string;
  /** 0..1 model/verifier confidence. */
  confidence: number;
  /** True once the referenced source/evidence has been resolved & validated. */
  resolved: boolean;
}

export type SourceKind = "book" | "paper" | "sandbox" | "web";

export interface Source {
  id: string;
  kind: SourceKind;
  title: string;
  ref: string; // e.g. "CLRS §24.3"
  /** actor id who added it; user-added sources are still SME/verifier-gated to become authoritative */
  addedBy: string;
  preferred?: boolean;
}

export interface Claim {
  id: string;
  topicId: string;
  sectionId: string;
  text: string;
}

/**
 * A verification event is the ONLY thing that can produce a trust state
 * (epistemic firewall, invariant I1). Emitted by a system verifier or, under
 * dual-control, an SME — never by a learner, admin, or platform root.
 */
export interface VerificationEvent {
  id: string;
  claimId: string;
  state: TrustState;
  evidence: Evidence;
  /** actor id that produced it (must have verification capability) */
  producedBy: string;
  /** model/verifier version for reproducibility & silent-verdict-change detection */
  producerVersion: string;
  at: number; // epoch ms (caller-supplied; keeps the module pure/deterministic)
  /** SME override requires a second approver (dual control) and a reason. */
  smeReason?: string;
  smeApprovedBy?: string;
}

// ----------------------------------------------------------------------------
// Learning objects
// ----------------------------------------------------------------------------

export interface Topic {
  id: string;
  ownerId: string;
  title: string;
  level: string;
  goal: string;
  createdAt: number;
}

/** Grouping helper: is this state one of the two verified variants? */
export function isVerified(state: TrustState): boolean {
  return state === "verified_execution" || state === "verified_source";
}

/** Ordered severity for sorting/aggregation (higher = more attention needed). */
export const TRUST_SEVERITY: Record<TrustState, number> = {
  verified_execution: 0,
  verified_source: 1,
  sourced: 2,
  interpretive: 3,
  unsupported: 4,
  disputed: 5,
};

/** Human label + short description for UI + accessibility (non-color encoding, A11Y-01). */
export const TRUST_LABEL: Record<TrustState, { label: string; glyph: string }> = {
  verified_execution: { label: "Verified · execution", glyph: "✓⚙" },
  verified_source: { label: "Verified · source", glyph: "✓" },
  sourced: { label: "Sourced", glyph: "◉" },
  disputed: { label: "Disputed", glyph: "⚠" },
  unsupported: { label: "Unsupported", glyph: "∅" },
  interpretive: { label: "Interpretive", glyph: "⇄" },
};

/** Trust states whose claims are eligible to appear on a formal test (TEST-02). */
export function isTestEligible(state: TrustState): boolean {
  return isVerified(state) || state === "sourced";
}
