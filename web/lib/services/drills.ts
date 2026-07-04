/**
 * Blind-spot error-drills (ANALYTICS-07 / REVIEW-06): a real "spot the seeded
 * error" check salted into review. `db.drills` content is hand-authored
 * fixtures (`lib/store/seed.ts`) — real Skeptic-generated drills are Deferred
 * behind the LLM verifier — but the catch mechanic and the blind-spot signal
 * it feeds are genuinely computed from real per-learner attempts, never
 * fabricated.
 */
import { noteOriginHit, onLapse, openGap } from "@/lib/domain/gap";
import { getDb, gapsOf, topicsOf } from "@/lib/store/db";
import { newId } from "@/lib/ids";
import { getPrefs } from "./prefs";

export interface DrillPrompt {
  id: string;
  topicId: string;
  topicTitle: string;
  statement: string;
}

/**
 * The next not-yet-attempted drill among the learner's own (non-archived)
 * topics, or null if none remain — or if the learner has switched off seeded
 * drills in Settings › Review (REVIEW-14: the toggle is now genuinely consumed
 * at session time, not just persisted).
 */
export function nextDrillFor(userId: string): DrillPrompt | null {
  const db = getDb();
  if (getPrefs(userId)?.review.drills === false) return null;
  const topics = topicsOf(db, userId).filter((t) => !t.archived);
  const attempted = new Set(db.drillLog.filter((a) => a.userId === userId).map((a) => a.drillId));
  for (const drill of db.drills.values()) {
    if (attempted.has(drill.id)) continue;
    const topic = topics.find((t) => t.id === drill.topicId);
    if (!topic) continue;
    return { id: drill.id, topicId: topic.id, topicTitle: topic.title, statement: drill.statement };
  }
  return null;
}

export interface DrillAnswerResult {
  ok: boolean;
  error?: string;
  caught?: boolean;
  actualCorrect?: boolean;
  explanation?: string;
  /** True when missing this drill opened or reopened a tracked gap (GAP-07). */
  gapReopened?: boolean;
}

/**
 * A missed, claim-anchored drill is a genuine misconception sighting — feed it
 * into the Gap Map (GAP-07) the same way a review lapse or a missed test/task
 * criterion does: open a fresh gap, or regress an already-tracked one via
 * `onLapse`. Gaps never touch trust state (read-only linkage to the claim).
 */
function applyDrillMiss(userId: string, claimId: string, topicId: string, at: number): boolean {
  const db = getDb();
  const rec = gapsOf(db, userId).find((g) => g.gap.claimId === claimId);
  if (rec) {
    const before = rec.gap.status;
    rec.gap = noteOriginHit(onLapse(rec.gap, at, "missed a blind-spot drill"), "drill");
    return rec.gap.status !== before;
  }
  const gap = openGap({ id: newId("gap"), claimId, topicId, origin: "drill", severity: "med" }, at);
  db.gaps.set(gap.id, { userId, gap });
  return true;
}

/**
 * Record a learner's true/false judgment on a drill (fail-closed ownership:
 * refuses a foreign, archived, or already-answered drill). `caught` is real —
 * true only when the guess matches the drill's actual answer. A miss on a
 * claim-anchored drill opens/reopens a tracked gap (GAP-07).
 */
export function submitDrillAnswer(userId: string, drillId: string, guessedCorrect: boolean, at: number): DrillAnswerResult {
  const db = getDb();
  const drill = db.drills.get(drillId);
  if (!drill) return { ok: false, error: "Drill not found." };
  const topic = db.topics.get(drill.topicId);
  if (!topic || topic.ownerId !== userId) return { ok: false, error: "Drill not found." };
  if (topic.archived) return { ok: false, error: "This topic is archived." };
  if (db.drillLog.some((a) => a.userId === userId && a.drillId === drillId)) {
    return { ok: false, error: "You already answered this one." };
  }

  const caught = guessedCorrect === drill.isCorrect;
  db.drillLog.push({ userId, drillId, topicId: drill.topicId, guessedCorrect, caught, at });
  const gapReopened = !caught && drill.claimId ? applyDrillMiss(userId, drill.claimId, drill.topicId, at) : false;
  return { ok: true, caught, actualCorrect: drill.isCorrect, explanation: drill.explanation, gapReopened };
}

export interface BlindSpotSummary {
  caught: number;
  total: number;
}

/** The learner's real lifetime catch rate — honest-empty (0/0) until they've attempted any drill. */
export function blindSpotSummary(userId: string): BlindSpotSummary {
  const attempts = getDb().drillLog.filter((a) => a.userId === userId);
  return { caught: attempts.filter((a) => a.caught).length, total: attempts.length };
}

/**
 * Per-attempt catch outcomes, for the blind-spot honest signal (ANALYTICS-07).
 * `asOf`, when supplied, includes only attempts at-or-before that timestamp —
 * the same real-history-replay trick used for the other signals' trend delta.
 */
export function blindSpotOutcomes(userId: string, asOf?: number): boolean[] {
  return getDb()
    .drillLog.filter((a) => a.userId === userId && (asOf === undefined || a.at <= asOf))
    .map((a) => a.caught);
}
