"use client";

import { useState } from "react";
import { submitAppealAction } from "@/app/appeal-actions";
import { fieldStyle, labelStyle, submitStyle } from "@/components/AuthShell";

/**
 * The one real, unauthenticated action a banned account can still take
 * (AUTH-18): submit an appeal by email, since a banned account can't sign in
 * to reach anything else. Honest outcomes only — no fabricated "your appeal
 * is being reviewed" state unless it genuinely was accepted.
 */
export default function AppealForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; error?: string } | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const r = await submitAppealAction(email, message);
    setSubmitting(false);
    setResult(r);
  }

  if (result?.ok) {
    return (
      <div style={{ textAlign: "center", padding: "10px 0" }}>
        <div style={{ fontSize: 32, marginBottom: 10 }}>✓</div>
        <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 6 }}>Appeal submitted</div>
        <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
          A Trust &amp; Safety reviewer will look into it. You&apos;ll be able to sign in again if it&apos;s upheld.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <label style={labelStyle} htmlFor="email">Account email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} style={fieldStyle} />
      </div>
      <div>
        <label style={labelStyle} htmlFor="message">Why should this ban be reconsidered?</label>
        <textarea
          id="message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Explain what happened…"
          style={{ ...fieldStyle, resize: "vertical" }}
        />
      </div>
      {result && !result.ok && (
        <div style={{ background: "#fbeceb", border: "1px solid #f4d5d1", color: "#c0392b", font: "700 12.5px var(--font-nunito)", borderRadius: 12, padding: "10px 13px" }}>
          {result.error}
        </div>
      )}
      <button type="submit" disabled={submitting} style={{ ...submitStyle, opacity: submitting ? 0.7 : 1, cursor: submitting ? "default" : "pointer" }}>
        {submitting ? "Submitting…" : "Submit appeal"}
      </button>
    </form>
  );
}
