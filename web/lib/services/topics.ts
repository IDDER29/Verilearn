/**
 * Topic application service — the read/write API the UI uses, composing the store
 * and the trust ledger. Ownership is always scoped to the acting user (tenant safety).
 * Traces to HOME-05 (trust bars), VERIFY (create → pipeline), TRUST (ledger reads).
 */
import { DeterministicVerifier, runPipeline } from "@/lib/domain/pipeline";
import { TrustLedger, trustBreakdown, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import { isTestEligible, type TrustState } from "@/lib/domain/types";
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
}

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

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
  };
}

export function listTopicSummaries(userId: string): TopicSummary[] {
  return topicsOf(getDb(), userId).map(summarize);
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
  const existing = topicsOf(db, userId);
  if (user.plan === "free" && existing.length >= 3) {
    return { ok: false, error: "Free plan is limited to 3 topics. Upgrade to Pro for unlimited topics." };
  }
  const title = input.title.trim();
  if (title.length < 2) return { ok: false, error: "Enter a topic to learn." };

  const topicId = newId("topic");
  const createdAt = now();
  const ledger = new TrustLedger();
  let n = 0;
  const run = runPipeline({
    topic: { id: topicId, title, level: input.level, goal: input.goal },
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
    level: input.level,
    goal: input.goal,
    createdAt,
    claims: run.claims,
    // The deterministic adapter doesn't surface curated source objects; sources are
    // added/curated post-creation (a Should-Have). Trust is still ledger-derived.
    sources: [],
    events: ledger.allEvents(),
    status: run.ok ? "ready" : "verifying",
    verifiedPercent: verifiedPercent(states),
  };
  db.topics.set(topicId, record);
  return { ok: true, topicId };
}
