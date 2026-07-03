import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Session Complete · VeriLearn" };

export default function SessionCompletePage() {
  return (
    <AppShell active="tasks">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* hero celebration */}
        <div style={{ position: "relative", background: "linear-gradient(150deg,#6d5bd0,#8b78e8)", borderRadius: 26, padding: "38px 40px", overflow: "hidden", textAlign: "center", color: "#fff" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 120% at 20% 10%,rgba(255,255,255,.22),transparent 50%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0zM7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" />
              </svg>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", letterSpacing: "-.02em" }}>Session complete! 🎉</div>
            <div style={{ font: "600 14px/1.5 var(--font-nunito)", color: "#e7e1fb", marginTop: 8, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              You reviewed 4 cards and caught 2 seeded errors. Your next batch is scheduled for Thursday.
            </div>
          </div>
        </div>

        {/* summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>4</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Cards reviewed</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>2 / 2</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Errors caught</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#f3eefc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 100 18M12 3a9 9 0 019 9h-9z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>88%</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Calibration</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M4 7l2 2M20 7l-2 2M5 13a7 7 0 0114 0v3a3 3 0 01-3 3H8a3 3 0 01-3-3z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>6</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Day streak</div>
            </div>
          </div>
        </div>

        {/* card breakdown + up next */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 20, alignItems: "start" }}>
          {/* FSRS ratings breakdown */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 18px var(--font-nunito)", marginBottom: 4 }}>How you rated recall</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>FSRS uses these to schedule your next reviews.</div>

            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0" }}>
              <span style={{ width: 76, font: "800 12.5px var(--font-nunito)", color: "#c0392b" }}>Again</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#f3f1f9", overflow: "hidden" }}>
                <div style={{ width: "0%", height: "100%", background: "#c0392b" }} />
              </div>
              <span style={{ width: 24, textAlign: "right", font: "800 13px var(--font-nunito)", color: "#8b8699" }}>0</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0" }}>
              <span style={{ width: 76, font: "800 12.5px var(--font-nunito)", color: "#b4830f" }}>Hard</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#f3f1f9", overflow: "hidden" }}>
                <div style={{ width: "25%", height: "100%", background: "#c99a2b" }} />
              </div>
              <span style={{ width: 24, textAlign: "right", font: "800 13px var(--font-nunito)", color: "#8b8699" }}>1</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0" }}>
              <span style={{ width: 76, font: "800 12.5px var(--font-nunito)", color: "#3a63b0" }}>Good</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#f3f1f9", overflow: "hidden" }}>
                <div style={{ width: "50%", height: "100%", background: "#3a63b0" }} />
              </div>
              <span style={{ width: 24, textAlign: "right", font: "800 13px var(--font-nunito)", color: "#8b8699" }}>2</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0" }}>
              <span style={{ width: 76, font: "800 12.5px var(--font-nunito)", color: "#2e9c6a" }}>Easy</span>
              <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#f3f1f9", overflow: "hidden" }}>
                <div style={{ width: "25%", height: "100%", background: "#2e9c6a" }} />
              </div>
              <span style={{ width: 24, textAlign: "right", font: "800 13px var(--font-nunito)", color: "#8b8699" }}>1</span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "14px 16px", borderRadius: 15, background: "#fbf6ec" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M5 8l7-5 7 5M5 8v8l7 5 7-5V8" />
                </svg>
              </div>
              <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#6c6780" }}>
                <b style={{ color: "#221f2e" }}>One card marked &quot;Hard&quot;</b> — &quot;Relaxation step&quot; comes back tomorrow to reinforce it.
              </div>
            </div>
          </div>

          {/* next up */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Next review</div>
              <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                <div style={{ width: 52, height: 52, borderRadius: 15, background: "#efe9ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ font: "800 9px var(--font-nunito)", color: "#6d5bd0", textTransform: "uppercase" }}>Thu</span>
                  <span style={{ font: "900 18px var(--font-nunito)", color: "#6d5bd0", lineHeight: 1 }}>10</span>
                </div>
                <div>
                  <div style={{ font: "800 14px var(--font-nunito)" }}>3 cards due</div>
                  <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>in 2 days · Dijkstra, hashing</div>
                </div>
              </div>
            </div>

            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#6d5bd0", color: "#fff", font: "800 15px var(--font-nunito)", padding: 16, borderRadius: 16, boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}>
              Back to dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fff", color: "#4a4560", font: "800 14px var(--font-nunito)", padding: 15, borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11A8 8 0 004.6 9M4 4v5h5" />
              </svg>
              Review ahead
            </button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
