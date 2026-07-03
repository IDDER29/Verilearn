import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";

export const metadata = { title: "Active listening · Settings · VeriLearn" };

const knobRight = (
  <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3 }} />
);
const knobLeft = (
  <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, left: 3 }} />
);

function Toggle({ on }: { on: boolean }) {
  return (
    <div style={{ width: 46, height: 27, borderRadius: 14, background: on ? "#6d5bd0" : "#dcd7ea", position: "relative", flexShrink: 0 }}>
      {on ? knobRight : knobLeft}
    </div>
  );
}

export default function SettingsActiveListeningPage() {
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
        <SettingsNav active="active-listening" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3zM9.5 21h5" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Active listening</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>The in-lecture prompts that keep you engaged</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", borderRadius: 14, background: "#f2effc", border: "1px solid #e3ddf6", font: "700 12.5px/1.5 var(--font-nunito)", color: "#6c6780" }}>
            <span style={{ fontSize: 16 }}>🧠</span>
            Turn each prompt type on or off. At least one keeps recall honest — we recommend leaving the close-gate on.
          </div>

          {/* toggles */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#f2effc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔮</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Predict before reading</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Guess what a section will cover before it opens</div>
              </div>
              <Toggle on />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⏸️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Pause-point checks</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Quick comprehension checks mid-section</div>
              </div>
              <Toggle on />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✍️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Fill-in-the-blank (cloze)</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Recall a key term instead of re-reading it</div>
              </div>
              <Toggle on={false} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔗</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Connection prompts</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Relate the new idea to something you know</div>
              </div>
              <Toggle on />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#f1eefb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔒</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>
                  Close-gate
                  <span style={{ font: "800 9px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "2px 7px", borderRadius: 7, marginLeft: 4 }}>Recommended</span>
                </div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Explain the section in your words to unlock Next</div>
              </div>
              <Toggle on />
            </div>
          </div>

          {/* intensity */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Prompt frequency</span>
              <span style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 12px", borderRadius: 9 }}>Balanced</span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>How often prompts appear as you read.</div>
            <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", position: "relative", margin: "0 6px" }}>
              <div style={{ width: "50%", height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
              <span style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: 22, height: 22, borderRadius: "50%", background: "#fff", border: "3px solid #6d5bd0", boxShadow: "0 3px 8px rgba(109,91,208,.4)" }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 12, padding: "0 4px" }}>
              <span>Light</span>
              <span>Balanced</span>
              <span>Intensive</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10, background: "#fff", borderRadius: 20, padding: "16px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <button style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: "pointer" }}>Reset</button>
            <button style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 24px", borderRadius: 13, cursor: "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)" }}>Save changes</button>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
