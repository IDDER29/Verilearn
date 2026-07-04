/**
 * Conflicts service — the learner adjudicates disputed claims in their OWN topics
 * (SME-free in R1). Resolving a conflict does NOT let the user write a trust state
 * directly (epistemic firewall); instead it records the missing constraint and
 * triggers RE-VERIFICATION, and the system verifier emits the new verification
 * event. Traces to TRUST (conflicts), VERIFY-13, and the firewall invariant.
 */
import { TrustLedger, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
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
