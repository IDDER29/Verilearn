/**
 * Review application service — the retain half of the spine. Composes FSRS
 * scheduling, calibration logging, and Gap-Map auto-reopen over the store.
 * Traces to REVIEW-01/02/03 (FSRS + commit-before-reveal), GAP-06 (auto-reopen),
 * ANALYTICS (retention/calibration signals).
 */
import { calibrationScore } from "@/lib/domain/calibration";
import { schedule, type Rating } from "@/lib/domain/fsrs";
import { closeGap, MASTERY_THRESHOLD, onLapse, openGap, toWatching } from "@/lib/domain/gap";
import { isTestEligible } from "@/lib/domain/types";
import { getDb, gapsOf, ledgerFor, reviewCardsOf } from "@/lib/store/db";
import type { ReviewCardRecord } from "@/lib/store/entities";
import { newId } from "@/lib/ids";

export type Confidence = "sure" | "unsure" | "guessing";

/** True when a card's underlying claim is currently test-eligible (verified/sourced). */
function cardClaimEligible(card: ReviewCardRecord): boolean {
  const topic = getDb().topics.get(card.topicId);
  return topic ? isTestEligible(ledgerFor(topic).stateOf(card.claimId)) : false;
}

/**
 * Cards due for review, soonest first — gated by LIVE trust eligibility (REVIEW-15):
 * a card whose claim has become `disputed`/`unsupported`/`interpretive` is held
 * out of the deck until it's resolved, so review never reinforces contested
 * content. Recomputed from the ledger on each call, not a stored flag.
 */
export function getDueCards(userId: string, at: number): ReviewCardRecord[] {
  return reviewCardsOf(getDb(), userId)
    .filter((c) => c.fsrs.due <= at && cardClaimEligible(c))
    .sort((a, b) => a.fsrs.due - b.fsrs.due);
}

export interface GradeResult {
  ok: boolean;
  error?: string;
  nextDue?: number;
  gapReopened?: boolean;
  /** A tracked gap advanced toward closed (watching or closed) on a correct recall. */
  gapAdvanced?: boolean;
  /** A tracked gap reached `closed` on this correct recall (sustained mastery). */
  gapClosed?: boolean;
}

/**
 * Grade one card: reschedule via FSRS, log the confidence↔correctness pair for
 * calibration, and auto-reopen (or open) a Gap on a lapse. "again" is a lapse.
 */
export function gradeCard(userId: string, cardId: string, confidence: Confidence, rating: Rating, at: number): GradeResult {
  const db = getDb();
  const card = db.reviewCards.get(cardId);
  if (!card || card.userId !== userId) return { ok: false, error: "Card not found." };

  card.fsrs = schedule(card.fsrs, rating, at);
  const correct = rating !== "again";
  db.reviewLog.push({ userId, claimId: card.claimId, topicId: card.topicId, confidence, rating, correct, at });

  let gapReopened = false;
  let gapAdvanced = false;
  let gapClosed = false;
  if (rating === "again") {
    const rec = gapsOf(db, userId).find((g) => g.gap.claimId === card.claimId);
    if (rec) {
      const before = rec.gap.status;
      rec.gap = onLapse(rec.gap, at);
      gapReopened = rec.gap.status === "reopened" && before !== "reopened";
    } else {
      // A fresh lapse with no tracked gap opens one (origin: review).
      const gap = openGap({ id: newId("gap"), claimId: card.claimId, topicId: card.topicId, origin: "review", severity: "med" }, at);
      db.gaps.set(gap.id, { userId, gap });
    }
  } else {
    // Correct recall advances a tracked gap toward closed (GAP-05):
    // open/reopened → watching on the first correct recall, then watching →
    // closed once sustained correct recalls reach the mastery threshold.
    const rec = gapsOf(db, userId).find((g) => g.gap.claimId === card.claimId);
    if (rec) {
      const before = rec.gap.status;
      if (before === "open" || before === "reopened") {
        rec.gap = toWatching(rec.gap, at);
        gapAdvanced = rec.gap.status === "watching";
      } else if (before === "watching") {
        const successes = db.reviewLog.filter((r) => r.userId === userId && r.claimId === card.claimId && r.correct).length;
        if (successes >= MASTERY_THRESHOLD) {
          rec.gap = closeGap(rec.gap, { successfulReviews: successes }, at);
          gapClosed = rec.gap.status === "closed";
          gapAdvanced = gapClosed;
        }
      }
    }
  }
  return { ok: true, nextDue: card.fsrs.due, gapReopened, gapAdvanced, gapClosed };
}

/** Calibration summary for the learner from the review log (feeds Progress). */
export function calibrationFor(userId: string) {
  const records = getDb()
    .reviewLog.filter((r) => r.userId === userId)
    .map((r) => ({ confidence: r.confidence, correct: r.correct }));
  return calibrationScore(records);
}

/** Retention = share of reviews graded correct (feeds the Retention signal). */
export function retentionFor(userId: string): { total: number; correct: number } {
  const log = getDb().reviewLog.filter((r) => r.userId === userId);
  return { total: log.length, correct: log.filter((r) => r.correct).length };
}

const DAY_MS = 24 * 60 * 60 * 1000;
/** Reviews within this window of the latest one count as the same session. */
export const SESSION_WINDOW_MS = 2 * 60 * 60 * 1000;

export interface SessionSummary {
  /** Cards graded in the most-recent session. */
  reviewed: number;
  /** Of those, how many were recalled (rating !== "again"). */
  correct: number;
  /** FSRS rating tally for the session, in schedule order. */
  ratingCounts: { again: number; hard: number; good: number; easy: number };
  /** Session-scoped calibration (may be insufficient_data under MIN_RECORDS). */
  calibration: ReturnType<typeof calibrationScore>;
  /** Consecutive calendar days (ending on the latest review) with ≥1 review. */
  streakDays: number;
  /** Soonest due timestamp among not-yet-due cards, or null if none upcoming. */
  nextDue: number | null;
  /** Cards due on that soonest day. */
  dueSoonCount: number;
}

/**
 * Summarise the learner's most-recent review session for the completion screen.
 * A "session" is the run of graded cards whose timestamps fall within
 * {@link SESSION_WINDOW_MS} of the latest grade. Pure over (log, cards, now):
 * no clock/random of its own — `now` is supplied. Traces to REVIEW (session
 * summary) and ANALYTICS (retention/calibration/streak signals).
 */
export function sessionSummaryFor(userId: string, now: number): SessionSummary {
  const db = getDb();
  const log = db.reviewLog.filter((r) => r.userId === userId).sort((a, b) => a.at - b.at);
  const latest = log.length ? log[log.length - 1].at : now;
  const session = log.filter((r) => latest - r.at <= SESSION_WINDOW_MS);

  const ratingCounts = { again: 0, hard: 0, good: 0, easy: 0 };
  for (const r of session) ratingCounts[r.rating] += 1;
  const correct = session.filter((r) => r.correct).length;
  const calibration = calibrationScore(session.map((r) => ({ confidence: r.confidence, correct: r.correct })));

  // Consecutive-day streak ending on the latest review day.
  const days = new Set(log.map((r) => Math.floor(r.at / DAY_MS)));
  let streakDays = 0;
  for (let d = Math.floor(latest / DAY_MS); days.has(d); d -= 1) streakDays += 1;

  const upcoming = reviewCardsOf(db, userId)
    .filter((c) => c.fsrs.due > now)
    .sort((a, b) => a.fsrs.due - b.fsrs.due);
  const nextDue = upcoming.length ? upcoming[0].fsrs.due : null;
  const dueSoonCount =
    nextDue === null ? 0 : upcoming.filter((c) => Math.floor(c.fsrs.due / DAY_MS) === Math.floor(nextDue / DAY_MS)).length;

  return { reviewed: session.length, correct, ratingCounts, calibration, streakDays, nextDue, dueSoonCount };
}
