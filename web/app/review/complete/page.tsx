import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { sessionSummaryFor } from "@/lib/services/review";
import { now } from "@/lib/ids";

export const metadata = { title: "Session Complete · VeriLearn" };

const RATING_ROWS = [
  { key: "again", label: "Again", color: "#c0392b", track: "#c0392b" },
  { key: "hard", label: "Hard", color: "#b4830f", track: "#c99a2b" },
  { key: "good", label: "Good", color: "#3a63b0", track: "#3a63b0" },
  { key: "easy", label: "Easy", color: "#2e9c6a", track: "#2e9c6a" },
] as const;

const WEEKDAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAY_MS = 24 * 60 * 60 * 1000;

export default async function SessionCompletePage() {
  const user = await requireUser();
  const at = now();
  const s = sessionSummaryFor(user.id, at);

  const reviewedLabel = `${s.reviewed} card${s.reviewed === 1 ? "" : "s"}`;
  const calibrationLabel = s.calibration.status === "ok" ? `${Math.round(s.calibration.score * 100)}%` : "—";

  // Next-review framing derived from the soonest upcoming card.
  const nextDate = s.nextDue !== null ? new Date(s.nextDue) : null;
  const daysUntil = s.nextDue !== null ? Math.max(1, Math.ceil((s.nextDue - at) / DAY_MS)) : null;
  const heroNext =
    s.nextDue !== null && daysUntil !== null
      ? `Your next batch is scheduled in ${daysUntil} day${daysUntil === 1 ? "" : "s"}.`
      : "No cards are scheduled yet — start a new topic to build your review deck.";

  const maxRating = Math.max(1, ...RATING_ROWS.map((r) => s.ratingCounts[r.key]));

  return (
    <AppShell active="tasks">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* hero celebration */}
        <div style={{ position: "relative", background: "linear-gradient(150deg,#6d5bd0,#8b78e8)", borderRadius: 26, padding: "38px 40px", overflow: "hidden", textAlign: "center", color: "#fff" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 120% at 20% 10%,rgba(255,255,255,.22),transparent 50%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", margin: "0 auto 16px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 21h8M12 17v4M7 4h10v4a5 5 0 01-10 0zM7 5H4v2a3 3 0 003 3M17 5h3v2a3 3 0 01-3 3" />
              </svg>
            </div>
            <div style={{ font: "900 30px var(--font-nunito)", letterSpacing: "-.02em" }}>Session complete! 🎉</div>
            <div style={{ font: "600 14px/1.5 var(--font-nunito)", color: "#e7e1fb", marginTop: 8, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>
              You reviewed {reviewedLabel} and recalled {s.correct} of {s.reviewed}. {heroNext}
            </div>
          </div>
        </div>

        {/* summary stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>{s.reviewed}</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Cards reviewed</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>{s.correct} / {s.reviewed}</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Recalled</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#f3eefc", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a9 9 0 100 18M12 3a9 9 0 019 9h-9z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>{calibrationLabel}</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Calibration</div>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -20px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3v3M4 7l2 2M20 7l-2 2M5 13a7 7 0 0114 0v3a3 3 0 01-3 3H8a3 3 0 01-3-3z" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 24px var(--font-nunito)", lineHeight: 1 }}>{s.streakDays}</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>Day streak</div>
            </div>
          </div>
        </div>

        {/* card breakdown + up next */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 20, alignItems: "start" }}>
          {/* FSRS ratings breakdown */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 18px var(--font-nunito)", marginBottom: 4 }}>How you rated recall</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>FSRS uses these to schedule your next reviews.</div>

            {RATING_ROWS.map((r) => {
              const count = s.ratingCounts[r.key];
              const pct = Math.round((count / maxRating) * 100);
              return (
                <div key={r.key} style={{ display: "flex", alignItems: "center", gap: 13, padding: "12px 0" }}>
                  <span style={{ width: 76, font: "800 12.5px var(--font-nunito)", color: r.color }}>{r.label}</span>
                  <div style={{ flex: 1, height: 12, borderRadius: 6, background: "#f3f1f9", overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: r.track }} />
                  </div>
                  <span style={{ width: 24, textAlign: "right", font: "800 13px var(--font-nunito)", color: "#8b8699" }}>{count}</span>
                </div>
              );
            })}

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, padding: "14px 16px", borderRadius: 15, background: "#fbf6ec" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M5 8l7-5 7 5M5 8v8l7 5 7-5V8" />
                </svg>
              </div>
              <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#6c6780" }}>
                {s.ratingCounts.again + s.ratingCounts.hard > 0 ? (
                  <>
                    <b style={{ color: "#221f2e" }}>{s.ratingCounts.again + s.ratingCounts.hard} card{s.ratingCounts.again + s.ratingCounts.hard === 1 ? "" : "s"} to reinforce</b> — anything you rated &quot;Again&quot; or &quot;Hard&quot; comes back sooner.
                  </>
                ) : (
                  <><b style={{ color: "#221f2e" }}>Clean sweep</b> — every card was recalled, so intervals stretch further out.</>
                )}
              </div>
            </div>
          </div>

          {/* next up */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Next review</div>
              {nextDate && daysUntil !== null ? (
                <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
                  <div style={{ width: 52, height: 52, borderRadius: 15, background: "#efe9ff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ font: "800 9px var(--font-nunito)", color: "#6d5bd0", textTransform: "uppercase" }}>{WEEKDAY[nextDate.getUTCDay()]}</span>
                    <span style={{ font: "900 18px var(--font-nunito)", color: "#6d5bd0", lineHeight: 1 }}>{nextDate.getUTCDate()}</span>
                  </div>
                  <div>
                    <div style={{ font: "800 14px var(--font-nunito)" }}>{s.dueSoonCount} card{s.dueSoonCount === 1 ? "" : "s"} due</div>
                    <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>in {daysUntil} day{daysUntil === 1 ? "" : "s"}</div>
                  </div>
                </div>
              ) : (
                <div style={{ font: "700 12.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>Nothing scheduled — you&apos;re all caught up.</div>
              )}
            </div>

            <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 9, background: "#6d5bd0", color: "#fff", font: "800 15px var(--font-nunito)", padding: 16, borderRadius: 16, boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}>
              Back to dashboard
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/review" style={{ textDecoration: "none", border: "1.5px solid #ece8f4", background: "#fff", color: "#4a4560", font: "800 14px var(--font-nunito)", padding: 15, borderRadius: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11A8 8 0 004.6 9M4 4v5h5" />
              </svg>
              Review ahead
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
