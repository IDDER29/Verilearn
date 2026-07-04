"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { BackButton, ProgressRing, SpotlightCard } from "@/components/ui";
import { caughtUpInfoAction, getDueCardsAction, gradeCardAction, reviewAheadCardsAction, type CaughtUpInfo, type SessionCard } from "@/app/review-actions";
import { dismissReviewPrimerAction, reviewPrimerSeenAction } from "@/app/prefs-actions";
import type { Rating } from "@/lib/domain/fsrs";

const CONF = {
  confident: { label: "Confident", color: "#2e9c6a", border: "#cdeadd", bg: "#f0f9f4" },
  unsure: { label: "Unsure", color: "#b4830f", border: "#f0e2c2", bg: "#fbf6ec" },
  guessing: { label: "Guessing", color: "#c0392b", border: "#f3d4cf", bg: "#fdf2f0" },
} as const;
type ConfKey = keyof typeof CONF;

const RATINGS = [
  { key: "again", label: "Again", color: "#c0392b", subColor: "#cc8888", border: "#f3d4cf", bg: "#fdf2f0" },
  { key: "hard", label: "Hard", color: "#b4830f", subColor: "#c9a94e", border: "#f0e2c2", bg: "#fbf6ec" },
  { key: "good", label: "Good", color: "#6d5bd0", subColor: "#9184c4", border: "#6d5bd0", bg: "#f2effc" },
  { key: "easy", label: "Easy", color: "#2e9c6a", subColor: "#6ab48c", border: "#cdeadd", bg: "#f0f9f4" },
] as const;

/** Format a claim's lecture section id ("s1") for display ("§1"). */
function sectionLabel(section: string): string {
  const m = /^s(\d+)$/.exec(section);
  return m ? `§${m[1]}` : section || "lecture";
}

/** Card trust badge derived from the claim's LIVE ledger state (REVIEW-03) — never a static label. */
const TRUST_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  verified_execution: { label: "Verified · execution", color: "#0e8c6b", bg: "#e7f4ee" },
  verified_source: { label: "Verified · source", color: "#2d6cdf", bg: "#e7effb" },
  sourced: { label: "Sourced", color: "#2d6cdf", bg: "#e7effb" },
  interpretive: { label: "Interpretive", color: "#6d5bd0", bg: "#efe9ff" },
  disputed: { label: "Disputed", color: "#c0392b", bg: "#fbeceb" },
  unsupported: { label: "Unsupported", color: "#c0392b", bg: "#fbeceb" },
};

/** Real per-card calibration verdict from the committed confidence vs. the recall outcome (REVIEW-05). */
function calibrationVerdict(confidence: ConfKey, rating: Rating): { title: string; tone: string; bg: string; detail: string } {
  const correct = rating !== "again";
  const high = confidence === "confident";
  const felt = CONF[confidence].label;
  if (correct && high) return { title: "Well calibrated!", tone: "#2e9c6a", bg: "#eef7f1", detail: "You felt Confident and recalled it — confidence matched reality." };
  if (correct && !high) return { title: "Under-confident", tone: "#b4830f", bg: "#fbf6ec", detail: `You recalled it despite feeling ${felt} — you knew more than you thought.` };
  if (!correct && high) return { title: "Over-confident", tone: "#c0392b", bg: "#fdf2f0", detail: "You felt Confident but missed it — this becomes a tracked gap." };
  return { title: "Well calibrated", tone: "#2e9c6a", bg: "#eef7f1", detail: `You flagged doubt (${felt}) and indeed missed it — honest signal.` };
}

function SessionRing({ reviewed, total }: { reviewed: number; total: number }) {
  return (
    <div style={{ margin: "0 auto 10px", width: 128 }}>
      <ProgressRing size={128} stroke={13} r={54} pct={total ? (reviewed / total) * 100 : 0} animate>
        <div style={{ font: "900 26px var(--font-nunito)" }}>{reviewed}/{total}</div>
        <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>reviewed</div>
      </ProgressRing>
    </div>
  );
}

/** Map the confidence-gate key to the domain calibration vocabulary. */
const CONF_TO_DOMAIN = { confident: "sure", unsure: "unsure", guessing: "guessing" } as const;

export default function ReviewPage() {
  const router = useRouter();
  const [cards, setCards] = useState<SessionCard[] | null>(null);
  const [card, setCard] = useState(0);
  const [phase, setPhase] = useState<"front" | "back">("front");
  const [confidence, setConfidence] = useState<ConfKey | null>(null);
  const [rating, setRating] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [tracked, setTracked] = useState(0);
  const [caughtUp, setCaughtUp] = useState<CaughtUpInfo | null>(null);
  const [showPrimer, setShowPrimer] = useState(false);

  useEffect(() => {
    getDueCardsAction().then((cs) => {
      setCards(cs);
      if (cs.length === 0) caughtUpInfoAction().then(setCaughtUp);
      else reviewPrimerSeenAction().then((seen) => setShowPrimer(!seen));
    });
  }, []);

  function dismissPrimer() {
    setShowPrimer(false);
    dismissReviewPrimerAction();
  }

  // Review-ahead (REVIEW-11): study not-yet-due cards, lowest-retention first.
  const [aheadLoading, setAheadLoading] = useState(false);
  async function startReviewAhead() {
    setAheadLoading(true);
    const ahead = await reviewAheadCardsAction();
    setAheadLoading(false);
    if (ahead.length === 0) return;
    setCards(ahead);
    setCaughtUp(null);
    setCard(0);
    setPhase("front");
    setConfidence(null);
    setRating(null);
  }

  const TOTAL = cards?.length ?? 0;
  const c = cards && cards[card];
  const reviewed = phase === "back" ? card + 1 : card;

  async function next() {
    if (!c) return;
    // Persist the graded card (FSRS reschedule + calibration + gap auto-reopen).
    setSaving(true);
    const gradeRating = (rating as Rating) ?? "again";
    const res = await gradeCardAction(c.id, CONF_TO_DOMAIN[confidence ?? "unsure"], gradeRating);
    setSaving(false);
    // A lapse ("again") opens or reopens a Gap Map entry — confirm it to the learner (GAP-01).
    if (res.ok && gradeRating === "again") setTracked((n) => n + 1);
    if (card + 1 >= TOTAL) {
      router.push("/review/complete");
      return;
    }
    setCard((n) => n + 1);
    setPhase("front");
    setConfidence(null);
    setRating(null);
  }

  // Loading / all-caught-up states.
  if (cards === null) {
    return (
      <AppShell active="tasks">
        <main style={{ padding: "24px 26px 30px" }}>
          <div style={{ font: "700 14px var(--font-nunito)", color: "#8b8699" }}>Loading your review session…</div>
        </main>
      </AppShell>
    );
  }
  if (cards.length === 0 || !c) {
    return (
      <AppShell active="tasks">
        <main style={{ padding: "24px 26px 30px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <BackButton href="/" />
            <div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Spaced review · today</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Review session</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 24, padding: "44px 32px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {caughtUp && caughtUp.totalCards === 0 ? (
              <>
                <div style={{ fontSize: 40, marginBottom: 10 }}>🌱</div>
                <div style={{ font: "900 20px var(--font-nunito)", marginBottom: 6 }}>No review deck yet</div>
                <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>
                  Start a topic — its verified claims become spaced-review cards, and they&apos;ll appear here when they&apos;re due.
                </div>
                <Link href="/new-topic" style={{ textDecoration: "none", display: "inline-block", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "12px 24px", borderRadius: 13 }}>
                  Start a topic
                </Link>
              </>
            ) : (
              <>
                <div style={{ fontSize: 40, marginBottom: 10 }}>✅</div>
                <div style={{ font: "900 20px var(--font-nunito)", marginBottom: 6 }}>All caught up!</div>
                <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>
                  No cards are due right now.{" "}
                  {caughtUp?.nextDue
                    ? `Your next card is due ${new Date(caughtUp.nextDue).toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}.`
                    : "FSRS will resurface them exactly when you're about to forget."}
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/" style={{ textDecoration: "none", display: "inline-block", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "12px 24px", borderRadius: 13 }}>
                    Back to dashboard
                  </Link>
                  {(caughtUp?.totalCards ?? 0) > 0 && (
                    <button
                      type="button"
                      onClick={startReviewAhead}
                      disabled={aheadLoading}
                      style={{ border: "1.5px solid #ece8f4", background: "#fff", color: "#6d5bd0", font: "800 13.5px var(--font-nunito)", padding: "12px 24px", borderRadius: 13, cursor: aheadLoading ? "default" : "pointer" }}
                    >
                      {aheadLoading ? "Loading…" : "Review ahead →"}
                    </button>
                  )}
                </div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#a7a1b8", marginTop: 12, maxWidth: 340, marginLeft: "auto", marginRight: "auto" }}>
                  Reviewing ahead studies cards before they&apos;re due, weakest-memory first — the intervals it shows are the true, un-fudged next dates.
                </div>
              </>
            )}
          </div>
        </main>
      </AppShell>
    );
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

          {/* one-time primer (REVIEW-01) — commit-before-reveal, dismissible */}
          {showPrimer && (
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12, background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 16, padding: "14px 16px" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 17 }}>🧠</div>
              <div style={{ flex: 1, minWidth: 0, font: "600 12.5px/1.55 var(--font-nunito)", color: "#4a4560" }}>
                <b style={{ color: "#221f2e" }}>How review works:</b> commit a confidence level <i>before</i> you reveal the answer. That&apos;s what makes your calibration score honest — you can&apos;t revise the guess after seeing the result.
              </div>
              <button type="button" onClick={dismissPrimer} aria-label="Dismiss" style={{ border: "none", background: "none", cursor: "pointer", color: "#8b8699", font: "800 13px var(--font-nunito)", flexShrink: 0 }}>Got it ✕</button>
            </div>
          )}

          {/* progress dots */}
          <div style={{ display: "flex", gap: 7 }}>
            {cards.map((_, i) => (
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
                  <div style={{ font: "800 13px var(--font-nunito)" }}>{c.topicTitle}</div>
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Flashcard · from {sectionLabel(c.section)}</div>
                </div>
              </div>
              {phase === "front" ? (
                (() => {
                  const badge = (c.trustState && TRUST_BADGE[c.trustState]) || { label: "Unverified", color: "#8b8699", bg: "#f2f0f6" };
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 11px var(--font-nunito)", color: badge.color, background: badge.bg, padding: "6px 11px", borderRadius: 10 }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        <path d="M8 12.5l2.5 2.5L16 9.5" />
                      </svg>
                      {badge.label}
                    </div>
                  );
                })()
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
                <div role="group" aria-label="Commit your confidence before revealing" style={{ background: "#f7f5fb", border: "1.5px solid #ece8f4", borderRadius: 18, padding: "18px 20px", marginBottom: 22 }}>
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
                          aria-pressed={sel}
                          aria-label={`Confidence: ${cfg.label}`}
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
                  <div id="vl-reveal-hint" role="status" aria-live="polite" style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: confidence ? "#2e9c6a" : "#9a95a8" }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      {confidence ? <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 017-2.6" /></> : <><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 018 0v3" /></>}
                    </svg>
                    {confidence ? "Locked in — reveal when ready" : "Pick a confidence level to reveal the answer"}
                  </div>
                  <button
                    type="button"
                    disabled={!confidence}
                    aria-describedby="vl-reveal-hint"
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
                        <span style={{ font: "700 10.5px var(--font-nunito)", color: r.subColor }}>{c.intervals[r.key]}</span>
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
              {confidence && rating ? (
                (() => {
                  const v = calibrationVerdict(confidence, rating as Rating);
                  return (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: v.bg }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={v.tone} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="9" />
                          <path d="M8 12.5l2.5 2.5L16 9.5" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ font: "800 13.5px var(--font-nunito)", color: v.tone }}>{v.title}</div>
                        <div style={{ font: "600 11.5px/1.45 var(--font-nunito)", color: "#6c6780" }}>{v.detail}</div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", padding: "6px 2px" }}>
                  Rate your recall below to see how your <b>{confidence ? CONF[confidence].label : "committed"}</b> confidence matched reality.
                </div>
              )}
              <div style={{ font: "600 11.5px/1.55 var(--font-nunito)", color: "#8b8699", marginTop: 12 }}>
                Matching confidence to reality is what builds the calibration signal on your Progress page.
              </div>
            </div>
          )}

          {/* session ring */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Today&apos;s session</div>
            <SessionRing reviewed={reviewed} total={TOTAL} />
            <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>
              {TOTAL - reviewed > 0 ? `${TOTAL - reviewed} card${TOTAL - reviewed === 1 ? "" : "s"} left in this session` : "Last card — nice work!"}
            </div>
            {tracked > 0 && (
              <Link href="/gap-map" style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 12, textDecoration: "none", font: "800 11.5px var(--font-nunito)", color: "#6d5bd0", background: "#f1eefb", padding: "7px 12px", borderRadius: 10 }}>
                🎯 {tracked} gap{tracked === 1 ? "" : "s"} tracked — open Gap Map
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            )}
          </div>

          {phase === "front" ? (
            <>
              {/* up next — the real upcoming cards in this session */}
              <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
                <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Up next</div>
                {cards.slice(card + 1, card + 4).length === 0 ? (
                  <div style={{ font: "600 12px var(--font-nunito)", color: "#9a95a8" }}>This is the last card in your session.</div>
                ) : (
                  cards.slice(card + 1, card + 4).map((it, idx) => (
                    <div key={it.id} style={{ display: "flex", alignItems: "center", gap: 11, padding: "9px 0", ...(idx > 0 ? { borderTop: "1px solid #f5f3fa" } : {}) }}>
                      <div style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: "800 13px var(--font-nunito)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.q}</div>
                        <div style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>{it.topicTitle} · {sectionLabel(it.section)}</div>
                      </div>
                    </div>
                  ))
                )}
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
                    <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>Seeded error-drills</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
                  <span style={{ font: "900 30px var(--font-nunito)" }}>—</span>
                  <span style={{ font: "800 15px var(--font-nunito)", color: "#b3a7f0" }}>none this session</span>
                </div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#c9c3d8", marginTop: 10 }}>
                  Drills salt deliberately-false claims into your reviews so you can catch them — they turn on once the Skeptic is generating them.
                </div>
              </SpotlightCard>
            </>
          ) : (
            <button
              type="button"
              disabled={!rating || saving}
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
