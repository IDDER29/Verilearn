import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Conflicts · VeriLearn" };

export default function TopicConflictsPage() {
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
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "9px 15px", borderRadius: 12 }}>
              ⚖️ 1 open conflict
            </div>
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 8, background: "#fff", padding: 7, borderRadius: 16, boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
            <Link href="/topics" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>📖 Lecture</Link>
            <Link href="/topics/tasks" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>✍️ Tasks</Link>
            <span style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)" }}>
              ⚖️ Conflicts <span style={{ fontSize: 11, background: "rgba(255,255,255,.24)", padding: "1px 7px", borderRadius: 7 }}>1</span>
            </span>
            <Link href="/topics/sources" style={{ flex: 1, textAlign: "center", padding: 11, borderRadius: 12, color: "#6c6780", font: "700 13.5px var(--font-nunito)", textDecoration: "none" }}>🔗 Sources</Link>
          </div>

          {/* conflict list */}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, background: "#fff", borderRadius: 16, padding: "14px 16px", border: "2px solid #6d5bd0", boxShadow: "0 12px 26px -14px rgba(109,91,208,.4)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b" }}>● OPEN</span>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Raised by the Skeptic</span>
              </div>
              <div style={{ font: "800 13.5px/1.4 var(--font-nunito)" }}>&quot;Works on any weighted graph&quot;</div>
            </div>
            <div style={{ flex: 1, background: "#fbfafd", borderRadius: 16, padding: "14px 16px", border: "1.5px solid #ece8f4", opacity: 0.7 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ font: "800 11px var(--font-nunito)", color: "#2e9c6a" }}>✓ RESOLVED</span>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Execution sandbox</span>
              </div>
              <div style={{ font: "800 13.5px/1.4 var(--font-nunito)", color: "#6c6780" }}>&quot;O(V²) is always fastest&quot;</div>
            </div>
          </div>

          {/* conflict detail */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {/* disputed claim */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#f2effc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🧐</div>
              <div>
                <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#6d5bd0" }}>The Skeptic disputes a claim</div>
                <div style={{ font: "700 12.5px var(--font-nunito)", color: "#9a95a8" }}>Your call — pick the position that holds, and say why.</div>
              </div>
            </div>
            <div style={{ background: "#fbeceb", borderLeft: "4px solid #c0392b", borderRadius: "0 14px 14px 0", padding: "15px 18px", marginBottom: 22 }}>
              <div style={{ font: "800 15px/1.5 var(--font-nunito)", color: "#221f2e" }}>&quot;Dijkstra&apos;s algorithm works on <u>any</u> weighted graph.&quot;</div>
              <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8a5a56", marginTop: 6 }}>Flagged because the lecture didn&apos;t qualify &quot;weighted&quot; — with negative weights the correctness proof fails.</div>
            </div>

            {/* competing positions */}
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 12 }}>Competing positions</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
              <div style={{ border: "2px solid #6d5bd0", borderRadius: 16, padding: "16px 18px", background: "#f7f5fd", position: "relative" }}>
                <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</div>
                <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>Restrict to non-negative</div>
                <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#6c6780" }}>Add the constraint: it&apos;s correct only on graphs with non-negative edge weights. Use Bellman-Ford otherwise.</div>
                <div style={{ marginTop: 10, font: "700 11.5px var(--font-nunito)", color: "#2d6cdf" }}>◉ Backed by CLRS §24.3</div>
              </div>
              <div style={{ border: "1.5px solid #ece8f4", borderRadius: 16, padding: "16px 18px", background: "#fff" }}>
                <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8, color: "#221f2e" }}>Keep as-is</div>
                <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699" }}>Argue &quot;weighted&quot; implies non-negative in context, so the original wording is acceptable.</div>
                <div style={{ marginTop: 10, font: "700 11.5px var(--font-nunito)", color: "#b4690e" }}>△ Unsupported by sources</div>
              </div>
            </div>

            {/* resolution */}
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 10 }}>Your resolution</div>
            <textarea
              rows={3}
              defaultValue="Constrain the claim to non-negative weights and cite CLRS §24.3. For negative edges, the lecture should point to Bellman-Ford."
              style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #ece8f4", borderRadius: 14, padding: "13px 15px", font: "600 14px/1.6 var(--font-nunito)", background: "#fbfafd", outline: "none", resize: "none", marginBottom: 18 }}
            />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>🔄 Resolving updates the trust badges everywhere</div>
              <button style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", padding: "12px 24px", borderRadius: 13, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)", whiteSpace: "nowrap" }}>Record resolution</button>
            </div>
          </div>
        </div>

        {/* ---- RIGHT ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* the skeptic */}
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 22, color: "#fff", boxShadow: "0 16px 34px -16px rgba(40,30,70,.7)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧐</div>
              <div>
                <div style={{ font: "900 16px var(--font-nunito)" }}>The Skeptic</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#b3a7f0" }}>Red-teams every topic</div>
              </div>
            </div>
            <div style={{ font: "600 13px/1.65 var(--font-nunito)", color: "#d8d3e8" }}>It stress-tests each claim against edge cases and sources, then flags anything it can break. You stay the judge.</div>
            <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
              <div>
                <div style={{ font: "900 20px var(--font-nunito)" }}>6</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>claims tested</div>
              </div>
              <div>
                <div style={{ font: "900 20px var(--font-nunito)" }}>1</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>flagged</div>
              </div>
              <div>
                <div style={{ font: "900 20px var(--font-nunito)" }}>5</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>held up</div>
              </div>
            </div>
          </div>

          {/* what happens */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>When you resolve</div>
            <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, background: "#e4f4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✅</span>The claim&apos;s badge updates in the lecture
            </div>
            <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, background: "#e4ecfb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🔢</span>The conflict counter drops to 0
            </div>
            <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, background: "#f2effc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>📌</span>Your reasoning is saved to the topic
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
