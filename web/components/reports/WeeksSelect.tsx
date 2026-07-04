"use client";

/**
 * Real, keyboard-operable trend-window control (ANALYTICS-17) — replaces what
 * used to be a decorative, unwired "Last 30 days" button. A native <select>
 * is keyboard/screen-reader operable by construction; changing it re-fetches
 * the page with the chosen window via a real query param, so the retention
 * chart and its "last N weeks" label reflect what's actually selected.
 */

import { useRouter } from "next/navigation";

const OPTIONS = [4, 6, 8, 12] as const;

export default function WeeksSelect({ weeks }: { weeks: number }) {
  const router = useRouter();
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid #ece8f4", background: "#fff", padding: "8px 12px", borderRadius: 13, boxShadow: "0 6px 18px -12px rgba(80,60,140,.3)" }}>
      <span className="vl-sr-only">Trend window</span>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <rect x="3" y="4.5" width="18" height="16" rx="3" />
        <path d="M3 9h18M8 3v3M16 3v3" />
      </svg>
      <select
        value={weeks}
        onChange={(e) => router.replace(`/reports?weeks=${e.target.value}`)}
        style={{ border: "none", background: "none", font: "800 12.5px var(--font-nunito)", color: "#4a4560", cursor: "pointer", outline: "none" }}
      >
        {OPTIONS.map((w) => (
          <option key={w} value={w}>
            Last {w} weeks
          </option>
        ))}
      </select>
    </label>
  );
}
