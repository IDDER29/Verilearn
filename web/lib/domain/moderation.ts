/**
 * User moderation — ban/unban (ADMIN-16). Mirrors the same append-only,
 * reviewer-accountable shape as certificate revoke/reinstate
 * (`lib/domain/certificates.ts`): a ban records who and why, an unban is a
 * distinct reviewer's call, and the prior ban is kept as history rather than
 * erased. Pure & deterministic — no Date.now/Math.random; timestamps and ids
 * arrive as parameters.
 *
 * Traces to PRD domain 33 (Platform Admin, Moderation & T&S).
 *  - ADMIN-16: `user:ban` is a T&S-only permission (`rbac.ts`); this module is
 *    the actual ban/unban mechanism the permission gates.
 */

/** The subset of `User` this module reads/writes — kept narrow so it has no store dependency. */
export interface Bannable {
  banned?: boolean;
  bannedReason?: string;
  bannedAt?: number;
  bannedBy?: string;
  unbannedAt?: number;
  unbannedBy?: string;
  unbannedReason?: string;
}

/** Thrown when a ban/unban attempt violates an ADMIN-16 guarantee. */
export class ModerationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModerationError";
  }
}

/** Ban an account. Requires a non-empty reason; refuses to double-ban an already-banned account. */
export function banUser<T extends Bannable>(user: T, reason: string, now: number, actorId: string): T {
  if (user.banned) throw new ModerationError("This account is already banned.");
  if (!reason.trim()) throw new ModerationError("A reason is required to ban an account.");
  return { ...user, banned: true, bannedReason: reason.trim(), bannedAt: now, bannedBy: actorId };
}

/**
 * Unban an account (the second-approval half, ADMIN-16). Requires:
 *  - the account is actually banned;
 *  - a non-empty reason;
 *  - a reviewer DISTINCT from whoever banned it — the same reviewer-other-
 *    than-actor gate `reinstateCertificate` uses, so a ban can never be
 *    quietly self-reversed by the same actor.
 * The prior ban fields are kept as history, not erased.
 */
export function unbanUser<T extends Bannable>(user: T, reviewerId: string, reason: string, now: number): T {
  if (!user.banned) throw new ModerationError("This account isn't banned — nothing to unban.");
  if (!reason.trim()) throw new ModerationError("A reason is required to unban an account.");
  if (user.bannedBy && reviewerId === user.bannedBy) {
    throw new ModerationError("The reviewer unbanning an account must be someone other than whoever banned it.");
  }
  return { ...user, banned: false, unbannedAt: now, unbannedBy: reviewerId, unbannedReason: reason.trim() };
}
