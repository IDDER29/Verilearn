"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { getPrefs, updatePrefs } from "@/lib/services/prefs";
import type { UserPrefs } from "@/lib/store/entities";

export async function getPrefsAction(): Promise<UserPrefs | null> {
  const user = await getCurrentUser();
  return user ? getPrefs(user.id) : null;
}

/** The current learner's plan — used to hide the upgrade upsell for paid plans (SETTINGS-01). */
export async function currentPlanAction(): Promise<"free" | "pro" | "team"> {
  const user = await getCurrentUser();
  return user?.plan ?? "free";
}

export async function saveVerificationAction(patch: Partial<UserPrefs["verification"]>): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "verification", patch);
  revalidatePath("/settings");
  return { ok: true };
}

export async function saveActiveListeningAction(patch: Partial<UserPrefs["activeListening"]>): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "activeListening", patch);
  revalidatePath("/settings/active-listening");
  return { ok: true };
}

export async function saveReviewPrefsAction(patch: Partial<UserPrefs["review"]>): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "review", patch);
  revalidatePath("/settings/review");
  return { ok: true };
}

export async function savePrivacyAction(patch: Partial<UserPrefs["privacy"]>): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "privacy", patch);
  revalidatePath("/settings/privacy");
  return { ok: true };
}

/** Per-category in-app notification opt-in (NOTIF-08). */
export async function saveNotificationPrefsAction(patch: Partial<UserPrefs["notifications"]>): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "notifications", patch);
  revalidatePath("/settings/privacy");
  revalidatePath("/notifications");
  return { ok: true };
}

/** Whether the learner has already dismissed the review commit-before-reveal primer (REVIEW-01). */
export async function reviewPrimerSeenAction(): Promise<boolean> {
  const user = await getCurrentUser();
  return user ? (getPrefs(user.id)?.flags.reviewPrimerSeen ?? true) : true;
}

/** Mark the review primer dismissed so it never re-shows (REVIEW-01). */
export async function dismissReviewPrimerAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  updatePrefs(user.id, "flags", { reviewPrimerSeen: true });
  return { ok: true };
}
