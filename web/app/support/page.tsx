import AppShell from "@/components/AppShell";

export const metadata = { title: "Support · VeriLearn" };

export default function SupportPage() {
  return (
    <AppShell active="support">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Support 💬</div>
          <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
            Answers, guides, and a way to reach us.
          </div>
        </div>

        {/* search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            background: "#fff",
            borderRadius: 16,
            padding: "15px 20px",
            boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
          }}
        >
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
          <span style={{ font: "600 14.5px var(--font-nunito)", color: "#a7a1b8" }}>Search help articles…</span>
        </div>

        {/* quick help cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ background: "#eef2fb", borderRadius: 20, padding: 20 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 4 }}>How verification works</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#7d90b5" }}>
              Claims, sources, trust levels &amp; the Skeptic explained.
            </div>
          </div>
          <div style={{ background: "#eef7f1", borderRadius: 20, padding: 20 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" />
              </svg>
            </div>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 4 }}>Reviews &amp; scheduling</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#6ba888" }}>
              How FSRS decides when cards come back.
            </div>
          </div>
          <div style={{ background: "#f3eefc", borderRadius: 20, padding: 20 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 14,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="13" rx="2.5" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 4 }}>Plans &amp; billing</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#948ab5" }}>
              Free vs Pro, invoices, and cancellation.
            </div>
          </div>
        </div>

        {/* FAQ + contact */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 20, alignItems: "start" }}>
          <div
            style={{
              background: "#fff",
              borderRadius: 22,
              padding: "8px 24px",
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 0",
                borderBottom: "1px solid #f5f3fa",
              }}
            >
              <span style={{ font: "800 14px var(--font-nunito)" }}>Why is a claim marked &quot;disputed&quot;?</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div style={{ padding: "0 0 18px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "18px 0 12px",
                }}
              >
                <span style={{ font: "800 14px var(--font-nunito)" }}>Can I add my own sources?</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 15l-6-6-6 6" />
                </svg>
              </div>
              <div style={{ font: "600 13px/1.7 var(--font-nunito)", color: "#6c6780" }}>
                Yes — open any topic&apos;s Sources tab and tap &quot;Add&quot;. Your source is checked by the Skeptic
                before it can back a claim, and you can mark one as preferred.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 0",
                borderTop: "1px solid #f5f3fa",
              }}
            >
              <span style={{ font: "800 14px var(--font-nunito)" }}>How do I resolve a conflict?</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 0",
                borderTop: "1px solid #f5f3fa",
              }}
            >
              <span style={{ font: "800 14px var(--font-nunito)" }}>What&apos;s the difference between Free and Pro?</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                background: "linear-gradient(160deg,#221d2e,#3a3550)",
                borderRadius: 22,
                padding: 22,
                color: "#fff",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 13,
                    background: "rgba(255,255,255,.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  💬
                </div>
                <div>
                  <div style={{ font: "900 15px var(--font-nunito)" }}>Still stuck?</div>
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>We reply within a few hours</div>
                </div>
              </div>
              <button
                style={{
                  width: "100%",
                  border: "none",
                  borderRadius: 13,
                  background: "#fff",
                  color: "#221f2e",
                  font: "800 13.5px var(--font-nunito)",
                  padding: 13,
                  cursor: "pointer",
                  marginBottom: 9,
                }}
              >
                Chat with us
              </button>
              <button
                style={{
                  width: "100%",
                  border: "1px solid rgba(255,255,255,.2)",
                  borderRadius: 13,
                  background: "transparent",
                  color: "#fff",
                  font: "800 13.5px var(--font-nunito)",
                  padding: 13,
                  cursor: "pointer",
                }}
              >
                Email support
              </button>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
              }}
            >
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 10 }}>System status</div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 12.5px var(--font-nunito)" }}>
                <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2e9c6a" }} />
                All systems operational
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
