"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSessionCookie, getCurrentUser } from "@/lib/auth/current";
import { newCard } from "@/lib/domain/fsrs";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";

/** Reset spaced-review history: clear the review log, drill attempts, and return every card to "new". */
export async function resetReviewHistoryAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const db = getDb();
  db.reviewLog = db.reviewLog.filter((r) => r.userId !== user.id);
  db.drillLog = db.drillLog.filter((a) => a.userId !== user.id);
  for (const card of db.reviewCards.values()) {
    if (card.userId === user.id) card.fsrs = newCard(now());
  }
  revalidatePath("/reports");
  revalidatePath("/settings/danger");
  return { ok: true };
}

/** Reset the gap map: remove all of the learner's tracked misconceptions. */
export async function resetGapMapAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const db = getDb();
  for (const [id, rec] of db.gaps) if (rec.userId === user.id) db.gaps.delete(id);
  revalidatePath("/settings/danger");
  return { ok: true };
}

/** Delete all of the learner's topics (and their claims/ledger/coverage). */
export async function deleteAllTopicsAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const db = getDb();
  for (const [id, t] of db.topics) if (t.ownerId === user.id) db.topics.delete(id);
  revalidatePath("/");
  revalidatePath("/settings/danger");
  return { ok: true };
}

/**
 * Delete the account and ALL its data (GDPR erasure). Requires the confirmation
 * text to equal "DELETE". Clears every owned record, ends the session, and
 * redirects to sign-up.
 *
 * NOT erased: certificates and ban appeals outlive the account they were
 * issued to/filed by (a public verify code must keep resolving; an appeal is
 * moderation history, not the learner's own data) — see TEST-11/AUTH-18.
 */
export async function deleteAccountAction(confirm: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  if (confirm.trim() !== "DELETE") return { ok: false, error: 'Type "DELETE" to confirm.' };
  const db = getDb();
  db.users.delete(user.id);
  db.reviewLog = db.reviewLog.filter((r) => r.userId !== user.id);
  db.drillLog = db.drillLog.filter((a) => a.userId !== user.id);
  for (const [id, t] of db.topics) if (t.ownerId === user.id) db.topics.delete(id);
  for (const [id, c] of db.reviewCards) if (c.userId === user.id) db.reviewCards.delete(id);
  for (const [id, g] of db.gaps) if (g.userId === user.id) db.gaps.delete(id);
  for (const [id, t] of db.tasks) if (t.userId === user.id) db.tasks.delete(id);
  for (const [tok, s] of db.sessions) if (s.userId === user.id) db.sessions.delete(tok);
  for (const k of db.readNotifications) if (k.startsWith(`${user.id} `)) db.readNotifications.delete(k);
  db.disputeLog = db.disputeLog.filter((d) => d.userId !== user.id);
  db.loginAttempts.delete(user.email);
  await clearSessionCookie();
  redirect("/signup");
}
