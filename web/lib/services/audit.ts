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

function resolveActorName(db: ReturnType<typeof getDb>, actorId: string): string {
  return db.users.get(actorId)?.displayName ?? actorId;
}

function resolveTargetLabel(db: ReturnType<typeof getDb>, targetType: AuditTargetType, targetId: string): string {
  if (targetType === "certificate") return db.certificates.get(targetId)?.verifyCode ?? targetId;
  if (targetType === "user") return db.users.get(targetId)?.displayName ?? targetId;
  for (const topic of db.topics.values()) {
    const claim = topic.claims.find((c) => c.id === targetId);
    if (claim) return claim.text;
  }
  return targetId;
}

/**
 * Append one entry for a just-succeeded privileged action. Never called for a
 * rejected/no-op attempt. `actorName`/`targetLabel` are resolved and
 * snapshotted here, at write time, so the trail keeps naming who did what to
 * what even after the actor or target is later deleted (account erasure, bulk
 * topic delete) — every target type here is genuinely deletable.
 */
export function recordAudit(p: RecordAuditParams): void {
  const db = getDb();
  appendAuditEntry(db.auditLog, {
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
    actorName: resolveActorName(db, p.actorId),
    targetLabel: resolveTargetLabel(db, p.targetType, p.targetId),
  });
}

export interface AdminAuditView extends AuditLogEntry {
  actorName: string;
  targetLabel: string;
}

/**
 * The audit console's read model. RBAC-gated on `audit:read` — a role
 * without it gets an empty list, never a peek at the data (the same honest
 * no-access shape as the other admin consoles). Prefers the actor/target
 * labels snapshotted at write time, falling back to a live lookup only for a
 * hypothetical pre-snapshot entry.
 */
export function listAuditLogForAdmin(actorRole: Role, query: AuditQuery = {}): AdminAuditView[] {
  if (!can(actorRole, "audit:read")) return [];
  const db = getDb();
  return queryAuditLog(db.auditLog, query).map((e) => ({
    ...e,
    actorName: e.actorName ?? resolveActorName(db, e.actorId),
    targetLabel: e.targetLabel ?? resolveTargetLabel(db, e.targetType, e.targetId),
  }));
}
