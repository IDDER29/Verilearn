"use client";

import { useState } from "react";
import { quarantineClaimAction, unquarantineClaimAction } from "@/app/admin-actions";
import { TRUST_LABEL } from "@/lib/domain/types";
import type { AdminClaimView } from "@/lib/services/quarantine";

const STATE_COLOR: Record<string, { color: string; bg: string }> = {
  verified_execution: { color: "#0e8c6b", bg: "#e7f4ee" },
  verified_source: { color: "#2d6cdf", bg: "#e7effb" },
  sourced: { color: "#2d6cdf", bg: "#e7effb" },
  disputed: { color: "#c0392b", bg: "#fbeceb" },
  unsupported: { color: "#c0392b", bg: "#fbeceb" },
  interpretive: { color: "#6d5bd0", bg: "#efe9ff" },
};

/**
 * Real, RBAC-gated claim quarantine console (ADMIN-14) — an admin override
 * layered on the trust ledger. Quarantining/clearing never touches the
 * claim's own ledger-derived state (shown alongside, untouched); it only
 * flips whether Tests/Review will hold the claim out.
 */
export default function QuarantineAdmin({ initial }: { initial: AdminClaimView[] }) {
  const [claims, setClaims] = useState(initial);
  const [openReasonFor, setOpenReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  function startAction(claimId: string) {
    setOpenReasonFor(claimId);
    setReason("");
    setErrorFor(null);
  }

  function cancelAction() {
    setOpenReasonFor(null);
    setReason("");
  }

  async function confirmQuarantine(c: AdminClaimView) {
    setBusy(true);
    const r = await quarantineClaimAction(c.claimId, c.topicId, reason);
    setBusy(false);
    if (r.ok) {
      setClaims((cs) => cs.map((x) => (x.claimId === c.claimId ? { ...x, quarantined: true } : x)));
      cancelAction();
    } else {
      setErrorFor({ id: c.claimId, message: r.error ?? "Couldn't quarantine." });
    }
  }

  async function confirmClear(claimId: string) {
    setBusy(true);
    const r = await unquarantineClaimAction(claimId);
    setBusy(false);
    if (r.ok) {
      setClaims((cs) => cs.map((x) => (x.claimId === claimId ? { ...x, quarantined: false } : x)));
      cancelAction();
    } else {
      setErrorFor({ id: claimId, message: r.error ?? "Couldn't clear." });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {claims.map((c) => {
        const tone = STATE_COLOR[c.state] ?? { color: "#6c6780", bg: "#f2f0f6" };
        const label = TRUST_LABEL[c.state];
        return (
          <div key={c.claimId} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "700 13px/1.4 var(--font-nunito)" }}>{c.claimText}</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 4 }}>{c.topicTitle}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <span style={{ font: "800 10.5px var(--font-nunito)", color: tone.color, background: tone.bg, padding: "4px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                  {label.glyph} {label.label}
                </span>
                {c.quarantined && (
                  <span style={{ font: "800 10.5px var(--font-nunito)", color: "#b4460f", background: "#fdeee1", padding: "4px 10px", borderRadius: 8, whiteSpace: "nowrap" }}>
                    🔒 Quarantined
                  </span>
                )}
              </div>
            </div>

            {openReasonFor === c.claimId ? (
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                {!c.quarantined && (
                  <input
                    type="text"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason (required)"
                    aria-label="Reason"
                    style={{ flex: 1, border: "1.5px solid #ece8f4", borderRadius: 10, padding: "8px 11px", font: "600 12.5px var(--font-nunito)" }}
                  />
                )}
                <button
                  type="button"
                  disabled={busy || (!c.quarantined && !reason.trim())}
                  onClick={() => (c.quarantined ? confirmClear(c.claimId) : confirmQuarantine(c))}
                  style={{ border: "none", background: c.quarantined ? "#0e8c6b" : "#b4460f", color: "#fff", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
                >
                  {busy ? "Working…" : c.quarantined ? "Confirm clear" : "Confirm quarantine"}
                </button>
                <button type="button" onClick={cancelAction} disabled={busy} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}>
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => startAction(c.claimId)}
                style={{ marginTop: 12, border: "1.5px solid #ece8f4", background: "#fbfafd", color: c.quarantined ? "#0e8c6b" : "#b4460f", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}
              >
                {c.quarantined ? "Clear quarantine…" : "Quarantine…"}
              </button>
            )}

            {errorFor?.id === c.claimId && <div style={{ font: "700 11.5px var(--font-nunito)", color: "#c0392b", marginTop: 8 }}>{errorFor.message}</div>}
          </div>
        );
      })}
    </div>
  );
}
