"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { reopenConflict, resolveAsInterpretive, resolveConflict, type ConflictPosition } from "@/lib/services/conflicts";

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

/** Map ≥2 competing positions → system records an `interpretive` state (TRUST-10). */
export async function resolveInterpretiveAction(topicId: string, claimId: string, positions: ConflictPosition[]): Promise<ResolveActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = resolveAsInterpretive(user.id, topicId, claimId, positions);
  if (r.ok) revalidatePath("/topics");
  return { ok: r.ok, error: r.error, newState: r.newState };
}

/** Reopen a resolved conflict with a required reason → system reverts the claim to disputed (TRUST-13). */
export async function reopenConflictAction(topicId: string, claimId: string, reason: string): Promise<ResolveActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = reopenConflict(user.id, topicId, claimId, reason);
  if (r.ok) revalidatePath("/topics");
  return { ok: r.ok, error: r.error, newState: r.newState };
}
