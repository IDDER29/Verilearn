import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Pipeline · VeriLearn" };

export default function PipelinePage() {
  return (
    <AppShell active="topics">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <style>{"@keyframes vlp{0%,100%{opacity:1}50%{opacity:.4}}"}</style>

        {/* header */}
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
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>New topic · verifying</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Merkle trees</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "9px 15px", borderRadius: 12 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#6d5bd0", animation: "vlp 1.1s ease-in-out infinite" }} />
            Verifying · 12s
          </div>
        </div>

        {/* hero verifying banner */}
        <div style={{ position: "relative", background: "#211d2e", borderRadius: 24, padding: "32px 36px", overflow: "hidden", display: "flex", alignItems: "center", gap: 26 }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 150% at 88% 15%,rgba(139,120,232,.42),transparent 55%)" }} />
          <div style={{ position: "relative", width: 78, height: 78, flexShrink: 0 }}>
            <svg width="78" height="78" viewBox="0 0 78 78" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="39" cy="39" r="32" fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="9" />
              <circle cx="39" cy="39" r="32" fill="none" stroke="#8b78e8" strokeWidth="9" strokeLinecap="round" strokeDasharray="201" strokeDashoffset="117" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", font: "900 17px var(--font-nunito)", color: "#fff" }}>42%</div>
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".12em", textTransform: "uppercase", color: "#b3a7f0", marginBottom: 6 }}>Building your verified lecture</div>
            <div style={{ font: "900 22px/1.25 var(--font-nunito)", color: "#fff" }}>Checking every claim against real sources ✨</div>
            <div style={{ font: "600 13px/1.55 var(--font-nunito)", color: "#c9c3d8", marginTop: 8 }}>
              You can leave this page — it keeps running, and the lecture lands in your library when it&apos;s done.
            </div>
          </div>
        </div>

        {/* stage stepper */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 18px var(--font-nunito)", marginBottom: 20 }}>Verification pipeline</div>

          {/* done */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "13px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Triage the topic</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Scoped to beginner · 4 sections planned</div>
            </div>
            <span style={{ font: "800 11.5px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 12px", borderRadius: 10 }}>Done</span>
          </div>
          <div style={{ height: 1, background: "#f5f3fa" }} />
          {/* done */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "13px 0" }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Retrieve trusted sources</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>4 sources gathered · CLRS, Skiena, sandbox, web</div>
            </div>
            <span style={{ font: "800 11.5px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 12px", borderRadius: 10 }}>Done</span>
          </div>
          <div style={{ height: 1, background: "#f5f3fa" }} />
          {/* active */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "13px 12px", background: "#f7f5fd", borderRadius: 14, margin: "2px -12px" }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, animation: "vlp 1.2s ease-in-out infinite" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h10M4 18h13" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)", color: "#6d5bd0" }}>Writing the lecture</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Drafting §2 Implementation…</div>
            </div>
            <span style={{ display: "flex", alignItems: "center", gap: 5, font: "800 11.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "6px 12px", borderRadius: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#6d5bd0", animation: "vlp 1s ease-in-out infinite" }} />
              Running
            </span>
          </div>
          <div style={{ height: 1, background: "#f5f3fa" }} />
          {/* pending */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "13px 0", opacity: 0.55 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "#f1eff5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Verify each claim</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Match every claim to a source</div>
            </div>
            <span style={{ font: "800 11.5px var(--font-nunito)", color: "#a7a1b8", background: "#f3f1f9", padding: "6px 12px", borderRadius: 10 }}>Waiting</span>
          </div>
          <div style={{ height: 1, background: "#f5f3fa" }} />
          {/* pending */}
          <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "13px 0", opacity: 0.55 }}>
            <div style={{ width: 40, height: 40, borderRadius: 13, background: "#f1eff5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" />
                <circle cx="12" cy="9.5" r="1.5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 14.5px var(--font-nunito)" }}>Skeptic red-teams it</div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Stress-test claims &amp; flag disputes</div>
            </div>
            <span style={{ font: "800 11.5px var(--font-nunito)", color: "#a7a1b8", background: "#f3f1f9", padding: "6px 12px", borderRadius: 10 }}>Waiting</span>
          </div>
        </div>

        {/* live counters */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h10M4 18h13" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>4</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Sections drafted</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>4</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Sources found</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>3 / 6</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Claims verified</div>
            </div>
          </div>
        </div>
        <Link
          href="/topics"
          style={{
            alignSelf: "flex-start",
            textDecoration: "none",
            display: "flex",
            alignItems: "center",
            gap: 8,
            borderRadius: 14,
            background: "#0e8c6b",
            color: "#fff",
            font: "800 14px var(--font-nunito)",
            padding: "13px 24px",
            boxShadow: "0 12px 26px -10px rgba(14,140,107,.6)",
          }}
        >
          Open the lecture when ready
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </Link>
      </main>
    </AppShell>
  );
}
