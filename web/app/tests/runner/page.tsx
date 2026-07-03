import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Test Runner · VeriLearn" };

export default function TestRunnerPage() {
  return (
    <AppShell active="tests">
      <main style={{ padding: "22px 26px 28px", display: "flex", flexDirection: "column", gap: 18 }}>
        {/* test-mode notice — the sidebar can't be dimmed, so it lives in the main area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 13,
            background: "#f2effc",
            border: "1px solid #e3ddf6",
            borderRadius: 16,
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <rect x="5" y="11" width="14" height="9" rx="2" />
              <path d="M8 11V8a4 4 0 018 0v3" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "800 13.5px var(--font-nunito)", color: "#6d5bd0" }}>Test in progress · navigation paused</div>
            <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              Navigation is paused so the timer stays honest.
            </div>
          </div>
        </div>

        {/* header: exit + title + timer */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/tests/dijkstra-checkpoint"
            title="Exit test"
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
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Link>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Checkpoint · covers §1–§3</div>
            <div style={{ font: "900 22px var(--font-nunito)", letterSpacing: "-.02em" }}>Dijkstra&apos;s algorithm</div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              font: "900 16px var(--font-nunito)",
              color: "#c0392b",
              background: "#fff",
              padding: "11px 16px",
              borderRadius: 13,
              boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v4l3 2" />
            </svg>
            12:47
          </div>
        </div>

        {/* progress: question count + segmented bar */}
        <div style={{ background: "#fff", borderRadius: 18, padding: "16px 20px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 11 }}>
            <span style={{ font: "800 13px var(--font-nunito)" }}>Question 4 of 12</span>
            <span style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>3 answered · 1 flagged</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#2e9c6a" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#2e9c6a" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#c99a2b" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#6d5bd0" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: "#e2dcf1" }} />
          </div>
        </div>

        {/* question card */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "30px 34px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              font: "800 10px var(--font-nunito)",
              letterSpacing: ".05em",
              textTransform: "uppercase",
              color: "#6d5bd0",
              background: "#efe9ff",
              padding: "5px 11px",
              borderRadius: 9,
              marginBottom: 18,
            }}
          >
            §2 · Implementation
          </div>
          <div style={{ font: "900 21px/1.45 var(--font-nunito)", marginBottom: 24 }}>
            Which data structure lets Dijkstra repeatedly extract the unvisited node with the smallest tentative distance in O(log V)?
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                border: "2px solid #ece8f4",
                background: "#fbfafd",
                borderRadius: 15,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 9, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px var(--font-nunito)", color: "#8b8699", flexShrink: 0 }}>A</span>
              <span style={{ font: "700 14.5px var(--font-nunito)" }}>A plain unsorted array</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                border: "2px solid #6d5bd0",
                background: "#f7f5fd",
                borderRadius: 15,
                cursor: "pointer",
                boxShadow: "0 8px 20px -10px rgba(109,91,208,.4)",
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 9, background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px var(--font-nunito)", color: "#fff", flexShrink: 0 }}>B</span>
              <span style={{ font: "800 14.5px var(--font-nunito)", color: "#6d5bd0" }}>A binary min-heap (priority queue)</span>
              <span style={{ marginLeft: "auto", width: 22, height: 22, borderRadius: "50%", background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                border: "2px solid #ece8f4",
                background: "#fbfafd",
                borderRadius: 15,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 9, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px var(--font-nunito)", color: "#8b8699", flexShrink: 0 }}>C</span>
              <span style={{ font: "700 14.5px var(--font-nunito)" }}>A stack (LIFO)</span>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "15px 18px",
                border: "2px solid #ece8f4",
                background: "#fbfafd",
                borderRadius: 15,
                cursor: "pointer",
              }}
            >
              <span style={{ width: 28, height: 28, borderRadius: 9, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center", font: "800 13px var(--font-nunito)", color: "#8b8699", flexShrink: 0 }}>D</span>
              <span style={{ font: "700 14.5px var(--font-nunito)" }}>A hash map keyed by node id</span>
            </div>
          </div>
        </div>

        {/* footer nav */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              border: "1.5px solid #ece8f4",
              borderRadius: 14,
              background: "#fff",
              color: "#6c6780",
              font: "800 13.5px var(--font-nunito)",
              padding: "13px 20px",
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
            Previous
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                border: "1.5px solid #f0e2c2",
                background: "#fbf6ec",
                color: "#b4830f",
                font: "800 12.5px var(--font-nunito)",
                padding: "13px 18px",
                borderRadius: 14,
                cursor: "pointer",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 21V4M5 4h11l-2 3.5L16 11H5" />
              </svg>
              Flag
            </button>
            <Link
              href="/tests/results"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                textDecoration: "none",
                borderRadius: 14,
                background: "#6d5bd0",
                color: "#fff",
                font: "800 14px var(--font-nunito)",
                padding: "14px 26px",
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Next question
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, font: "600 11.5px var(--font-nunito)", color: "#a7a1b8" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="11" width="14" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 018 0v3" />
          </svg>
          Graded assessment — sources &amp; explanations appear after you finish.
        </div>
      </main>
    </AppShell>
  );
}
