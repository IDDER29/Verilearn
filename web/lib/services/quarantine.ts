/**
 * Claim quarantine (ADMIN-14): a T&S override layered on top of the trust
 * ledger, reusing the same test-exclusion bar (`isTestEligible`) tests and
 * review already gate on — a quarantined claim is held out of both exactly
 * like a disputed one, without touching its real ledger-derived trust state
 * at all. RBAC-gated on `integrity:quarantine`, the same shape as the
 * certificate (ADMIN-15/22) and ban (ADMIN-16) admin consoles this session.
 */
import { can, type Role } from "@/lib/domain/rbac";
import { getDb, ledgerFor } from "@/lib/store/db";
import type { TrustState } from "@/lib/domain/types";
import { recordAudit } from "./audit";

/** Whether a claim is currently quarantined — the single check every gated learner surface reuses. */
export function isQuarantined(claimId: string): boolean {
  return getDb().quarantinedClaims.has(claimId);
}

export interface AdminQuarantineView {
  claimId: string;
  topicId: string;
  topicTitle: string;
  claimText: string;
  reason: string;
  quarantinedAt: number;
  quarantinedBy: string;
}

/** Every currently-quarantined claim, newest first — the admin console's read model. */
export function listQuarantinedClaims(): AdminQuarantineView[] {
  const db = getDb();
  return [...db.quarantinedClaims.values()]
    .sort((a, b) => b.quarantinedAt - a.quarantinedAt)
    .map((q) => {
      const topic = db.topics.get(q.topicId);
      const claim = topic?.claims.find((c) => c.id === q.claimId);
      return { claimId: q.claimId, topicId: q.topicId, topicTitle: topic?.title ?? "Unknown topic", claimText: claim?.text ?? "Unknown claim", reason: q.reason, quarantinedAt: q.quarantinedAt, quarantinedBy: q.quarantinedBy };
    });
}

export interface AdminClaimView {
  claimId: string;
  topicId: string;
  topicTitle: string;
  claimText: string;
  state: TrustState;
  quarantined: boolean;
}

/** Every claim across every topic, with its real live ledger state — the browsable list the console quarantines *from*. */
export function listAllClaimsForAdmin(): AdminClaimView[] {
  const db = getDb();
  const rows: AdminClaimView[] = [];
  for (const topic of db.topics.values()) {
    const ledger = ledgerFor(topic);
    for (const c of topic.claims) {
      rows.push({ claimId: c.id, topicId: topic.id, topicTitle: topic.title, claimText: c.text, state: ledger.stateOf(c.id), quarantined: isQuarantined(c.id) });
    }
  }
  return rows;
}

export interface AdminQuarantineResult {
  ok: boolean;
  error?: string;
}

/** Quarantine a claim (ADMIN-14). RBAC-gated: only an `integrity:quarantine`-holding role may act. */
export function quarantineClaimForAdmin(actorId: string, actorRole: Role, claimId: string, topicId: string, reason: string, now: number): AdminQuarantineResult {
  if (!can(actorRole, "integrity:quarantine")) return { ok: false, error: "You don't have permission to quarantine claims." };
  if (!reason.trim()) return { ok: false, error: "A reason is required." };
  const db = getDb();
  if (!db.topics.get(topicId)?.claims.some((c) => c.id === claimId)) return { ok: false, error: "Claim not found." };
  if (db.quarantinedClaims.has(claimId)) return { ok: false, error: "This claim is already quarantined." };
  db.quarantinedClaims.set(claimId, { claimId, topicId, reason: reason.trim(), quarantinedAt: now, quarantinedBy: actorId });
  recordAudit({ actorId, actorRole, action: "claim_quarantine", targetType: "claim", targetId: claimId, reason: reason.trim(), before: { quarantined: false }, after: { quarantined: true }, now });
  return { ok: true };
}

/** Clear a claim's quarantine (ADMIN-14) — never touches the claim's real ledger-derived trust state. */
export function unquarantineClaimForAdmin(actorId: string, actorRole: Role, claimId: string, now: number): AdminQuarantineResult {
  if (!can(actorRole, "integrity:quarantine")) return { ok: false, error: "You don't have permission to clear a quarantine." };
  const db = getDb();
  if (!db.quarantinedClaims.has(claimId)) return { ok: false, error: "This claim isn't quarantined." };
  db.quarantinedClaims.delete(claimId);
  recordAudit({ actorId, actorRole, action: "claim_unquarantine", targetType: "claim", targetId: claimId, reason: "Quarantine cleared", before: { quarantined: true }, after: { quarantined: false }, now });
  return { ok: true };
}
