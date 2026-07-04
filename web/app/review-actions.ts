"use server";

import { getCurrentUser } from "@/lib/auth/current";
import { nextIntervals, type Rating } from "@/lib/domain/fsrs";
import { formatInterval } from "@/lib/format";
import { dueBreakdown, fsrsParamsFor, getReviewAheadCards, getSessionCards, gradeCard, type Confidence, type DueBreakdown } from "@/lib/services/review";
import { blindSpotSummary, nextDrillFor, submitDrillAnswer, type BlindSpotSummary, type DrillPrompt } from "@/lib/services/drills";
import { getDb, ledgerFor, reviewCardsOf } from "@/lib/store/db";
import type { TrustState } from "@/lib/domain/types";
import { now } from "@/lib/ids";

export interface SessionCard {
  id: string;
  q: string;
  a: string;
  source: string;
  topicTitle: string;
  /** Lecture section the card's claim belongs to (e.g. "s1"). */
  section: string;
  /** Live trust state of the card's underlying claim, from the ledger (REVIEW-03). */
  trustState: TrustState | null;
  /** Real FSRS projected interval label per rating (REVIEW-04). */
  intervals: { again: string; hard: string; good: string; easy: string };
}

import type { ReviewCardRecord } from "@/lib/store/entities";

/** Map a stored review card to the client session shape (shared by due + review-ahead). */
function toSessionCard(c: ReviewCardRecord, at: number, params: ReturnType<typeof fsrsParamsFor>): SessionCard {
  const db = getDb();
  const topic = db.topics.get(c.topicId);
  const iv = nextIntervals(c.fsrs, at, params);
  const section = topic?.claims.find((cl) => cl.id === c.claimId)?.sectionId ?? "";
  const trustState = topic ? ledgerFor(topic).stateOf(c.claimId) : null;
  return {
    id: c.id,
    q: c.question,
    a: c.answer,
    source: c.sourceRef,
    topicTitle: topic?.title ?? "Topic",
    section,
    trustState,
    intervals: {
      again: formatInterval(iv.again),
      hard: formatInterval(iv.hard),
      good: formatInterval(iv.good),
      easy: formatInterval(iv.easy),
    },
  };
}

/** Due review cards for the current user, capped at the daily limit (REVIEW-19), mapped to the session shape. */
export async function getDueCardsAction(): Promise<SessionCard[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const at = now();
  const params = fsrsParamsFor(user.id); // per-learner retention/max-interval (REVIEW-13)
  return getSessionCards(user.id, at).map((c) => toSessionCard(c, at, params));
}

/** Per-topic due breakdown for the session panel (REVIEW-12). */
export async function dueBreakdownAction(): Promise<DueBreakdown | null> {
  const user = await getCurrentUser();
  if (!user) return null;
  return dueBreakdown(user.id, now());
}

/** Review-ahead cards (not-yet-due, lowest-retrievability first) for study-ahead (REVIEW-11). */
export async function reviewAheadCardsAction(): Promise<SessionCard[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const at = now();
  const params = fsrsParamsFor(user.id);
  return getReviewAheadCards(user.id, at).map((c) => toSessionCard(c, at, params));
}

export interface GradeActionResult {
  ok: boolean;
  gapReopened?: boolean;
  error?: string;
}

export interface CaughtUpInfo {
  /** Total review cards the learner has (0 ⇒ brand-new, no deck yet). */
  totalCards: number;
  /** Soonest upcoming due timestamp, or null if none. */
  nextDue: number | null;
}

/** Info for the "all caught up" state: deck size + next due (REVIEW-18). */
export async function caughtUpInfoAction(): Promise<CaughtUpInfo> {
  const user = await getCurrentUser();
  if (!user) return { totalCards: 0, nextDue: null };
  const cards = reviewCardsOf(getDb(), user.id);
  const at = now();
  const upcoming = cards.filter((c) => c.fsrs.due > at).map((c) => c.fsrs.due).sort((a, b) => a - b);
  return { totalCards: cards.length, nextDue: upcoming[0] ?? null };
}

/** Persist a graded card (FSRS reschedule + calibration log + gap auto-reopen). */
export async function gradeCardAction(cardId: string, confidence: Confidence, rating: Rating): Promise<GradeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = gradeCard(user.id, cardId, confidence, rating, now());
  return { ok: r.ok, gapReopened: r.gapReopened, error: r.error };
}

/** The learner's real blind-spot catch rate, for the "Blind-spot check" card (ANALYTICS-07). */
export async function blindSpotSummaryAction(): Promise<BlindSpotSummary> {
  const user = await getCurrentUser();
  return user ? blindSpotSummary(user.id) : { caught: 0, total: 0 };
}

/** The next not-yet-attempted seeded error-drill for the learner, or null if none remain (REVIEW-06). */
export async function nextDrillAction(): Promise<DrillPrompt | null> {
  const user = await getCurrentUser();
  return user ? nextDrillFor(user.id) : null;
}

export interface DrillAnswerActionResult {
  ok: boolean;
  error?: string;
  caught?: boolean;
  actualCorrect?: boolean;
  explanation?: string;
  gapReopened?: boolean;
}

/** Record the learner's true/false judgment on a drill (REVIEW-06); a miss may open/reopen a gap (GAP-07). */
export async function submitDrillAnswerAction(drillId: string, guessedCorrect: boolean): Promise<DrillAnswerActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  return submitDrillAnswer(user.id, drillId, guessedCorrect, now());
}
