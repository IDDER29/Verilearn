/**
 * Conflicts service — the learner adjudicates disputed claims in their OWN topics
 * (SME-free in R1). Resolving a conflict does NOT let the user write a trust state
 * directly (epistemic firewall); instead it records the missing constraint and
 * triggers RE-VERIFICATION, and the system verifier emits the new verification
 * event. Traces to TRUST (conflicts), VERIFY-13, and the firewall invariant.
 */
import { verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import type { TrustState } from "@/lib/domain/types";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";
import { newId, now } from "@/lib/ids";

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

export interface ConflictItem {
  topicId: string;
  topicTitle: string;
  claimId: string;
  claimText: string;
  state: TrustState;
}

/** All open conflicts (disputed claims) across the learner's topics. */
export function listConflicts(userId: string): ConflictItem[] {
  const out: ConflictItem[] = [];
  for (const topic of topicsOf(getDb(), userId)) {
    const ledger = ledgerFor(topic);
    for (const claim of topic.claims) {
      if (ledger.stateOf(claim.id) === "disputed") {
        out.push({ topicId: topic.id, topicTitle: topic.title, claimId: claim.id, claimText: claim.text, state: "disputed" });
      }
    }
  }
  return out;
}

export interface ResolveResult {
  ok: boolean;
  error?: string;
  newState?: TrustState;
}

/**
 * Resolve a disputed claim by adding a qualifying constraint + a backing source,
 * which re-verifies the claim. The learner supplies the reasoning; the SYSTEM
 * verifier produces the new trust state (never the user).
 */
export function resolveConflict(userId: string, topicId: string, claimId: string, opts: { constraint: string; sourceId?: string }): ResolveResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  const claim = topic.claims.find((c) => c.id === claimId);
  if (!claim) return { ok: false, error: "Claim not found." };

  const ledger = ledgerFor(topic);
  if (ledger.stateOf(claimId) !== "disputed") return { ok: false, error: "This claim is not disputed." };
  if (!opts.constraint.trim()) return { ok: false, error: "Add the qualifying constraint to resolve the conflict." };

  const sourceId = opts.sourceId ?? topic.sources.find((s) => s.preferred)?.id ?? topic.sources[0]?.id;
  const at = now();
  // Re-verification: system verifier moves disputed → verified_source with the source.
  ledger.record(SYSTEM, {
    id: newId("ve"),
    claimId,
    state: sourceId ? "verified_source" : "sourced",
    producedBy: SYSTEM.id,
    producerVersion: "reverify-v1",
    at,
    evidence: {
      method: "citation",
      sourceId,
      detail: `Re-verified after learner added constraint: "${opts.constraint.trim()}"`,
      confidence: 0.9,
      resolved: true,
    },
  });

  topic.events = ledger.allEvents();
  topic.verifiedPercent = verifiedPercent(topic.claims.map((c) => ledger.stateOf(c.id)));
  return { ok: true, newState: ledger.stateOf(claimId) };
}

/** One mapped stance in an interpretive resolution — a position with optional backing source. */
export interface ConflictPosition {
  stance: string;
  sourceId?: string;
}

/**
 * Resolve a disputed claim as INTERPRETIVE (TRUST-10): rather than picking a
 * single winner, the learner maps ≥2 genuinely-competing positions (each may
 * cite a source). The SYSTEM verifier records an `interpretive` event — the
 * claim is NOT certified and stays out of single-answer test pools
 * (`isTestEligible` false), which is the correct epistemic outcome for a
 * contested claim. The learner supplies the positions; the system writes state.
 */
export function resolveAsInterpretive(userId: string, topicId: string, claimId: string, positions: ConflictPosition[]): ResolveResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  const claim = topic.claims.find((c) => c.id === claimId);
  if (!claim) return { ok: false, error: "Claim not found." };

  const ledger = ledgerFor(topic);
  if (ledger.stateOf(claimId) !== "disputed") return { ok: false, error: "This claim is not disputed." };

  const mapped = positions.map((p) => ({ stance: p.stance.trim(), sourceId: p.sourceId })).filter((p) => p.stance.length > 0);
  if (mapped.length < 2) return { ok: false, error: "Map at least two competing positions to record an interpretive resolution." };

  const cited = mapped.find((p) => p.sourceId)?.sourceId;
  ledger.record(SYSTEM, {
    id: newId("ve"),
    claimId,
    state: "interpretive",
    producedBy: SYSTEM.id,
    producerVersion: "interpretive-v1",
    at: now(),
    evidence: {
      method: cited ? "citation" : "skeptic",
      sourceId: cited,
      detail: `Mapped ${mapped.length} competing positions: ${mapped.map((p) => `"${p.stance}"`).join(" vs ")}`,
      confidence: 0.5,
      resolved: true,
    },
  });

  topic.events = ledger.allEvents();
  topic.verifiedPercent = verifiedPercent(topic.claims.map((c) => ledger.stateOf(c.id)));
  return { ok: true, newState: ledger.stateOf(claimId) };
}

/** A claim that was disputed and later resolved — a candidate for reopening (TRUST-13). */
export interface ResolvedConflictItem {
  topicId: string;
  claimId: string;
  claimText: string;
}

/** Claims whose ledger history shows a disputed→resolved transition, per topic. */
export function listResolvedConflicts(userId: string, topicId: string): ResolvedConflictItem[] {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return [];
  const out: ResolvedConflictItem[] = [];
  for (const claim of topic.claims) {
    const evs = topic.events.filter((e) => e.claimId === claim.id);
    const everDisputed = evs.some((e) => e.state === "disputed");
    const nowResolved = evs.length > 0 && evs[evs.length - 1].state !== "disputed";
    if (everDisputed && nowResolved) out.push({ topicId, claimId: claim.id, claimText: claim.text });
  }
  return out;
}

/**
 * Reopen a resolved conflict (TRUST-13): the learner supplies a required reason,
 * and the SYSTEM verifier (never the learner) records a new `disputed` event that
 * reverts the claim's trust state — re-excluding it from test pools. Append-only:
 * the prior resolution is preserved in history.
 */
export function reopenConflict(userId: string, topicId: string, claimId: string, reason: string): ResolveResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  const claim = topic.claims.find((c) => c.id === claimId);
  if (!claim) return { ok: false, error: "Claim not found." };
  if (!reason.trim()) return { ok: false, error: "Give a reason to reopen this conflict." };

  const ledger = ledgerFor(topic);
  if (ledger.stateOf(claimId) === "disputed") return { ok: false, error: "This conflict is already open." };

  ledger.record(SYSTEM, {
    id: newId("ve"),
    claimId,
    state: "disputed",
    producedBy: SYSTEM.id,
    producerVersion: "reopen-v1",
    at: now(),
    evidence: { method: "skeptic", detail: `Reopened by the learner: "${reason.trim()}"`, confidence: 0.4, resolved: false },
  });

  topic.events = ledger.allEvents();
  topic.verifiedPercent = verifiedPercent(topic.claims.map((c) => ledger.stateOf(c.id)));
  return { ok: true, newState: ledger.stateOf(claimId) };
}
