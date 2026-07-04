/**
 * A fixed, ephemeral guest-demo scenario (TRUST-22): runs the REAL
 * TrustLedger/verifiedPercent engine over a hardcoded set of claims/events —
 * this is real domain logic, just not tied to any account and never
 * persisted anywhere (no `db` involved at all).
 */
import { TrustLedger, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import type { Claim, TrustState, VerificationEvent } from "@/lib/domain/types";

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

export const DEMO_TOPIC = { title: "Dijkstra’s algorithm", level: "Intermediate" };
export const DEMO_SOURCE = { title: "CLRS — Introduction to Algorithms", ref: "Ch. 24" };
export const DEMO_SOURCE_ID = "demo_src_clrs";
export const DEMO_DISPUTED_CLAIM_ID = "demo_c4";

export const DEMO_CLAIMS: Claim[] = [
  { id: "demo_c1", topicId: "demo", sectionId: "s1", text: "Always expanding the nearest unvisited node is the correct greedy choice here." },
  { id: "demo_c2", topicId: "demo", sectionId: "s1", text: "The algorithm is proven correct by the greedy cut-property argument." },
  { id: "demo_c3", topicId: "demo", sectionId: "s2", text: "It uses a priority queue keyed by tentative distance." },
  { id: "demo_c4", topicId: "demo", sectionId: "s3", text: "It works correctly on any weighted graph, including negative edge weights." },
];

export const BASE_EVENTS: VerificationEvent[] = [
  {
    id: "demo_ve1",
    claimId: "demo_c1",
    state: "verified_execution",
    producedBy: SYSTEM.id,
    producerVersion: "demo-v1",
    at: 1_000,
    evidence: { method: "execution", detail: "Traced against a reference execution.", confidence: 0.95, resolved: true },
  },
  {
    id: "demo_ve2",
    claimId: "demo_c2",
    state: "verified_source",
    producedBy: SYSTEM.id,
    producerVersion: "demo-v1",
    at: 1_000,
    evidence: { method: "citation", sourceId: DEMO_SOURCE_ID, detail: "Matched to CLRS Ch. 24.", confidence: 0.9, resolved: true },
  },
  {
    id: "demo_ve3",
    claimId: "demo_c3",
    state: "sourced",
    producedBy: SYSTEM.id,
    producerVersion: "demo-v1",
    at: 1_000,
    evidence: { method: "citation", sourceId: DEMO_SOURCE_ID, detail: "Cited, not independently re-derived.", confidence: 0.7, resolved: true },
  },
  {
    id: "demo_ve4",
    claimId: "demo_c4",
    state: "disputed",
    producedBy: SYSTEM.id,
    producerVersion: "demo-v1",
    at: 1_000,
    evidence: { method: "skeptic", detail: "The Skeptic flagged this: a negative edge weight breaks the greedy cut-property argument.", confidence: 0.3, resolved: false },
  },
];

export interface DemoClaimView {
  id: string;
  text: string;
  state: TrustState;
}

export interface DemoSnapshot {
  claims: DemoClaimView[];
  verifiedPercent: number;
}

function toSnapshot(ledger: TrustLedger): DemoSnapshot {
  return {
    claims: DEMO_CLAIMS.map((c) => ({ id: c.id, text: c.text, state: ledger.stateOf(c.id) })),
    verifiedPercent: verifiedPercent(DEMO_CLAIMS.map((c) => ledger.stateOf(c.id))),
  };
}

/** The demo's starting state — one disputed claim among an otherwise-verified topic. */
export function demoSnapshot(): DemoSnapshot {
  return toSnapshot(new TrustLedger().load(BASE_EVENTS));
}

/**
 * Resolve the demo's disputed claim through the REAL firewall-respecting
 * path: only the SYSTEM verifier writes the new trust state, exactly as
 * `resolveConflict` does for a real account (`lib/services/conflicts.ts`) —
 * this just runs on a fresh, throwaway ledger instead of a persisted topic.
 */
export function resolveDemoConflict(at: number): DemoSnapshot {
  const ledger = new TrustLedger().load(BASE_EVENTS);
  ledger.record(SYSTEM, {
    id: `demo_ve_resolve_${at}`,
    claimId: DEMO_DISPUTED_CLAIM_ID,
    state: "verified_source",
    producedBy: SYSTEM.id,
    producerVersion: "demo-resolve-v1",
    at,
    evidence: {
      method: "citation",
      sourceId: DEMO_SOURCE_ID,
      detail: 'Re-verified after adding the constraint: "only non-negative edge weights".',
      confidence: 0.9,
      resolved: true,
    },
  });
  return toSnapshot(ledger);
}
