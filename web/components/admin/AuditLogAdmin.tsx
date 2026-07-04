"use client";

import { useState, useTransition } from "react";
import { listAdminAuditAction } from "@/app/admin-actions";
import type { AdminAuditView } from "@/lib/services/audit";
import type { AuditActionType, AuditTargetType } from "@/lib/domain/audit";

const ACTION_LABEL: Record<AuditActionType, string> = {
  cert_revoke: "Certificate revoked",
  cert_reinstate: "Certificate reinstated",
  user_ban: "Account banned",
  user_unban: "Account unbanned",
  claim_quarantine: "Claim quarantined",
  claim_unquarantine: "Quarantine cleared",
};

const ACTION_TONE: Record<AuditActionType, { color: string; bg: string }> = {
  cert_revoke: { color: "#c0392b", bg: "#fbeceb" },
  cert_reinstate: { color: "#0e8c6b", bg: "#e7f4ee" },
  user_ban: { color: "#c0392b", bg: "#fbeceb" },
  user_unban: { color: "#0e8c6b", bg: "#e7f4ee" },
  claim_quarantine: { color: "#b4460f", bg: "#fdeee1" },
  claim_unquarantine: { color: "#0e8c6b", bg: "#e7f4ee" },
};

const TARGET_TYPES: { value: AuditTargetType | ""; label: string }[] = [
  { value: "", label: "All targets" },
  { value: "certificate", label: "Certificates" },
  { value: "user", label: "Accounts" },
  { value: "claim", label: "Claims" },
];

const ACTIONS: { value: AuditActionType | ""; label: string }[] = [
  { value: "", label: "All actions" },
  ...(Object.keys(ACTION_LABEL) as AuditActionType[]).map((a) => ({ value: a, label: ACTION_LABEL[a] })),
];

/**
 * Real, RBAC-gated central audit console (ADMIN-20) — the one place a
 * `trust_safety_lead`/`platform_admin`/`compliance_dpo` can see every
 * privileged action (certificate revoke/reinstate, ban/unban,
 * quarantine/clear) side by side, queryable by target type and action.
 * Read-only by design: this console has no action buttons of its own — it's
 * the trail left BY the other three consoles, not another surface that
 * writes to the ledger or firewall.
 */
export default function AuditLogAdmin({ initial }: { initial: AdminAuditView[] }) {
  const [entries, setEntries] = useState(initial);
  const [targetType, setTargetType] = useState<AuditTargetType | "">("");
  const [action, setAction] = useState<AuditActionType | "">("");
  const [actorId, setActorId] = useState("");
  const [pending, startTransition] = useTransition();

  function refetch(next: { targetType?: AuditTargetType | ""; action?: AuditActionType | ""; actorId?: string }) {
    const q = {
      targetType: next.targetType ?? targetType,
      action: next.action ?? action,
      actorId: (next.actorId ?? actorId).trim() || undefined,
    };
    startTransition(async () => {
      const rows = await listAdminAuditAction({
        targetType: q.targetType || undefined,
        action: q.action || undefined,
        actorId: q.actorId,
      });
      setEntries(rows);
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <select
          aria-label="Filter by target type"
          value={targetType}
          onChange={(e) => {
            const v = e.target.value as AuditTargetType | "";
            setTargetType(v);
            refetch({ targetType: v });
          }}
          style={{ border: "1.5px solid #ece8f4", borderRadius: 10, padding: "8px 11px", font: "600 12.5px var(--font-nunito)" }}
        >
          {TARGET_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
        <select
          aria-label="Filter by action"
          value={action}
          onChange={(e) => {
            const v = e.target.value as AuditActionType | "";
            setAction(v);
            refetch({ action: v });
          }}
          style={{ border: "1.5px solid #ece8f4", borderRadius: 10, padding: "8px 11px", font: "600 12.5px var(--font-nunito)" }}
        >
          {ACTIONS.map((a) => (
            <option key={a.value} value={a.value}>
              {a.label}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={actorId}
          onChange={(e) => setActorId(e.target.value)}
          onBlur={() => refetch({})}
          placeholder="Filter by actor id…"
          aria-label="Filter by actor id"
          style={{ border: "1.5px solid #ece8f4", borderRadius: 10, padding: "8px 11px", font: "600 12.5px var(--font-nunito)", flex: 1, minWidth: 160 }}
        />
      </div>

      {pending && <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Loading…</div>}

      {entries.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 16, padding: "18px 20px", font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>
          No privileged actions match this filter.
        </div>
      ) : (
        entries.map((e) => {
          const tone = ACTION_TONE[e.action];
          return (
            <div key={e.id} style={{ background: "#fff", borderRadius: 16, padding: "14px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <span style={{ font: "800 10.5px var(--font-nunito)", color: tone.color, background: tone.bg, padding: "4px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                  {ACTION_LABEL[e.action]}
                </span>
                <span style={{ font: "600 11px var(--font-nunito)", color: "#8b8699", whiteSpace: "nowrap" }}>{new Date(e.at).toLocaleString()}</span>
              </div>
              <div style={{ font: "700 13px/1.4 var(--font-nunito)", marginTop: 8 }}>{e.targetLabel}</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 4 }}>
                {e.actorName} ({e.actorRole}) · {e.reason}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
