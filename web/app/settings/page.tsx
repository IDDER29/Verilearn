import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";

export const metadata = { title: "Settings · VeriLearn" };

export default function SettingsVerificationPage() {
  return (
    <AppShell active="settings">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "210px minmax(0,1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <SettingsNav active="verification" />

        {/* panel: Verification */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 15,
                background: "#efe9ff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)", letterSpacing: "-.01em" }}>Verification</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>
                How thoroughly VeriLearn checks each lecture
              </div>
            </div>
          </div>

          {/* depth */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 4 }}>Verification depth</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
              Deeper checks take longer but flag more.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <div style={{ padding: 14, border: "2px solid #ece8f4", borderRadius: 14, textAlign: "center", background: "#fff" }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", color: "#4a4560" }}>Minimal</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#9a95a8", marginTop: 3 }}>Fastest</div>
              </div>
              <div style={{ padding: 14, border: "2px solid #6d5bd0", borderRadius: 14, textAlign: "center", background: "#f7f5fd" }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", color: "#6d5bd0" }}>Standard</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>Recommended</div>
              </div>
              <div style={{ padding: 14, border: "2px solid #ece8f4", borderRadius: 14, textAlign: "center", background: "#fff" }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", color: "#4a4560" }}>Thorough</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#9a95a8", marginTop: 3 }}>Slowest</div>
              </div>
            </div>
          </div>

          {/* toggles */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Show interpretive claims</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Include genuinely contested points with mapped positions</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#6d5bd0", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3, boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Alert me to new disputes</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Notify when the Skeptic flags a claim in your topics</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#6d5bd0", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3, boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Run the execution sandbox</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Prove code-based claims by actually running them</div>
              </div>
              <div style={{ width: 46, height: 27, borderRadius: 14, background: "#dcd7ea", position: "relative", flexShrink: 0 }}>
                <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, left: 3, boxShadow: "0 2px 4px rgba(0,0,0,.2)" }} />
              </div>
            </div>
          </div>

          {/* slider */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Skeptic aggressiveness</span>
              <span style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 12px", borderRadius: 9 }}>Balanced</span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
              How hard the red-team pushes on each claim.
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", position: "relative", margin: "0 6px" }}>
              <div style={{ width: "55%", height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
              <span style={{ position: "absolute", left: "55%", top: "50%", transform: "translate(-50%,-50%)", width: 22, height: 22, borderRadius: "50%", background: "#fff", border: "3px solid #6d5bd0", boxShadow: "0 3px 8px rgba(109,91,208,.4)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 12, padding: "0 4px" }}>
              <span>Gentle</span>
              <span>Balanced</span>
              <span>Ruthless</span>
            </div>
          </div>

          {/* save bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, background: "#fff", borderRadius: 22, padding: "16px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#8b8699" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              Changes apply to future lectures
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: "pointer" }}>Reset</button>
              <button style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 24px", borderRadius: 13, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)" }}>Save changes</button>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
