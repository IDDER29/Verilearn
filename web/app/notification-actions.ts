"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { markAllNotificationsRead } from "@/lib/services/notifications";

/** Mark all of the current learner's notifications read (NOTIF-01). */
export async function markAllReadAction(): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  markAllNotificationsRead(user.id);
  revalidatePath("/notifications");
  revalidatePath("/");
  return { ok: true };
}
