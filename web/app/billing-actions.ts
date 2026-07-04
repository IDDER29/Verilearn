"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";

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

/** DEMO downgrade back to Free (no proration/processor — mirrors the note above). */
export async function downgradeToFreeAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  user.plan = "free";
  revalidatePath("/");
  revalidatePath("/upgrade");
  revalidatePath("/settings/plan");
  return { ok: true };
}
