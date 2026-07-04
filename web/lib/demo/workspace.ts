/**
 * Guest demo Lecture reader (LEARN-17): assembles the same `WorkspaceData`
 * shape a real signed-in `loadWorkspaceData` produces, from the fixed
 * ephemeral demo scenario (`lib/demo/scenario.ts`) — real underlined claims,
 * a real claim→evidence side rail, and a real disputed claim, all computed by
 * the actual `TrustLedger` engine, just never touching `db`.
 */
import type { WorkspaceData } from "@/components/workspace/types";
import { TrustLedger, trustBreakdown, verifiedPercent } from "@/lib/domain/trust";
import { BASE_EVENTS, DEMO_CLAIMS, DEMO_SOURCE, DEMO_SOURCE_ID, DEMO_TOPIC } from "./scenario";

/** Real, ledger-derived workspace data for the guest Lecture reader — nothing persisted, nothing fabricated. */
export function demoWorkspaceData(): WorkspaceData {
  const ledger = new TrustLedger().load(BASE_EVENTS);
  const eventByClaimId = new Map(BASE_EVENTS.map((e) => [e.claimId, e]));
  const states = DEMO_CLAIMS.map((c) => ledger.stateOf(c.id));

  const claims = DEMO_CLAIMS.map((c) => {
    const ev = eventByClaimId.get(c.id)!;
    const backed = ev.evidence.sourceId === DEMO_SOURCE_ID;
    return {
      id: c.id,
      text: c.text,
      sectionId: c.sectionId,
      state: ledger.stateOf(c.id),
      source: backed ? { title: DEMO_SOURCE.title, kind: "book", detail: ev.evidence.detail } : null,
      confidence: ev.evidence.confidence,
      method: ev.evidence.method,
    };
  });

  const disputedClaims = DEMO_CLAIMS.filter((c) => ledger.stateOf(c.id) === "disputed").map((c) => ({ claimId: c.id, text: c.text }));
  const backedClaims = claims.filter((c) => c.source !== null);

  return {
    topicId: "demo",
    title: DEMO_TOPIC.title,
    level: DEMO_TOPIC.level,
    claimCount: DEMO_CLAIMS.length,
    sourceCount: 1,
    verifiedPercent: verifiedPercent(states),
    breakdown: trustBreakdown(states),
    claims,
    disputedClaims,
    resolvedClaims: [], // the demo's dispute starts unresolved — resolving it is DemoConflictPanel's live interaction, not a fixed fact
    coverage: {
      sources: [{ id: DEMO_SOURCE_ID, title: DEMO_SOURCE.title, kind: "book", preferred: true }],
      rows: claims.map((c) => ({
        claimId: c.id,
        claimText: c.text,
        state: c.state,
        cells: [{ sourceId: DEMO_SOURCE_ID, filled: c.source !== null, state: c.source !== null ? c.state : null }],
      })),
      coveragePercent: Math.round((backedClaims.length / DEMO_CLAIMS.length) * 100),
      backedCount: backedClaims.length,
      backsBySource: { [DEMO_SOURCE_ID]: backedClaims.length },
    },
  };
}
