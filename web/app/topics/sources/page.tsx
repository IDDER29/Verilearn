import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Sources · VeriLearn" };

function GreenCell() {
  return (
    <span style={{ height: 36, borderRadius: 11, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

function BlueCell() {
  return (
    <span style={{ height: 36, borderRadius: 11, background: "#2d6cdf", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  );
}

function EmptyCell() {
  return <span style={{ height: 36, borderRadius: 11, background: "#f1eff5" }} />;
}

function DashedCell() {
  return <span style={{ height: 36, borderRadius: 11, background: "#fff", border: "1.5px dashed #e3b4af" }} />;
}

const rowStyle = {
  display: "grid",
  gridTemplateColumns: "minmax(0,1fr) 78px 78px 78px 78px",
  gap: 10,
  alignItems: "center" as const,
  padding: "11px 12px",
  borderRadius: 14,
  background: "#faf9fc",
  marginBottom: 8,
};

export default function TopicSourcesPage() {
  return (
    <AppShell active="topics">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/topics"
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
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / Algorithms</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Dijkstra&apos;s algorithm</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12.5px var(--font-nunito)", color: "#3a63b0", background: "#e3ecfb", padding: "9px 15px", borderRadius: 12 }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" />
            </svg>
            4 sources · 6 claims
          </div>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 8, background: "#fff", padding: 7, borderRadius: 16, boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
          <Link href="/topics" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 6.5C10.5 5 8 4.6 4 5v12c4-.4 6.5 0 8 1.5M12 6.5c1.5-1.5 4-1.9 8-1.5v12c-4-.4-6.5 0-8 1.5M12 6.5v12" />
            </svg>
            Lecture
          </Link>
          <Link href="/topics/tasks" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 20h4L18.5 9.5a2 2 0 00-3-3L5 17z" />
              <path d="M13.5 6.5l3 3" />
            </svg>
            Tasks
          </Link>
          <Link href="/topics/conflicts" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 21V4M5 4h11l-2 3.5L16 11H5" />
            </svg>
            Conflicts <span style={{ fontSize: 11, color: "#c0392b" }}>1</span>
          </Link>
          <span style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7, padding: 11, borderRadius: 12, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" />
            </svg>
            Sources
          </span>
        </div>

        {/* source summary strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {/* CLRS */}
          <div style={{ background: "#eef7f1", borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                  <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>CLRS §24.3</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>Verified</div>
              </div>
            </div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "800 10.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 9px", borderRadius: 8 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3.5l2.5 5.2 5.7.8-4.1 4 .97 5.7L12 16.9 6.93 19.2l.97-5.7-4.1-4 5.7-.8z" />
              </svg>
              Preferred
            </div>
          </div>
          {/* Sandbox */}
          <div style={{ background: "#eef7f1", borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
                  <path d="M7 9.5l3 3-3 3M13 15.5h4" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Sandbox</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>Verified by run</div>
              </div>
            </div>
            <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Backs 3 claims</div>
          </div>
          {/* Skiena */}
          <div style={{ background: "#eef2fb", borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3h8l5 5v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
                  <path d="M14 3v5h5M9 13h6M9 16.5h4" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Skiena</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#3a63b0" }}>Retrieved</div>
              </div>
            </div>
            <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Backs 3 claims</div>
          </div>
          {/* cp-algorithms */}
          <div style={{ background: "#f3eefc", borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3.2 9h17.6M3.2 15h17.6M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
                </svg>
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>cp-algorithms</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#6d5bd0" }}>Added by you</div>
              </div>
            </div>
            <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Backs 1 claim</div>
          </div>
        </div>

        {/* coverage matrix */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "26px 28px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "900 19px var(--font-nunito)", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>Coverage map</div>
              <div style={{ font: "600 13px/1.5 var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>Which source backs each claim. Empty rows are the claims to worry about.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "9px 14px", borderRadius: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l9 15.5H3z" />
                <path d="M12 10v4M12 17h.01" />
              </svg>
              1 unsupported
            </div>
          </div>

          {/* column headers */}
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 78px 78px 78px 78px", gap: 10, alignItems: "end", marginBottom: 8 }}>
            <span style={{ font: "800 10.5px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#a7a1b8" }}>Claim</span>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6c6780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
              </svg>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6c6780" }}>CLRS</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6c6780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
                <path d="M7 9.5l3 3-3 3M13 15.5h4" />
              </svg>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6c6780" }}>Sandbox</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6c6780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3h8l5 5v12a1 1 0 01-1 1H6a1 1 0 01-1-1V4a1 1 0 011-1z" />
                <path d="M14 3v5h5M9 13h6M9 16.5h4" />
              </svg>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6c6780" }}>Skiena</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6c6780" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M3.2 9h17.6M3.2 15h17.6M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
              </svg>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6c6780" }}>Web</span>
            </div>
          </div>

          {/* rows */}
          <div style={rowStyle}>
            <span style={{ font: "700 13.5px var(--font-nunito)" }}>Greedy grows the shortest-path tree</span>
            <GreenCell />
            <GreenCell />
            <EmptyCell />
            <EmptyCell />
          </div>
          <div style={rowStyle}>
            <span style={{ font: "700 13.5px var(--font-nunito)" }}>Finalised distance is correct</span>
            <BlueCell />
            <EmptyCell />
            <BlueCell />
            <EmptyCell />
          </div>
          <div style={rowStyle}>
            <span style={{ font: "700 13.5px var(--font-nunito)" }}>Priority queue keyed by distance</span>
            <GreenCell />
            <GreenCell />
            <EmptyCell />
            <BlueCell />
          </div>
          <div style={rowStyle}>
            <span style={{ font: "700 13.5px var(--font-nunito)" }}>O((V+E) log V) runtime</span>
            <GreenCell />
            <EmptyCell />
            <BlueCell />
            <EmptyCell />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 78px 78px 78px 78px", gap: 10, alignItems: "center", padding: "11px 12px", borderRadius: 14, background: "#fdf2f1", border: "1.5px solid #f3d9d6" }}>
            <span style={{ font: "800 13.5px var(--font-nunito)", color: "#c0392b", display: "flex", alignItems: "center", gap: 7 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l9 15.5H3z" />
                <path d="M12 10v4M12 17h.01" />
              </svg>
              Works on any weighted graph
            </span>
            <DashedCell />
            <DashedCell />
            <DashedCell />
            <DashedCell />
          </div>

          {/* legend */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0edf6", font: "700 12px var(--font-nunito)", color: "#6c6780" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 15, height: 15, borderRadius: 5, background: "#0e8c6b" }} />Verified by execution
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 15, height: 15, borderRadius: 5, background: "#2d6cdf" }} />Backed by a source
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 15, height: 15, borderRadius: 5, background: "#fff", border: "1.5px dashed #e3b4af" }} />Unsupported
            </span>
          </div>
        </div>

        {/* bottom row: unsupported action + coverage health */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "stretch" }}>
          {/* unsupported spotlight */}
          <div style={{ background: "#221d2e", borderRadius: 24, padding: "24px 26px", color: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 140% at 90% 10%,rgba(192,57,43,.32),transparent 55%)" }} />
            <div style={{ position: "relative", width: 56, height: 56, borderRadius: 17, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f0a99f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l9 15.5H3z" />
                <path d="M12 10v4M12 17h.01" />
              </svg>
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#f0a99f", marginBottom: 5 }}>1 unsupported claim</div>
              <div style={{ font: "800 16px/1.4 var(--font-nunito)" }}>&quot;Works on any weighted graph&quot; isn&apos;t backed by any source.</div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#c9c3d8", marginTop: 5 }}>The Skeptic flagged it — resolve the dispute to correct or qualify the claim.</div>
            </div>
            <Link href="/topics/conflicts" style={{ position: "relative", textDecoration: "none", display: "flex", alignItems: "center", gap: 7, background: "#fff", color: "#221f2e", font: "800 13.5px var(--font-nunito)", padding: "12px 20px", borderRadius: 13, whiteSpace: "nowrap", flexShrink: 0 }}>
              Resolve in Conflicts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* coverage health */}
          <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
              <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="44" cy="44" r="36" fill="none" stroke="#eee9f7" strokeWidth="11" />
                <circle cx="44" cy="44" r="36" fill="none" stroke="#0e8c6b" strokeWidth="11" strokeLinecap="round" strokeDasharray="226" strokeDashoffset="38" />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ font: "900 20px var(--font-nunito)" }}>83%</div>
                <div style={{ font: "700 9.5px var(--font-nunito)", color: "#8b8699" }}>coverage</div>
              </div>
            </div>
            <div>
              <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 4 }}>Coverage health</div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#6c6780" }}>5 of 6 claims are backed by at least one source.</div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
