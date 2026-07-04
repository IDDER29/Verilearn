"use client";

/**
 * Notifications feed — the real, working filter chips (NOTIF-07). Chips match
 * the kinds the service actually emits (`NotificationKind`); there's no
 * fabricated "Community" category since no such notification kind exists yet
 * (Community/Events aren't seeded — R2/R3).
 */

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { NotificationItem, NotificationKind } from "@/lib/services/notifications";

const KIND: Record<NotificationKind, { bg: string; icon: ReactNode; label: string }> = {
  verification: {
    bg: "#e7f4ee",
    label: "Verification",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  review: { bg: "#fbeadf", label: "Review", icon: "📼" },
  conflict: { bg: "#f2effc", label: "Conflicts", icon: "🧐" },
  streak: { bg: "#fdf1de", label: "Streak", icon: "🔥" },
  test: {
    bg: "#eef2fb",
    label: "Tests",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 3h6l1 3H8zM8 6h8l1 14a1 1 0 01-1 1H8a1 1 0 01-1-1z" />
        <path d="M10 12h4M10 16h4" />
      </svg>
    ),
  },
};

const KINDS: NotificationKind[] = ["test", "verification", "review", "conflict", "streak"];

export default function NotificationsFeed({ items }: { items: NotificationItem[] }) {
  const [filter, setFilter] = useState<NotificationKind | "all">("all");
  const visible = filter === "all" ? items : items.filter((i) => i.kind === filter);

  function chipStyle(active: boolean) {
    return {
      font: "800 12px var(--font-nunito)",
      color: active ? "#fff" : "#6c6780",
      background: active ? "#6d5bd0" : "#fff",
      padding: "8px 15px",
      borderRadius: 11,
      border: "none",
      cursor: "pointer",
      boxShadow: active ? "none" : "0 6px 16px -12px rgba(80,60,140,.3)",
    } as const;
  }

  return (
    <>
      {/* filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => setFilter("all")} style={chipStyle(filter === "all")}>
          All
        </button>
        {KINDS.filter((k) => items.some((i) => i.kind === k)).map((k) => (
          <button key={k} type="button" onClick={() => setFilter(k)} style={chipStyle(filter === k)}>
            {KIND[k].label}
          </button>
        ))}
      </div>

      {/* section label */}
      <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8" }}>
        Recent
      </div>

      {visible.length === 0 ? (
        <div style={{ background: "#fff", borderRadius: 20, padding: "40px 22px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ fontSize: 40, lineHeight: 1 }}>🎉</div>
          <div style={{ font: "800 16px var(--font-nunito)", marginTop: 12 }}>
            {filter === "all" ? "You're all caught up" : `No ${KIND[filter].label.toLowerCase()} notifications`}
          </div>
          <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginTop: 4 }}>
            {filter === "all" ? "No new updates on your topics, tests & the Skeptic." : "Switch back to All to see everything else."}
          </div>
        </div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 20, padding: "6px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          {visible.map((item, i) => {
            const treatment = KIND[item.kind];
            return (
              <Link
                key={item.id}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 14,
                  padding: "16px 0",
                  borderBottom: i < visible.length - 1 ? "1px solid #f5f3fa" : "none",
                  textDecoration: "none",
                  color: "inherit",
                  position: "relative",
                }}
              >
                {item.unread && (
                  <>
                    <span aria-hidden style={{ position: "absolute", left: -14, top: 22, width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0" }} />
                    <span className="vl-sr-only">Unread. </span>
                  </>
                )}
                <div
                  aria-hidden
                  style={{ width: 44, height: 44, borderRadius: 13, background: treatment.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                >
                  {treatment.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>{item.title}</div>
                  <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>{item.detail}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
