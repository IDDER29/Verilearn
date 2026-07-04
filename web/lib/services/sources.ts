/**
 * Sources service — the claims × sources coverage matrix (TRUST). A cell is
 * filled when a claim's verification evidence resolves to that source; an empty
 * row is an unsupported/disputed claim (the coverage gap the learner must close).
 */
import { ledgerFor, getDb } from "@/lib/store/db";
import { verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import type { Source, SourceKind, TrustState } from "@/lib/domain/types";
import { newId, now } from "@/lib/ids";

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

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

export interface AddSourceResult {
  ok: boolean;
  error?: string;
  newState?: TrustState;
  sourceId?: string;
}

/**
 * Attach a learner-provided source to an unsupported/disputed claim (TRUST-09).
 * Respects the epistemic firewall: the learner never writes a trust state — the
 * SYSTEM verifier records a `citation` event that moves the claim to `sourced`
 * (backed-by-a-citation; deeper Skeptic vetting of the reference is Deferred to
 * the real LLM verifier). Recomputes coverage/verifiedPercent.
 */
export function addSourceForClaim(
  userId: string,
  topicId: string,
  claimId: string,
  input: { title: string; ref?: string; kind?: SourceKind },
): AddSourceResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  const claim = topic.claims.find((c) => c.id === claimId);
  if (!claim) return { ok: false, error: "Claim not found." };

  const title = input.title.trim();
  const ref = (input.ref ?? "").trim();
  if (!title) return { ok: false, error: "Give the source a title." };

  const ledger = ledgerFor(topic);
  const state = ledger.stateOf(claimId);
  if (state !== "disputed" && state !== "unsupported") return { ok: false, error: "This claim is already backed by a source." };

  const source: Source = { id: newId("src"), kind: input.kind ?? "web", title, ref: ref || title, addedBy: userId };
  topic.sources.push(source);

  const at = now();
  ledger.record(SYSTEM, {
    id: newId("ve"),
    claimId,
    state: "sourced",
    producedBy: SYSTEM.id,
    producerVersion: "add-source-v1",
    at,
    evidence: {
      method: "citation",
      sourceId: source.id,
      detail: `Learner attached source "${title}"${ref ? ` (${ref})` : ""}`,
      confidence: 0.85,
      resolved: true,
    },
  });

  topic.events = ledger.allEvents();
  topic.verifiedPercent = verifiedPercent(topic.claims.map((c) => ledger.stateOf(c.id)));
  return { ok: true, newState: ledger.stateOf(claimId), sourceId: source.id };
}
