"use client";

import { useState } from "react";
import { decideAppealAction } from "@/app/admin-actions";
import type { AdminAppealView } from "@/lib/services/appeals";

/**
 * Real, RBAC-gated ban-appeal console (AUTH-18) — decisions call the exact
 * same reviewer-gated `unbanUser` domain function the ban/unban console does
 * (ADMIN-16), so a reviewer can't approve their own ban's appeal either. Shown
 * only when there's at least one appeal on record — most of the time there's
 * nothing here, and that's the honest default.
 */
export default function AppealsAdmin({ initial }: { initial: AdminAppealView[] }) {
  const [appeals, setAppeals] = useState(initial);
  const [openReasonFor, setOpenReasonFor] = useState<string | null>(null);
  const [decision, setDecision] = useState<"approve" | "deny" | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  function start(appealId: string, d: "approve" | "deny") {
    setOpenReasonFor(appealId);
    setDecision(d);
    setReason("");
    setErrorFor(null);
  }

  function cancel() {
    setOpenReasonFor(null);
    setDecision(null);
    setReason("");
  }

  async function confirm(appealId: string) {
    if (!decision) return;
    setBusy(true);
    const r = await decideAppealAction(appealId, decision === "approve", reason);
    setBusy(false);
    if (r.ok) {
      setAppeals((as) => as.map((a) => (a.id === appealId ? { ...a, status: decision === "approve" ? "approved" : "denied" } : a)));
      cancel();
    } else {
      setErrorFor({ id: appealId, message: r.error ?? "Couldn't decide this appeal." });
    }
  }

  const pending = appeals.filter((a) => a.status === "pending");
  const decided = appeals.filter((a) => a.status !== "pending");

  if (appeals.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 22 }}>
      <div style={{ font: "900 15px var(--font-nunito)" }}>Ban appeals</div>
      {[...pending, ...decided].map((a) => (
        <div key={a.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>{a.userDisplayName}</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>{a.userEmail}</div>
            </div>
            <span
              style={{
                font: "800 10.5px var(--font-nunito)",
                color: a.status === "pending" ? "#b4830f" : a.status === "approved" ? "#0e8c6b" : "#c0392b",
                background: a.status === "pending" ? "#fbefdd" : a.status === "approved" ? "#e7f4ee" : "#fbeceb",
                padding: "5px 11px",
                borderRadius: 9,
                whiteSpace: "nowrap",
              }}
            >
              {a.status === "pending" ? "Pending" : a.status === "approved" ? "Approved" : "Denied"}
            </span>
          </div>

          <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#4a4560", marginTop: 8 }}>&quot;{a.message}&quot;</div>

          {a.status !== "pending" && a.decisionReason && (
            <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 8 }}>Decision: {a.decisionReason}</div>
          )}

          {a.status === "pending" && (
            openReasonFor === a.id ? (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Reason (required)"
                  aria-label="Reason"
                  style={{ flex: 1, border: "1.5px solid #ece8f4", borderRadius: 10, padding: "8px 11px", font: "600 12.5px var(--font-nunito)" }}
                />
                <button
                  type="button"
                  disabled={busy || !reason.trim()}
                  onClick={() => confirm(a.id)}
                  style={{ border: "none", background: decision === "approve" ? "#0e8c6b" : "#c0392b", color: "#fff", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
                >
                  {busy ? "Working…" : decision === "approve" ? "Confirm approve" : "Confirm deny"}
                </button>
                <button type="button" onClick={cancel} disabled={busy} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}>
                  Cancel
                </button>
              </div>
            ) : (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <button type="button" onClick={() => start(a.id, "approve")} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#0e8c6b", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>
                  Approve — unban…
                </button>
                <button type="button" onClick={() => start(a.id, "deny")} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#c0392b", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}>
                  Deny…
                </button>
              </div>
            )
          )}

          {errorFor?.id === a.id && <div style={{ font: "700 11.5px var(--font-nunito)", color: "#c0392b", marginTop: 8 }}>{errorFor.message}</div>}
        </div>
      ))}
    </div>
  );
}
