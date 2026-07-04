// SETTINGS/SEC — data-subject controls: analytics / community visibility / product
// emails are the privacy prefs the learner governs here. Bound to real prefs via
// getPrefsAction (load) + savePrivacyAction (per-toggle persist).
"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import { getPrefsAction, savePrivacyAction } from "@/app/prefs-actions";
import type { UserPrefs } from "@/lib/store/entities";

type Privacy = UserPrefs["privacy"];

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

  useEffect(() => {
    getPrefsAction().then((p) => setPrivacy(p?.privacy ?? null));
  }, []);

  const loaded = privacy !== null;

  async function toggle(key: keyof Privacy) {
    if (!privacy) return;
    const next = { ...privacy, [key]: !privacy[key] };
    setPrivacy(next);
    await savePrivacyAction({ [key]: next[key] });
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
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Privacy</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>What we store and what you control</div>
            </div>
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

          {/* export — Deferred: there is no export service yet, so this stays a stub. */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v12M8 11l4 4 4-4M4 21h16" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px var(--font-nunito)" }}>Export your data</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Download everything as JSON — topics, reviews, gaps</div>
            </div>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#4a4560", font: "800 12.5px var(--font-nunito)", padding: "10px 18px", borderRadius: 12, cursor: "pointer" }}>Request export</button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
