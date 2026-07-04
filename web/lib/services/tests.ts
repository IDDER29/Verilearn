/**
 * Tests read-service — surfaces per-topic test readiness using the tests engine.
 * A test's questions may come ONLY from verified/sourced claims; disputed and
 * unsupported claims are excluded (TEST-02). Traces to TEST-02, TEST (readiness).
 */
import { eligibleClaims } from "@/lib/domain/tests-engine";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";

export interface TestableTopic {
  topicId: string;
  title: string;
  level: string;
  claimCount: number;
  eligibleCount: number;
  excludedCount: number;
  /** naive readiness = share of claims eligible (real eligibility off the ledger) */
  readinessPercent: number;
}

export function listTestableTopics(userId: string): TestableTopic[] {
  return topicsOf(getDb(), userId).map((topic) => {
    const ledger = ledgerFor(topic);
    const eligible = eligibleClaims(topic.claims, ledger);
    const claimCount = topic.claims.length;
    return {
      topicId: topic.id,
      title: topic.title,
      level: topic.level,
      claimCount,
      eligibleCount: eligible.length,
      excludedCount: claimCount - eligible.length,
      readinessPercent: claimCount === 0 ? 0 : Math.round((eligible.length / claimCount) * 100),
    };
  });
}
