"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateDisplayNameAction } from "@/app/profile-actions";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  font: "600 14px var(--font-nunito)",
  padding: "11px 13px",
  border: "1.5px solid #ece8f4",
  borderRadius: 12,
  background: "#fbfafd",
};

const selectRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  font: "600 14px var(--font-nunito)",
  padding: "11px 13px",
  border: "1.5px solid #ece8f4",
  borderRadius: 12,
  background: "#f4f2f8",
  color: "#8b8699",
} as const;

const labelStyle = { font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 } as const;

const chevron = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/** Editable profile identity: display name persists; email is read-only (identity). */
export default function ProfileForm({ initialName, email }: { initialName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = name.trim() !== initialName && name.trim().length > 0;

  async function save() {
    setSaving(true);
    setError(null);
    const r = await updateDisplayNameAction(name);
    setSaving(false);
    if (r.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      router.refresh();
    } else {
      setError(r.error ?? "Couldn't save.");
    }
  }

  return (
    <>
      <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>Display name</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            aria-label="Display name"
            style={inputStyle}
          />
          {error && <div style={{ font: "700 12px var(--font-nunito)", color: "#c0392b", marginTop: 6 }}>{error}</div>}
        </div>
        <div style={{ marginBottom: 16 }}>
          <div style={labelStyle}>Email</div>
          <div style={selectRow}>
            {email}
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8" }}>identity · locked</span>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <div style={labelStyle}>Language</div>
            <div style={selectRow}>English (US){chevron}</div>
          </div>
          <div>
            <div style={labelStyle}>Timezone</div>
            <div style={selectRow}>Auto · device{chevron}</div>
          </div>
        </div>
      </div>

      {/* save bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 12, background: "#fff", borderRadius: 20, padding: "16px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
        <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 12px", borderRadius: 10, opacity: saved ? 1 : 0, transition: "opacity .2s" }}>Saved ✓</span>
        <button
          type="button"
          onClick={() => { setName(initialName); setError(null); }}
          disabled={!dirty || saving}
          style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: dirty && !saving ? "pointer" : "default", opacity: dirty ? 1 : 0.55 }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={save}
          disabled={!dirty || saving}
          style={{ border: "none", background: dirty ? "#6d5bd0" : "#cdc6e8", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 24px", borderRadius: 13, cursor: dirty && !saving ? "pointer" : "default", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)" }}
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </>
  );
}
