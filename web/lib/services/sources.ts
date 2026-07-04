/**
 * Sources service — the claims × sources coverage matrix (TRUST). A cell is
 * filled when a claim's verification evidence resolves to that source; an empty
 * row is an unsupported/disputed claim (the coverage gap the learner must close).
 */
import { ledgerFor, getDb } from "@/lib/store/db";
import type { Source, TrustState } from "@/lib/domain/types";

export interface CoverageCell {
  claimId: string;
  sourceId: string;
  state: TrustState | null; // null = not backed by this source
}

export interface CoverageMatrix {
  topicId: string;
  title: string;
  sources: Source[];
  rows: {
    claimId: string;
    claimText: string;
    state: TrustState;
    cells: CoverageCell[];
  }[];
  backedCount: number;
  coveragePercent: number;
}

export function coverageMatrix(userId: string, topicId: string): CoverageMatrix | null {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return null;
  const ledger = ledgerFor(topic);

  const rows = topic.claims.map((claim) => {
    const state = ledger.stateOf(claim.id);
    const evidence = ledger.evidenceOf(claim.id);
    const cells = topic.sources.map((s) => ({
      claimId: claim.id,
      sourceId: s.id,
      state: evidence?.sourceId === s.id ? state : null,
    }));
    return { claimId: claim.id, claimText: claim.text, state, cells };
  });

  const backedCount = rows.filter((r) => r.cells.some((c) => c.state !== null)).length;
  return {
    topicId: topic.id,
    title: topic.title,
    sources: topic.sources,
    rows,
    backedCount,
    coveragePercent: topic.claims.length === 0 ? 0 : Math.round((backedCount / topic.claims.length) * 100),
  };
}
