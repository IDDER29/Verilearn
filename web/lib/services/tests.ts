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
}

export function listTestableTopics(userId: string): TestableTopic[] {
  // Read-only enforcement (BILL-12): an archived topic can't be tested, so it
  // shouldn't offer a live "start test" entry point in the first place.
  return topicsOf(getDb(), userId)
    .filter((topic) => !topic.archived)
    .map((topic) => {
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
      };
    });
}
