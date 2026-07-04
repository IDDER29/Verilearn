"use client";

import { useState } from "react";

/** Real share action (COMM-16): copies the actual current page URL to the clipboard — not a fabricated "shared" state. */
export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  async function share() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard permission denied or unavailable — no fabricated success state.
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      aria-label="Copy a link to this thread"
      style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", padding: 0, cursor: "pointer", font: "800 12px var(--font-nunito)", color: "inherit" }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v13" />
      </svg>
      <span aria-live="polite">{copied ? "Link copied!" : "Share"}</span>
    </button>
  );
}
