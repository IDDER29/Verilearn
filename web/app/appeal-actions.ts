"use server";

import { submitAppealForBannedUser, type SubmitAppealResult } from "@/lib/services/appeals";
import { now } from "@/lib/ids";

/** Submit a ban appeal (AUTH-18) — the one real action a signed-out, banned account can still take. */
export async function submitAppealAction(email: string, message: string): Promise<SubmitAppealResult> {
  return submitAppealForBannedUser(email, message, now());
}
