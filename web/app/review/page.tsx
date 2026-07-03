import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Review · VeriLearn" };

export default function ReviewPage() {
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

          {/* FLASHCARD */}
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
              <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 11px", borderRadius: 10 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
                Verified card
              </div>
            </div>

            {/* question */}
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 10 }}>Question</div>
            <div style={{ font: "800 22px/1.4 var(--font-nunito)", letterSpacing: "-.01em", marginBottom: 26 }}>
              Why can Dijkstra finalise a node&apos;s distance the moment it&apos;s picked, and never revisit it?
            </div>

            {/* confidence gate */}
            <div style={{ background: "#f7f5fb", border: "1.5px solid #ece8f4", borderRadius: 18, padding: "18px 20px", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", marginBottom: 13 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3z" />
                  <path d="M9.5 21h5" />
                </svg>
                Before you reveal — how confident are you?
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 14, border: "2px solid #cdeadd", background: "#f0f9f4", borderRadius: 14, cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8.5 12.5l2.5 2.5 4.5-5" />
                  </svg>
                  <span style={{ font: "800 13px var(--font-nunito)", color: "#2e9c6a" }}>Confident</span>
                </button>
                <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 14, border: "2px solid #f0e2c2", background: "#fbf6ec", borderRadius: 14, cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M9.2 9.5a2.8 2.8 0 015.5.8c0 1.9-2.8 2.5-2.8 2.5M12 17h.01" />
                  </svg>
                  <span style={{ font: "800 13px var(--font-nunito)", color: "#b4830f" }}>Unsure</span>
                </button>
                <button style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: 14, border: "2px solid #f3d4cf", background: "#fdf2f0", borderRadius: 14, cursor: "pointer" }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8.5 15.5s1.5-1 3.5-1 3.5 1 3.5 1M9 9.5h.01M15 9.5h.01" />
                  </svg>
                  <span style={{ font: "800 13px var(--font-nunito)", color: "#c0392b" }}>Guessing</span>
                </button>
              </div>
            </div>

            {/* reveal (locked) */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="11" width="14" height="9" rx="2" />
                  <path d="M8 11V8a4 4 0 018 0v3" />
                </svg>
                Pick a confidence level to reveal the answer
              </div>
              <Link
                href="/review/reveal"
                style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 7, borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", padding: "12px 24px", whiteSpace: "nowrap" }}
              >
                Show answer
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* hint about rating */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 18, padding: "16px 20px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
              </svg>
            </div>
            <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#6c6780" }}>
              <b style={{ color: "#221f2e" }}>Committing first keeps you honest.</b> After you reveal, you&apos;ll rate recall — and if your confidence didn&apos;t match reality, it feeds your calibration score.
            </div>
          </div>
        </div>

        {/* ---- RIGHT ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* session progress ring */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Today&apos;s session</div>
            <div style={{ position: "relative", width: 128, height: 128, margin: "0 auto 10px" }}>
              <svg width="128" height="128" viewBox="0 0 128 128" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="64" cy="64" r="54" fill="none" stroke="#eee9f7" strokeWidth="13" />
                <circle cx="64" cy="64" r="54" fill="none" stroke="#6d5bd0" strokeWidth="13" strokeLinecap="round" strokeDasharray="339" strokeDashoffset="255" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ font: "900 26px var(--font-nunito)" }}>0/4</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>reviewed</div>
              </div>
            </div>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>~2 min left · next batch in 2 days</div>
          </div>

          {/* up next */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Up next</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Relaxation step</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Dijkstra · flashcard</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fbeceb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4l9 15.5H3z" />
                  <path d="M12 10v4M12 17h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Spot the error</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Seeded drill</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#e9f7ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Correctness proof</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Dijkstra · flashcard</div>
              </div>
            </div>
          </div>

          {/* blind-spot score */}
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 22, color: "#fff", boxShadow: "0 16px 34px -16px rgba(40,30,70,.7)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b3a7f0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div style={{ font: "900 15px var(--font-nunito)" }}>Blind-spot check</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>Errors you caught</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <span style={{ font: "900 30px var(--font-nunito)" }}>6</span>
              <span style={{ font: "800 15px var(--font-nunito)", color: "#b3a7f0" }}>/ 9 caught</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
              <div style={{ width: "67%", height: "100%", borderRadius: 5, background: "#8b78e8" }} />
            </div>
            <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#c9c3d8", marginTop: 10 }}>
              Drills salt false claims into your reviews — catching them sharpens judgment.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
