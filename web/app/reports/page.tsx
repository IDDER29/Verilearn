import AppShell from "@/components/AppShell";

export const metadata = { title: "Progress · VeriLearn" };

export default function ReportsPage() {
  return (
    <AppShell active="reports">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "900 25px var(--font-nunito)", letterSpacing: "-.02em" }}>Your progress 📈</div>
            <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              Four honest signals — no vanity metrics. Each maps to something you actually did.
            </div>
          </div>
          <button style={{ display: "flex", alignItems: "center", gap: 7, border: "1px solid #ece8f4", background: "#fff", font: "800 12.5px var(--font-nunito)", color: "#4a4560", padding: "10px 15px", borderRadius: 13, cursor: "pointer", boxShadow: "0 6px 18px -12px rgba(80,60,140,.3)" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4.5" width="18" height="16" rx="3" />
              <path d="M3 9h18M8 3v3M16 3v3" />
            </svg>
            Last 30 days
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>

        {/* four signal cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {/* retention */}
          <div style={{ background: "#eef2fb", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" />
                </svg>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 3, font: "800 11px var(--font-nunito)", color: "#2e9c6a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 15l6-6 6 6" />
                </svg>
                4%
              </span>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", lineHeight: 1 }}>74%</div>
            <div style={{ font: "800 13px var(--font-nunito)", color: "#3a63b0", marginTop: 4 }}>Retention</div>
            <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#7d90b5", marginTop: 5 }}>How much you recall over time</div>
          </div>
          {/* transfer */}
          <div style={{ background: "#eef7f1", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 17l5-5-5-5M12 19h8" />
                </svg>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 3, font: "800 11px var(--font-nunito)", color: "#2e9c6a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 15l6-6 6 6" />
                </svg>
                7%
              </span>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", lineHeight: 1 }}>61%</div>
            <div style={{ font: "800 13px var(--font-nunito)", color: "#2e9c6a", marginTop: 4 }}>Transfer</div>
            <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#6ba888", marginTop: 5 }}>Applying it to new problems</div>
          </div>
          {/* calibration */}
          <div style={{ background: "#f3eefc", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a9 9 0 100 18M12 3a9 9 0 019 9h-9z" />
                  <path d="M12 12l4-4" />
                </svg>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 3, font: "800 11px var(--font-nunito)", color: "#2e9c6a" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 15l6-6 6 6" />
                </svg>
                2%
              </span>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", lineHeight: 1 }}>82%</div>
            <div style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0", marginTop: 4 }}>Calibration</div>
            <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#948ab5", marginTop: 5 }}>Confidence vs. reality</div>
          </div>
          {/* drill detection */}
          <div style={{ background: "#fbf3e4", borderRadius: 20, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <span style={{ display: "flex", alignItems: "center", gap: 3, font: "800 11px var(--font-nunito)", color: "#c0392b" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 9l-6 6-6-6" />
                </svg>
                3%
              </span>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", lineHeight: 1 }}>63%</div>
            <div style={{ font: "800 13px var(--font-nunito)", color: "#b4830f", marginTop: 4 }}>Drill detection</div>
            <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#b09257", marginTop: 5 }}>Catching seeded errors</div>
          </div>
        </div>

        {/* chart + focus */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 20, alignItems: "start" }}>
          {/* retention trend chart */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ font: "900 18px var(--font-nunito)" }}>Retention over time</div>
              <div style={{ display: "flex", gap: 14, font: "700 11.5px var(--font-nunito)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#3a63b0" }}>
                  <span style={{ width: 11, height: 11, borderRadius: 4, background: "#3a63b0" }} />
                  Retention
                </span>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#2e9c6a" }}>
                  <span style={{ width: 11, height: 11, borderRadius: 4, background: "#2e9c6a" }} />
                  Transfer
                </span>
              </div>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 20 }}>Trending up as you keep reviews on schedule.</div>

            {/* svg line chart */}
            <div style={{ position: "relative" }}>
              <svg viewBox="0 0 620 200" style={{ width: "100%", height: "auto", display: "block" }}>
                {/* gridlines */}
                <line x1="0" y1="20" x2="620" y2="20" stroke="#f0edf6" strokeWidth="1.5" />
                <line x1="0" y1="70" x2="620" y2="70" stroke="#f0edf6" strokeWidth="1.5" />
                <line x1="0" y1="120" x2="620" y2="120" stroke="#f0edf6" strokeWidth="1.5" />
                <line x1="0" y1="170" x2="620" y2="170" stroke="#f0edf6" strokeWidth="1.5" />
                {/* retention area + line */}
                <path d="M10 150 L110 128 L210 132 L310 96 L410 88 L510 70 L610 58 L610 190 L10 190 Z" fill="#3a63b0" opacity="0.08" />
                <path d="M10 150 L110 128 L210 132 L310 96 L410 88 L510 70 L610 58" fill="none" stroke="#3a63b0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="610" cy="58" r="5" fill="#3a63b0" stroke="#fff" strokeWidth="2.5" />
                {/* transfer line */}
                <path d="M10 172 L110 160 L210 150 L310 140 L410 122 L510 108 L610 96" fill="none" stroke="#2e9c6a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1 0" />
                <circle cx="610" cy="96" r="5" fill="#2e9c6a" stroke="#fff" strokeWidth="2.5" />
              </svg>
              <div style={{ display: "flex", justifyContent: "space-between", font: "700 10.5px var(--font-nunito)", color: "#a7a1b8", marginTop: 8, padding: "0 4px" }}>
                <span>Wk 1</span><span>Wk 2</span><span>Wk 3</span><span>Wk 4</span><span>Wk 5</span><span>Wk 6</span><span>Now</span>
              </div>
            </div>
          </div>

          {/* where to focus */}
          <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 4 }}>Where to focus</div>
            <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>Ranked by recent signals</div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: "#fdf2f1", marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 4l9 15.5H3z" />
                  <path d="M12 10v4M12 17h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Merkle trees</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#c0392b" }}>Overconfident · calibration low</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: "#fbf6ec", marginBottom: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 8v4l2.5 2.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Hashing basics</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#b4830f" }}>Watch · retention dipping</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: "#eef7f1" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13px var(--font-nunito)" }}>Binary search</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>Solid · nicely calibrated</div>
              </div>
            </div>
          </div>
        </div>

        {/* per-topic breakdown */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 18px var(--font-nunito)", marginBottom: 18 }}>By topic</div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, font: "800 10.5px var(--font-nunito)", letterSpacing: ".04em", textTransform: "uppercase", color: "#a7a1b8", padding: "0 4px 12px", borderBottom: "1px solid #f0edf6" }}>
            <span>Topic</span><span>Retention</span><span>Transfer</span><span>Calibration</span><span>Verified</span>
          </div>

          {/* row 1 */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, alignItems: "center", padding: "14px 4px", borderBottom: "1px solid #f5f3fa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-2 5-4 1 2-5z" />
                </svg>
              </div>
              <span style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Dijkstra&apos;s algorithm</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "81%", height: "100%", background: "#3a63b0" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>81%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "68%", height: "100%", background: "#2e9c6a" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>68%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "88%", height: "100%", background: "#6d5bd0" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>88%</span>
            </div>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "5px 11px", borderRadius: 9, justifySelf: "start" }}>83%</span>
          </div>
          {/* row 2 */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, alignItems: "center", padding: "14px 4px", borderBottom: "1px solid #f5f3fa" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#e9f7ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M12 7l4-2M12 11l5-2.5M12 15l4-2" />
                  <path d="M6 21h12" />
                </svg>
              </div>
              <span style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Merkle trees</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "64%", height: "100%", background: "#3a63b0" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>64%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "52%", height: "100%", background: "#2e9c6a" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>52%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "47%", height: "100%", background: "#c0392b" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#c0392b" }}>47%</span>
            </div>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#b4830f", background: "#fbefdd", padding: "5px 11px", borderRadius: 9, justifySelf: "start" }}>82%</span>
          </div>
          {/* row 3 */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, alignItems: "center", padding: "14px 4px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#e2ecfb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
              </div>
              <span style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Binary search</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "92%", height: "100%", background: "#3a63b0" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>92%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "79%", height: "100%", background: "#2e9c6a" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>79%</span>
            </div>
            <div>
              <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: "90%", height: "100%", background: "#6d5bd0" }} /></div>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>90%</span>
            </div>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "5px 11px", borderRadius: 9, justifySelf: "start" }}>100%</span>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
