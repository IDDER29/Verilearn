/**
 * Ban appeal lifecycle (AUTH-18): the real path back in for a banned learner
 * who can't sign in to reach any authenticated action. Mirrors the same
 * reviewer-accountable shape as ban/unban itself (`lib/domain/moderation.ts`):
 * a decision records who and why, and a decided appeal's history is kept, not
 * erased. Pure & deterministic — no Date.now/randomUUID; timestamps and ids
 * arrive as parameters.
 *
 * Traces to PRD domain 20 (Auth/Identity) / AUTH-18.
 */

export type AppealStatus = "pending" | "approved" | "denied";

export interface Appeal {
  readonly id: string;
  readonly userId: string;
  readonly message: string;
  readonly submittedAt: number;
  readonly status: AppealStatus;
  readonly decidedBy?: string;
  readonly decidedAt?: number;
  readonly decisionReason?: string;
}

export class AppealError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AppealError";
  }
}

/** Submit a new appeal. Requires a non-empty message explaining the ask. */
export function submitAppeal(id: string, userId: string, message: string, now: number): Appeal {
  if (!message.trim()) throw new AppealError("Explain why this ban should be reconsidered.");
  return { id, userId, message: message.trim(), submittedAt: now, status: "pending" };
}

/**
 * Decide a pending appeal. Refuses to re-decide an already-decided one (the
 * decision, once made, is history — not reversible by calling this again) and
 * requires a non-empty reason either way, approve or deny.
 */
export function decideAppeal(appeal: Appeal, approve: boolean, reviewerId: string, reason: string, now: number): Appeal {
  if (appeal.status !== "pending") throw new AppealError("This appeal has already been decided.");
  if (!reason.trim()) throw new AppealError("A reason is required to decide an appeal.");
  return { ...appeal, status: approve ? "approved" : "denied", decidedBy: reviewerId, decidedAt: now, decisionReason: reason.trim() };
}
