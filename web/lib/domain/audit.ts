/**
 * Central audit log (ADMIN-20): a single, append-only, queryable record of
 * every privileged action across the trust-&-safety/admin surfaces
 * (certificate revoke/reinstate, ban/unban, quarantine/clear). Before this,
 * each action left only its own scattered trace on its own record
 * (`revokedBy`, `bannedBy`, `quarantinedBy`, ...) with no cross-cutting view
 * an auditor could query by actor, target, or action type.
 *
 * Pure & deterministic: entries are caller-supplied (id/timestamp) — no
 * Date.now/randomUUID in this module. `appendAuditEntry` validates before
 * accepting a write so a malformed entry can never silently leave a hole in
 * the trail (the "fail-closed if the sink can't accept a write" guarantee,
 * scoped to what this in-memory store can actually enforce).
 *
 * Traces to PRD domain 36 (Platform Admin, Moderation & T&S) / ADMIN-20.
 */

export type AuditActionType = "cert_revoke" | "cert_reinstate" | "user_ban" | "user_unban" | "claim_quarantine" | "claim_unquarantine";

export type AuditTargetType = "certificate" | "user" | "claim";

export interface AuditLogEntry {
  readonly id: string;
  readonly at: number;
  readonly actorId: string;
  readonly actorRole: string;
  readonly action: AuditActionType;
  readonly targetType: AuditTargetType;
  readonly targetId: string;
  readonly reason: string;
  /** A small before/after snapshot of just the fields this action changed — not the whole record. */
  readonly before: Readonly<Record<string, unknown>>;
  readonly after: Readonly<Record<string, unknown>>;
  /** The actor's display name and a human-readable label for the target, snapshotted at write time so the trail keeps naming who/what even after the actor or target is later deleted. */
  readonly actorName?: string;
  readonly targetLabel?: string;
}

export class AuditLogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuditLogError";
  }
}

/**
 * Append one entry to an append-only log (no update/delete is exposed by this
 * module at all — the only mutation the audit trail supports is "add a new
 * entry"). Throws {@link AuditLogError} on a malformed entry rather than
 * silently accepting a gap.
 */
export function appendAuditEntry(log: AuditLogEntry[], entry: AuditLogEntry): void {
  if (!entry.id || !entry.actorId || !entry.actorRole || !entry.targetId || !entry.reason.trim()) {
    throw new AuditLogError("Refusing to record a malformed audit entry — the trail must stay complete.");
  }
  log.push(entry);
}

export interface AuditQuery {
  actorId?: string;
  targetId?: string;
  targetType?: AuditTargetType;
  action?: AuditActionType;
}

/** Query the log, newest first. A pure filter over whatever entries are passed in — no store access here. */
export function queryAuditLog(log: readonly AuditLogEntry[], query: AuditQuery = {}): AuditLogEntry[] {
  return log
    .filter((e) => (query.actorId ? e.actorId === query.actorId : true))
    .filter((e) => (query.targetId ? e.targetId === query.targetId : true))
    .filter((e) => (query.targetType ? e.targetType === query.targetType : true))
    .filter((e) => (query.action ? e.action === query.action : true))
    .slice()
    .sort((a, b) => b.at - a.at);
}
