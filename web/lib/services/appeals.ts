/**
 * Ban appeal service (AUTH-18): wires the pure `lib/domain/appeal.ts` lifecycle
 * to the live store, RBAC, and the real ban/unban engine. `submitAppealForBannedUser`
 * is the only genuinely unauthenticated entry point in this app that mutates
 * state for a specific account — necessary because a banned account fails
 * `authenticate()`/`signIn()` and so can never reach an authenticated action.
 * `decideAppealForAdmin` approves through the SAME `unbanUser` domain function
 * the `/admin/users` console uses, so the reviewer-other-than-whoever-banned
 * gate (ADMIN-16) still applies — even to an appeal.
 */
import { AppealError, decideAppeal, submitAppeal, type AppealStatus } from "@/lib/domain/appeal";
import { ModerationError, unbanUser } from "@/lib/domain/moderation";
import { can, type Role } from "@/lib/domain/rbac";
import { getDb, userByEmail } from "@/lib/store/db";
import { newId } from "@/lib/ids";
import { recordAudit } from "./audit";

export interface SubmitAppealResult {
  ok: boolean;
  error?: string;
}

/**
 * Submit an appeal for a banned account, looked up by email since the caller
 * can't be signed in. Refuses an unknown email, a non-banned account (nothing
 * to appeal), or a second appeal while one is still pending.
 */
export function submitAppealForBannedUser(email: string, message: string, now: number): SubmitAppealResult {
  const db = getDb();
  const user = userByEmail(db, email);
  if (!user) return { ok: false, error: "No account found with that email." };
  if (!user.banned) return { ok: false, error: "This account isn't banned — nothing to appeal." };
  const hasPending = [...db.appeals.values()].some((a) => a.userId === user.id && a.status === "pending");
  if (hasPending) return { ok: false, error: "You already have an appeal awaiting review." };
  try {
    const appeal = submitAppeal(newId("appeal"), user.id, user.email, user.displayName, message, now);
    db.appeals.set(appeal.id, appeal);
    return { ok: true };
  } catch (e) {
    if (e instanceof AppealError) return { ok: false, error: e.message };
    throw e;
  }
}

export interface AdminAppealView {
  id: string;
  userId: string;
  userEmail: string;
  userDisplayName: string;
  message: string;
  submittedAt: number;
  status: AppealStatus;
  decidedBy?: string;
  decidedAt?: number;
  decisionReason?: string;
}

/** Every appeal, newest first — RBAC-gated on `user:ban`, the same permission that gates ban/unban itself. */
export function listAppealsForAdmin(actorRole: Role): AdminAppealView[] {
  if (!can(actorRole, "user:ban")) return [];
  const db = getDb();
  return [...db.appeals.values()]
    .sort((a, b) => b.submittedAt - a.submittedAt)
    .map((a) => {
      // Prefer the email/name snapshotted at submission — a decided appeal is
      // kept as moderation history (deleteAccountAction deliberately keeps
      // appeals alive), so it must keep naming who it was for even after the
      // account is renamed or erased. Fall back to a live lookup only for a
      // hypothetical pre-snapshot record.
      const u = db.users.get(a.userId);
      return { ...a, userEmail: a.userEmail ?? u?.email ?? "unknown", userDisplayName: a.userDisplayName ?? u?.displayName ?? "Unknown learner" };
    });
}

export interface AdminAppealResult {
  ok: boolean;
  error?: string;
}

/**
 * Decide a pending appeal (AUTH-18). RBAC-gated: only a `user:ban`-holding role
 * may act. Approving genuinely unbans the account through the real domain
 * `unbanUser` — the reviewer-other-than-whoever-banned rule (ADMIN-16) still
 * applies, so the same reviewer who banned someone can't approve their own
 * appeal either. Denying leaves the ban exactly as it was, decision recorded.
 */
export function decideAppealForAdmin(actorId: string, actorRole: Role, appealId: string, approve: boolean, reason: string, now: number): AdminAppealResult {
  if (!can(actorRole, "user:ban")) return { ok: false, error: "You don't have permission to decide appeals." };
  const db = getDb();
  const appeal = db.appeals.get(appealId);
  if (!appeal) return { ok: false, error: "Appeal not found." };
  try {
    const decided = decideAppeal(appeal, approve, actorId, reason, now);
    if (approve) {
      const user = db.users.get(appeal.userId);
      if (!user) return { ok: false, error: "The account this appeal is for no longer exists." };
      db.users.set(user.id, unbanUser(user, actorId, reason, now));
      recordAudit({ actorId, actorRole, action: "user_unban", targetType: "user", targetId: user.id, reason: reason.trim(), before: { banned: true }, after: { banned: false }, now });
    }
    db.appeals.set(appealId, decided);
    return { ok: true };
  } catch (e) {
    if (e instanceof AppealError || e instanceof ModerationError) return { ok: false, error: e.message };
    throw e;
  }
}
