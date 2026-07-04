import Link from "next/link";
import type { ReactNode } from "react";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listNotifications, type NotificationKind } from "@/lib/services/notifications";

export const metadata = { title: "Notifications · VeriLearn" };

/** Visual treatment per notification kind, reusing the icons/colors already in the design. */
const KIND: Record<NotificationKind, { bg: string; icon: ReactNode }> = {
  verification: {
    bg: "#e7f4ee",
    icon: (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  review: { bg: "#fbeadf", icon: "📼" },
  conflict: { bg: "#f2effc", icon: "🧐" },
};

export default async function NotificationsPage() {
  const user = await requireUser();
  const items = listNotifications(user.id);
  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 18, maxWidth: 760 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/"
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
              flexShrink: 0,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Notifications 🔔</div>
            <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              {unreadCount} unread · updates on your topics, tests &amp; the Skeptic
            </div>
          </div>
          <button
            style={{
              border: "1.5px solid #ece8f4",
              background: "#fff",
              color: "#6c6780",
              font: "800 12px var(--font-nunito)",
              padding: "9px 15px",
              borderRadius: 12,
              cursor: "pointer",
            }}
          >
            Mark all read
          </button>
        </div>

        {/* filter chips */}
        <div style={{ display: "flex", gap: 8 }}>
          <span style={{ font: "800 12px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "8px 15px", borderRadius: 11 }}>
            All
          </span>
          <span
            style={{
              font: "800 12px var(--font-nunito)",
              color: "#6c6780",
              background: "#fff",
              padding: "8px 15px",
              borderRadius: 11,
              boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)",
            }}
          >
            Tests
          </span>
          <span
            style={{
              font: "800 12px var(--font-nunito)",
              color: "#6c6780",
              background: "#fff",
              padding: "8px 15px",
              borderRadius: 11,
              boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)",
            }}
          >
            Verification
          </span>
          <span
            style={{
              font: "800 12px var(--font-nunito)",
              color: "#6c6780",
              background: "#fff",
              padding: "8px 15px",
              borderRadius: 11,
              boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)",
            }}
          >
            Community
          </span>
        </div>

        {/* section label */}
        <div
          style={{
            font: "800 11px var(--font-nunito)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#a7a1b8",
          }}
        >
          Recent
        </div>

        {items.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "40px 22px",
              textAlign: "center",
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            }}
          >
            <div style={{ fontSize: 40, lineHeight: 1 }}>🎉</div>
            <div style={{ font: "800 16px var(--font-nunito)", marginTop: 12 }}>You&apos;re all caught up</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginTop: 4 }}>
              No new updates on your topics, tests &amp; the Skeptic.
            </div>
          </div>
        ) : (
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "6px 22px",
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            }}
          >
            {items.map((item, i) => {
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
                    borderBottom: i < items.length - 1 ? "1px solid #f5f3fa" : "none",
                    textDecoration: "none",
                    color: "inherit",
                    position: "relative",
                  }}
                >
                  {item.unread && (
                    <span style={{ position: "absolute", left: -14, top: 22, width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0" }} />
                  )}
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 13,
                      background: treatment.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
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
      </main>
    </AppShell>
  );
}
