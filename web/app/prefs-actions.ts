"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { getPrefs, updatePrefs } from "@/lib/services/prefs";
import type { UserPrefs } from "@/lib/store/entities";

export async function getPrefsAction(): Promise<UserPrefs | null> {
  const user = await getCurrentUser();
  return user ? getPrefs(user.id) : null;
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
