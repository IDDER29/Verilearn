/**
 * Trust ledger + the epistemic firewall (invariant I1).
 *
 * The ledger is the single source of truth for a claim's trust state. A trust
 * state can ONLY be produced by a verification event from an actor with
 * verification capability (a system verifier, or an SME under dual control).
 * No learner/admin/platform-root path can set a trust state — this is enforced
 * here by construction and covered by tests.
 *
 * Traces to: TRUST-01 (five states, source-traceable), VERIFY-13 (Skeptic),
 * SETTINGS-08 / BILL-21 / ADMIN-05 (nothing outside verification mutates the
 * ledger), and fail-closed rendering (LEARN, TEST).
 */

import type { Claim, Evidence, TrustState, VerificationEvent } from "./types";
import { isVerified } from "./types";

/** Capability an actor must hold to emit a verification event. */
export interface VerificationActor {
  id: string;
  /** system verifier (pipeline/sandbox/Skeptic) — may emit any verification event */
  canVerify: boolean;
  /** subject-matter expert — may emit under dual control (smeReason + smeApprovedBy) */
  isSME: boolean;
}

export class EpistemicFirewallError extends Error {
  constructor(actorId: string) {
    super(
      `Epistemic firewall: actor "${actorId}" has no verification capability and cannot set a trust state.`,
    );
    this.name = "EpistemicFirewallError";
  }
}

export class DualControlError extends Error {
  constructor() {
    super("SME verification override requires a reason and a distinct second approver (dual control).");
    this.name = "DualControlError";
  }
}

let __seq = 0;
/** Deterministic id helper (no Math.random, keeps the module reproducible). */
export function verificationId(claimId: string, at: number): string {
  __seq += 1;
  return `ve_${claimId}_${at}_${__seq}`;
}

export class TrustLedger {
  /** claimId -> verification events in insertion order (latest wins) */
  private events = new Map<string, VerificationEvent[]>();

  /**
   * Record a verification event. Throws {@link EpistemicFirewallError} if the
   * actor cannot verify, and {@link DualControlError} if an SME omits dual control.
   */
  record(actor: VerificationActor, event: VerificationEvent): VerificationEvent {
    if (!actor.canVerify && !actor.isSME) {
      throw new EpistemicFirewallError(actor.id);
    }
    if (!actor.canVerify && actor.isSME) {
      // SME path requires dual control.
      if (!event.smeReason || !event.smeApprovedBy || event.smeApprovedBy === actor.id) {
        throw new DualControlError();
      }
    }
    // Evidence integrity: a `citation` verification must resolve to a source.
    if (event.evidence.method === "citation" && !event.evidence.sourceId) {
      throw new Error("Source-hallucination guard: citation evidence must reference a resolved source.");
    }
    const list = this.events.get(event.claimId) ?? [];
    list.push(event);
    this.events.set(event.claimId, list);
    return event;
  }

  /** Full ordered history for a claim. */
  history(claimId: string): readonly VerificationEvent[] {
    return this.events.get(claimId) ?? [];
  }

  /** The latest verification event, if any. */
  latest(claimId: string): VerificationEvent | undefined {
    const list = this.events.get(claimId);
    return list && list.length ? list[list.length - 1] : undefined;
  }

  /**
   * The claim's current trust state, applying **fail-closed rendering**: a claim
   * with no verification, or whose latest verified evidence is unresolved, never
   * presents as verified — it downgrades to `unsupported`.
   */
  stateOf(claimId: string): TrustState {
    const latest = this.latest(claimId);
    if (!latest) return "unsupported";
    return failClosed(latest.state, latest.evidence);
  }

  evidenceOf(claimId: string): Evidence | undefined {
    return this.latest(claimId)?.evidence;
  }

  /** Snapshot the current state of many claims (for coverage matrices / aggregates). */
  snapshot(claims: readonly Claim[]): Map<string, TrustState> {
    const out = new Map<string, TrustState>();
    for (const c of claims) out.set(c.id, this.stateOf(c.id));
    return out;
  }
}

/**
 * Fail-closed rule: if a state claims to be verified but its evidence has not
 * resolved, present `unsupported` rather than a false `Verified`.
 */
export function failClosed(state: TrustState, evidence: Evidence): TrustState {
  if (isVerified(state) && !evidence.resolved) return "unsupported";
  if (state === "verified_source" && !evidence.sourceId) return "unsupported";
  return state;
}

/** Trust breakdown counts for a set of claims — feeds coverage & section-trust UI. */
export function trustBreakdown(states: Iterable<TrustState>): Record<TrustState, number> {
  const counts: Record<TrustState, number> = {
    verified_execution: 0,
    verified_source: 0,
    sourced: 0,
    disputed: 0,
    unsupported: 0,
    interpretive: 0,
  };
  for (const s of states) counts[s] += 1;
  return counts;
}

/** % of claims that are verified (either variant) — the topic "trust bar" headline (HOME-05). */
export function verifiedPercent(states: Iterable<TrustState>): number {
  let total = 0;
  let verified = 0;
  for (const s of states) {
    total += 1;
    if (isVerified(s)) verified += 1;
  }
  return total === 0 ? 0 : Math.round((verified / total) * 100);
}
