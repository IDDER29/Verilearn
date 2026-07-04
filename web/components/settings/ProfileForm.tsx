"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { updateDisplayNameAction, updateEmailAction } from "@/app/profile-actions";

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

/** Editable profile identity: display name persists; email changes with a current-password re-auth (SETTINGS-03). */
export default function ProfileForm({ initialName, email: initialEmail }: { initialName: string; email: string }) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [email, setEmail] = useState(initialEmail);
  const [editingEmail, setEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const dirty = name.trim() !== initialName && name.trim().length > 0;

  // Dirty-state navigation guard (SETTINGS-20): warn on tab close/refresh while
  // an unsaved display-name edit or an in-progress email change would be lost.
  // This is a real gap the auto-saving toggle pages elsewhere don't have — those
  // persist on every change, so there's no unsaved draft to protect.
  useEffect(() => {
    if (!dirty && !editingEmail) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty, editingEmail]);

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

  function startEmailEdit() {
    setEditingEmail(true);
    setNewEmail(email);
    setCurrentPassword("");
    setEmailError(null);
  }

  function cancelEmailEdit() {
    setEditingEmail(false);
    setNewEmail("");
    setCurrentPassword("");
    setEmailError(null);
  }

  async function saveEmail() {
    setEmailSaving(true);
    setEmailError(null);
    const r = await updateEmailAction(currentPassword, newEmail);
    setEmailSaving(false);
    if (r.ok && r.email) {
      setEmail(r.email);
      cancelEmailEdit();
      setSaved(true);
      setTimeout(() => setSaved(false), 1600);
      router.refresh();
    } else {
      setEmailError(r.error ?? "Couldn't save.");
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
          {editingEmail ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="New email"
                aria-label="New email"
                style={inputStyle}
              />
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password, to confirm"
                aria-label="Current password"
                style={inputStyle}
              />
              {emailError && <div style={{ font: "700 12px var(--font-nunito)", color: "#c0392b" }}>{emailError}</div>}
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  type="button"
                  onClick={saveEmail}
                  disabled={emailSaving || !newEmail.trim() || !currentPassword}
                  style={{ border: "none", background: emailSaving ? "#cdc6e8" : "#6d5bd0", color: "#fff", font: "800 12.5px var(--font-nunito)", padding: "9px 16px", borderRadius: 11, cursor: emailSaving ? "default" : "pointer" }}
                >
                  {emailSaving ? "Saving…" : "Save email"}
                </button>
                <button
                  type="button"
                  onClick={cancelEmailEdit}
                  disabled={emailSaving}
                  style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 12.5px var(--font-nunito)", padding: "9px 16px", borderRadius: 11, cursor: emailSaving ? "default" : "pointer" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={selectRow}>
              {email}
              <button
                type="button"
                onClick={startEmailEdit}
                style={{ border: "none", background: "none", cursor: "pointer", font: "800 11px var(--font-nunito)", color: "#6d5bd0", padding: 0 }}
              >
                Change →
              </button>
            </div>
          )}
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
