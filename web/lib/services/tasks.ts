/**
 * Tasks service — the "produce" step. A write-in answer is graded against a
 * source-anchored rubric (each criterion traces to a canonical source), ≥75% to
 * pass, revise-to-pass. Traces to TASK-04 (source-traced rubric), TASK.
 */
import { assertRubricGradeable, grade, keywordMatcher, UngradeableCriterionError, type Criterion } from "@/lib/domain/rubric";
import { onLapse, openGap, toWatching } from "@/lib/domain/gap";
import type { TrustState } from "@/lib/domain/types";
import { getDb, gapsOf, ledgerFor } from "@/lib/store/db";
import { newId, now } from "@/lib/ids";
import type { TaskRecord, TaskType } from "@/lib/store/entities";

export interface TaskView {
  id: string;
  type: TaskType;
  prompt: string;
  /** Reference answer — only sent to the client once the learner has passed (TASK-06). */
  modelAnswer?: string;
  criteria: { id: string; text: string; sourceId: string }[];
  submittedAnswer?: string;
  scorePct?: number;
  passed?: boolean;
  hit: string[];
  missing: string[];
}

function toView(task: TaskRecord): TaskView {
  const hits = task.submissionHits ?? {};
  return {
    id: task.id,
    type: task.type,
    prompt: task.prompt,
    // Gate the reference answer server-side: only reveal it once passed (TASK-06).
    modelAnswer: task.passed ? task.modelAnswer : undefined,
    criteria: task.rubric.criteria.map((c) => ({ id: c.id, text: c.text, sourceId: c.sourceId })),
    submittedAnswer: task.submittedAnswer,
    scorePct: task.scorePct,
    passed: task.passed,
    hit: task.rubric.criteria.filter((c) => hits[c.id]).map((c) => c.id),
    missing: task.rubric.criteria.filter((c) => task.submissionHits && !hits[c.id]).map((c) => c.id),
  };
}

export function getTasks(userId: string, topicId: string): TaskView[] {
  return [...getDb().tasks.values()].filter((t) => t.userId === userId && t.topicId === topicId).map(toView);
}

export interface GradeSubmissionResult {
  ok: boolean;
  error?: string;
  scorePct?: number;
  passed?: boolean;
  hitIds?: string[];
  missingIds?: string[];
  /** Reference answer, returned only on a passing submission (TASK-06). */
  modelAnswer?: string;
  /** Gaps opened or reopened from missed, claim-anchored criteria (TASK-14). */
  gapsOpened?: number;
}

/**
 * Feed a graded task's per-criterion outcomes into the Gap Map (TASK-14): a
 * missed criterion anchored to a claim opens a gap (origin: task) or regresses a
 * tracked one via `onLapse`; a hit criterion advances a tracked gap toward
 * closure (open/reopened → watching, like a correct recall). Gaps never touch
 * trust state. Returns the number opened/reopened. Criteria without a `claimId`,
 * or anchored to a claim outside the topic, are skipped.
 */
function applyTaskGapOutcomes(userId: string, topicId: string, criteria: Criterion[], hits: Record<string, boolean>, at: number): number {
  const db = getDb();
  const topic = db.topics.get(topicId);
  if (!topic) return 0;
  let opened = 0;
  for (const c of criteria) {
    const claimId = c.claimId;
    if (!claimId || !topic.claims.some((cl) => cl.id === claimId)) continue;
    const rec = gapsOf(db, userId).find((g) => g.gap.claimId === claimId);
    if (hits[c.id]) {
      // Correct on this criterion → advance a tracked gap toward closure.
      if (rec) rec.gap = toWatching(rec.gap, at);
    } else if (rec) {
      const before = rec.gap.status;
      rec.gap = onLapse(rec.gap, at, "missed a task criterion");
      if (rec.gap.status !== before) opened += 1;
    } else {
      const gap = openGap({ id: newId("gap"), claimId, topicId, origin: "task", severity: "med" }, at);
      db.gaps.set(gap.id, { userId, gap });
      opened += 1;
    }
  }
  return opened;
}

/** Grade a write-in answer against the task's source-anchored rubric (revise-to-pass). */
export function gradeSubmission(userId: string, taskId: string, answer: string): GradeSubmissionResult {
  const db = getDb();
  const task = db.tasks.get(taskId);
  if (!task || task.userId !== userId) return { ok: false, error: "Task not found." };
  if (!answer.trim()) return { ok: false, error: "Write an answer before submitting." };

  // Trust-gate the rubric (TASK-04): every criterion must anchor to a live
  // test-eligible (verified/sourced) claim. A criterion pointing at a disputed/
  // unsupported claim makes the task ungradeable until the conflict is resolved.
  const topic = db.topics.get(task.topicId);
  if (topic) {
    const ledger = ledgerFor(topic);
    const trustByClaimId: Record<string, TrustState> = {};
    for (const cl of topic.claims) trustByClaimId[cl.id] = ledger.stateOf(cl.id);
    try {
      assertRubricGradeable(task.rubric, trustByClaimId);
    } catch (e) {
      if (e instanceof UngradeableCriterionError) {
        return { ok: false, error: "This task can't be graded yet — one of its criteria references a claim that isn't verified or sourced. Resolve that conflict first." };
      }
      throw e;
    }
  }

  const submission = { id: taskId, answer };
  const hits: Record<string, boolean> = {};
  for (const c of task.rubric.criteria) hits[c.id] = keywordMatcher(c, submission);
  const result = grade(task.rubric, hits);

  task.submittedAnswer = answer;
  task.submissionHits = hits;
  task.scorePct = result.scorePct;
  task.passed = result.passed;

  // Per-criterion outcomes feed the Gap Map (TASK-14).
  const gapsOpened = applyTaskGapOutcomes(userId, task.topicId, task.rubric.criteria, hits, now());

  return {
    ok: true,
    scorePct: result.scorePct,
    passed: result.passed,
    hitIds: result.hit.map((c: Criterion) => c.id),
    missingIds: result.missing.map((c: Criterion) => c.id),
    modelAnswer: result.passed ? task.modelAnswer : undefined,
    gapsOpened,
  };
}
