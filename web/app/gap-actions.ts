"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { closeGapById } from "@/lib/services/gaps";

/** Manually close a watching gap (evidence-gated, GAP-03/09). */
export async function closeGapAction(gapId: string): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const r = closeGapById(user.id, gapId);
  if (r.ok) revalidatePath("/gap-map");
  return r;
}
