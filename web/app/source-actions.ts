"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { addSourceForClaim, removeSource, setPreferredSource } from "@/lib/services/sources";

/** Attach a learner-provided source to an unsupported/disputed claim (TRUST-09). */
export async function addSourceAction(topicId: string, claimId: string, title: string, ref: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const r = addSourceForClaim(user.id, topicId, claimId, { title, ref });
  if (r.ok) {
    revalidatePath("/topics");
    revalidatePath("/topics/sources");
  }
  return { ok: r.ok, error: r.error };
}

/** Mark a source preferred (TRUST-11). */
export async function setPreferredSourceAction(topicId: string, sourceId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const r = setPreferredSource(user.id, topicId, sourceId);
  if (r.ok) {
    revalidatePath("/topics");
    revalidatePath("/topics/sources");
  }
  return r;
}

/** Remove a source; claims left unbacked fail-closed to unsupported (TRUST-11). */
export async function removeSourceAction(topicId: string, sourceId: string): Promise<{ ok: boolean; error?: string; downgraded?: number }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const r = removeSource(user.id, topicId, sourceId);
  if (r.ok) {
    revalidatePath("/topics");
    revalidatePath("/topics/sources");
  }
  return { ok: r.ok, error: r.error, downgraded: r.downgraded };
}
