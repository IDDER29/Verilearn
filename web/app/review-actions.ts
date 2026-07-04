"use server";

import { getCurrentUser } from "@/lib/auth/current";
import type { Rating } from "@/lib/domain/fsrs";
import { getDueCards, gradeCard, type Confidence } from "@/lib/services/review";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";

export interface SessionCard {
  id: string;
  q: string;
  a: string;
  source: string;
  topicTitle: string;
}

/** Due review cards for the current user, mapped to the session shape. */
export async function getDueCardsAction(): Promise<SessionCard[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  const db = getDb();
  return getDueCards(user.id, now()).map((c) => ({
    id: c.id,
    q: c.question,
    a: c.answer,
    source: c.sourceRef,
    topicTitle: db.topics.get(c.topicId)?.title ?? "Topic",
  }));
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
