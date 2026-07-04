/**
 * Tasks service — the "produce" step. A write-in answer is graded against a
 * source-anchored rubric (each criterion traces to a canonical source), ≥75% to
 * pass, revise-to-pass. Traces to TASK-04 (source-traced rubric), TASK.
 */
import { grade, keywordMatcher, type Criterion } from "@/lib/domain/rubric";
import { getDb } from "@/lib/store/db";
import type { TaskRecord } from "@/lib/store/entities";

export interface TaskView {
  id: string;
  prompt: string;
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
    prompt: task.prompt,
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
}

/** Grade a write-in answer against the task's source-anchored rubric (revise-to-pass). */
export function gradeSubmission(userId: string, taskId: string, answer: string): GradeSubmissionResult {
  const db = getDb();
  const task = db.tasks.get(taskId);
  if (!task || task.userId !== userId) return { ok: false, error: "Task not found." };
  if (!answer.trim()) return { ok: false, error: "Write an answer before submitting." };

  const submission = { id: taskId, answer };
  const hits: Record<string, boolean> = {};
  for (const c of task.rubric.criteria) hits[c.id] = keywordMatcher(c, submission);
  const result = grade(task.rubric, hits);

  task.submittedAnswer = answer;
  task.submissionHits = hits;
  task.scorePct = result.scorePct;
  task.passed = result.passed;

  return {
    ok: true,
    scorePct: result.scorePct,
    passed: result.passed,
    hitIds: result.hit.map((c: Criterion) => c.id),
    missingIds: result.missing.map((c: Criterion) => c.id),
  };
}
