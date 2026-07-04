/**
 * Blind-spot error-drills (ANALYTICS-07 / REVIEW-06): a real "spot the seeded
 * error" check salted into review. `db.drills` content is hand-authored
 * fixtures (`lib/store/seed.ts`) — real Skeptic-generated drills are Deferred
 * behind the LLM verifier — but the catch mechanic and the blind-spot signal
 * it feeds are genuinely computed from real per-learner attempts, never
 * fabricated.
 */
import { getDb, topicsOf } from "@/lib/store/db";
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
}

/**
 * Record a learner's true/false judgment on a drill (fail-closed ownership:
 * refuses a foreign, archived, or already-answered drill). `caught` is real —
 * true only when the guess matches the drill's actual answer.
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
  return { ok: true, caught, actualCorrect: drill.isCorrect, explanation: drill.explanation };
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
