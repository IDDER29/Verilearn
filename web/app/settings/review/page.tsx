"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import { getPrefsAction, saveReviewPrefsAction } from "@/app/prefs-actions";
import type { UserPrefs } from "@/lib/store/entities";

type Review = UserPrefs["review"];

const stepBtn = {
  width: 34,
  height: 34,
  borderRadius: 11,
  border: "1.5px solid #ece8f4",
  background: "#fbfafd",
  font: "900 16px var(--font-nunito)",
  color: "#6c6780",
  cursor: "pointer",
} as const;

const RET_MIN = 80;
const RET_MAX = 95;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

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
      <span style={{ position: "absolute", width: 21, height: 21, borderRadius: "50%", background: "#fff", top: 3, [on ? "right" : "left"]: 3 }} />
    </button>
  );
}

export default function SettingsReviewPage() {
  const [rv, setRv] = useState<Review | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getPrefsAction().then((p) => p && setRv(p.review));
  }, []);

  function patch(next: Partial<Review>) {
    setRv((cur) => (cur ? { ...cur, ...next } : cur));
    saveReviewPrefsAction(next).then(({ ok }) => {
      if (ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1400);
      }
    });
  }

  const retention = rv?.targetRetention ?? 90;
  const retPct = `${(clamp(retention, RET_MIN, RET_MAX) - RET_MIN) / (RET_MAX - RET_MIN) * 100}%`;

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
        <SettingsNav active="review" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Review &amp; FSRS</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>Tune the spaced-repetition scheduler</div>
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

          {/* target retention slider */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Target retention</span>
              <span style={{ font: "900 15px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "4px 12px", borderRadius: 9 }}>{retention}%</span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>Higher = you remember more, but review more often.</div>
            <div style={{ position: "relative", margin: "0 6px" }}>
              <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", position: "relative" }}>
                <div style={{ width: retPct, height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
                <span style={{ position: "absolute", left: retPct, top: "50%", transform: "translate(-50%,-50%)", width: 22, height: 22, borderRadius: "50%", background: "#fff", border: "3px solid #6d5bd0", boxShadow: "0 3px 8px rgba(109,91,208,.4)" }} />
              </div>
              <input
                type="range"
                min={RET_MIN}
                max={RET_MAX}
                step={1}
                value={clamp(retention, RET_MIN, RET_MAX)}
                onChange={(e) => patch({ targetRetention: Number(e.target.value) })}
                aria-label="Target retention"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", margin: 0, opacity: 0, cursor: "pointer" }}
              />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 12, padding: "0 4px" }}>
              <span>80% · less work</span>
              <span>95% · rock solid</span>
            </div>
          </div>

          {/* number fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "800 14px var(--font-nunito)", marginBottom: 4 }}>Daily review limit</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginBottom: 12 }}>Max cards per day</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" style={stepBtn} onClick={() => patch({ dailyLimit: clamp((rv?.dailyLimit ?? 0) - 5, 5, 500) })}>−</button>
                <span style={{ font: "900 20px var(--font-nunito)", flex: 1, textAlign: "center" }}>{rv?.dailyLimit ?? "—"}</span>
                <button type="button" style={stepBtn} onClick={() => patch({ dailyLimit: clamp((rv?.dailyLimit ?? 0) + 5, 5, 500) })}>+</button>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "800 14px var(--font-nunito)", marginBottom: 4 }}>Max interval</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginBottom: 12 }}>Longest gap between reviews</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button type="button" style={stepBtn} onClick={() => patch({ maxIntervalDays: clamp((rv?.maxIntervalDays ?? 0) - 30, 30, 3650) })}>−</button>
                <span style={{ font: "900 20px var(--font-nunito)", flex: 1, textAlign: "center" }}>
                  {rv?.maxIntervalDays ?? "—"}<span style={{ fontSize: 12, color: "#8b8699" }}> d</span>
                </span>
                <button type="button" style={stepBtn} onClick={() => patch({ maxIntervalDays: clamp((rv?.maxIntervalDays ?? 0) + 30, 30, 3650) })}>+</button>
              </div>
            </div>
          </div>

          {/* toggles */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "8px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Confidence gate</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Rate confidence before revealing the answer</div>
              </div>
              <Toggle on={!!rv?.confidenceGate} onClick={() => patch({ confidenceGate: !rv?.confidenceGate })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0", borderBottom: "1px solid #f5f3fa" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Seeded error drills</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Mix in deliberately-wrong claims to catch</div>
              </div>
              <Toggle on={!!rv?.drills} onClick={() => patch({ drills: !rv?.drills })} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "18px 0" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Daily reminder</div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>Nudge me when reviews are due</div>
              </div>
              <Toggle on={!!rv?.reminders} onClick={() => patch({ reminders: !rv?.reminders })} />
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
