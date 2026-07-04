"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { clearSessionCookie, sessionSecret, setSessionCookie } from "@/lib/auth/current";
import { AuthError, signIn, signUp } from "@/lib/auth/service";
import { getDb } from "@/lib/store/db";
import { newId, now } from "@/lib/ids";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  let token: string;
  try {
    const r = signIn(getDb(), { email, password }, { now: now(), secret: sessionSecret(), tokenNonce: randomUUID() });
    token = r.token;
  } catch (e) {
    const msg = e instanceof AuthError ? e.message : "Sign-in failed.";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }
  await setSessionCookie(token);
  redirect("/");
}

export async function signupAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");
  const birthYearRaw = String(formData.get("birthYear") ?? "");
  const birthYear = birthYearRaw ? Number(birthYearRaw) : undefined;
  let token: string;
  try {
    const r = signUp(
      getDb(),
      { email, password, displayName, birthYear },
      { now: now(), secret: sessionSecret(), userId: newId("user"), tokenNonce: randomUUID() },
    );
    token = r.token;
  } catch (e) {
    const msg = e instanceof AuthError ? e.message : "Sign-up failed.";
    redirect(`/signup?error=${encodeURIComponent(msg)}`);
  }
  await setSessionCookie(token);
  redirect("/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
