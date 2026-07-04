"use server";

import { getCurrentUser } from "@/lib/auth/current";
import { nextIntervals, type Rating } from "@/lib/domain/fsrs";
import { formatInterval } from "@/lib/format";
import { getDueCards, gradeCard, type Confidence } from "@/lib/services/review";
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

/** Due review cards for the current user, mapped to the session shape. */
export async function getDueCardsAction(): Promise<SessionCard[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const db = getDb();
  const at = now();
  return getDueCards(user.id, at).map((c) => {
    const topic = db.topics.get(c.topicId);
    const iv = nextIntervals(c.fsrs, at);
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
  });
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
