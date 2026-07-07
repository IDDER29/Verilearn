/**
 * Test session service — the "prove" loop. A test is built from verified/sourced
 * claims only (TEST-02); a passing score mints a certificate with a fail-closed
 * verify code (TEST). A failing test can never produce a certificate.
 */
import { issueCertificate } from "@/lib/domain/certificates";
import { buildTest, scoreTest } from "@/lib/domain/tests-engine";
import { noteOriginHit, onLapse, openGap } from "@/lib/domain/gap";
import { getDb, gapsOf, ledgerFor } from "@/lib/store/db";
import type { CertificateRecord } from "@/lib/store/entities";
import { newId, now } from "@/lib/ids";
import { isQuarantined } from "./quarantine";

export const TEST_DURATION_MS = 20 * 60_000;
export const TEST_PASS_BAR = 75;

export interface TestSessionInfo {
  topicId: string;
  title: string;
  questionCount: number;
  durationMs: number;
  passBar: number;
  /** True when the topic has claims that couldn't make the test (disputed/unsupported/interpretive/quarantined) — coverage is disclosed, never padded (TEST-20). */
  reducedCoverage: boolean;
  /** How many of the topic's claims were left out of the test. */
  excludedCount: number;
  /** False when there isn't a single eligible claim to test — the zero-question case (TEST-20): the test can't be started at all, not just reduced. */
  startable: boolean;
  /** The claim ids the test actually draws on, in the same deterministic (claim-id-ascending) order `buildTest` selects them — lets a caller identify which real claims a given question count corresponds to (TEST-05/06). */
  claimIds: string[];
}

/** Format a test for a topic from its eligible claims (returns null if none). */
export function buildSession(userId: string, topicId: string): TestSessionInfo | null {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return null;
  // Read-only enforcement (BILL-12): an archived topic can't be tested — the
  // same guard review (`getDueCards`), tasks (`gradeSubmission`), and drills
  // already apply.
  if (topic.archived) return null;
  const ledger = ledgerFor(topic);
  // A quarantined claim (ADMIN-14) is filtered out before the pure engine ever
  // sees it — a T&S override layered on top of the trust ledger, not a ledger
  // state itself, so the engine's own eligibility rules stay untouched.
  const claims = topic.claims.filter((c) => !isQuarantined(c.id));
  const built = buildTest({ claims, ledger, count: claims.length, now: now() });
  return {
    topicId,
    title: topic.title,
    questionCount: built.questions.length,
    durationMs: TEST_DURATION_MS,
    passBar: TEST_PASS_BAR,
    startable: built.questions.length > 0,
    reducedCoverage: built.reducedCoverage,
    excludedCount: topic.claims.length - built.questions.length,
    claimIds: built.questions.map((q) => q.claimId),
  };
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
  scorePct?: number;
  passed?: boolean;
  certificateId?: string;
  verifyCode?: string;
  /** Number of gaps created or reopened from missed claims (TEST-06). */
  gapsOpened?: number;
}

/**
 * On a wrong answer, a missed claim becomes a tracked gap (origin: test) — a
 * fresh miss opens one, an already-tracked claim regresses via `onLapse`
 * (open/watching/closed → reopened). Mirrors the review-lapse path so the same
 * claim can't be silently "learned" while a test still fails it. Gaps never
 * touch trust state (read-only linkage). Returns how many were opened/reopened.
 */
function recordMissesAsGaps(userId: string, topicId: string, missedClaimIds: string[], at: number): number {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic) return 0;
  let count = 0;
  for (const claimId of new Set(missedClaimIds)) {
    if (!topic.claims.some((c) => c.id === claimId)) continue; // ignore claims not in this topic
    const rec = gapsOf(db, userId).find((g) => g.gap.claimId === claimId);
    if (rec) {
      const before = rec.gap.status;
      rec.gap = noteOriginHit(onLapse(rec.gap, at, "missed on a test"), "test");
      if (rec.gap.status !== before) count += 1; // regressed (e.g. closed/watching → reopened)
    } else {
      const gap = openGap({ id: newId("gap"), claimId, topicId, origin: "test", severity: "high" }, at);
      db.gaps.set(gap.id, { userId, gap });
      count += 1;
    }
  }
  return count;
}

/**
 * Score a completed test and, on a pass, issue + persist a certificate.
 * `correctCount`/`totalCount` come from the runner UI; `missedClaimIds` (when
 * the runner supplies per-question claims) drives test→gap tracking (TEST-06).
 */
export function submitTest(userId: string, topicId: string, correctCount: number, totalCount: number, missedClaimIds: string[] = []): SubmitResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  // Read-only enforcement (BILL-12): an archived topic can't mint a certificate.
  if (topic.archived) return { ok: false, error: "This topic is archived. Upgrade or free up a slot to reactivate it before testing." };
  if (totalCount <= 0) return { ok: false, error: "No questions to score." };

  const answers = Array.from({ length: totalCount }, (_, i) => ({ correct: i < correctCount }));
  const score = scoreTest(answers, TEST_PASS_BAR);
  const at = now();

  // Missed claims become tracked gaps regardless of overall pass/fail (TEST-06).
  const gapsOpened = recordMissesAsGaps(userId, topicId, missedClaimIds, at);

  let certificateId: string | undefined;
  let verifyCode: string | undefined;
  if (score.passed) {
    verifyCode = newId("vc").replace("vc_", "VL-").toUpperCase();
    const learnerName = db.users.get(userId)?.displayName ?? "Unknown learner";
    const cert = issueCertificate({ topicId, topicTitle: topic.title, learnerId: userId, learnerName, testResult: score, now: at, id: newId("cert"), verifyCode });
    const record: CertificateRecord = { ...cert };
    db.certificates.set(cert.id, record);
    certificateId = cert.id;
  }
  return { ok: true, scorePct: score.pct, passed: score.passed, certificateId, verifyCode, gapsOpened };
}
