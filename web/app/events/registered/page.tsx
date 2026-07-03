import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "You're registered · VeriLearn" };

export default function EventRegisteredPage() {
  return (
    <AppShell active="events">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column" }}>
        <style>{"@keyframes vlpop{0%{opacity:0;transform:scale(.5)}70%{opacity:1;transform:scale(1.08)}100%{transform:scale(1)}}"}</style>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 16,
            minHeight: 620,
          }}
        >
          <div
            style={{
              width: 82,
              height: 82,
              borderRadius: "50%",
              background: "#e7f4ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "vlpop .5s cubic-bezier(.34,1.56,.64,1)",
            }}
          >
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div style={{ font: "900 28px var(--font-nunito)", letterSpacing: "-.02em" }}>You&apos;re registered! 🎉</div>
          <div style={{ font: "600 14px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 400 }}>
            See you Saturday at 2:00 PM for the live claim-check. We&apos;ve emailed your join link and added it to your
            tasks.
          </div>

          {/* ticket card */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "22px 26px",
              boxShadow: "0 14px 34px -18px rgba(80,60,140,.4)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              marginTop: 6,
              textAlign: "left",
            }}
          >
            <div
              style={{
                width: 70,
                height: 74,
                borderRadius: 15,
                background: "linear-gradient(135deg,#6d5bd0,#8b78e8)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#fff",
              }}
            >
              <span style={{ font: "800 10px var(--font-nunito)", textTransform: "uppercase" }}>Sat</span>
              <span style={{ font: "900 28px var(--font-nunito)", lineHeight: 1 }}>12</span>
              <span style={{ font: "700 9px var(--font-nunito)" }}>Jul</span>
            </div>
            <div>
              <div style={{ font: "900 16px var(--font-nunito)" }}>Graph algorithms, verified</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>
                2:00 PM · 45 min · Online
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 9 }}>
                <span
                  style={{
                    font: "800 10px var(--font-nunito)",
                    color: "#2e9c6a",
                    background: "#e4f4ec",
                    padding: "4px 10px",
                    borderRadius: 8,
                  }}
                >
                  ✓ Confirmed
                </span>
                <span
                  style={{
                    font: "800 10px var(--font-nunito)",
                    color: "#6d5bd0",
                    background: "#f1eefb",
                    padding: "4px 10px",
                    borderRadius: 8,
                  }}
                >
                  Reminder set
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button
              style={{
                border: "1.5px solid #ece8f4",
                background: "#fff",
                color: "#4a4560",
                font: "800 13.5px var(--font-nunito)",
                padding: "13px 22px",
                borderRadius: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4.5" width="18" height="16" rx="3" />
                <path d="M3 9h18M8 3v3M16 3v3" />
              </svg>
              Add to calendar
            </button>
            <Link
              href="/events"
              style={{
                textDecoration: "none",
                background: "#6d5bd0",
                color: "#fff",
                font: "800 13.5px var(--font-nunito)",
                padding: "13px 22px",
                borderRadius: 14,
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Back to events
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
