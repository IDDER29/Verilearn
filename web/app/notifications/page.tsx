import Link from "next/link";
import AppShell from "@/components/AppShell";
import MarkAllReadButton from "@/components/MarkAllReadButton";
import NotificationsFeed from "@/components/NotificationsFeed";
import { requireUser } from "@/lib/auth/current";
import { listNotifications } from "@/lib/services/notifications";

export const metadata = { title: "Notifications · VeriLearn" };

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
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Notifications <span aria-hidden>🔔</span></div>
            <div role="status" aria-live="polite" style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              {unreadCount} unread · updates on your topics, tests &amp; the Skeptic
            </div>
          </div>
          <MarkAllReadButton disabled={unreadCount === 0} />
        </div>

        <NotificationsFeed items={items} />
      </main>
    </AppShell>
  );
}
