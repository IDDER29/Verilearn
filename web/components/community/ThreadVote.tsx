"use client";

import { useState } from "react";

/**
 * Real, keyboard-operable vote control (COMM-16): a native `<button>` with
 * `aria-pressed` and an `aria-live` count, not the inert `<span>` this used to
 * be. The vote itself is genuinely ephemeral, page-local state — there is no
 * community backend yet (Deferred, R2/R3), so it's honest to make that
 * explicit rather than pretending a click here persists anywhere.
 */
export default function ThreadVote({ initialCount, label }: { initialCount: number; label: string }) {
  const [count, setCount] = useState(initialCount);
  const [voted, setVoted] = useState(false);

  function toggle() {
    setVoted((v) => !v);
    setCount((c) => (voted ? c - 1 : c + 1));
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={voted}
      aria-label={`${label}, ${count} vote${count === 1 ? "" : "s"}${voted ? ", voted" : ""}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        border: "none",
        background: "none",
        padding: 0,
        cursor: "pointer",
        font: "800 12px var(--font-nunito)",
        color: voted ? "#6d5bd0" : "inherit",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill={voted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M7 10l4-7a2 2 0 013 2l-1 5h5a2 2 0 012 2.3l-1.3 6A2 2 0 0118.7 21H7" />
        <path d="M7 10v11H4a1 1 0 01-1-1v-9a1 1 0 011-1z" />
      </svg>
      <span aria-live="polite">{count}</span>
    </button>
  );
}
