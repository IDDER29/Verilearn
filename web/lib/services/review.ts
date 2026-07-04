/**
 * Review application service — the retain half of the spine. Composes FSRS
 * scheduling, calibration logging, and Gap-Map auto-reopen over the store.
 * Traces to REVIEW-01/02/03 (FSRS + commit-before-reveal), GAP-06 (auto-reopen),
 * ANALYTICS (retention/calibration signals).
 */
import { calibrationScore } from "@/lib/domain/calibration";
import { schedule, type Rating } from "@/lib/domain/fsrs";
import { onLapse, openGap } from "@/lib/domain/gap";
import { getDb, gapsOf, reviewCardsOf } from "@/lib/store/db";
import type { ReviewCardRecord } from "@/lib/store/entities";
import { newId } from "@/lib/ids";

export type Confidence = "sure" | "unsure" | "guessing";

/** Cards due for review, soonest first. */
export function getDueCards(userId: string, at: number): ReviewCardRecord[] {
  return reviewCardsOf(getDb(), userId)
    .filter((c) => c.fsrs.due <= at)
    .sort((a, b) => a.fsrs.due - b.fsrs.due);
}

export interface GradeResult {
  ok: boolean;
  error?: string;
  nextDue?: number;
  gapReopened?: boolean;
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
  }
  return { ok: true, nextDue: card.fsrs.due, gapReopened };
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
