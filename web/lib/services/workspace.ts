/**
 * Shared loader for the Topic Workspace — builds the WorkspaceData bundle
 * (ledger aggregates, disputed claims, coverage matrix) for a topic. Used by all
 * four workspace routes so deep links (/topics/conflicts, …) get real data too.
 */
import type { WorkspaceData } from "@/components/workspace/types";
import { coverageMatrix } from "./sources";
import { getTopicView, listTopicSummaries } from "./topics";

export function loadWorkspaceData(userId: string, topicId?: string): WorkspaceData | null {
  const summaries = listTopicSummaries(userId);
  const id = topicId ?? summaries[0]?.id;
  const view = id ? getTopicView(userId, id) : null;
  if (!view) return null;
  const cov = coverageMatrix(userId, view.topic.id);

  // Per-claim ledger detail (latest verification event → state, source, confidence).
  const sourceById = new Map(view.topic.sources.map((s) => [s.id, s]));
  const claims = view.claimStates.map((cs) => {
    const evs = view.topic.events.filter((e) => e.claimId === cs.id);
    const latest = evs.length ? evs[evs.length - 1] : null;
    const src = latest?.evidence.sourceId ? sourceById.get(latest.evidence.sourceId) : undefined;
    return {
      id: cs.id,
      text: cs.text,
      sectionId: cs.sectionId,
      state: cs.state,
      source: src ? { title: src.title, kind: src.kind, detail: latest?.evidence.detail ?? "" } : null,
      confidence: latest?.evidence.confidence ?? 0,
      method: latest?.evidence.method ?? "",
    };
  });

  return {
    topicId: view.topic.id,
    title: view.topic.title,
    level: view.topic.level,
    claimCount: view.topic.claims.length,
    sourceCount: view.topic.sources.length,
    verifiedPercent: view.verifiedPercent,
    breakdown: view.breakdown,
    claims,
    disputedClaims: view.claimStates.filter((c) => c.state === "disputed").map((c) => ({ claimId: c.id, text: c.text })),
    coverage: cov
      ? {
          sources: cov.sources.map((s) => ({ id: s.id, title: s.title, kind: s.kind })),
          rows: cov.rows.map((r) => ({ claimId: r.claimId, claimText: r.claimText, state: r.state, cells: r.cells.map((c) => ({ sourceId: c.sourceId, filled: c.state !== null })) })),
          coveragePercent: cov.coveragePercent,
          backedCount: cov.backedCount,
        }
      : null,
  };
}
