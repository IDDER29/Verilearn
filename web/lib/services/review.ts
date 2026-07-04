/**
 * Review application service — the retain half of the spine. Composes FSRS
 * scheduling, calibration logging, and Gap-Map auto-reopen over the store.
 * Traces to REVIEW-01/02/03 (FSRS + commit-before-reveal), GAP-06 (auto-reopen),
 * ANALYTICS (retention/calibration signals).
 */
import { calibrationScore } from "@/lib/domain/calibration";
import { retrievability, schedule, type FsrsParams, type Rating } from "@/lib/domain/fsrs";
import { getPrefs } from "./prefs";
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

export interface DueBreakdown {
  byTopic: { topicId: string; topicTitle: string; due: number; overdue: number }[];
  totalDue: number;
  overdue: number;
  dailyLimit: number;
  /** Due cards beyond today's per-learner daily limit — honest "N beyond today's limit". */
  beyondLimit: number;
}

/**
 * Per-topic due breakdown for the session (REVIEW-12): how many cards are due in
 * each topic, how many are overdue (>1 day past due), and how many fall beyond
 * the learner's daily limit. All from the eligibility-gated due deck.
 */
export function dueBreakdown(userId: string, at: number): DueBreakdown {
  const db = getDb();
  const DAY = 86_400_000;
  const map = new Map<string, { title: string; due: number; overdue: number }>();
  const due = getDueCards(userId, at);
  for (const c of due) {
    const title = db.topics.get(c.topicId)?.title ?? "Topic";
    const e = map.get(c.topicId) ?? { title, due: 0, overdue: 0 };
    e.due += 1;
    if (c.fsrs.due <= at - DAY) e.overdue += 1;
    map.set(c.topicId, e);
  }
  const byTopic = [...map.entries()]
    .map(([topicId, v]) => ({ topicId, topicTitle: v.title, due: v.due, overdue: v.overdue }))
    .sort((a, b) => b.due - a.due);
  const dailyLimit = getPrefs(userId)?.review.dailyLimit ?? 40;
  return {
    byTopic,
    totalDue: due.length,
    overdue: byTopic.reduce((n, t) => n + t.overdue, 0),
    dailyLimit,
    beyondLimit: Math.max(0, due.length - dailyLimit),
  };
}

/**
 * Review-ahead (REVIEW-11): not-yet-due, still-eligible cards ordered by LOWEST
 * retrievability first — the ones closest to being forgotten, so studying ahead
 * spends effort where it matters most. Same eligibility gate as the due deck.
 */
export function getReviewAheadCards(userId: string, at: number, limit = 10): ReviewCardRecord[] {
  return reviewCardsOf(getDb(), userId)
    .filter((c) => c.fsrs.due > at && cardClaimEligible(c))
    .sort((a, b) => retrievability(a.fsrs, at) - retrievability(b.fsrs, at))
    .slice(0, limit);
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
/**
 * Per-learner FSRS tuning from saved Review preferences (REVIEW-13): the
 * Settings › Review target-retention (%) and max-interval (days) feed the
 * scheduler, so a learner who raises retention gets shorter intervals. Falls
 * back to the engine defaults when no prefs are stored. `schedule`/`nextIntervals`
 * clamp these to safe ranges.
 */
export function fsrsParamsFor(userId: string): Partial<FsrsParams> {
  const p = getPrefs(userId);
  if (!p) return {};
  return { requestRetention: p.review.targetRetention / 100, maximumInterval: p.review.maxIntervalDays };
}

export function gradeCard(userId: string, cardId: string, confidence: Confidence, rating: Rating, at: number): GradeResult {
  const db = getDb();
  const card = db.reviewCards.get(cardId);
  if (!card || card.userId !== userId) return { ok: false, error: "Card not found." };

  card.fsrs = schedule(card.fsrs, rating, at, fsrsParamsFor(userId));
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

export interface StreakStatus {
  /** Consecutive calendar days with ≥1 review, counting backward from yesterday (or today). */
  currentStreak: number;
  /** True when a real (≥2-day) streak is still alive as of yesterday but nothing is logged yet today. */
  atRisk: boolean;
}

/**
 * A learner's review streak as of `now` (NOTIF-05), independent of
 * {@link sessionSummaryFor}'s "ending on the latest review" framing: this one
 * is relative to the calendar day `now` falls on, so it can tell whether
 * TODAY still needs a review to keep the streak alive. `atRisk` requires a
 * genuine streak (≥2 days) that's intact through yesterday — a single day
 * isn't a "streak" worth nudging about, and a streak already broken isn't
 * "at risk", it's just over.
 */
export function streakStatus(userId: string, now: number): StreakStatus {
  const log = getDb().reviewLog.filter((r) => r.userId === userId);
  const days = new Set(log.map((r) => Math.floor(r.at / DAY_MS)));
  const today = Math.floor(now / DAY_MS);

  const reviewedToday = days.has(today);
  let currentStreak = 0;
  for (let d = reviewedToday ? today : today - 1; days.has(d); d -= 1) currentStreak += 1;

  const atRisk = !reviewedToday && currentStreak >= 2;
  return { currentStreak, atRisk };
}
