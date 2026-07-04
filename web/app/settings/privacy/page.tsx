// SETTINGS/SEC — data-subject controls: analytics / community visibility / product
// emails are the privacy prefs the learner governs here. Bound to real prefs via
// getPrefsAction (load) + savePrivacyAction (per-toggle persist).
"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import { getPrefsAction, savePrivacyAction, saveNotificationPrefsAction } from "@/app/prefs-actions";
import { exportDataAction } from "@/app/export-actions";
import type { UserPrefs } from "@/lib/store/entities";

type Privacy = UserPrefs["privacy"];
type Notif = UserPrefs["notifications"];

const NOTIF_ROWS: { key: keyof Notif; label: string; desc: string }[] = [
  { key: "verification", label: "Topic verified & ready", desc: "When a topic finishes verifying" },
  { key: "conflict", label: "The Skeptic flags a claim", desc: "A new conflict to adjudicate" },
  { key: "review", label: "Reviews due", desc: "Spaced-review reminders" },
  { key: "test", label: "Test checkpoint ready", desc: "A topic has enough verified claims to test" },
];

function Toggle({ on, disabled, onClick }: { on: boolean; disabled?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onClick}
      style={{
        width: 46,
        height: 27,
        borderRadius: 14,
        background: on ? "#6d5bd0" : "#dcd7ea",
        position: "relative",
        flexShrink: 0,
        border: "none",
        padding: 0,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "background .15s",
      }}
    >
      <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, ...(on ? { right: 3 } : { left: 3 }) }} />
    </button>
  );
}

export default function SettingsPrivacyPage() {
  const [privacy, setPrivacy] = useState<Privacy | null>(null);
  const [notif, setNotif] = useState<Notif | null>(null);
  const [exporting, setExporting] = useState(false);
  const [exportErr, setExportErr] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    getPrefsAction().then((p) => {
      setPrivacy(p?.privacy ?? null);
      setNotif(p?.notifications ?? null);
    });
  }, []);

  const loaded = privacy !== null;

  // Optimistic update with real rollback-on-failure (SETTINGS-20): a save that
  // fails reverts the toggle instead of silently leaving a lie on screen.
  async function toggle(key: keyof Privacy) {
    if (!privacy) return;
    const prev = privacy;
    const next = { ...privacy, [key]: !privacy[key] };
    setPrivacy(next);
    const r = await savePrivacyAction({ [key]: next[key] });
    setStatus(r.ok ? "saved" : "error");
    if (!r.ok) setPrivacy(prev);
    setTimeout(() => setStatus("idle"), 1800);
  }

  async function toggleNotif(key: keyof Notif) {
    if (!notif) return;
    const prev = notif;
    const next = { ...notif, [key]: !notif[key] };
    setNotif(next);
    const r = await saveNotificationPrefsAction({ [key]: next[key] });
    setStatus(r.ok ? "saved" : "error");
    if (!r.ok) setNotif(prev);
    setTimeout(() => setStatus("idle"), 1800);
  }

  async function exportData() {
    setExporting(true);
    setExportErr(null);
    const r = await exportDataAction();
    setExporting(false);
    if (r.ok && r.json) {
      const blob = new Blob([r.json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "verilearn-export.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } else {
      setExportErr(r.error ?? "Export failed.");
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
        <SettingsNav active="privacy" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V8a4 4 0 018 0v3" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Privacy</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>What we store and what you control</div>
            </div>
            <span
              role="status"
              aria-live="polite"
              style={{
                font: "800 12px var(--font-nunito)",
                color: status === "error" ? "#c0392b" : "#2e9c6a",
                background: status === "error" ? "#fbeceb" : "#e7f4ee",
                padding: "6px 12px",
                borderRadius: 10,
                opacity: status === "idle" ? 0 : 1,
                transition: "opacity .2s",
              }}
            >
              {status === "error" ? "Couldn't save — reverted" : "Saved ✓"}
            </span>
          </div>

          {/* what's stored */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>What VeriLearn stores</div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Your topics, lectures &amp; the claim ledger
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Review history &amp; FSRS schedule
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Gap map &amp; discussion threads
            </div>
            <div style={{ display: "flex", gap: 10, padding: "9px 0", font: "700 13px/1.4 var(--font-nunito)", color: "#8b8699" }}>
              <span style={{ flexShrink: 0 }}>✕</span>We never sell your data or train public models on it
            </div>
          </div>

          {/* toggles */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Anonymous usage analytics</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Help improve VeriLearn with de-identified data</div>
              </div>
              <Toggle on={!!privacy?.analytics} disabled={!loaded} onClick={() => toggle("analytics")} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Show my profile in Community</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Others can see your name on threads</div>
              </div>
              <Toggle on={!!privacy?.communityVisible} disabled={!loaded} onClick={() => toggle("communityVisible")} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Product emails</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Occasional tips &amp; feature news</div>
              </div>
              <Toggle on={!!privacy?.emailUpdates} disabled={!loaded} onClick={() => toggle("emailUpdates")} />
            </div>
          </div>

          {/* notification categories (NOTIF-08) — muting a category drops it from the feed */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", padding: "18px 0 6px" }}>Notifications</div>
            {NOTIF_ROWS.map((row, i) => (
              <div key={row.key} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 0", ...(i < NOTIF_ROWS.length - 1 ? { borderBottom: "1px solid #f5f3fa" } : {}) }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 14px var(--font-nunito)" }}>{row.label}</div>
                  <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>{row.desc}</div>
                </div>
                <Toggle on={notif ? notif[row.key] : true} disabled={notif === null} onClick={() => toggleNotif(row.key)} />
              </div>
            ))}
            <div style={{ font: "600 11px var(--font-nunito)", color: "#a7a1b8", padding: "0 0 14px" }}>
              These control the in-app notification center. Email &amp; push channels are coming with the notifications service.
            </div>
          </div>

          {/* export — real DSAR bundle (SETTINGS-13): full claim ledger, reviews, gaps, certs. */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px var(--font-nunito)" }}>Export your data</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
                {exportErr ?? "Download everything as JSON — profile, topics + claim ledger, reviews, gaps, tasks, certificates"}
              </div>
            </div>
            <button
              type="button"
              onClick={exportData}
              disabled={exporting}
              style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#4a4560", font: "800 12.5px var(--font-nunito)", padding: "10px 18px", borderRadius: 12, cursor: exporting ? "default" : "pointer" }}
            >
              {exporting ? "Preparing…" : "Download JSON"}
            </button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
