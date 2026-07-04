/**
 * Deterministic seed data. Mirrors the design's demo learner (Adeline) and her
 * three topics, with a fully-populated trust ledger so trust bars and coverage
 * are computed by the real engine — not hard-coded.
 */
import { hashPassword } from "@/lib/auth/password";
import { newCard } from "@/lib/domain/fsrs";
import { openGap } from "@/lib/domain/gap";
import { TrustLedger, verifiedPercent, type VerificationActor } from "@/lib/domain/trust";
import type { Claim, Source, TrustState, VerificationEvent } from "@/lib/domain/types";
import type { Db } from "./db";
import type { TopicRecord, User } from "./entities";

const SYSTEM: VerificationActor = { id: "system:verifier", canVerify: true, isSME: false };

let idc = 0;
const nid = (p: string) => `${p}_${(idc += 1)}`;

function evFor(claimId: string, state: TrustState, sourceId: string | undefined, at: number): VerificationEvent {
  const method = state === "verified_execution" ? "execution" : state === "disputed" ? "skeptic" : "citation";
  return {
    id: nid("ve"),
    claimId,
    state,
    producedBy: SYSTEM.id,
    producerVersion: "seed-v1",
    at,
    evidence: {
      method,
      sourceId: method === "citation" ? sourceId : undefined,
      detail: `${state} via ${method}`,
      confidence: state === "disputed" ? 0.45 : 0.94,
      resolved: true,
    },
  };
}

/** Build one topic with claims, sources and a recorded ledger from a spec. */
function buildTopic(
  spec: {
    id: string;
    ownerId: string;
    title: string;
    level: string;
    goal: string;
    sources: Omit<Source, "addedBy">[];
    claims: { text: string; sectionId: string; state: TrustState; sourceIdx?: number }[];
  },
  now: number,
): TopicRecord {
  const sources: Source[] = spec.sources.map((s) => ({ ...s, addedBy: SYSTEM.id }));
  const claims: Claim[] = [];
  const ledger = new TrustLedger();
  spec.claims.forEach((c, i) => {
    const claim: Claim = { id: `${spec.id}_c${i + 1}`, topicId: spec.id, sectionId: c.sectionId, text: c.text };
    claims.push(claim);
    const sourceId = c.sourceIdx != null ? sources[c.sourceIdx].id : undefined;
    ledger.record(SYSTEM, evFor(claim.id, c.state, sourceId, now));
  });
  const states = claims.map((c) => ledger.stateOf(c.id));
  return {
    id: spec.id,
    ownerId: spec.ownerId,
    title: spec.title,
    level: spec.level,
    goal: spec.goal,
    createdAt: now,
    claims,
    sources,
    events: ledger.allEvents(),
    status: "ready",
    verifiedPercent: verifiedPercent(states),
  };
}

export function seedDb(db: Db, now: number): void {
  idc = 0;
  const userId = "user_adeline";
  const user: User = {
    id: userId,
    email: "adeline@example.com",
    // demo password: "verilearn" (hashed at seed time)
    passwordHash: hashPassword("verilearn"),
    displayName: "Adeline",
    role: "learner",
    ageBand: "adult",
    plan: "free",
    createdAt: now,
  };
  db.users.set(user.id, user);

  const dijkstra = buildTopic(
    {
      id: "topic_dijkstra",
      ownerId: userId,
      title: "Dijkstra's algorithm",
      level: "Beginner",
      goal: "Understand the intuition",
      sources: [
        { id: "src_clrs", kind: "book", title: "CLRS", ref: "§24.3", preferred: true },
        { id: "src_sandbox", kind: "sandbox", title: "Execution sandbox", ref: "run" },
        { id: "src_skiena", kind: "paper", title: "Skiena", ref: "§6.3" },
      ],
      claims: [
        { text: "Pick the unvisited node with the smallest tentative distance.", sectionId: "s1", state: "verified_execution", sourceIdx: 1 },
        { text: "The greedy choice is guaranteed to be correct.", sectionId: "s1", state: "verified_source", sourceIdx: 0 },
        { text: "Uses a priority queue keyed by tentative distance.", sectionId: "s2", state: "verified_source", sourceIdx: 0 },
        { text: "Overall running time is O((V+E) log V).", sectionId: "s2", state: "verified_source", sourceIdx: 0 },
        { text: "Relaxation never increases a tentative distance.", sectionId: "s2", state: "verified_execution", sourceIdx: 1 },
        { text: "It works on any weighted graph.", sectionId: "s3", state: "disputed", sourceIdx: undefined },
      ],
    },
    now,
  );

  const merkle = buildTopic(
    {
      id: "topic_merkle",
      ownerId: userId,
      title: "Merkle trees",
      level: "Beginner",
      goal: "Use it in practice",
      sources: [
        { id: "src_merkle_book", kind: "book", title: "Handbook of Applied Cryptography", ref: "§13.4", preferred: true },
        { id: "src_merkle_web", kind: "web", title: "cp-algorithms", ref: "merkle" },
      ],
      claims: [
        { text: "A Merkle root commits to every leaf.", sectionId: "s1", state: "verified_source", sourceIdx: 0 },
        { text: "Second-preimage resistance needs domain separation.", sectionId: "s2", state: "sourced", sourceIdx: 0 },
        { text: "Proofs are O(log n) hashes.", sectionId: "s2", state: "verified_execution", sourceIdx: 1 },
        { text: "Any hash function is safe here.", sectionId: "s3", state: "disputed", sourceIdx: undefined },
        { text: "Used in Git and blockchains.", sectionId: "s3", state: "sourced", sourceIdx: 1 },
      ],
    },
    now,
  );

  const binsearch = buildTopic(
    {
      id: "topic_binsearch",
      ownerId: userId,
      title: "Binary search",
      level: "Beginner",
      goal: "Pass an interview",
      sources: [{ id: "src_bs_book", kind: "book", title: "CLRS", ref: "§2.3", preferred: true }],
      claims: [
        { text: "Requires a sorted array.", sectionId: "s1", state: "verified_execution", sourceIdx: 0 },
        { text: "Runs in O(log n).", sectionId: "s1", state: "verified_source", sourceIdx: 0 },
        { text: "mid = lo + (hi-lo)/2 avoids overflow.", sectionId: "s2", state: "verified_execution", sourceIdx: 0 },
        { text: "Works on linked lists efficiently.", sectionId: "s2", state: "sourced", sourceIdx: 0 },
        { text: "Boundary handling is the common bug.", sectionId: "s2", state: "verified_source", sourceIdx: 0 },
      ],
    },
    now,
  );

  for (const t of [dijkstra, merkle, binsearch]) db.topics.set(t.id, t);

  // Review cards drawn from verified/sourced claims of Dijkstra.
  const day = 86_400_000;
  dijkstra.claims.slice(0, 4).forEach((c, i) => {
    const card = newCard(now);
    db.reviewCards.set(`rc_${c.id}`, {
      id: `rc_${c.id}`,
      userId,
      topicId: dijkstra.id,
      claimId: c.id,
      question: `Recall: ${c.text}`,
      answer: c.text,
      sourceRef: "CLRS §24.3",
      // stagger due dates so some are due "today"
      fsrs: { ...card, due: now + (i - 2) * day },
    });
  });

  // A tracked gap (the disputed Dijkstra claim), plus a closed one that can auto-reopen.
  const g1 = openGap({ id: "gap_1", claimId: "topic_dijkstra_c6", topicId: dijkstra.id, origin: "conflict", severity: "high" }, now);
  db.gaps.set(g1.id, { userId, gap: g1 });
}
