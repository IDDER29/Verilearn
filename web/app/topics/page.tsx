import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Topic Workspace · VeriLearn" };

export default function TopicWorkspacePage() {
  return (
    <AppShell active="topics">
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
          {/* breadcrumb row */}
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
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / Algorithms</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Dijkstra&apos;s algorithm</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "9px 15px", borderRadius: 12 }}>
              ✓ 83% verified
            </div>
          </div>

          {/* meta + section progress */}
          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: "18px 22px",
              boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
              display: "flex",
              alignItems: "center",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧭</div>
              <div>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#8b8699" }}>Beginner · 6 claims · 4 sources</div>
                <div style={{ font: "700 12px var(--font-nunito)", color: "#221f2e", marginTop: 2 }}>
                  Trust: <span style={{ color: "#0e8c6b" }}>3 verified</span> · <span style={{ color: "#2d6cdf" }}>2 sourced</span> · <span style={{ color: "#c0392b" }}>1 disputed</span>
                </div>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 150 }}>
              <div style={{ display: "flex", justifyContent: "space-between", font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginBottom: 6 }}>
                <span>Section 2 of 4</span>
                <span>50%</span>
              </div>
              <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "50%", height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
              </div>
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 8, background: "#fff", padding: 7, borderRadius: 16, boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
            <span style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)" }}>📖 Lecture</span>
            <Link href="/topics/tasks" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>✍️ Tasks</Link>
            <Link href="/topics/conflicts" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>
              ⚖️ Conflicts <span style={{ fontSize: 11, color: "#c0392b" }}>1</span>
            </Link>
            <Link href="/topics/sources" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>🔗 Sources</Link>
          </div>

          {/* lecture reader */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {/* section chips */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
              <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "7px 13px", borderRadius: 11 }}>✓ Prereqs</span>
              <span style={{ font: "800 12px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "7px 13px", borderRadius: 11 }}>§1 Core idea</span>
              <span style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "7px 13px", borderRadius: 11 }}>§2 Implementation</span>
              <span style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "7px 13px", borderRadius: 11 }}>§3 Limits</span>
            </div>

            <h2 style={{ font: "900 21px var(--font-nunito)", letterSpacing: "-.01em", margin: "0 0 14px" }}>The core idea: greedily grow the shortest-path tree</h2>
            <p style={{ font: "600 15px/1.85 var(--font-nunito)", color: "#3a3550", margin: "0 0 16px" }}>
              Dijkstra&apos;s algorithm finds the shortest path from a source node by repeatedly picking the{" "}
              <span style={{ borderBottom: "2.5px solid #0e8c6b", paddingBottom: 1, cursor: "pointer" }}>unvisited node with the smallest tentative distance</span>,
              then relaxing its neighbours. Each time a node is finalised, its shortest distance is{" "}
              <span style={{ borderBottom: "2.5px solid #2d6cdf", paddingBottom: 1, cursor: "pointer" }}>guaranteed to be correct</span>
              {" "}— the greedy choice never has to be revised.
            </p>

            {/* highlighted disputed claim */}
            <div style={{ background: "#fbeceb", borderLeft: "4px solid #c0392b", borderRadius: "0 14px 14px 0", padding: "14px 18px", margin: "0 0 18px" }}>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#c0392b", marginBottom: 5 }}>⚠️ Disputed claim · the Skeptic flagged this</div>
              <div style={{ font: "700 14.5px/1.6 var(--font-nunito)", color: "#221f2e" }}>
                &quot;It works on any weighted graph.&quot; — this fails with <b>negative edge weights</b>. Tap Conflicts to resolve.
              </div>
            </div>

            <p style={{ font: "600 15px/1.85 var(--font-nunito)", color: "#3a3550", margin: "0 0 22px" }}>
              The classic implementation uses a{" "}
              <span style={{ borderBottom: "2.5px solid #2d6cdf", paddingBottom: 1, cursor: "pointer" }}>priority queue keyed by tentative distance</span>,
              giving an overall running time of O((V + E) log V).
            </p>

            {/* active listening prompt */}
            <div style={{ background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12px var(--font-nunito)", color: "#6d5bd0", marginBottom: 10 }}>🧠 Before you continue — one prompt to lock it in</div>
              <div style={{ font: "700 14.5px var(--font-nunito)", marginBottom: 10 }}>In your own words, why can the greedy choice never be wrong here?</div>
              <div style={{ display: "flex", gap: 10 }}>
                <input placeholder="Type your answer…" style={{ flex: 1, border: "1.5px solid #e3ddf6", borderRadius: 12, padding: "11px 14px", font: "600 14px var(--font-nunito)", background: "#fff", outline: "none" }} />
                <button style={{ border: "none", borderRadius: 12, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "0 20px", cursor: "pointer", whiteSpace: "nowrap" }}>Submit</button>
              </div>
            </div>

            {/* gate + next */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>🔒 Answer the prompt to unlock the next section</div>
              <button style={{ border: "none", borderRadius: 13, background: "#e9e5f4", color: "#a29cb6", font: "800 14px var(--font-nunito)", padding: "12px 24px", cursor: "not-allowed", whiteSpace: "nowrap" }}>Next section →</button>
            </div>
          </div>
        </div>

        {/* ---- RIGHT: TRUST PANEL ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* section trust */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Section trust</div>
            <div style={{ height: 12, borderRadius: 6, overflow: "hidden", display: "flex", gap: 2, marginBottom: 14 }}>
              <span style={{ flex: 3, background: "#0e8c6b" }} />
              <span style={{ flex: 2, background: "#2d6cdf" }} />
              <span style={{ flex: 1, background: "#c0392b" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
                <span style={{ width: 11, height: 11, borderRadius: 4, background: "#0e8c6b" }} />Verified by execution<span style={{ marginLeft: "auto", color: "#8b8699" }}>3</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
                <span style={{ width: 11, height: 11, borderRadius: 4, background: "#2d6cdf" }} />Backed by a source<span style={{ marginLeft: "auto", color: "#8b8699" }}>2</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
                <span style={{ width: 11, height: 11, borderRadius: 4, background: "#c0392b" }} />Disputed<span style={{ marginLeft: "auto", color: "#8b8699" }}>1</span>
              </div>
            </div>
          </div>

          {/* claim detail */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 10 }}>Selected claim</div>
            <div style={{ font: "700 15px/1.55 var(--font-nunito)", marginBottom: 14 }}>&quot;The greedy choice is guaranteed to be correct.&quot;</div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "800 12px var(--font-nunito)", color: "#2d6cdf", background: "#e4ecfb", padding: "6px 12px", borderRadius: 10, marginBottom: 14 }}>◉ Backed by a source</div>
            <div style={{ background: "#f7f5fb", borderRadius: 14, padding: "13px 15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>📘</div>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>CLRS · §24.3</div>
              </div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#6c6780" }}>Proof of correctness via the cut property — page 661.</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, font: "700 12.5px var(--font-nunito)" }}>
              <span style={{ color: "#8b8699" }}>Confidence</span>
              <span style={{ color: "#2e9c6a" }}>High · 0.94</span>
            </div>
          </div>

          {/* active listening checklist */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Active listening</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</span>Predict the section
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</span>Pause-point check
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)", color: "#6d5bd0" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, border: "2px solid #6d5bd0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>3</span>Explain in your words
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)", color: "#b6b1c4" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, border: "2px solid #e0dced", boxSizing: "border-box" }} />Close the section
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
