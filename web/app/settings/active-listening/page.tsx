// SETTINGS-08: Active-listening prompt preferences apply to FUTURE lectures only.
// Toggling a prompt type or the frequency here never mutates the trust/verification
// ledger — it only changes how upcoming in-lecture prompts are generated.
"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import { getPrefsAction, saveActiveListeningAction } from "@/app/prefs-actions";
import type { UserPrefs } from "@/lib/store/entities";

type AL = UserPrefs["activeListening"];

const knobRight = (
  <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, right: 3 }} />
);
const knobLeft = (
  <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, left: 3 }} />
);

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      onClick={onClick}
      aria-checked={on}
      style={{
        width: 46,
        height: 27,
        borderRadius: 14,
        border: "none",
        padding: 0,
        cursor: "pointer",
        background: on ? "#6d5bd0" : "#dcd7ea",
        position: "relative",
        flexShrink: 0,
        transition: "background .15s",
      }}
    >
      {on ? knobRight : knobLeft}
    </button>
  );
}

const FREQ_LABEL = ["Light", "Balanced", "Intensive"] as const;
const freqLabel = (f: number) => FREQ_LABEL[Math.min(2, Math.max(0, f - 1))];
const freqPct = (f: number) => `${((Math.min(3, Math.max(1, f)) - 1) / 2) * 100}%`;

export default function SettingsActiveListeningPage() {
  const [al, setAl] = useState<AL | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPrefsAction().then((p) => p && setAl(p.activeListening));
  }, []);

  function patch(next: Partial<AL>) {
    setAl((cur) => (cur ? { ...cur, ...next } : cur));
    saveActiveListeningAction(next).then(({ ok }) => {
      if (ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1400);
      }
    });
  }

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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Active listening</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>The in-lecture prompts that keep you engaged</div>
            </div>
            <span
              style={{
                font: "800 12px var(--font-nunito)",
                color: "#2e9c6a",
                background: "#e7f4ee",
                padding: "6px 12px",
                borderRadius: 10,
                opacity: saved ? 1 : 0,
                transition: "opacity .2s",
              }}
            >
              Saved ✓
            </span>
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
              <Toggle on={!!al?.predict} onClick={() => patch({ predict: !al?.predict })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⏸️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Pause-point checks</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Quick comprehension checks mid-section</div>
              </div>
              <Toggle on={!!al?.pause} onClick={() => patch({ pause: !al?.pause })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>✍️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Fill-in-the-blank (cloze)</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Recall a key term instead of re-reading it</div>
              </div>
              <Toggle on={!!al?.cloze} onClick={() => patch({ cloze: !al?.cloze })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔗</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Connection prompts</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Relate the new idea to something you know</div>
              </div>
              <Toggle on={!!al?.connection} onClick={() => patch({ connection: !al?.connection })} />
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
              <Toggle on={!!al?.closeGate} onClick={() => patch({ closeGate: !al?.closeGate })} />
            </div>
          </div>

          {/* intensity */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Prompt frequency</span>
              <span style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 12px", borderRadius: 9 }}>{freqLabel(al?.frequency ?? 2)}</span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>How often prompts appear as you read.</div>
            <div style={{ position: "relative", margin: "0 6px" }}>
              <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", position: "relative" }}>
                <div style={{ width: freqPct(al?.frequency ?? 2), height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
                <span style={{ position: "absolute", left: freqPct(al?.frequency ?? 2), top: "50%", transform: "translate(-50%,-50%)", width: 22, height: 22, borderRadius: "50%", background: "#fff", border: "3px solid #6d5bd0", boxShadow: "0 3px 8px rgba(109,91,208,.4)" }} />
              </div>
              <input
                type="range"
                min={1}
                max={3}
                step={1}
                value={al?.frequency ?? 2}
                onChange={(e) => patch({ frequency: Number(e.target.value) })}
                aria-label="Prompt frequency"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 12, padding: "0 4px" }}>
              <span>Light</span>
              <span>Balanced</span>
              <span>Intensive</span>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
