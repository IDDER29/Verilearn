"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { activeTopicCount, chooseFreeTopics, FREE_TOPIC_CAP, listTopicSummaries } from "@/lib/services/topics";

/**
 * DEMO plan activation. There is no payment processor in this environment —
 * real checkout/billing is Deferred behind a Stripe seam (see BILL disposition).
 * This flips the plan state directly with NO charge, so the demo can exercise
 * the real plan transition and its downstream effects (the Free 3-topic cap in
 * `lib/services/topics.ts`, verification depth) without faking a payment flow.
 */
export async function activateDemoPlanAction(plan: "pro" | "team"): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  user.plan = plan;
  revalidatePath("/");
  revalidatePath("/upgrade");
  revalidatePath("/settings/plan");
  return { ok: true };
}

export interface DowngradeResult {
  ok: boolean;
  /** True when the learner owns more than the Free cap and must choose which topics stay active (BILL-12). */
  needsTopicChoice?: boolean;
}

/**
 * DEMO downgrade back to Free (no proration/processor — mirrors the note
 * above). If the learner owns more topics than the Free cap allows, this
 * does NOT downgrade yet — it signals that a topic choice is needed first
 * (BILL-12), so nobody's active topic count silently exceeds the plan they're
 * being moved to. `confirmDowngradeWithTopicsAction` completes the downgrade
 * once that choice is made.
 */
export async function downgradeToFreeAction(): Promise<DowngradeResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  if (activeTopicCount(user.id) > FREE_TOPIC_CAP) {
    return { ok: false, needsTopicChoice: true };
  }
  user.plan = "free";
  revalidatePath("/");
  revalidatePath("/upgrade");
  revalidatePath("/settings/plan");
  return { ok: true };
}

/** The learner's topics for the "choose which stay active" downgrade prompt (BILL-12). */
export async function topicsForDowngradeChoiceAction() {
  const user = await getCurrentUser();
  return user ? listTopicSummaries(user.id) : [];
}

/**
 * Complete a downgrade after the learner picks exactly {@link FREE_TOPIC_CAP}
 * topics to keep active (BILL-12): archives the rest (content + trust ledger
 * untouched, never deleted) and only then flips the plan to Free.
 */
export async function confirmDowngradeWithTopicsAction(keepTopicIds: string[]): Promise<{ ok: boolean; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = chooseFreeTopics(user.id, keepTopicIds);
  if (!r.ok) return { ok: false, error: r.error };
  user.plan = "free";
  revalidatePath("/");
  revalidatePath("/upgrade");
  revalidatePath("/settings/plan");
  return { ok: true };
}
