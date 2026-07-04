/**
 * Audit log service (ADMIN-20): wires the pure `lib/domain/audit.ts` log
 * to the live store and RBAC. `recordAudit` is called by every privileged
 * admin action (certificates.ts, moderation.ts, quarantine.ts) right after
 * its mutation succeeds; `listAuditLogForAdmin` is the RBAC-gated read model
 * behind the `/admin/audit` console — the one place an auditor can see
 * revoke/ban/quarantine actions side by side, queryable by actor/target/type.
 *
 * `audit:read` is broader than any single action permission on purpose:
 * `trust_safety_lead`, `platform_admin`, and `compliance_dpo` all hold it
 * (`rbac.ts`) because each needs visibility into the others' privileged
 * actions, even though only `trust_safety_lead` can actually perform most of
 * them.
 */
import { newId } from "@/lib/ids";
import { appendAuditEntry, queryAuditLog, type AuditActionType, type AuditLogEntry, type AuditQuery, type AuditTargetType } from "@/lib/domain/audit";
import { can, type Role } from "@/lib/domain/rbac";
import { getDb } from "@/lib/store/db";

export interface RecordAuditParams {
  actorId: string;
  actorRole: Role;
  action: AuditActionType;
  targetType: AuditTargetType;
  targetId: string;
  reason: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  now: number;
}

/** Append one entry for a just-succeeded privileged action. Never called for a rejected/no-op attempt. */
export function recordAudit(p: RecordAuditParams): void {
  appendAuditEntry(getDb().auditLog, {
    id: newId("audit"),
    at: p.now,
    actorId: p.actorId,
    actorRole: p.actorRole,
    action: p.action,
    targetType: p.targetType,
    targetId: p.targetId,
    reason: p.reason,
    before: p.before,
    after: p.after,
  });
}

export interface AdminAuditView extends AuditLogEntry {
  actorName: string;
  targetLabel: string;
}

function targetLabel(db: ReturnType<typeof getDb>, entry: AuditLogEntry): string {
  if (entry.targetType === "certificate") return db.certificates.get(entry.targetId)?.verifyCode ?? entry.targetId;
  if (entry.targetType === "user") return db.users.get(entry.targetId)?.displayName ?? entry.targetId;
  for (const topic of db.topics.values()) {
    const claim = topic.claims.find((c) => c.id === entry.targetId);
    if (claim) return claim.text;
  }
  return entry.targetId;
}

/**
 * The audit console's read model. RBAC-gated on `audit:read` — a role
 * without it gets an empty list, never a peek at the data (the same honest
 * no-access shape as the other admin consoles).
 */
export function listAuditLogForAdmin(actorRole: Role, query: AuditQuery = {}): AdminAuditView[] {
  if (!can(actorRole, "audit:read")) return [];
  const db = getDb();
  return queryAuditLog(db.auditLog, query).map((e) => ({
    ...e,
    actorName: db.users.get(e.actorId)?.displayName ?? e.actorId,
    targetLabel: targetLabel(db, e),
  }));
}
