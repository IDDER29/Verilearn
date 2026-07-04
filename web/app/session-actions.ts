"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { clearSessionCookie, getCurrentToken, getCurrentUser } from "@/lib/auth/current";
import { signOutAllSessions, signOutOtherSessions, signOutSession } from "@/lib/auth/service";
import { getDb } from "@/lib/store/db";

/** Revoke one specific session. Signing out the CURRENT session also clears the cookie and redirects to /login. */
export async function signOutSessionAction(token: string): Promise<{ ok: boolean }> {
  const user = await getCurrentUser();
  const currentToken = await getCurrentToken();
  if (!user) return { ok: false };
  const ok = signOutSession(getDb(), user.id, token);
  if (ok && token === currentToken) {
    await clearSessionCookie();
    redirect("/login");
  }
  revalidatePath("/settings/sessions");
  return { ok };
}

/** "Sign out everywhere else": revoke every session but this one. */
export async function signOutOtherSessionsAction(): Promise<{ ok: boolean; revoked: number }> {
  const user = await getCurrentUser();
  const token = await getCurrentToken();
  if (!user || !token) return { ok: false, revoked: 0 };
  const revoked = signOutOtherSessions(getDb(), user.id, token);
  revalidatePath("/settings/sessions");
  return { ok: true, revoked };
}

/** "Sign out everywhere" including this device — ends the caller's own session too. */
export async function signOutAllSessionsAction(): Promise<void> {
  const user = await getCurrentUser();
  if (user) signOutAllSessions(getDb(), user.id);
  await clearSessionCookie();
  redirect("/login");
}
