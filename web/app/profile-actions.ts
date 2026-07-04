"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { getDb } from "@/lib/store/db";

/** Persist the learner's display name (AUTH-09). Trimmed, 1–60 chars. */
export async function updateDisplayNameAction(name: string): Promise<{ ok: boolean; error?: string; name?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const trimmed = name.trim();
  if (trimmed.length === 0) return { ok: false, error: "Name can't be empty." };
  if (trimmed.length > 60) return { ok: false, error: "Name must be 60 characters or fewer." };
  const stored = getDb().users.get(user.id);
  if (!stored) return { ok: false, error: "Account not found." };
  stored.displayName = trimmed;
  revalidatePath("/settings/profile");
  revalidatePath("/");
  return { ok: true, name: trimmed };
}
