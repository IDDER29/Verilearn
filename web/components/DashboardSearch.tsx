"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Real dashboard topic search (HOME-06/07). Controlled input updates immediately;
 * the URL `?q=` is updated debounced so the server re-renders the filtered topic
 * list without a keystroke storm. Supports trust-state operators
 * (disputed/unsupported/interpretive/verified) — see `topicMatchesQuery`.
 */
export default function DashboardSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const [q, setQ] = useState(initialQuery);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function onChange(value: string) {
    setQ(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const trimmed = value.trim();
      router.replace(trimmed ? `/?q=${encodeURIComponent(trimmed)}` : "/");
    }, 250);
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "#fff",
        borderRadius: 15,
        padding: "11px 16px",
        width: 250,
        boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4-4" />
      </svg>
      <input
        value={q}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search topics… (try: disputed)"
        aria-label="Search topics"
        style={{ border: "none", outline: "none", background: "none", font: "600 13.5px var(--font-nunito)", color: "#221f2e", width: "100%" }}
      />
    </div>
  );
}
