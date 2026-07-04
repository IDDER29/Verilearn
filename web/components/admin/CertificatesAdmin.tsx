"use client";

import { useState } from "react";
import { reinstateCertificateAction, revokeCertificateAction } from "@/app/admin-actions";
import type { AdminCertificateView } from "@/lib/services/certificates";

/**
 * The first real, RBAC-gated admin console screen in the app (ADMIN-15/22).
 * Revoke/reinstate call the actual domain functions through a real
 * `cert:revoke` permission check — a rejected attempt (e.g. reinstating as
 * the same reviewer who revoked it) surfaces the genuine `ReinstateError`
 * message, never a silently-ignored click.
 */
export default function CertificatesAdmin({ initial }: { initial: AdminCertificateView[] }) {
  const [certs, setCerts] = useState(initial);
  const [openReasonFor, setOpenReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  function startAction(certId: string) {
    setOpenReasonFor(certId);
    setReason("");
    setErrorFor(null);
  }

  function cancelAction() {
    setOpenReasonFor(null);
    setReason("");
  }

  async function confirmRevoke(certId: string) {
    setBusy(true);
    const r = await revokeCertificateAction(certId, reason);
    setBusy(false);
    if (r.ok) {
      setCerts((cs) => cs.map((c) => (c.id === certId ? { ...c, revoked: true, revokedReason: reason, revokedAt: Date.now() } : c)));
      cancelAction();
    } else {
      setErrorFor({ id: certId, message: r.error ?? "Couldn't revoke." });
    }
  }

  async function confirmReinstate(certId: string) {
    setBusy(true);
    const r = await reinstateCertificateAction(certId, reason);
    setBusy(false);
    if (r.ok) {
      setCerts((cs) => cs.map((c) => (c.id === certId ? { ...c, revoked: false } : c)));
      cancelAction();
    } else {
      setErrorFor({ id: certId, message: r.error ?? "Couldn't reinstate." });
    }
  }

  if (certs.length === 0) {
    return <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699" }}>No certificates have been issued yet.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {certs.map((c) => (
        <div key={c.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>{c.topicTitle}</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>
                {c.learnerName} · {c.testScorePct}% · {c.verifyCode}
              </div>
            </div>
            <span
              style={{
                font: "800 10.5px var(--font-nunito)",
                color: c.revoked ? "#c0392b" : "#0e8c6b",
                background: c.revoked ? "#fbeceb" : "#e7f4ee",
                padding: "5px 11px",
                borderRadius: 9,
                whiteSpace: "nowrap",
              }}
            >
              {c.revoked ? "Revoked" : "Valid"}
            </span>
          </div>

          {c.revoked && c.revokedReason && (
            <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 8 }}>Revoked reason: {c.revokedReason}</div>
          )}

          {openReasonFor === c.id ? (
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
                onClick={() => (c.revoked ? confirmReinstate(c.id) : confirmRevoke(c.id))}
                style={{ border: "none", background: c.revoked ? "#0e8c6b" : "#c0392b", color: "#fff", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
              >
                {busy ? "Working…" : c.revoked ? "Confirm reinstate" : "Confirm revoke"}
              </button>
              <button type="button" onClick={cancelAction} disabled={busy} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startAction(c.id)}
              style={{ marginTop: 12, border: "1.5px solid #ece8f4", background: "#fbfafd", color: c.revoked ? "#0e8c6b" : "#c0392b", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}
            >
              {c.revoked ? "Reinstate…" : "Revoke…"}
            </button>
          )}

          {errorFor?.id === c.id && <div style={{ font: "700 11.5px var(--font-nunito)", color: "#c0392b", marginTop: 8 }}>{errorFor.message}</div>}
        </div>
      ))}
    </div>
  );
}
