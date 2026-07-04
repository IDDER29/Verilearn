"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import {
  resetReviewHistoryAction,
  resetGapMapAction,
  deleteAllTopicsAction,
  deleteAccountAction,
} from "@/app/danger-actions";

export default function SettingsDangerPage() {
  // Per-reset transient status so we can show a brief "Done" affordance.
  const [busy, setBusy] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function run(key: string, action: () => Promise<{ ok: boolean }>) {
    if (busy) return;
    setBusy(key);
    setDone(null);
    await action();
    setBusy(null);
    setDone(key);
    setTimeout(() => setDone((d) => (d === key ? null : d)), 2200);
  }

  function label(key: string, idle: string) {
    if (busy === key) return "Working…";
    if (done === key) return "Done ✓";
    return idle;
  }

  // Account deletion flow — gated on typing DELETE.
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canDelete = confirm.trim() === "DELETE";

  async function deleteAccount() {
    if (!canDelete || deleting) return;
    setError(null);
    setDeleting(true);
    // On success this redirects internally (throws NEXT_REDIRECT); we only reach
    // the lines below when it returns an error (e.g. confirm text mismatch).
    const res = await deleteAccountAction(confirm);
    if (res && !res.ok) {
      setError(res.error ?? "Could not delete account.");
      setDeleting(false);
    }
  }

  return (
    <AppShell active="settings">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "210px minmax(0,1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <SettingsNav active="danger" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#fbeceb", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l9 15.5H3z" />
                <path d="M12 10v4M12 17h.01" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)", color: "#c0392b" }}>Danger zone</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>Irreversible actions — proceed carefully</div>
            </div>
          </div>

          {/* reset review history */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Reset review history</div>
              <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699" }}>Clears your FSRS schedule &amp; ratings. Your topics &amp; lectures stay.</div>
            </div>
            <button
              type="button"
              disabled={busy === "history"}
              onClick={() => run("history", resetReviewHistoryAction)}
              style={{ border: "1.5px solid #f0d5c9", background: "#fff", color: "#b4690e", font: "800 12.5px var(--font-nunito)", padding: "11px 18px", borderRadius: 12, cursor: busy === "history" ? "default" : "pointer", whiteSpace: "nowrap" }}
            >
              {label("history", "Reset history")}
            </button>
          </div>

          {/* reset gap map */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Reset gap map</div>
              <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699" }}>Deletes all tracked gaps &amp; their discussion threads.</div>
            </div>
            <button
              type="button"
              disabled={busy === "gaps"}
              onClick={() => run("gaps", resetGapMapAction)}
              style={{ border: "1.5px solid #f0d5c9", background: "#fff", color: "#b4690e", font: "800 12.5px var(--font-nunito)", padding: "11px 18px", borderRadius: 12, cursor: busy === "gaps" ? "default" : "pointer", whiteSpace: "nowrap" }}
            >
              {label("gaps", "Reset gaps")}
            </button>
          </div>

          {/* delete all topics */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Delete all topics</div>
              <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699" }}>Permanently removes every topic, lecture &amp; claim ledger.</div>
            </div>
            <button
              type="button"
              disabled={busy === "topics"}
              onClick={() => run("topics", deleteAllTopicsAction)}
              style={{ border: "1.5px solid #f3d9d6", background: "#fff", color: "#c0392b", font: "800 12.5px var(--font-nunito)", padding: "11px 18px", borderRadius: 12, cursor: busy === "topics" ? "default" : "pointer", whiteSpace: "nowrap" }}
            >
              {label("topics", "Delete topics")}
            </button>
          </div>

          {/* delete account */}
          <div style={{ background: "#fdf2f1", border: "1.5px solid #f3d9d6", borderRadius: 20, padding: "22px 24px" }}>
            <div style={{ font: "900 15px var(--font-nunito)", color: "#c0392b", marginBottom: 6 }}>Delete account</div>
            <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#8a5a56", marginBottom: 16 }}>
              This permanently deletes your account and everything in it. This cannot be undone. Type <b>DELETE</b> to confirm.
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <input
                type="text"
                placeholder="Type DELETE"
                value={confirm}
                onChange={(e) => {
                  setConfirm(e.target.value);
                  if (error) setError(null);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") deleteAccount();
                }}
                style={{ flex: 1, boxSizing: "border-box", font: "700 14px var(--font-nunito)", padding: "12px 14px", border: "1.5px solid #f0c8c2", borderRadius: 12, background: "#fff" }}
              />
              <button
                type="button"
                disabled={!canDelete || deleting}
                onClick={deleteAccount}
                style={{ border: "none", background: "#c0392b", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "12px 22px", borderRadius: 12, cursor: canDelete && !deleting ? "pointer" : "not-allowed", whiteSpace: "nowrap", opacity: canDelete && !deleting ? 1 : 0.55 }}
              >
                {deleting ? "Deleting…" : "Delete my account"}
              </button>
            </div>
            {error && (
              <div style={{ font: "700 12px var(--font-nunito)", color: "#c0392b", marginTop: 10 }}>{error}</div>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
