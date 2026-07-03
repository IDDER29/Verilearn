"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AppShell from "@/components/AppShell";
import { BackButton, ProgressRing, SpotlightCard } from "@/components/ui";

type Card = { q: string; a: string; source: string };

const CARDS: Card[] = [
  {
    q: "Why can Dijkstra finalise a node's distance the moment it's picked, and never revisit it?",
    a: "Because every edge weight is non-negative, once a node is dequeued its tentative distance can't be lowered by any future path — every remaining route is at least as long. So the greedy choice is provably final.",
    source: "Verified · CLRS §24.3 (cut property)",
  },
  {
    q: "What single assumption, if broken, invalidates Dijkstra's correctness proof?",
    a: "Non-negative edge weights. A negative edge means a later path can lower an already-finalised distance, so the cut-property argument fails — you'd reach for Bellman-Ford instead.",
    source: "Verified · CLRS §24.3",
  },
  {
    q: "Why does a binary-heap priority queue speed Dijkstra up over a plain array?",
    a: "Extract-min is the hot loop. A binary heap makes each extraction O(log V) instead of O(V), giving O((V+E) log V) overall — a big win on sparse graphs.",
    source: "Verified · CLRS §24.3",
  },
  {
    q: "On a dense graph, can a plain array actually beat a heap?",
    a: "Yes. With ~V² edges, the array's O(V²) total can beat the heap's O(E log V) = O(V² log V). Dense graphs favour the simpler array — the 'always use a heap' claim is unqualified.",
    source: "Sourced · Skiena §6.3",
  },
];

const CONF = {
  confident: { label: "Confident", color: "#2e9c6a", border: "#cdeadd", bg: "#f0f9f4" },
  unsure: { label: "Unsure", color: "#b4830f", border: "#f0e2c2", bg: "#fbf6ec" },
  guessing: { label: "Guessing", color: "#c0392b", border: "#f3d4cf", bg: "#fdf2f0" },
} as const;
type ConfKey = keyof typeof CONF;

const RATINGS = [
  { key: "again", label: "Again", sub: "< 1 min", color: "#c0392b", subColor: "#cc8888", border: "#f3d4cf", bg: "#fdf2f0" },
  { key: "hard", label: "Hard", sub: "2 days", color: "#b4830f", subColor: "#c9a94e", border: "#f0e2c2", bg: "#fbf6ec" },
  { key: "good", label: "Good", sub: "4 days", color: "#6d5bd0", subColor: "#9184c4", border: "#6d5bd0", bg: "#f2effc" },
  { key: "easy", label: "Easy", sub: "9 days", color: "#2e9c6a", subColor: "#6ab48c", border: "#cdeadd", bg: "#f0f9f4" },
] as const;

const TOTAL = CARDS.length;

function SessionRing({ reviewed }: { reviewed: number }) {
  return (
    <div style={{ margin: "0 auto 10px", width: 128 }}>
      <ProgressRing size={128} stroke={13} r={54} pct={(reviewed / TOTAL) * 100} animate>
        <div style={{ font: "900 26px var(--font-nunito)" }}>{reviewed}/{TOTAL}</div>
        <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>reviewed</div>
      </ProgressRing>
    </div>
  );
}

export default function ReviewPage() {
  const router = useRouter();
  const [card, setCard] = useState(0);
  const [phase, setPhase] = useState<"front" | "back">("front");
  const [confidence, setConfidence] = useState<ConfKey | null>(null);
  const [rating, setRating] = useState<string | null>(null);

  const c = CARDS[card];
  const reviewed = phase === "back" ? card + 1 : card;

  function next() {
    if (card + 1 >= TOTAL) {
      router.push("/review/complete");
      return;
    }
    setCard((n) => n + 1);
    setPhase("front");
    setConfidence(null);
    setRating(null);
  }

  return (
    <AppShell active="tasks">
      <main style={{ padding: "24px 26px 30px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24, alignItems: "start" }}>
        {/* ---- CENTER ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          {/* header */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BackButton href="/" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Spaced review · today</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Review session</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "9px 15px", borderRadius: 12 }}>
              Card {card + 1} of {TOTAL}
            </div>
          </div>

          {/* progress dots */}
          <div style={{ display: "flex", gap: 7 }}>
            {CARDS.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 7, borderRadius: 4, background: i <= card ? "#6d5bd0" : "#e2dcf1", transition: "background .3s" }} />
            ))}
          </div>

          {/* FLASHCARD */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "30px 32px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {/* card chrome */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>Dijkstra&apos;s algorithm</div>
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Flashcard · from §1</div>
                </div>
              </div>
              {phase === "front" ? (
                <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "6px 11px", borderRadius: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.5 2.5L16 9.5" />
                  </svg>
                  Verified card
                </div>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: "#6d5bd0", background: "#efe9ff", padding: "6px 11px", borderRadius: 10 }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3zM9.5 21h5" />
                  </svg>
                  You said: {confidence ? CONF[confidence].label : "—"}
                </div>
              )}
            </div>

            {/* question */}
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: phase === "front" ? 10 : 8 }}>Question</div>
            <div style={{ font: phase === "front" ? "800 22px/1.4 var(--font-nunito)" : "800 17px/1.4 var(--font-nunito)", letterSpacing: "-.01em", color: phase === "front" ? "#221f2e" : "#4a4560", marginBottom: phase === "front" ? 26 : 20 }}>
              {c.q}
            </div>

            {phase === "front" ? (
              <>
                {/* confidence gate */}
                <div style={{ background: "#f7f5fb", border: "1.5px solid #ece8f4", borderRadius: 18, padding: "18px 20px", marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12.5px var(--font-nunito)", color: "#6d5bd0", marginBottom: 13 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3a7 7 0 00-4 12.7V18h8v-2.3A7 7 0 0012 3z" />
                      <path d="M9.5 21h5" />
                    </svg>
                    Before you reveal — how confident are you?
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {(Object.keys(CONF) as ConfKey[]).map((k) => {
                      const cfg = CONF[k];
                      const sel = confidence === k;
                      const faces: Record<ConfKey, React.ReactNode> = {
                        confident: <path d="M8.5 12.5l2.5 2.5 4.5-5" />,
                        unsure: <path d="M9.2 9.5a2.8 2.8 0 015.5.8c0 1.9-2.8 2.5-2.8 2.5M12 17h.01" />,
                        guessing: <path d="M8.5 15.5s1.5-1 3.5-1 3.5 1 3.5 1M9 9.5h.01M15 9.5h.01" />,
                      };
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setConfidence(k)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 6,
                            padding: 14,
                            border: `2px solid ${cfg.border}`,
                            background: cfg.bg,
                            borderRadius: 14,
                            cursor: "pointer",
                            outline: sel ? `2px solid ${cfg.color}` : "none",
                            outlineOffset: 1,
                            boxShadow: sel ? `0 8px 18px -10px ${cfg.color}` : "none",
                            transition: "outline .12s, box-shadow .12s",
                          }}
                        >
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={cfg.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="9" />
                            {faces[k]}
                          </svg>
                          <span style={{ font: "800 13px var(--font-nunito)", color: cfg.color }}>{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* reveal gate */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: confidence ? "#2e9c6a" : "#9a95a8" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {confidence ? <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 017-2.6" /></> : <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>}
                    </svg>
                    {confidence ? "Locked in — reveal when ready" : "Pick a confidence level to reveal the answer"}
                  </div>
                  <button
                    type="button"
                    disabled={!confidence}
                    onClick={() => setPhase("back")}
                    style={{
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      borderRadius: 13,
                      background: confidence ? "#6d5bd0" : "#cdc6e8",
                      color: "#fff",
                      font: "800 14px var(--font-nunito)",
                      padding: "12px 24px",
                      whiteSpace: "nowrap",
                      cursor: confidence ? "pointer" : "not-allowed",
                      transition: "background .15s",
                    }}
                  >
                    Show answer
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* answer */}
                <div style={{ background: "#eef7f1", border: "1.5px solid #cdeadd", borderRadius: 18, padding: "20px 22px", marginBottom: 20 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#2e9c6a", marginBottom: 10 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                    Answer
                  </div>
                  <div style={{ font: "700 15.5px/1.65 var(--font-nunito)", color: "#221f2e" }}>{c.a}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid #d6ecdf" }}>
                    <div style={{ width: 28, height: 28, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                        <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                      </svg>
                    </div>
                    <span style={{ font: "700 12px var(--font-nunito)", color: "#3d8763" }}>{c.source}</span>
                  </div>
                </div>

                {/* rating */}
                <div style={{ font: "800 13px var(--font-nunito)", marginBottom: 12 }}>How well did you recall it?</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 10 }}>
                  {RATINGS.map((r) => {
                    const sel = rating === r.key;
                    return (
                      <button
                        key={r.key}
                        type="button"
                        onClick={() => setRating(r.key)}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 6,
                          padding: "15px 8px",
                          border: `2px solid ${r.border}`,
                          background: r.bg,
                          borderRadius: 15,
                          cursor: "pointer",
                          outline: sel ? `2px solid ${r.color}` : "none",
                          outlineOffset: 1,
                          boxShadow: sel ? `0 8px 18px -8px ${r.color}` : "none",
                          transition: "outline .12s, box-shadow .12s",
                        }}
                      >
                        <span style={{ font: "800 14px var(--font-nunito)", color: r.color }}>{r.label}</span>
                        <span style={{ font: "700 10.5px var(--font-nunito)", color: r.subColor }}>{r.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* footer helper / hatches */}
          {phase === "front" ? (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff", borderRadius: 18, padding: "16px 20px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)" }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
                </svg>
              </div>
              <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#6c6780" }}>
                <b style={{ color: "#221f2e" }}>Committing first keeps you honest.</b> After you reveal, you&apos;ll rate recall — and if your confidence didn&apos;t match reality, it feeds your calibration score.
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 12 }}>
              <button type="button" onClick={() => setRating("again")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", border: "1.5px solid #f3d9d6", borderRadius: 16, padding: 15, cursor: "pointer", boxShadow: "0 10px 30px -22px rgba(80,60,140,.3)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-6 6M9 9l6 6" />
                </svg>
                <span style={{ font: "800 13.5px var(--font-nunito)", color: "#c0392b" }}>I had the wrong idea</span>
              </button>
              <Link href="/review/discuss" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#fff", border: "1.5px solid #ece8f4", borderRadius: 16, padding: 15, cursor: "pointer", textDecoration: "none", boxShadow: "0 10px 30px -22px rgba(80,60,140,.3)" }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 10h8M8 14h5M21 12a8 8 0 01-11.5 7.2L4 20l.8-5.5A8 8 0 1121 12z" />
                </svg>
                <span style={{ font: "800 13.5px var(--font-nunito)", color: "#6d5bd0" }}>Discuss this answer</span>
              </Link>
            </div>
          )}
        </div>

        {/* ---- RIGHT ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {phase === "back" && (
            <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Calibration check</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: confidence === "confident" ? "#eef7f1" : "#fbf6ec" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={confidence === "confident" ? "#2e9c6a" : "#c99a2b"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M8 12.5l2.5 2.5L16 9.5" />
                  </svg>
                </div>
                <div>
                  <div style={{ font: "800 13.5px var(--font-nunito)", color: confidence === "confident" ? "#2e9c6a" : "#b4830f" }}>
                    {confidence === "confident" ? "Well calibrated!" : "Under-confident"}
                  </div>
                  <div style={{ font: "600 11.5px/1.45 var(--font-nunito)", color: "#6c6780" }}>
                    You felt {confidence ? CONF[confidence].label : "—"} and got it right.
                  </div>
                </div>
              </div>
              <div style={{ font: "600 11.5px/1.55 var(--font-nunito)", color: "#8b8699", marginTop: 12 }}>
                Matching confidence to reality is what builds the calibration signal on your Progress page.
              </div>
            </div>
          )}

          {/* session ring */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Today&apos;s session</div>
            <SessionRing reviewed={reviewed} />
            <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>~2 min left · next batch in 2 days</div>
          </div>

          {phase === "front" ? (
            <>
              {/* up next */}
              <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
                <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Up next</div>
                {[
                  { t: "Relaxation step", s: "Dijkstra · flashcard", bg: "#efe9ff", stroke: "#6d5bd0", icon: <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />, border: false },
                  { t: "Spot the error", s: "Seeded drill", bg: "#fbeceb", stroke: "#c0392b", icon: (<><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 17h.01" /></>), border: true },
                  { t: "Correctness proof", s: "Dijkstra · flashcard", bg: "#e9f7ef", stroke: "#2e9c6a", icon: (<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></>), border: true },
                ].map((it) => (
                  <div key={it.t} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", ...(it.border ? { borderTop: "1px solid #f5f3fa" } : {}) }}>
                    <div style={{ width: 34, height: 34, borderRadius: 11, background: it.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={it.stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        {it.icon}
                      </svg>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ font: "800 13px var(--font-nunito)" }}>{it.t}</div>
                      <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>{it.s}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* blind-spot */}
              <SpotlightCard radius={22} padding={22} raised>
                <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 13, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#b3a7f0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </div>
                  <div>
                    <div style={{ font: "900 15px var(--font-nunito)" }}>Blind-spot check</div>
                    <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>Errors you caught</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span style={{ font: "900 30px var(--font-nunito)" }}>6</span>
                  <span style={{ font: "800 15px var(--font-nunito)", color: "#b3a7f0" }}>/ 9 caught</span>
                </div>
                <div style={{ height: 8, borderRadius: 5, background: "rgba(255,255,255,.15)", overflow: "hidden" }}>
                  <div style={{ width: "67%", height: "100%", borderRadius: 5, background: "#8b78e8" }} />
                </div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#c9c3d8", marginTop: 10 }}>
                  Drills salt false claims into your reviews — catching them sharpens judgment.
                </div>
              </SpotlightCard>
            </>
          ) : (
            <button
              type="button"
              disabled={!rating}
              onClick={next}
              style={{
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 9,
                background: rating ? "#6d5bd0" : "#cdc6e8",
                color: "#fff",
                font: "800 15px var(--font-nunito)",
                padding: 16,
                borderRadius: 16,
                cursor: rating ? "pointer" : "not-allowed",
                boxShadow: rating ? "0 12px 26px -10px rgba(109,91,208,.7)" : "none",
                transition: "background .15s",
              }}
            >
              {card + 1 >= TOTAL ? "Finish session" : "Next card"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          )}
        </div>
      </main>
    </AppShell>
  );
}
