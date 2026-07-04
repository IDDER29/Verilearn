"use server";

import { randomUUID } from "node:crypto";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { clearSessionCookie, sessionSecret, setSessionCookie } from "@/lib/auth/current";
import { AuthError, signIn, signUp } from "@/lib/auth/service";
import { getDb } from "@/lib/store/db";
import { newId, now } from "@/lib/ids";

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const rememberMe = formData.get("rememberMe") === "on";
  const userAgent = (await headers()).get("user-agent") ?? undefined;
  let token: string;
  try {
    const r = signIn(getDb(), { email, password }, { now: now(), secret: sessionSecret(), tokenNonce: randomUUID(), userAgent, rememberMe });
    token = r.token;
  } catch (e) {
    const msg = e instanceof AuthError ? e.message : "Sign-in failed.";
    redirect(`/login?error=${encodeURIComponent(msg)}`);
  }
  await setSessionCookie(token, rememberMe);
  redirect("/");
}

export async function signupAction(formData: FormData): Promise<void> {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "");
  const birthYearRaw = String(formData.get("birthYear") ?? "");
  const birthYear = birthYearRaw ? Number(birthYearRaw) : undefined;
  // Plan intent carried from /pricing through the form (BILL-03) — preserved
  // across a validation failure too, so retrying doesn't lose it.
  const planRaw = String(formData.get("plan") ?? "");
  const plan = planRaw === "pro" || planRaw === "team" ? planRaw : undefined;
  const userAgent = (await headers()).get("user-agent") ?? undefined;
  let token: string;
  try {
    const r = signUp(
      getDb(),
      { email, password, displayName, birthYear },
      { now: now(), secret: sessionSecret(), userId: newId("user"), tokenNonce: randomUUID(), userAgent },
    );
    token = r.token;
  } catch (e) {
    const msg = e instanceof AuthError ? e.message : "Sign-up failed.";
    redirect(`/signup?error=${encodeURIComponent(msg)}${plan ? `&plan=${plan}` : ""}`);
  }
  await setSessionCookie(token);
  // A newly-created account never lands mid-checkout unannounced — it's routed
  // to /upgrade with the intent so the learner explicitly confirms the plan.
  redirect(plan ? `/upgrade?plan=${plan}` : "/");
}

export async function logoutAction(): Promise<void> {
  await clearSessionCookie();
  redirect("/login");
}
