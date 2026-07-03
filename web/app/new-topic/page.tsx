"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import AppShell from "@/components/AppShell";
import { BackButton } from "@/components/ui";

type Goal = { label: string; icon: React.ReactNode };

const GOALS: Goal[] = [
  {
    label: "Understand the intuition",
    icon: <path d="M9 18h6M10 21h4M12 3a6 6 0 00-4 10.5c.6.6 1 1.3 1 2.5h6c0-1.2.4-1.9 1-2.5A6 6 0 0012 3z" />,
  },
  { label: "Implement it from scratch", icon: <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" /> },
  {
    label: "Use it in practice",
    icon: (
      <>
        <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
        <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
      </>
    ),
  },
  { label: "Pass an interview", icon: <path d="M7 10a5 5 0 0010 0V4H7zM5 4h14M9 20h6M12 15v5" /> },
];

function FieldNum({ n }: { n: number }) {
  return (
    <div style={{ width: 30, height: 30, borderRadius: 10, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", font: "900 13px var(--font-nunito)", color: "#6d5bd0" }}>
      {n}
    </div>
  );
}

function GoalPill({ goal, selected, onClick }: { goal: Goal; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "14px 16px",
        border: `2px solid ${selected ? "#6d5bd0" : "#ece8f4"}`,
        background: selected ? "#f7f5fd" : "#fff",
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        font: "inherit",
        transition: "border-color .15s, background .15s",
      }}
    >
      <div style={{ width: 34, height: 34, borderRadius: 11, background: selected ? "#fff" : "#f7f5fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={selected ? "#6d5bd0" : "#8b8699"} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          {goal.icon}
        </svg>
      </div>
      <span style={{ font: "800 13.5px var(--font-nunito)", color: selected ? "#221f2e" : "#4a4560" }}>{goal.label}</span>
      {selected && (
        <span style={{ marginLeft: "auto", width: 20, height: 20, borderRadius: "50%", background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </span>
      )}
    </button>
  );
}

export default function NewTopicPage() {
  const router = useRouter();
  const [topic, setTopic] = useState("Merkle trees");
  const [level, setLevel] = useState("Comfortable with hashing; new to tree structures and cryptographic proofs.");
  const [goal, setGoal] = useState<number | null>(0);
  const [tried, setTried] = useState(false);

  const ready = useMemo(() => topic.trim().length > 1 && level.trim().length > 3 && goal !== null, [topic, level, goal]);

  const inputStyle = (invalid: boolean): React.CSSProperties => ({
    width: "100%",
    boxSizing: "border-box",
    font: "600 15px var(--font-nunito)",
    padding: "13px 15px",
    border: `1.5px solid ${invalid ? "#f0b8b1" : "#ece8f4"}`,
    borderRadius: 13,
    background: "#fbfafd",
    color: "#221f2e",
  });

  function submit() {
    if (!ready) {
      setTried(true);
      return;
    }
    router.push(`/pipeline?topic=${encodeURIComponent(topic.trim())}`);
  }

  return (
    <AppShell active="topics">
      <main style={{ padding: "24px 26px 30px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 336px", gap: 24, alignItems: "start" }}>
        {/* ---- CENTER ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BackButton href="/" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>New topic</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>What do you want to learn? ✨</div>
            </div>
          </div>

          {/* form card */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "28px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", flexDirection: "column", gap: 22 }}>
            {/* field 1 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                <FieldNum n={1} />
                <span style={{ font: "800 15px var(--font-nunito)" }}>The topic</span>
              </div>
              <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)} style={inputStyle(tried && topic.trim().length <= 1)} />
              <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 10, alignItems: "center" }}>
                <span style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Popular:</span>
                {["TCP/IP", "Binary trees", "Bloom filters"].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTopic(p)}
                    style={{ font: "700 11.5px var(--font-nunito)", color: "#6d5bd0", background: "#f1eefb", padding: "4px 11px", borderRadius: 9, border: "none", cursor: "pointer" }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: "#f0edf6" }} />

            {/* field 2 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                <FieldNum n={2} />
                <span style={{ font: "800 15px var(--font-nunito)" }}>Where you&apos;re starting from</span>
              </div>
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", margin: "0 0 10px 39px" }}>
                Name what you know and what you don&apos;t — it tunes the depth.
              </div>
              <textarea
                rows={3}
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                style={{ ...inputStyle(tried && level.trim().length <= 3), font: "600 14.5px/1.6 var(--font-nunito)", resize: "none" }}
              />
            </div>

            <div style={{ height: 1, background: "#f0edf6" }} />

            {/* field 3 */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 12 }}>
                <FieldNum n={3} />
                <span style={{ font: "800 15px var(--font-nunito)" }}>Your goal</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {GOALS.map((g, i) => (
                  <GoalPill key={g.label} goal={g} selected={goal === i} onClick={() => setGoal(i)} />
                ))}
              </div>
            </div>

            {/* submit */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 20, borderTop: "1px solid #f0edf6" }}>
              {ready ? (
                <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 13px var(--font-nunito)", color: "#2e9c6a" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.5 2.5L16 9.5" />
                  </svg>
                  Ready to verify
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 13px var(--font-nunito)", color: tried ? "#c0392b" : "#a7a1b8" }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  Fill in all three fields
                </div>
              )}
              <button
                type="button"
                onClick={submit}
                style={{
                  border: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  background: ready ? "#6d5bd0" : "#c9c2e6",
                  color: "#fff",
                  font: "800 15px var(--font-nunito)",
                  padding: "14px 26px",
                  borderRadius: 14,
                  cursor: "pointer",
                  boxShadow: ready ? "0 12px 26px -10px rgba(109,91,208,.7)" : "none",
                  transition: "background .15s",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start verifying
              </button>
            </div>
          </div>
        </div>

        {/* ---- RIGHT: pipeline preview ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 24, padding: 24, color: "#fff", boxShadow: "0 16px 34px -16px rgba(40,30,70,.7)" }}>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".1em", textTransform: "uppercase", color: "#b3a7f0", marginBottom: 6 }}>What happens next</div>
            <div style={{ font: "900 18px/1.3 var(--font-nunito)", marginBottom: 18 }}>We verify every claim before you read a word.</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { t: "Triage the topic", d: <path d="M3 6h18M6 12h12M10 18h4" /> },
                { t: "Retrieve trusted sources", d: (<><circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" /></>) },
                { t: "Write the lecture", d: <path d="M4 6h16M4 12h10M4 18h13" /> },
                { t: "Verify each claim", d: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></>) },
                { t: "Skeptic red-teams it", d: (<><path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" /><circle cx="12" cy="9.5" r="1.4" /></>) },
              ].map((s) => (
                <div key={s.t} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0" }}>
                  <span style={{ width: 28, height: 28, borderRadius: 9, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c4b8f5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {s.d}
                    </svg>
                  </span>
                  <span style={{ font: "700 13px var(--font-nunito)" }}>{s.t}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,.12)", font: "700 12px var(--font-nunito)", color: "#b3a7f0" }}>
              Usually ready in under a minute ⚡
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
            </div>
            <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#6c6780" }}>
              Nothing gets shown to you until it&apos;s checked. Disputed claims are flagged, never hidden.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
