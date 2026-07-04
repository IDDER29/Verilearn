import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { buildSession } from "@/lib/services/testsession";
import { readinessFor } from "@/lib/services/progress";
import { now } from "@/lib/ids";

export const metadata = { title: "Test Detail · VeriLearn" };

// TEST-02: a test is formatted from verified/sourced-eligible claims only —
// disputed claims are excluded until resolved. Real format strip comes from buildSession.
export default async function TestDetailPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const user = await requireUser();
  const { topic } = await searchParams;
  const summaries = listTopicSummaries(user.id);
  const topicId = topic ?? summaries[0]?.id;
  const summary = summaries.find((s) => s.id === topicId);
  const session = topicId ? buildSession(user.id, topicId) : null;

  // Graceful fallback when the user has no topics / no eligible claims (buildSession → null).
  const title = session?.title ?? "Your first test";
  const questionCount = session?.questionCount ?? 0;
  const durationMin = Math.round((session?.durationMs ?? 1_200_000) / 60_000);
  const passBar = session?.passBar ?? 75;
  const excluded = summary?.disputes ?? 0;

  // Real predicted readiness from the tested predictReadiness engine (TEST-01).
  const readiness = topicId ? readinessFor(user.id, topicId, now()) : { pct: null, lowConfidence: true, basis: "not enough data yet", reviewed: 0, covered: 0 };
  const rPct = readiness.pct;
  const noPrediction = rPct === null || readiness.reviewed === 0;
  const rColor = noPrediction || readiness.lowConfidence ? "#c99a2b" : rPct! >= passBar ? "#2e9c6a" : rPct! >= passBar - 15 ? "#c99a2b" : "#c0392b";
  const rDeg = noPrediction ? 0 : Math.round((rPct! / 100) * 360);
  const rSub = noPrediction
    ? "no prediction yet"
    : readiness.lowConfidence
      ? "low confidence"
      : rPct! >= passBar
        ? "likely to pass"
        : "below the bar";

  return (
    <AppShell active="tests">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 320px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Link
              href="/tests"
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
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Tests / Checkpoint</div>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{title}</div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                font: "800 12px var(--font-nunito)",
                color: "#c0392b",
                background: "#fbeceb",
                padding: "9px 14px",
                borderRadius: 12,
                whiteSpace: "nowrap",
              }}
            >
              ⏳ In 2 days
            </div>
          </div>

          {/* format strip */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 14 }}>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>{questionCount}</div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>Questions</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>
                {durationMin}<span style={{ fontSize: 13, color: "#8b8699" }}> min</span>
              </div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>Time limit</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>
                {passBar}<span style={{ fontSize: 13, color: "#8b8699" }}>%</span>
              </div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>To pass</div>
            </div>
            <div style={{ background: "#fff", borderRadius: 18, padding: "16px 18px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>{excluded}</div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>Disputed · excluded</div>
            </div>
          </div>

          {/* what it covers */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 6 }}>What this test covers</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
              All {questionCount} questions are drawn only from <b>verified &amp; sourced</b> claims —{" "}
              {excluded > 0
                ? <>{excluded} disputed {excluded === 1 ? "claim is" : "claims are"} excluded until resolved.</>
                : <>disputed claims are excluded until resolved.</>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 13, background: "#faf9fc" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span style={{ flex: 1, minWidth: 0, font: "700 13px var(--font-nunito)" }}>§1 · Core idea — greedy shortest-path tree</span>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>3 Q</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 13, background: "#faf9fc" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span style={{ flex: 1, minWidth: 0, font: "700 13px var(--font-nunito)" }}>§2 · Implementation — priority queue &amp; relaxation</span>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>5 Q</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 13, background: "#fbf6ec" }}>
                <span style={{ width: 26, height: 26, borderRadius: 8, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 8v4M12 16h.01" />
                    <circle cx="12" cy="12" r="9" />
                  </svg>
                </span>
                <span style={{ flex: 1, minWidth: 0, font: "700 13px var(--font-nunito)" }}>§3 · Limits — complexity &amp; when it fails</span>
                <span style={{ font: "700 11px var(--font-nunito)", color: "#b4830f" }}>4 Q · needs review</span>
              </div>
            </div>
          </div>

          {/* format rules */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 14 }}>How it works</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div style={{ display: "flex", gap: 11 }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v4l3 2" />
                  </svg>
                </span>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>Timed &amp; continuous</div>
                  <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
                    The clock keeps running — you can&apos;t pause once started.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 11 }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
                    <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
                  </svg>
                </span>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>Every answer cites a source</div>
                  <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
                    Afterward you see which claim each question tested.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 11 }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3a9 9 0 100 18M12 3a9 9 0 019 9h-9z" />
                  </svg>
                </span>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>No confidence gate</div>
                  <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
                    Unlike review, this is a straight assessment.
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 11 }}>
                <span style={{ width: 34, height: 34, borderRadius: 11, background: "#fbf3e4", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                    <path d="M4 12h2M18 12h2M12 4v2M12 18v2" />
                  </svg>
                </span>
                <div>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>Misses feed your gap map</div>
                  <div style={{ font: "600 11.5px/1.5 var(--font-nunito)", color: "#8b8699" }}>
                    Wrong answers become tracked gaps automatically.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right: readiness + start */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14, textAlign: "left" }}>Predicted readiness</div>
            <div style={{ position: "relative", width: 132, height: 132, margin: "0 auto 6px" }}>
              <div style={{ width: 132, height: 132, borderRadius: "50%", background: `conic-gradient(${rColor} ${rDeg}deg,#eee9f7 0)` }} />
              <div
                style={{
                  position: "absolute",
                  inset: 15,
                  borderRadius: "50%",
                  background: "#fff",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ font: "900 28px var(--font-nunito)", color: rColor }}>{noPrediction ? "—" : `${rPct}%`}</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>{rSub}</div>
              </div>
            </div>
            <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginTop: 8 }}>
              {noPrediction
                ? "No prediction yet — review this topic's cards to unlock it."
                : `${readiness.basis[0].toUpperCase()}${readiness.basis.slice(1)} (${readiness.reviewed} of ${readiness.covered} covered claims reviewed).`}
            </div>
          </div>

          {/* readiness breakdown */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14 }}>Boost your odds</div>
            <Link href="/review" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fbeadf", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📼</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>Review §3 flashcards</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>4 cards · weakest section</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/topics/conflicts" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", borderTop: "1px solid #f5f3fa", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⚖️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>Resolve 1 conflict</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>Frees a claim for the test</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          </div>

          {/* start CTA */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 8v4l3 2" />
              </svg>
              You can start now or wait until it&apos;s due.
            </div>
            <Link
              href="/tests/runner"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                padding: 15,
                borderRadius: 14,
                background: "#6d5bd0",
                color: "#fff",
                font: "800 15px var(--font-nunito)",
                boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)",
              }}
            >
              Start test now
            </Link>
            <Link
              href="/tests"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: 10,
                padding: 13,
                borderRadius: 14,
                border: "1.5px solid #ece8f4",
                background: "#fbfafd",
                color: "#4a4560",
                font: "800 13.5px var(--font-nunito)",
              }}
            >
              Remind me when due
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
