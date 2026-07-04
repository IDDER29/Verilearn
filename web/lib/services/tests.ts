/**
 * Tests read-service — surfaces per-topic test readiness using the tests engine.
 * A test's questions may come ONLY from verified/sourced claims; disputed and
 * unsupported claims are excluded (TEST-02). Traces to TEST-02, TEST (readiness).
 */
import { eligibleClaims } from "@/lib/domain/tests-engine";
import { getDb, ledgerFor, topicsOf } from "@/lib/store/db";
import { isQuarantined } from "./quarantine";

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
    // A quarantined claim (ADMIN-14) is held out the same way a disputed one is —
    // a T&S override layered on top of the trust ledger, not a ledger state itself.
    const eligible = eligibleClaims(topic.claims, ledger).filter((c) => !isQuarantined(c.id));
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
