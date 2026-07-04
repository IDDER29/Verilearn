/**
 * Server-side session helpers over the Next cookie store (Next 16: cookies() is async).
 * Reads the signed session cookie and resolves the current user; provides guards.
 */
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/store/db";
import type { User } from "@/lib/store/entities";
import { authenticate } from "./service";

export const SESSION_COOKIE = "vl_session";

/** Signing secret. In production this MUST come from env; a stable dev fallback keeps local runs working. */
export function sessionSecret(): string {
  return process.env.VERILEARN_SESSION_SECRET || "dev-only-insecure-secret-change-me";
}

export async function getCurrentUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return authenticate(getDb(), token, sessionSecret(), Date.now());
}

/** Route guard: return the user or redirect to /login. */
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function setSessionCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 30 * 86_400,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
