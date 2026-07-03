import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Review · VeriLearn" };

export default function ReviewRevealPage() {
  return (
    <AppShell active="tasks">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 320px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* ---- CENTER ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* header + progress */}
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
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Spaced review · today</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Review session</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "9px 15px", borderRadius: 12 }}>
              Card 1 of 4
            </div>
          </div>

          {/* progress dots */}
          <div style={{ display: "flex", gap: 7 }}>
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#6d5bd0" }} />
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 7, borderRadius: 4, background: "#e2dcf1" }} />
          </div>

          {/* FLASHCARD (revealed) */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "30px 32px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {/* card chrome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>Dijkstra&apos;s algorithm</div>
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Flashcard · from §1</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "6px 11px", borderRadius: 10 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3zM9.5 21h5" />
                </svg>
                You said: Confident
              </div>
            </div>

            {/* question (recap) */}
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 8 }}>Question</div>
            <div style={{ font: "800 17px/1.4 var(--font-nunito)", color: "#4a4560", marginBottom: 20 }}>
              Why can Dijkstra finalise a node&apos;s distance the moment it&apos;s picked, and never revisit it?
            </div>

            {/* answer */}
            <div style={{ background: "#eef7f1", border: "1.5px solid #cdeadd", borderRadius: 18, padding: "20px 22px", marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#2e9c6a", marginBottom: 10 }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
                Answer
              </div>
              <div style={{ font: "700 15.5px/1.65 var(--font-nunito)", color: "#221f2e" }}>
                Because every edge weight is non-negative, once a node is dequeued its tentative distance can&apos;t be lowered by any future path — every remaining route is at least as long. So the greedy choice is provably final.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #d6ecdf" }}>
                <div style={{ width: 28, height: 28, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                    <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                  </svg>
                </div>
                <span style={{ font: "700 12px var(--font-nunito)", color: "#3d8763" }}>Verified · CLRS §24.3 (cut property)</span>
              </div>
            </div>

            {/* rating */}
            <div style={{ font: "800 13px var(--font-nunito)", marginBottom: 12 }}>How well did you recall it?</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
              <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "15px 8px", border: "2px solid #f3d4cf", background: "#fdf2f0", borderRadius: 15, cursor: "pointer" }}>
                <span style={{ font: "800 14px var(--font-nunito)", color: "#c0392b" }}>Again</span>
                <span style={{ font: "700 10.5px var(--font-nunito)", color: "#c88" }}>&lt; 1 min</span>
              </button>
              <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "15px 8px", border: "2px solid #f0e2c2", background: "#fbf6ec", borderRadius: 15, cursor: "pointer" }}>
                <span style={{ font: "800 14px var(--font-nunito)", color: "#b4830f" }}>Hard</span>
                <span style={{ font: "700 10.5px var(--font-nunito)", color: "#c9a94e" }}>2 days</span>
              </button>
              <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "15px 8px", border: "2px solid #6d5bd0", background: "#f2effc", borderRadius: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(109,91,208,.5)" }}>
                <span style={{ font: "800 14px var(--font-nunito)", color: "#6d5bd0" }}>Good</span>
                <span style={{ font: "700 10.5px var(--font-nunito)", color: "#9184c4" }}>4 days</span>
              </button>
              <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "15px 8px", border: "2px solid #cdeadd", background: "#f0f9f4", borderRadius: 15, cursor: "pointer" }}>
                <span style={{ font: "800 14px var(--font-nunito)", color: "#2e9c6a" }}>Easy</span>
                <span style={{ font: "700 10.5px var(--font-nunito)", color: "#6ab48c" }}>9 days</span>
              </button>
            </div>
          </div>

          {/* honesty hatch */}
          <div style={{ display: "flex", gap: 12 }}>
            <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", border: "1.5px solid #f3d9d6", borderRadius: 16, padding: 15, cursor: "pointer", boxShadow: "0 10px 30px -22px rgba(80,60,140,.3)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
              <span style={{ font: "800 13.5px var(--font-nunito)", color: "#c0392b" }}>I had the wrong idea</span>
            </button>
            <Link href="/review/discuss" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", border: "1.5px solid #ece8f4", borderRadius: 16, padding: 15, cursor: "pointer", textDecoration: "none", boxShadow: "0 10px 30px -22px rgba(80,60,140,.3)" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 10h8M8 14h5M21 12a8 8 0 01-11.5 7.2L4 20l.8-5.5A8 8 0 1121 12z" />
              </svg>
              <span style={{ font: "800 13.5px var(--font-nunito)", color: "#6d5bd0" }}>Discuss this answer</span>
            </Link>
          </div>
        </div>

        {/* ---- RIGHT ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* calibration match */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Calibration check</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: "#eef7f1" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              </div>
              <div>
                <div style={{ font: "800 13.5px var(--font-nunito)", color: "#2e9c6a" }}>Well calibrated!</div>
                <div style={{ font: "600 11.5px/1.45 var(--font-nunito)", color: "#6c6780" }}>You felt Confident and got it right.</div>
              </div>
            </div>
            <div style={{ font: "600 11.5px/1.55 var(--font-nunito)", color: "#8b8699", marginTop: 12 }}>
              Matching confidence to reality is what builds the calibration signal on your Progress page.
            </div>
          </div>

          {/* session ring */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Today&apos;s session</div>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 8px" }}>
              <svg width="120" height="120" viewBox="0 0 120 120" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#eee9f7" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="#6d5bd0" strokeWidth="12" strokeLinecap="round" strokeDasharray="314" strokeDashoffset="236" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ font: "900 24px var(--font-nunito)" }}>1/4</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>reviewed</div>
              </div>
            </div>
          </div>

          {/* next button */}
          <Link href="/review/complete" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#6d5bd0", color: "#fff", font: "800 15px var(--font-nunito)", padding: 16, borderRadius: 16, boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}>
            Next card
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
