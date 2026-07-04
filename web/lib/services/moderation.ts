/**
 * User moderation service (ADMIN-16): RBAC-gated ban/unban wired to the real
 * domain logic (`lib/domain/moderation.ts`) and the live user store — the
 * same `can()`-gated shape as the certificate admin console
 * (`lib/services/certificates.ts`).
 */
import { banUser, ModerationError, unbanUser } from "@/lib/domain/moderation";
import { can, type Role } from "@/lib/domain/rbac";
import { getDb } from "@/lib/store/db";
import { recordAudit } from "./audit";

export interface AdminUserView {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  banned: boolean;
  bannedReason?: string;
  bannedAt?: number;
  bannedBy?: string;
}

/** Every user, newest first — the moderation console's read model. */
export function listAllUsersForAdmin(): AdminUserView[] {
  return [...getDb().users.values()]
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((u) => ({ id: u.id, email: u.email, displayName: u.displayName, role: u.role, banned: !!u.banned, bannedReason: u.bannedReason, bannedAt: u.bannedAt, bannedBy: u.bannedBy }));
}

export interface AdminModerationResult {
  ok: boolean;
  error?: string;
}

/** Ban a user (ADMIN-16). RBAC-gated: only a `user:ban`-holding role may act. */
export function banUserForAdmin(actorId: string, actorRole: Role, targetUserId: string, reason: string, now: number): AdminModerationResult {
  if (!can(actorRole, "user:ban")) return { ok: false, error: "You don't have permission to ban accounts." };
  if (targetUserId === actorId) return { ok: false, error: "You can't ban your own account." };
  const db = getDb();
  const target = db.users.get(targetUserId);
  if (!target) return { ok: false, error: "Account not found." };
  try {
    db.users.set(targetUserId, banUser(target, reason, now, actorId));
    // A ban takes effect immediately — end every live session, not just future sign-ins.
    for (const [token, s] of db.sessions) if (s.userId === targetUserId) db.sessions.delete(token);
    recordAudit({ actorId, actorRole, action: "user_ban", targetType: "user", targetId: targetUserId, reason: reason.trim(), before: { banned: false }, after: { banned: true }, now });
    return { ok: true };
  } catch (e) {
    if (e instanceof ModerationError) return { ok: false, error: e.message };
    throw e;
  }
}

/** Unban a user — the second-approval half (ADMIN-16): refuses a reviewer who is the same actor that banned it. */
export function unbanUserForAdmin(actorId: string, actorRole: Role, targetUserId: string, reason: string, now: number): AdminModerationResult {
  if (!can(actorRole, "user:ban")) return { ok: false, error: "You don't have permission to unban accounts." };
  const db = getDb();
  const target = db.users.get(targetUserId);
  if (!target) return { ok: false, error: "Account not found." };
  try {
    db.users.set(targetUserId, unbanUser(target, actorId, reason, now));
    recordAudit({ actorId, actorRole, action: "user_unban", targetType: "user", targetId: targetUserId, reason: reason.trim(), before: { banned: true }, after: { banned: false }, now });
    return { ok: true };
  } catch (e) {
    if (e instanceof ModerationError) return { ok: false, error: e.message };
    throw e;
  }
}
