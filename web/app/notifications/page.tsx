import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Notifications · VeriLearn" };

export default function NotificationsPage() {
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
              2 unread · updates on your topics, tests &amp; the Skeptic
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

        {/* today */}
        <div
          style={{
            font: "800 11px var(--font-nunito)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#a7a1b8",
          }}
        >
          Today
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "6px 22px",
            boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
          }}
        >
          <Link
            href="/tests/dijkstra-checkpoint"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 0",
              borderBottom: "1px solid #f5f3fa",
              textDecoration: "none",
              color: "inherit",
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", left: -14, top: 22, width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0" }} />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#fbeceb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 3h6l1 3H8zM8 6h8l1 14a1 1 0 01-1 1H8a1 1 0 01-1-1z" />
                <path d="M10 12h4" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>
                Your <b>Dijkstra Checkpoint</b> is in 2 days
              </div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                You&apos;re 85% ready — review §3 to lift your odds.
              </div>
            </div>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", whiteSpace: "nowrap" }}>2h ago</span>
          </Link>
          <Link
            href="/topics/conflicts"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 0",
              textDecoration: "none",
              color: "inherit",
              position: "relative",
            }}
          >
            <span style={{ position: "absolute", left: -14, top: 22, width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0" }} />
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#f2effc",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              🧐
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>
                The Skeptic flagged a claim in <b>Merkle trees</b>
              </div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                &quot;Works on any input size&quot; — needs your call.
              </div>
            </div>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", whiteSpace: "nowrap" }}>5h ago</span>
          </Link>
        </div>

        {/* earlier */}
        <div
          style={{
            font: "800 11px var(--font-nunito)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#a7a1b8",
          }}
        >
          Earlier
        </div>
        <div
          style={{
            background: "#fff",
            borderRadius: 20,
            padding: "6px 22px",
            boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
          }}
        >
          <Link
            href="/topics"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 0",
              borderBottom: "1px solid #f5f3fa",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#e7f4ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>
                <b>Binary search</b> finished verifying
              </div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                100% verified · ready to read.
              </div>
            </div>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", whiteSpace: "nowrap" }}>Yesterday</span>
          </Link>
          <Link
            href="/review"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 0",
              borderBottom: "1px solid #f5f3fa",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#fbeadf",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              📼
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>4 flashcards are due for review</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                Keep your 6-day streak alive.
              </div>
            </div>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", whiteSpace: "nowrap" }}>Yesterday</span>
          </Link>
          <Link
            href="/community"
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 14,
              padding: "16px 0",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "#eef2fb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              💬
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14px/1.4 var(--font-nunito)" }}>Marcus replied to your thread</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                &quot;Great point on the cut property…&quot;
              </div>
            </div>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", whiteSpace: "nowrap" }}>2 days ago</span>
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
