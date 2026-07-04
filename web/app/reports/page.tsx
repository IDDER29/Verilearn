import Link from "next/link";
import AppShell from "@/components/AppShell";
import WeeksSelect from "@/components/reports/WeeksSelect";
import { requireUser } from "@/lib/auth/current";
import { focusAreas, perTopicProgress, progressFor, retentionSeries, signalDisplay } from "@/lib/services/progress";
import { now } from "@/lib/ids";
import type { Signal } from "@/lib/domain/signals";

const WEEK_OPTIONS = [4, 6, 8, 12] as const;
const DEFAULT_WEEKS = 6;

export const metadata = { title: "Progress · VeriLearn" };

const CONF_CHIP: Record<Signal["confidence"], { label: string; color: string }> = {
  none: { label: "new", color: "#a7a1b8" },
  low: { label: "low", color: "#b4830f" },
  ok: { label: "ok", color: "#2e9c6a" },
};

const FOCUS_TONE = {
  red: { bg: "#fdf2f1", color: "#c0392b" },
  amber: { bg: "#fbf6ec", color: "#b4830f" },
  green: { bg: "#eef7f1", color: "#2e9c6a" },
} as const;

/** A 0..1 signal as a percent, or an em-dash when there's no data yet. */
const pct = (v: number | null) => (v === null ? "—" : `${Math.round(v * 100)}%`);
const barPct = (v: number | null) => (v === null ? "0%" : `${Math.round(v * 100)}%`);

/** A signal's trend vs. 7 days ago (ANALYTICS-01) — null when there's no prior window to compare. */
function deltaLabel(delta: number | null): { text: string; color: string } | null {
  if (delta === null) return null;
  const points = Math.round(delta * 100);
  if (points === 0) return { text: "flat vs. last week", color: "#8b8699" };
  return points > 0 ? { text: `▲${points}% vs. last week`, color: "#2e9c6a" } : { text: `▼${Math.abs(points)}% vs. last week`, color: "#c0392b" };
}

const CALIB_DIRECTION: Record<string, string> = {
  overconfident: "Overconfident — you rate yourself higher than you score. Slow down on “sure”.",
  underconfident: "Underconfident — you know more than you claim. Trust your “sure”.",
  well_calibrated: "Well calibrated — your confidence tracks your accuracy.",
};

export default async function ReportsPage({ searchParams }: { searchParams: Promise<{ weeks?: string }> }) {
  const user = await requireUser();
  const { signals, calibration } = progressFor(user.id);
  const calibSub = calibration ? CALIB_DIRECTION[calibration.direction] : "Confidence vs. reality";

  // Real, learner-selectable trend window (ANALYTICS-17) — a genuine query param,
  // not a decorative label; invalid/missing values fall back to the honest default.
  const { weeks: weeksRaw } = await searchParams;
  const weeksParsed = Number(weeksRaw);
  const weeks = WEEK_OPTIONS.includes(weeksParsed as (typeof WEEK_OPTIONS)[number]) ? weeksParsed : DEFAULT_WEEKS;

  // Real weekly retention series for the trend chart (ANALYTICS-05).
  const at = now();
  const series = retentionSeries(user.id, at, weeks);
  // Freshness marker (ANALYTICS-20): signals are recomputed live on every visit —
  // there's no cache/snapshot to go stale, so this always reflects this exact request.
  const asOf = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" }).format(at);
  const CW = 620, PAD = 10, TOP = 20, BOT = 190;
  const xAt = (i: number) => PAD + (i * (CW - 2 * PAD)) / (series.weeks - 1);
  const yAt = (r: number) => BOT - r * (BOT - TOP);
  const linePts = series.points
    .map((p, i) => ({ x: xAt(i), y: p.retention !== null ? yAt(p.retention) : null, pct: p.retention }))
    .filter((p): p is { x: number; y: number; pct: number } => p.y !== null);
  const linePath = linePts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(0)} ${p.y.toFixed(0)}`).join(" ");
  const topicRows = perTopicProgress(user.id);
  const allFocus = focusAreas(user.id);
  const focus = allFocus.slice(0, 3);
  // Portfolio health bands (ANALYTICS-19): count topics by their weakest-signal tone.
  const bands = {
    green: allFocus.filter((f) => f.tone === "green").length,
    amber: allFocus.filter((f) => f.tone === "amber").length,
    red: allFocus.filter((f) => f.tone === "red").length,
  };
  const SIGNAL_CARDS = [
    { s: signals.retention, bg: "#eef2fb", stroke: "#3a63b0", label: "Retention", labelColor: "#3a63b0", sub: "How much you recall over time", subColor: "#7d90b5", icon: <path d="M20 11A8 8 0 004.6 9M4 4v5h5M4 13a8 8 0 0015.4 2M20 20v-5h-5" /> },
    { s: signals.transfer, bg: "#eef7f1", stroke: "#2e9c6a", label: "Transfer", labelColor: "#2e9c6a", sub: "Applying it to new problems", subColor: "#6ba888", icon: <path d="M4 17l5-5-5-5M12 19h8" /> },
    { s: signals.calibration, bg: "#f3eefc", stroke: "#6d5bd0", label: "Calibration", labelColor: "#6d5bd0", sub: calibSub, subColor: "#948ab5", icon: <><path d="M12 3a9 9 0 100 18M12 3a9 9 0 019 9h-9z" /><path d="M12 12l4-4" /></> },
    { s: signals.blindSpot, bg: "#fbf3e4", stroke: "#c99a2b", label: "Drill detection", labelColor: "#b4830f", sub: "Catching seeded errors", subColor: "#b09257", icon: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></> },
  ];
  return (
    <AppShell active="reports">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "900 25px var(--font-nunito)", letterSpacing: "-.02em" }}>Your progress 📈</div>
            <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              Four honest signals — no vanity metrics. Each maps to something you actually did.
            </div>
            <div style={{ font: "700 11px var(--font-nunito)", color: "#a7a1b8", marginTop: 4 }}>As of {asOf} · recomputed live on every visit, never cached</div>
          </div>
          <WeeksSelect weeks={weeks} />
        </div>

        {/* portfolio health bands (ANALYTICS-19) */}
        {allFocus.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 16, padding: "12px 18px", boxShadow: "0 6px 18px -14px rgba(80,60,140,.3)", font: "800 12.5px var(--font-nunito)" }}>
            <span style={{ color: "#8b8699", fontWeight: 700 }}>Across {allFocus.length} topic{allFocus.length === 1 ? "" : "s"}:</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#2e9c6a" }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: "#2e9c6a" }} />{bands.green} solid</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#b4830f" }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: "#c99a2b" }} />{bands.amber} watch</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#c0392b" }}><span style={{ width: 9, height: 9, borderRadius: "50%", background: "#c0392b" }} />{bands.red} needs work</span>
          </div>
        )}

        {/* four signal cards — real values, honest empty/low-confidence states */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {SIGNAL_CARDS.map((card) => {
            const disp = signalDisplay(card.s.value, card.s.confidence);
            const chip = CONF_CHIP[card.s.confidence];
            const delta = deltaLabel(card.s.delta);
            return (
              <div key={card.label} style={{ background: card.bg, borderRadius: 20, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={card.stroke} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {card.icon}
                    </svg>
                  </div>
                  <span style={{ font: "800 10px var(--font-nunito)", color: chip.color, background: "#ffffffaa", padding: "3px 8px", borderRadius: 8, textTransform: "uppercase", letterSpacing: ".04em" }}>
                    {chip.label}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <div style={{ font: "900 30px var(--font-nunito)", lineHeight: 1 }}>{disp.text}</div>
                  {/* Directional trend vs. 7 days ago (ANALYTICS-01) — never shown when there's no real comparison window. */}
                  {delta && (
                    <span style={{ font: "800 11px var(--font-nunito)", color: delta.color }}>{delta.text}</span>
                  )}
                </div>
                <div style={{ font: "800 13px var(--font-nunito)", color: card.labelColor, marginTop: 4 }}>{card.label}</div>
                <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: card.subColor, marginTop: 5 }}>{card.sub}</div>
                {card.s.confidence !== "ok" && (
                  <div style={{ font: "700 10.5px var(--font-nunito)", color: card.labelColor, marginTop: 2 }}>{disp.sub}</div>
                )}
                {/* Explainability drill-in (ANALYTICS-02): the engine's real provenance trace. */}
                <details style={{ marginTop: 10 }}>
                  <summary style={{ cursor: "pointer", font: "800 10px var(--font-nunito)", letterSpacing: ".03em", textTransform: "uppercase", color: card.labelColor }}>
                    Where this comes from
                  </summary>
                  <div style={{ font: "600 11px/1.55 var(--font-nunito)", color: card.subColor, marginTop: 6 }}>
                    {card.s.provenance}
                  </div>
                </details>
              </div>
            );
          })}
        </div>

        {/* chart + focus */}
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 20, alignItems: "start" }}>
          {/* retention trend chart */}
          <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ font: "900 18px var(--font-nunito)" }}>Retention over time</div>
              <div style={{ display: "flex", gap: 14, font: "700 11.5px var(--font-nunito)" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#3a63b0" }}>
                  <span style={{ width: 11, height: 11, borderRadius: 4, background: "#3a63b0" }} />
                  Weekly recall
                </span>
              </div>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 20 }}>
              Recall rate per week, straight from your review log — last {series.weeks} weeks.
            </div>

            {series.hasEnough ? (
              /* real weekly retention line (ANALYTICS-05) */
              <div style={{ position: "relative" }}>
                <svg viewBox="0 0 620 200" role="img" aria-label={`Weekly retention: ${linePts.map((p) => `${Math.round(p.pct * 100)}%`).join(", ")}`} style={{ width: "100%", height: "auto", display: "block" }}>
                  <line x1="0" y1="20" x2="620" y2="20" stroke="#f0edf6" strokeWidth="1.5" />
                  <line x1="0" y1="70" x2="620" y2="70" stroke="#f0edf6" strokeWidth="1.5" />
                  <line x1="0" y1="120" x2="620" y2="120" stroke="#f0edf6" strokeWidth="1.5" />
                  <line x1="0" y1="170" x2="620" y2="170" stroke="#f0edf6" strokeWidth="1.5" />
                  <path d={linePath} fill="none" stroke="#3a63b0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  {linePts.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r={i === linePts.length - 1 ? 5 : 3.5} fill="#3a63b0" stroke="#fff" strokeWidth="2.5" />
                  ))}
                </svg>
                <div style={{ display: "flex", justifyContent: "space-between", font: "700 10.5px var(--font-nunito)", color: "#a7a1b8", marginTop: 8, padding: "0 4px" }}>
                  {series.points.map((p) => <span key={p.weekStart}>{p.label}</span>)}
                </div>
              </div>
            ) : (
              <div style={{ background: "#faf9fc", borderRadius: 16, padding: "34px 20px", textAlign: "center", font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699" }}>
                Not enough review history yet — the trend line fills in once you&apos;ve reviewed across at least two weeks. Keep your reviews on schedule and it&apos;ll appear here.
              </div>
            )}
          </div>

          {/* where to focus */}
          <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 4 }}>Where to focus</div>
            <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>Ranked by your weakest signal per topic</div>

            {focus.length === 0 && (
              <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", padding: "8px 2px" }}>Start a topic to see where to focus.</div>
            )}
            {focus.map((f, i) => {
              const tone = FOCUS_TONE[f.tone];
              return (
                <Link key={f.topicId} href="/gap-map" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 15, background: tone.bg, marginBottom: i < focus.length - 1 ? 10 : 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tone.color} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      {f.tone === "green" ? <><circle cx="12" cy="12" r="9" /><path d="M8 12.5l2.5 2.5L16 9.5" /></> : <><path d="M12 4l9 15.5H3z" /><path d="M12 10v4M12 17h.01" /></>}
                    </svg>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 13px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.title}</div>
                    <div style={{ font: "700 11px var(--font-nunito)", color: tone.color, textTransform: "capitalize" }}>{f.reason}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* per-topic breakdown */}
        <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 18px var(--font-nunito)", marginBottom: 18 }}>By topic</div>

          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, font: "800 10.5px var(--font-nunito)", letterSpacing: ".04em", textTransform: "uppercase", color: "#a7a1b8", padding: "0 4px 12px", borderBottom: "1px solid #f0edf6" }}>
            <span>Topic</span><span>Retention</span><span>Transfer</span><span>Calibration</span><span>Verified</span>
          </div>

          {topicRows.length === 0 && (
            <div style={{ padding: "20px 4px", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>No topics yet — your per-topic signals appear here once you start one.</div>
          )}
          {topicRows.map((t, i) => {
            const verifiedTone = t.verifiedPercent >= 100 ? { color: "#2e9c6a", bg: "#e4f4ec" } : t.verifiedPercent >= 60 ? { color: "#b4830f", bg: "#fbefdd" } : { color: "#c0392b", bg: "#fbeceb" };
            return (
              <div key={t.topicId} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) 1fr 1fr 1fr 1fr", gap: 14, alignItems: "center", padding: "14px 4px", ...(i < topicRows.length - 1 ? { borderBottom: "1px solid #f5f3fa" } : {}) }}>
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8 12.5l2.5 2.5L16 9.5" />
                    </svg>
                  </div>
                  <span style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.title}</span>
                </div>
                <div>
                  <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: barPct(t.retention), height: "100%", background: "#3a63b0" }} /></div>
                  <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{pct(t.retention)}</span>
                </div>
                <div>
                  <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: barPct(t.transfer), height: "100%", background: "#2e9c6a" }} /></div>
                  <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{pct(t.transfer)}</span>
                </div>
                <div>
                  <div style={{ height: 7, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}><div style={{ width: barPct(t.calibration), height: "100%", background: "#6d5bd0" }} /></div>
                  <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{pct(t.calibration)}</span>
                </div>
                <span style={{ font: "800 12px var(--font-nunito)", color: verifiedTone.color, background: verifiedTone.bg, padding: "5px 11px", borderRadius: 9, justifySelf: "start" }}>{t.verifiedPercent}%</span>
              </div>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}
