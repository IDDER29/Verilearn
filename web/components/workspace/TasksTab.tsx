"use client";

import WorkspaceTabs from "./WorkspaceTabs";
import type { TabKey } from "./types";

export default function TasksTab({ onTab }: { onTab: (t: TabKey) => void }) {
  return (
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
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={() => onTab("lecture")}
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
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / Algorithms</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Dijkstra&apos;s algorithm</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#9a7f2a", background: "#fbefdd", padding: "9px 15px", borderRadius: 12 }}>
            ✍️ 1 of 3 tasks passed
          </div>
        </div>

        {/* tabs */}
        <WorkspaceTabs active="tasks" onTab={onTab} />

        {/* task selector */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <div style={{ background: "#6d5bd0", borderRadius: 16, padding: "14px 16px", color: "#fff", boxShadow: "0 12px 26px -12px rgba(109,91,208,.6)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ font: "800 11px var(--font-nunito)", opacity: 0.8 }}>TASK 1 · EXPLAIN</span>
              <span style={{ font: "800 10px var(--font-nunito)", background: "rgba(255,255,255,.22)", padding: "3px 8px", borderRadius: 8 }}>Revise</span>
            </div>
            <div style={{ font: "800 13.5px/1.4 var(--font-nunito)" }}>Why Dijkstra fails on negative edges</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#9a95a8" }}>TASK 2 · REASON</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "3px 8px", borderRadius: 8 }}>To do</span>
            </div>
            <div style={{ font: "800 13.5px/1.4 var(--font-nunito)", color: "#221f2e" }}>Trace the queue on a sample graph</div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, padding: "14px 16px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#9a95a8" }}>TASK 3 · APPLY</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "3px 8px", borderRadius: 8 }}>✓ Passed</span>
            </div>
            <div style={{ font: "800 13.5px/1.4 var(--font-nunito)", color: "#221f2e" }}>Pick the right data structure</div>
          </div>
        </div>

        {/* active task */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#6d5bd0", marginBottom: 8 }}>Task 1 · Explain</div>
          <h2 style={{ font: "900 20px/1.35 var(--font-nunito)", letterSpacing: "-.01em", margin: "0 0 18px" }}>Explain, in your own words, why Dijkstra&apos;s algorithm fails on graphs with negative edge weights.</h2>

          {/* submitted answer */}
          <div style={{ font: "800 11px var(--font-nunito)", color: "#9a95a8", marginBottom: 8 }}>YOUR ANSWER</div>
          <div style={{ background: "#f7f5fb", border: "1.5px solid #ece8f4", borderRadius: 14, padding: "15px 17px", font: "600 14.5px/1.7 var(--font-nunito)", color: "#3a3550", marginBottom: 18 }}>
            Because it locks in a node&apos;s distance as soon as it&apos;s picked. If a negative edge appears later, it could make an already-finalised path shorter, but Dijkstra never revisits it — so the &quot;final&quot; distance can be wrong.
          </div>

          {/* grade */}
          <div style={{ background: "#fbefdd", borderRadius: 16, padding: "16px 18px", marginBottom: 18 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, font: "900 15px var(--font-nunito)", color: "#9a7f2a" }}>🟡 Partially correct</div>
              <div style={{ font: "900 18px var(--font-nunito)", color: "#9a7f2a" }}>60%</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, font: "700 13.5px var(--font-nunito)" }}>
                <span style={{ width: 20, height: 20, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>✓</span>Identifies that finalised nodes aren&apos;t revisited
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, font: "700 13.5px var(--font-nunito)" }}>
                <span style={{ width: 20, height: 20, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11 }}>✓</span>Connects the greedy choice to the failure
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, font: "700 13.5px var(--font-nunito)", color: "#9a95a8" }}>
                <span style={{ width: 20, height: 20, borderRadius: 7, border: "2px solid #d8c9a3", boxSizing: "border-box" }} />Missing: names the <b style={{ color: "#3a3550" }}>cut property</b> assumption that breaks
              </div>
            </div>
          </div>

          {/* follow-up */}
          <div style={{ background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12px var(--font-nunito)", color: "#6d5bd0", marginBottom: 8 }}>💡 Follow-up to lift you to a pass</div>
            <div style={{ font: "700 14.5px var(--font-nunito)", marginBottom: 12 }}>Which specific property of the shortest-path proof stops holding once an edge can be negative?</div>
            <button style={{ display: "flex", alignItems: "center", gap: 8, border: "1.5px solid #d9cff2", background: "#fff", color: "#6d5bd0", font: "800 13px var(--font-nunito)", padding: "10px 16px", borderRadius: 12, cursor: "pointer" }}>
              📚 Open a 2-min micro-chapter
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
          </div>

          {/* actions */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
            <span style={{ font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>Model answer unlocks at a pass (≥ 75%)</span>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: "pointer" }}>See model answer</button>
              <button style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 22px", borderRadius: 13, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)" }}>Revise answer</button>
            </div>
          </div>
        </div>
      </div>

      {/* ---- RIGHT ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* progress */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Task progress</div>
          <div style={{ position: "relative", width: 132, height: 132, margin: "0 auto 8px" }}>
            <svg width="132" height="132" viewBox="0 0 132 132" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="66" cy="66" r="56" fill="none" stroke="#eee9f7" strokeWidth="14" />
              <circle cx="66" cy="66" r="56" fill="none" stroke="#6d5bd0" strokeWidth="14" strokeLinecap="round" strokeDasharray="352" strokeDashoffset="235" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ font: "900 26px var(--font-nunito)" }}>1/3</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>passed</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, font: "700 12px var(--font-nunito)", marginTop: 6 }}>
            <span style={{ color: "#2e9c6a" }}>● 1 passed</span>
            <span style={{ color: "#9a7f2a" }}>● 1 revise</span>
            <span style={{ color: "#9a95a8" }}>● 1 to do</span>
          </div>
        </div>

        {/* rubric */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 6 }}>How it&apos;s graded</div>
          <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>Your answer is scored against a rubric built from the topic&apos;s verified sources — not a keyword match.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "700 12.5px/1.4 var(--font-nunito)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: "#0e8c6b", marginTop: 3, flexShrink: 0 }} />Node finalisation isn&apos;t revisited
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "700 12.5px/1.4 var(--font-nunito)" }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: "#0e8c6b", marginTop: 3, flexShrink: 0 }} />Greedy choice → failure link
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "700 12.5px/1.4 var(--font-nunito)", color: "#9a95a8" }}>
              <span style={{ width: 9, height: 9, borderRadius: 3, background: "#d8c9a3", marginTop: 3, flexShrink: 0 }} />Cut-property assumption breaks
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0edf6", font: "700 12px var(--font-nunito)", color: "#8b8699" }}>
            Source · <span style={{ color: "#2d6cdf" }}>CLRS §24.3</span>
          </div>
        </div>
      </div>
    </main>
  );
}
