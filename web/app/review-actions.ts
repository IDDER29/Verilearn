"use server";

import { getCurrentUser } from "@/lib/auth/current";
import { nextIntervals, type Rating } from "@/lib/domain/fsrs";
import { formatInterval } from "@/lib/format";
import { getDueCards, gradeCard, type Confidence } from "@/lib/services/review";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";

export interface SessionCard {
  id: string;
  q: string;
  a: string;
  source: string;
  topicTitle: string;
  /** Lecture section the card's claim belongs to (e.g. "s1"). */
  section: string;
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
    return {
      id: c.id,
      q: c.question,
      a: c.answer,
      source: c.sourceRef,
      topicTitle: topic?.title ?? "Topic",
      section,
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

/** Persist a graded card (FSRS reschedule + calibration log + gap auto-reopen). */
export async function gradeCardAction(cardId: string, confidence: Confidence, rating: Rating): Promise<GradeActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = gradeCard(user.id, cardId, confidence, rating, now());
  return { ok: r.ok, gapReopened: r.gapReopened, error: r.error };
}
