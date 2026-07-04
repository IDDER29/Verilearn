/**
 * Topic application service — the read/write API the UI uses, composing the store
 * and the trust ledger. Ownership is always scoped to the acting user (tenant safety).
 * Traces to HOME-05 (trust bars), VERIFY (create → pipeline), TRUST (ledger reads).
 */
import { DeterministicVerifier, runPipeline } from "@/lib/domain/pipeline";
import { TrustLedger, trustBreakdown, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import { isTestEligible, type TrustState } from "@/lib/domain/types";
import { entitlementsFor } from "@/lib/domain/entitlements";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";
import type { TopicRecord } from "@/lib/store/entities";
import { newId, now } from "@/lib/ids";

export interface TopicSummary {
  id: string;
  title: string;
  level: string;
  claimCount: number;
  verifiedPercent: number;
  status: TopicRecord["status"];
  breakdown: Record<TrustState, number>;
  disputes: number;
  archived: boolean;
}

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

/** Free-plan topic cap (BILL / HOME-13), read from the entitlement catalog (ADMIN-07) — Pro/Team are unlimited. */
export const FREE_TOPIC_CAP = entitlementsFor("free").maxActiveTopics;

function summarize(topic: TopicRecord): TopicSummary {
  const ledger = ledgerFor(topic);
  const states = topic.claims.map((c) => ledger.stateOf(c.id));
  const breakdown = trustBreakdown(states);
  return {
    id: topic.id,
    title: topic.title,
    level: topic.level,
    claimCount: topic.claims.length,
    verifiedPercent: verifiedPercent(states),
    status: topic.status,
    breakdown,
    disputes: breakdown.disputed,
    archived: !!topic.archived,
  };
}

export function listTopicSummaries(userId: string): TopicSummary[] {
  return topicsOf(getDb(), userId).map(summarize);
}

export interface ClaimSearchResult {
  claimId: string;
  text: string;
  sectionId: string;
  state: TrustState;
  topicId: string;
  topicTitle: string;
}

/**
 * Cross-topic, claim-level search (HOME-07): the same trust-state operators
 * `topicMatchesQuery` (Dashboard) applies per-topic, applied per-claim instead
 * — "disputed" finds the actual disputed claims, not just the topics that
 * have one — plus a free-text substring match on claim text. Every state is
 * read live off each topic's real ledger; never a fabricated match.
 */
export function searchClaims(userId: string, query: string): ClaimSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: ClaimSearchResult[] = [];
  for (const topic of topicsOf(getDb(), userId)) {
    const ledger = ledgerFor(topic);
    for (const c of topic.claims) {
      const state = ledger.stateOf(c.id);
      const matches =
        q === "disputed"
          ? state === "disputed"
          : q === "unsupported"
            ? state === "unsupported"
            : q === "interpretive"
              ? state === "interpretive"
              : q === "verified"
                ? state === "verified_execution" || state === "verified_source"
                : c.text.toLowerCase().includes(q);
      if (matches) results.push({ claimId: c.id, text: c.text, sectionId: c.sectionId, state, topicId: topic.id, topicTitle: topic.title });
    }
  }
  return results;
}

/** Topics that count against the Free-plan cap — archived topics don't (BILL-12). */
function activeTopics(userId: string): TopicRecord[] {
  return topicsOf(getDb(), userId).filter((t) => !t.archived);
}

export function activeTopicCount(userId: string): number {
  return activeTopics(userId).length;
}

export interface TopicView {
  topic: TopicRecord;
  claimStates: { id: string; text: string; sectionId: string; state: TrustState }[];
  verifiedPercent: number;
  breakdown: Record<TrustState, number>;
  eligibleForTest: number;
}

export function getTopicView(userId: string, topicId: string): TopicView | null {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return null; // tenant scoping
  const ledger = ledgerFor(topic);
  const claimStates = topic.claims.map((c) => ({ id: c.id, text: c.text, sectionId: c.sectionId, state: ledger.stateOf(c.id) }));
  return {
    topic,
    claimStates,
    verifiedPercent: verifiedPercent(claimStates.map((c) => c.state)),
    breakdown: trustBreakdown(claimStates.map((c) => c.state)),
    eligibleForTest: claimStates.filter((c) => isTestEligible(c.state)).length,
  };
}

export interface CreateTopicInput {
  title: string;
  level: string;
  goal: string;
}

/**
 * Create a topic and run it through the verification pipeline. Enforces the Free
 * plan's 3-topic cap (BILL) before spending any verification compute.
 */
export function createTopic(userId: string, input: CreateTopicInput): { ok: true; topicId: string } | { ok: false; error: string } {
  const db = getDb();
  const user = db.users.get(userId);
  if (!user) return { ok: false, error: "Not authenticated." };
  // Archived topics (BILL-12) don't count against the cap they were archived to respect.
  // Reads the tier's cap from the entitlement catalog (ADMIN-07), not a hardcoded branch —
  // a future tier with a finite cap is enforced here automatically, no new code path needed.
  const cap = entitlementsFor(user.plan).maxActiveTopics;
  if (activeTopicCount(userId) >= cap) {
    return { ok: false, error: `${user.plan === "free" ? "Free plan" : "Your plan"} is limited to ${cap} topics. Upgrade to Pro for unlimited topics.` };
  }
  // Server-side gate mirrors the client (VERIFY-02): all three fields required,
  // not just the title — the client gate must not be the only guard.
  const title = input.title.trim();
  const level = input.level.trim();
  const goal = input.goal.trim();
  if (title.length < 2) return { ok: false, error: "Enter a topic to learn." };
  if (level.length < 4) return { ok: false, error: "Tell us what you already know about it." };
  if (goal.length === 0) return { ok: false, error: "Pick what you want to get out of it." };

  const topicId = newId("topic");
  const createdAt = now();
  const ledger = new TrustLedger();
  let n = 0;
  const run = runPipeline({
    topic: { id: topicId, title, level, goal },
    verifier: new DeterministicVerifier(),
    ledger,
    actor: SYSTEM,
    now: createdAt,
    ids: () => `${topicId}_ve${(n += 1)}`,
  });

  const states = run.claims.map((c) => ledger.stateOf(c.id));
  const record: TopicRecord = {
    id: topicId,
    ownerId: userId,
    title,
    level,
    goal,
    createdAt,
    claims: run.claims,
    // The deterministic adapter doesn't surface curated source objects; sources are
    // added/curated post-creation (a Should-Have). Trust is still ledger-derived.
    sources: [],
    events: ledger.allEvents(),
    // Synchronous pipeline: a non-ok run is a terminal failure, not still-in-flight (VERIFY-15).
    status: run.ok ? "ready" : "failed",
    verifiedPercent: verifiedPercent(states),
    pipelineStages: run.stages.map((s) => ({ stage: s.stage, detail: s.detail, status: s.status })),
  };
  db.topics.set(topicId, record);
  return { ok: true, topicId };
}

export interface ChooseFreeTopicsResult {
  ok: boolean;
  error?: string;
  archivedCount?: number;
}

/**
 * Downgrade-to-Free topic selection (BILL-12): the learner picks exactly
 * {@link FREE_TOPIC_CAP} topics to keep active; every other owned topic is
 * archived (never deleted — content and the trust ledger are untouched) and
 * any previously-archived topic in the kept set is restored. Refuses a
 * selection that isn't exactly the cap size or names a topic the caller
 * doesn't own.
 */
export function chooseFreeTopics(userId: string, keepTopicIds: string[]): ChooseFreeTopicsResult {
  const db = getDb();
  const owned = topicsOf(db, userId);
  const keepSet = new Set(keepTopicIds);
  if (keepSet.size !== FREE_TOPIC_CAP) {
    return { ok: false, error: `Choose exactly ${FREE_TOPIC_CAP} topics to keep active.` };
  }
  if (![...keepSet].every((id) => owned.some((t) => t.id === id))) {
    return { ok: false, error: "One of those topics isn't yours." };
  }
  let archivedCount = 0;
  for (const t of owned) {
    const shouldArchive = !keepSet.has(t.id);
    if (shouldArchive && !t.archived) archivedCount += 1;
    t.archived = shouldArchive;
  }
  return { ok: true, archivedCount };
}
