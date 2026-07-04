"use client";

import { useState } from "react";
import { banUserAction, unbanUserAction } from "@/app/admin-actions";
import type { AdminUserView } from "@/lib/services/moderation";

/**
 * Real, RBAC-gated ban/unban console (ADMIN-16) — the moderation counterpart
 * to the certificate admin console (ADMIN-15/22). A rejected attempt (e.g.
 * unbanning as the same reviewer who banned) surfaces the genuine
 * ModerationError message, never a silently-ignored click.
 */
export default function UsersAdmin({ initial }: { initial: AdminUserView[] }) {
  const [users, setUsers] = useState(initial);
  const [openReasonFor, setOpenReasonFor] = useState<string | null>(null);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [errorFor, setErrorFor] = useState<{ id: string; message: string } | null>(null);

  function startAction(userId: string) {
    setOpenReasonFor(userId);
    setReason("");
    setErrorFor(null);
  }

  function cancelAction() {
    setOpenReasonFor(null);
    setReason("");
  }

  async function confirmBan(userId: string) {
    setBusy(true);
    const r = await banUserAction(userId, reason);
    setBusy(false);
    if (r.ok) {
      setUsers((us) => us.map((u) => (u.id === userId ? { ...u, banned: true, bannedReason: reason } : u)));
      cancelAction();
    } else {
      setErrorFor({ id: userId, message: r.error ?? "Couldn't ban." });
    }
  }

  async function confirmUnban(userId: string) {
    setBusy(true);
    const r = await unbanUserAction(userId, reason);
    setBusy(false);
    if (r.ok) {
      setUsers((us) => us.map((u) => (u.id === userId ? { ...u, banned: false } : u)));
      cancelAction();
    } else {
      setErrorFor({ id: userId, message: r.error ?? "Couldn't unban." });
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {users.map((u) => (
        <div key={u.id} style={{ background: "#fff", borderRadius: 16, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>{u.displayName}</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>
                {u.email} · {u.role}
              </div>
            </div>
            <span
              style={{
                font: "800 10.5px var(--font-nunito)",
                color: u.banned ? "#c0392b" : "#0e8c6b",
                background: u.banned ? "#fbeceb" : "#e7f4ee",
                padding: "5px 11px",
                borderRadius: 9,
                whiteSpace: "nowrap",
              }}
            >
              {u.banned ? "Banned" : "Active"}
            </span>
          </div>

          {u.banned && u.bannedReason && <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 8 }}>Banned reason: {u.bannedReason}</div>}

          {openReasonFor === u.id ? (
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
                onClick={() => (u.banned ? confirmUnban(u.id) : confirmBan(u.id))}
                style={{ border: "none", background: u.banned ? "#0e8c6b" : "#c0392b", color: "#fff", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
              >
                {busy ? "Working…" : u.banned ? "Confirm unban" : "Confirm ban"}
              </button>
              <button type="button" onClick={cancelAction} disabled={busy} style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}>
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => startAction(u.id)}
              style={{ marginTop: 12, border: "1.5px solid #ece8f4", background: "#fbfafd", color: u.banned ? "#0e8c6b" : "#c0392b", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: "pointer" }}
            >
              {u.banned ? "Unban…" : "Ban…"}
            </button>
          )}

          {errorFor?.id === u.id && <div style={{ font: "700 11.5px var(--font-nunito)", color: "#c0392b", marginTop: 8 }}>{errorFor.message}</div>}
        </div>
      ))}
    </div>
  );
}
