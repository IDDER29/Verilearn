import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Live workshop · VeriLearn" };

export default function EventDetailPage() {
  return (
    <AppShell active="events">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/events"
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
          <div>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Events / Live workshop</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Graph algorithms, verified</div>
          </div>
        </div>

        {/* hero */}
        <div
          style={{
            position: "relative",
            background: "#211d2e",
            borderRadius: 24,
            padding: "30px 34px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 26,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(120% 140% at 88% 15%,rgba(139,120,232,.42),transparent 55%)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 96,
              height: 100,
              borderRadius: 18,
              background: "rgba(255,255,255,.1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ font: "800 12px var(--font-nunito)", color: "#b3a7f0", textTransform: "uppercase" }}>Sat</span>
            <span style={{ font: "900 40px var(--font-nunito)", color: "#fff", lineHeight: 1 }}>12</span>
            <span style={{ font: "700 11px var(--font-nunito)", color: "#c9c3d8" }}>Jul</span>
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                font: "800 10px var(--font-nunito)",
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#211d2e",
                background: "#8b78e8",
                padding: "4px 10px",
                borderRadius: 8,
                marginBottom: 11,
              }}
            >
              🔴 Live workshop
            </div>
            <div style={{ font: "900 23px/1.25 var(--font-nunito)", color: "#fff" }}>A live claim-check with the Skeptic</div>
            <div style={{ display: "flex", gap: 18, marginTop: 12, font: "700 12.5px var(--font-nunito)", color: "#c9c3d8" }}>
              <span>🕑 2:00 PM · 45 min</span>
              <span>👥 128 going</span>
              <span>🎥 Online</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 20, alignItems: "start" }}>
          {/* about */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: "24px 26px",
                boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
              }}
            >
              <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 10 }}>About this session</div>
              <p style={{ font: "600 14px/1.75 var(--font-nunito)", color: "#3a3550", margin: "0 0 14px" }}>
                Watch a graph-algorithms lecture get verified live. We&apos;ll run each claim through the Skeptic on hard
                mode, chase down sources in real time, and resolve a real dispute — the &quot;works on any weighted
                graph&quot; trap — together.
              </p>
              <div
                style={{
                  font: "800 12px var(--font-nunito)",
                  letterSpacing: ".05em",
                  textTransform: "uppercase",
                  color: "#a7a1b8",
                  marginBottom: 10,
                }}
              >
                What you&apos;ll see
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ display: "flex", gap: 10, font: "700 13.5px/1.4 var(--font-nunito)" }}>
                  <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>How a claim gets tagged verified vs disputed
                </div>
                <div style={{ display: "flex", gap: 10, font: "700 13.5px/1.4 var(--font-nunito)" }}>
                  <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Live source retrieval &amp; the coverage map
                </div>
                <div style={{ display: "flex", gap: 10, font: "700 13.5px/1.4 var(--font-nunito)" }}>
                  <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Resolving a Skeptic dispute end to end
                </div>
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: "20px 24px",
                boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#d7f0e2,#e9f7ef)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 24,
                  flexShrink: 0,
                }}
              >
                🧑‍🏫
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14.5px var(--font-nunito)" }}>Hosted by Dr. Sofia Lang</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Algorithms lead · VeriLearn team</div>
              </div>
              <Link
                href="/community"
                style={{
                  textDecoration: "none",
                  font: "800 12px var(--font-nunito)",
                  color: "#6d5bd0",
                  background: "#f1eefb",
                  padding: "8px 14px",
                  borderRadius: 10,
                }}
              >
                Follow
              </Link>
            </div>
          </div>

          {/* register card */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 22,
                boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
              }}
            >
              <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 4 }}>Free to join</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
                A recording is shared after, but live attendees can ask the Skeptic questions.
              </div>
              <Link
                href="/events/registered"
                style={{
                  display: "block",
                  textAlign: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  padding: 14,
                  border: "none",
                  borderRadius: 13,
                  background: "#6d5bd0",
                  color: "#fff",
                  font: "800 14.5px var(--font-nunito)",
                  textDecoration: "none",
                  boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
                }}
              >
                Register free
              </Link>
              <button
                style={{
                  width: "100%",
                  marginTop: 10,
                  padding: 12,
                  border: "1.5px solid #ece8f4",
                  borderRadius: 13,
                  background: "#fbfafd",
                  color: "#4a4560",
                  font: "800 13px var(--font-nunito)",
                  cursor: "pointer",
                }}
              >
                Add to calendar
              </button>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)",
              }}
            >
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 12 }}>Who&apos;s going</div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#cfe4ff,#e4ecff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    border: "2px solid #fff",
                  }}
                >
                  🧑‍💻
                </span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#f6d8e8,#efe4ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    border: "2px solid #fff",
                    marginLeft: -10,
                  }}
                >
                  🧑‍🎨
                </span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#fbeadf",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    border: "2px solid #fff",
                    marginLeft: -10,
                  }}
                >
                  🧑
                </span>
                <span
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: "#efe9ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    font: "800 11px var(--font-nunito)",
                    color: "#6d5bd0",
                    border: "2px solid #fff",
                    marginLeft: -10,
                  }}
                >
                  +125
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
