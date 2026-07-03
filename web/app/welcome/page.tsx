import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Welcome · VeriLearn" };

const EXAMPLES = [
  { emoji: "🧭", bg: "#efe9ff", title: "Dijkstra's algorithm", meta: "Algorithms · beginner" },
  { emoji: "🌳", bg: "#e9f7ef", title: "Merkle trees", meta: "Cryptography · intermediate" },
  { emoji: "🔍", bg: "#e2ecfb", title: "Binary search", meta: "Algorithms · beginner" },
];

export default function WelcomePage() {
  return (
    <AppShell active="dashboard">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Welcome to VeriLearn, Adeline 👋</div>
              <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                Let&apos;s set up your first verified topic.
              </div>
            </div>
          </div>

          {/* big empty hero */}
          <div style={{ position: "relative", background: "#211d2e", borderRadius: 24, padding: "44px 40px", overflow: "hidden", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 130% at 50% 0%,rgba(139,120,232,.4),transparent 55%)" }} />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 20,
                  background: "rgba(255,255,255,.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 18px",
                }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div style={{ font: "900 26px/1.2 var(--font-nunito)", color: "#fff", maxWidth: 480, margin: "0 auto" }}>
                Learn things you can actually trust ✨
              </div>
              <div style={{ font: "600 13.5px/1.6 var(--font-nunito)", color: "#c9c3d8", maxWidth: 440, margin: "12px auto 0" }}>
                Name a topic, and VeriLearn writes you a lecture — then checks every claim against real sources before you read a word.
              </div>
              <Link
                href="/new-topic"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  textDecoration: "none",
                  marginTop: 22,
                  padding: "14px 28px",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#221f2e",
                  font: "800 14.5px var(--font-nunito)",
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create your first topic
              </Link>
            </div>
          </div>

          {/* example on-ramps */}
          <div>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 12 }}>
              Or start from an example
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
              {EXAMPLES.map((e) => (
                <Link
                  key={e.title}
                  href="/new-topic"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    background: "#fff",
                    borderRadius: 18,
                    padding: 18,
                    boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
                  }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: e.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, marginBottom: 12 }}>
                    {e.emoji}
                  </div>
                  <div style={{ font: "800 14px var(--font-nunito)" }}>{e.title}</div>
                  <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>{e.meta}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* how it works, 3 steps */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 16 }}>How VeriLearn works</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", font: "900 14px var(--font-nunito)", color: "#6d5bd0" }}>1</div>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Name a topic</div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>Tell us what to teach and where you&apos;re starting from.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", font: "900 14px var(--font-nunito)", color: "#6d5bd0" }}>2</div>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>We verify it</div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>Every claim is checked against sources &amp; red-teamed.</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", font: "900 14px var(--font-nunito)", color: "#6d5bd0" }}>3</div>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Learn &amp; retain</div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>Read, apply, and review on a spaced schedule.</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 20, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                margin: "0 auto 12px",
                background: "linear-gradient(135deg,#f6d8e8,#efe4ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 38,
                border: "3px solid #f3eefc",
              }}
            >
              🧑‍🎨
            </div>
            <div style={{ font: "900 17px var(--font-nunito)" }}>Adeline Watson</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                font: "800 11.5px var(--font-nunito)",
                color: "#8b8699",
                background: "#f3f1f9",
                padding: "5px 12px",
                borderRadius: 10,
                marginTop: 8,
                whiteSpace: "nowrap",
              }}
            >
              New learner 🌱
            </div>
          </div>

          {/* empty stat placeholders */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14 }}>Your stats</div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b6b1c4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "900 16px var(--font-nunito)", color: "#b6b1c4" }}>0</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Verified topics</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#b6b1c4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "900 16px var(--font-nunito)", color: "#b6b1c4" }}>0</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Claims checked</div>
              </div>
            </div>
            <div style={{ font: "600 11px/1.5 var(--font-nunito)", color: "#a7a1b8", marginTop: 8, textAlign: "center" }}>
              These fill in once you start your first topic.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
