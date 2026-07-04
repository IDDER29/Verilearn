"use client";

import type { TabKey } from "./types";

const TABS: { key: TabKey; label: string; emoji: string; badge?: string }[] = [
  { key: "lecture", label: "Lecture", emoji: "📖" },
  { key: "tasks", label: "Tasks", emoji: "✍️" },
  { key: "conflicts", label: "Conflicts", emoji: "⚖️", badge: "1" },
  { key: "sources", label: "Sources", emoji: "🔗" },
];

/**
 * The Lecture / Tasks / Conflicts / Sources tab strip. Switches the active
 * workspace tab in place (client state) rather than navigating.
 */
export default function WorkspaceTabs({ active, onTab }: { active: TabKey; onTab: (t: TabKey) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, background: "#fff", padding: 7, borderRadius: 16, boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
      {TABS.map((t) => {
        const isActive = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onTab(t.key)}
            aria-current={isActive ? "true" : undefined}
            style={{
              flex: 1,
              textAlign: "center",
              padding: 11,
              borderRadius: 12,
              border: "none",
              cursor: "pointer",
              background: isActive ? "#6d5bd0" : "transparent",
              color: isActive ? "#fff" : "#6c6780",
              font: `${isActive ? 800 : 700} 13.5px var(--font-nunito)`,
              transition: "background .15s, color .15s",
            }}
          >
            {t.emoji} {t.label}
            {t.badge && (
              <span style={{ fontSize: 11, marginLeft: 4, color: isActive ? "rgba(255,255,255,.85)" : "#c0392b" }}>{t.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
