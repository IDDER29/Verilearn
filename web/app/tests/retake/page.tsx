import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Test Retake · VeriLearn" };

export default function TestRetakePage() {
  return (
    <AppShell active="tests">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 320px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/tests"
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
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Tests / Retake</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Graph traversal — Mastery test</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                font: "800 12px var(--font-nunito)",
                color: "#c0392b",
                background: "#fbeceb",
                padding: "9px 14px",
                borderRadius: 12,
                whiteSpace: "nowrap",
              }}
            >
              Last: missed · 53%
            </div>
          </div>

          {/* retake framing hero */}
          <div
            style={{
              position: "relative",
              background: "#211d2e",
              borderRadius: 24,
              padding: "28px 32px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              gap: 26,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(120% 150% at 88% 15%,rgba(139,120,232,.42),transparent 55%)",
              }}
            />
            <div
              style={{
                position: "relative",
                width: 70,
                height: 70,
                flexShrink: 0,
                borderRadius: 20,
                background: "rgba(255,255,255,.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" />
              </svg>
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div
                style={{
                  font: "800 10px var(--font-nunito)",
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  color: "#b3a7f0",
                  marginBottom: 6,
                }}
              >
                Retake · attempt 2 of 3
              </div>
              <div style={{ font: "900 22px/1.25 var(--font-nunito)", color: "#fff" }}>A fresh set, focused on what you missed</div>
              <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#c9c3d8", marginTop: 8 }}>
                New questions on the same claims — weighted toward the sections you struggled with last time.
              </div>
            </div>
          </div>

          {/* what changed */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 16 }}>Since your last attempt</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>You reviewed 6 gap-map cards</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Graph traversal · since 20 Jun</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 15l6-6 6 6" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Readiness climbed 53% → 78%</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Predicted from your recent recall</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4l9 15.5H3z" />
                  <path d="M12 10v4M12 17h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>1 gap still open: BFS vs DFS order</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Worth a review before you start</div>
              </div>
              <Link
                href="/review"
                style={{
                  textDecoration: "none",
                  font: "800 11px var(--font-nunito)",
                  color: "#6d5bd0",
                  background: "#f1eefb",
                  padding: "7px 13px",
                  borderRadius: 10,
                  whiteSpace: "nowrap",
                }}
              >
                Review
              </Link>
            </div>
          </div>

          {/* format reminder */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>15</div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>New questions</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>
                25<span style={{ fontSize: 13, color: "#8b8699" }}> min</span>
              </div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>Time limit</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>
                70<span style={{ fontSize: 13, color: "#8b8699" }}>%</span>
              </div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>To pass</div>
            </div>
          </div>
        </div>

        {/* right: readiness + start */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14, textAlign: "left" }}>Readiness now</div>
            <div style={{ position: "relative", width: 132, height: 132, margin: "0 auto 6px" }}>
              <div style={{ width: 132, height: 132, borderRadius: "50%", background: "conic-gradient(#c99a2b 281deg,#eee9f7 0)" }} />
              <div
                style={{
                  position: "absolute",
                  inset: 15,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ font: "900 28px var(--font-nunito)", color: "#b4830f" }}>78%</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>up from 53%</div>
              </div>
            </div>
            <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginTop: 8 }}>
              Above the 70% bar — you&apos;re in good shape to pass this time.
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
              Only your best score counts.
            </div>
            <Link
              href="/tests/runner"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                padding: 15,
                borderRadius: 14,
                background: "#6d5bd0",
                color: "#fff",
                font: "800 15px var(--font-nunito)",
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Start retake
            </Link>
            <Link
              href="/tests"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: 10,
                padding: 13,
                borderRadius: 14,
                border: "1.5px solid #ece8f4",
                background: "#fbfafd",
                color: "#4a4560",
                font: "800 13.5px var(--font-nunito)",
              }}
            >
              Not yet
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
