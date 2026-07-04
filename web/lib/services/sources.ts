/**
 * Sources service — the claims × sources coverage matrix (TRUST). A cell is
 * filled when a claim's verification evidence resolves to that source; an empty
 * row is an unsupported/disputed claim (the coverage gap the learner must close).
 */
import { ledgerFor, getDb } from "@/lib/store/db";
import { TrustLedger, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
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

export interface TrustReadClaim {
  claimId: string;
  text: string;
  state: TrustState;
  confidence: number;
}

export interface TrustReadModel {
  topicId: string;
  title: string;
  /**
   * `pipeline_incomplete` while the verification pipeline is still running or
   * failed to finish (topic.status !== "ready") — never presented as a
   * finalized read (API-04). This reflects the topic's CURRENT pipeline state;
   * there is no per-stage completion timestamp to say whether a historical
   * `asOf` cut fell before/after completion, so an in-flight/failed topic
   * reads `pipeline_incomplete` at every `asOf`.
   */
  status: "complete" | "pipeline_incomplete";
  /** The instant this snapshot reflects (epoch ms) — `asOf` if requested, else now. */
  asOf: number;
  claims: TrustReadClaim[];
  verifiedPercent: number;
}

/**
 * The read-only trust-state model behind the `/api/topics/[id]/trust` surface
 * (API-04): the five-state per-claim trust read, ledger-versioned via `asOf`
 * (replays only the events recorded at-or-before that instant — the ledger is
 * event-sourced, so this is a genuine historical snapshot, not an approximation).
 * Scoped to the authenticated caller's OWN topic (tenant/ownership check) —
 * there is no separate `trust:read` API-key/OAuth scope model (that needs the
 * deferred credential infrastructure, API-01/02); the session is the scope.
 */
export function trustReadModel(userId: string, topicId: string, opts: { asOf?: number } = {}): TrustReadModel | null {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return null;

  const asOf = opts.asOf ?? now();
  const ledger = new TrustLedger().load(topic.events.filter((e) => e.at <= asOf));

  const claims: TrustReadClaim[] = topic.claims.map((c) => {
    const state = ledger.stateOf(c.id);
    const evidence = ledger.evidenceOf(c.id);
    return { claimId: c.id, text: c.text, state, confidence: evidence?.confidence ?? 0 };
  });

  return {
    topicId: topic.id,
    title: topic.title,
    status: topic.status === "ready" ? "complete" : "pipeline_incomplete",
    asOf,
    claims,
    verifiedPercent: verifiedPercent(claims.map((c) => c.state)),
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

/** Mark one source as the topic's preferred citation (exactly one per topic, TRUST-11). */
export function setPreferredSource(userId: string, topicId: string, sourceId: string): { ok: boolean; error?: string } {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  if (!topic.sources.some((s) => s.id === sourceId)) return { ok: false, error: "Source not found." };
  for (const s of topic.sources) s.preferred = s.id === sourceId;
  return { ok: true };
}

export interface RemoveSourceResult {
  ok: boolean;
  error?: string;
  /** Claims that lost their only backing and were fail-closed to `unsupported`. */
  downgraded: number;
}

/**
 * Remove a source from a topic (TRUST-11). Any claim whose current backing cited
 * this source, with no other present source backing it, is fail-closed to
 * `unsupported` via a SYSTEM event — the "removing the only backing source →
 * unsupported" invariant, kept consistent between ledger and coverage.
 */
export function removeSource(userId: string, topicId: string, sourceId: string): RemoveSourceResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found.", downgraded: 0 };
  if (!topic.sources.some((s) => s.id === sourceId)) return { ok: false, error: "Source not found.", downgraded: 0 };

  topic.sources = topic.sources.filter((s) => s.id !== sourceId);
  const remaining = new Set(topic.sources.map((s) => s.id));

  const ledger = ledgerFor(topic);
  const at = now();
  let downgraded = 0;
  for (const claim of topic.claims) {
    const ev = ledger.evidenceOf(claim.id);
    // Backing cited the removed source and nothing present still backs it.
    if (ev?.sourceId === sourceId && !remaining.has(ev.sourceId)) {
      ledger.record(SYSTEM, {
        id: newId("ve"),
        claimId: claim.id,
        state: "unsupported",
        producedBy: SYSTEM.id,
        producerVersion: "remove-source-v1",
        at,
        evidence: { method: "none", detail: "Backing source removed by the learner", confidence: 0, resolved: false },
      });
      downgraded += 1;
    }
  }

  topic.events = ledger.allEvents();
  topic.verifiedPercent = verifiedPercent(topic.claims.map((c) => ledger.stateOf(c.id)));
  return { ok: true, downgraded };
}
