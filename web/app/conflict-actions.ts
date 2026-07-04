"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { resolveConflict } from "@/lib/services/conflicts";

export interface ResolveActionResult {
  ok: boolean;
  error?: string;
  newState?: string;
}

/** Resolve a disputed claim by adding a constraint → re-verifies via the system verifier. */
export async function resolveConflictAction(topicId: string, claimId: string, constraint: string): Promise<ResolveActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = resolveConflict(user.id, topicId, claimId, { constraint });
  if (r.ok) revalidatePath("/topics");
  return { ok: r.ok, error: r.error, newState: r.newState };
}
