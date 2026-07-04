/**
 * Test session service — the "prove" loop. A test is built from verified/sourced
 * claims only (TEST-02); a passing score mints a certificate with a fail-closed
 * verify code (TEST). A failing test can never produce a certificate.
 */
import { issueCertificate } from "@/lib/domain/certificates";
import { buildTest, scoreTest } from "@/lib/domain/tests-engine";
import { getDb, ledgerFor } from "@/lib/store/db";
import type { CertificateRecord } from "@/lib/store/entities";
import { newId, now } from "@/lib/ids";

export const TEST_DURATION_MS = 20 * 60_000;
export const TEST_PASS_BAR = 75;

export interface TestSessionInfo {
  topicId: string;
  title: string;
  questionCount: number;
  durationMs: number;
  passBar: number;
}

/** Format a test for a topic from its eligible claims (returns null if none). */
export function buildSession(userId: string, topicId: string): TestSessionInfo | null {
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return null;
  const ledger = ledgerFor(topic);
  const built = buildTest({ claims: topic.claims, ledger, count: topic.claims.length, now: now() });
  return {
    topicId,
    title: topic.title,
    questionCount: built.questions.length,
    durationMs: TEST_DURATION_MS,
    passBar: TEST_PASS_BAR,
  };
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
  scorePct?: number;
  passed?: boolean;
  certificateId?: string;
  verifyCode?: string;
}

/**
 * Score a completed test and, on a pass, issue + persist a certificate.
 * `correctCount`/`totalCount` come from the runner UI.
 */
export function submitTest(userId: string, topicId: string, correctCount: number, totalCount: number): SubmitResult {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Topic not found." };
  if (totalCount <= 0) return { ok: false, error: "No questions to score." };

  const answers = Array.from({ length: totalCount }, (_, i) => ({ correct: i < correctCount }));
  const score = scoreTest(answers, TEST_PASS_BAR);

  let certificateId: string | undefined;
  let verifyCode: string | undefined;
  if (score.passed) {
    verifyCode = newId("vc").replace("vc_", "VL-").toUpperCase();
    const cert = issueCertificate({ topicId, learnerId: userId, testResult: score, now: now(), id: newId("cert"), verifyCode });
    const record: CertificateRecord = { ...cert };
    db.certificates.set(cert.id, record);
    certificateId = cert.id;
  }
  return { ok: true, scorePct: score.pct, passed: score.passed, certificateId, verifyCode };
}
