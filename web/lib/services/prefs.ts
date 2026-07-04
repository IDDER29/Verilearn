/**
 * Preferences service. Learner settings for active-listening, review/FSRS, and
 * privacy. CRITICAL (SETTINGS-08 / invariant I1): these apply to FUTURE lectures
 * and sessions only — they never mutate the trust ledger or any past verification.
 */
import { getDb } from "@/lib/store/db";
import type { UserPrefs } from "@/lib/store/entities";

export function getPrefs(userId: string): UserPrefs | null {
  return getDb().users.get(userId)?.prefs ?? null;
}

type Section = keyof UserPrefs;

/** Patch one section of a user's prefs (shallow-merges the given keys). */
export function updatePrefs<S extends Section>(userId: string, section: S, patch: Partial<UserPrefs[S]>): UserPrefs | null {
  const user = getDb().users.get(userId);
  if (!user) return null;
  user.prefs = { ...user.prefs, [section]: { ...user.prefs[section], ...patch } };
  return user.prefs;
}
