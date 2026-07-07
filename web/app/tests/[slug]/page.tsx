import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { buildSession } from "@/lib/services/testsession";
import { readinessFor } from "@/lib/services/progress";
import { getTopicView } from "@/lib/services/topics";
import { isTestEligible } from "@/lib/domain/types";
import { now } from "@/lib/ids";
import { isQuarantined } from "@/lib/services/quarantine";
import { getDueCards } from "@/lib/services/review";

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
  // Total claims left out of the test for ANY reason (disputed, unsupported,
  // interpretive, or quarantined) — the same count the reduced-coverage banner
  // below already uses. Kept distinct from `disputedCount` because only
  // disputes are resolvable via the Conflicts inbox; a topic can be fully
  // excluded by unsourced/quarantined claims alone, with zero disputes.
  const totalExcluded = session?.excludedCount ?? 0;
  const disputedCount = summary?.disputes ?? 0;
  // TEST-20's zero-question case: not merely reduced coverage, but nothing
  // eligible to test at all — the "Start test now" CTA must not be offered.
  const startable = session?.startable ?? false;

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

  // Real per-section coverage: group the topic's claims by section and count
  // test-eligible vs. excluded (disputed/unsupported/quarantined) claims per
  // section — a quarantined claim (ADMIN-14) is held out of the actual test
  // the same as buildSession does, so it must not read as "eligible" here too
  // (that mismatch is exactly how the CTA and this breakdown could disagree).
  const view = topicId ? getTopicView(user.id, topicId) : null;
  const sectionMap = new Map<string, { eligible: number; excluded: number }>();
  for (const cs of view?.claimStates ?? []) {
    const s = sectionMap.get(cs.sectionId) ?? { eligible: 0, excluded: 0 };
    if (isTestEligible(cs.state) && !isQuarantined(cs.id)) s.eligible += 1;
    else s.excluded += 1;
    sectionMap.set(cs.sectionId, s);
  }
  const sections = [...sectionMap.entries()]
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([id, c], i) => ({ id, label: `§${i + 1}`, ...c }));

  // Real "Boost your odds" levers (TEST-09): the weakest section by real due
  // flashcards, and the real disputed-claim count — never static copy, and
  // each lever hides once its own blocker is cleared (no fabricated action).
  const claimSection = new Map((view?.topic.claims ?? []).map((c) => [c.id, c.sectionId]));
  const dueBySection = new Map<string, number>();
  if (topicId) {
    // Same eligibility-gated deck every due-count surface reads (REVIEW-15) —
    // a card on a disputed/quarantined claim can't count toward "weakest
    // section" here while the coverage breakdown above correctly excludes it.
    for (const card of getDueCards(user.id, now())) {
      if (card.topicId !== topicId) continue;
      const sec = claimSection.get(card.claimId);
      if (!sec) continue;
      dueBySection.set(sec, (dueBySection.get(sec) ?? 0) + 1);
    }
  }
  const weakestSectionId = [...dueBySection.entries()].sort(([, a], [, b]) => b - a)[0]?.[0];
  const weakestDueCount = weakestSectionId ? dueBySection.get(weakestSectionId)! : 0;
  const weakestSectionLabel = weakestSectionId ? (sections.find((s) => s.id === weakestSectionId)?.label ?? weakestSectionId) : null;

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

          {/* reduced coverage (TEST-20): the engine never pads with ineligible claims —
              when that means fewer questions than the topic's full claim count, say so. */}
          {session?.reducedCoverage && (
            <div style={{ display: "flex", alignItems: "center", gap: 9, background: "#fbefdd", border: "1.5px solid #f0dcae", borderRadius: 14, padding: "12px 15px", font: "700 12.5px/1.5 var(--font-nunito)", color: "#9a7f2a" }}>
              <span aria-hidden style={{ fontSize: 16 }}>⚠️</span>
              Reduced coverage — {session.excludedCount} of this topic&apos;s claim{session.excludedCount === 1 ? "" : "s"}
              {" "}couldn&apos;t be included (disputed, unsourced, or under review), so this test draws from fewer questions than the topic&apos;s full claim count.
            </div>
          )}

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
              <div style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>{totalExcluded}</div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 5 }}>Excluded</div>
            </div>
          </div>

          {/* what it covers */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 6 }}>What this test covers</div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
              All {questionCount} questions are drawn only from <b>verified &amp; sourced</b> claims —{" "}
              {totalExcluded > 0
                ? <>{totalExcluded} {totalExcluded === 1 ? "claim is" : "claims are"} excluded (disputed, unsourced, or under review) until resolved.</>
                : <>no claims are excluded right now.</>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {sections.length === 0 && (
                <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", padding: "6px 2px" }}>No claims to cover yet.</div>
              )}
              {sections.map((s) => {
                const needsReview = s.excluded > 0;
                return (
                  <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 13, background: needsReview ? "#fbf6ec" : "#faf9fc" }}>
                    <span style={{ width: 26, height: 26, borderRadius: 8, background: needsReview ? "#fbefdd" : "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {needsReview ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c99a2b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 8v4M12 16h.01" />
                          <circle cx="12" cy="12" r="9" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      )}
                    </span>
                    <span style={{ flex: 1, minWidth: 0, font: "700 13px var(--font-nunito)" }}>{s.label} · {s.eligible} eligible claim{s.eligible === 1 ? "" : "s"}</span>
                    <span style={{ font: "700 11px var(--font-nunito)", color: needsReview ? "#b4830f" : "#2e9c6a" }}>
                      {s.eligible} Q{needsReview ? ` · ${s.excluded} excluded` : ""}
                    </span>
                  </div>
                );
              })}
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

          {/* readiness breakdown — real levers (TEST-09): each hides once its own blocker clears */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14 }}>Boost your odds</div>
            {weakestSectionLabel && (
              <Link href="/review" style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", textDecoration: "none", color: "inherit" }}>
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fbeadf", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📼</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 12.5px var(--font-nunito)" }}>Review {weakestSectionLabel} flashcards</div>
                  <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>{weakestDueCount} card{weakestDueCount === 1 ? "" : "s"} due · weakest section</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            )}
            {disputedCount > 0 && (
              <Link
                href={`/topics/conflicts?topic=${topicId}`}
                style={{ display: "flex", alignItems: "center", gap: 11, padding: "11px 0", textDecoration: "none", color: "inherit", ...(weakestSectionLabel ? { borderTop: "1px solid #f5f3fa" } : {}) }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⚖️</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 12.5px var(--font-nunito)" }}>Resolve {disputedCount} conflict{disputedCount === 1 ? "" : "s"}</div>
                  <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>Frees {disputedCount === 1 ? "a claim" : `${disputedCount} claims`} for the test</div>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </Link>
            )}
            {!weakestSectionLabel && disputedCount === 0 && (
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", padding: "11px 0" }}>
                Nothing to boost right now — no cards due and no disputed claims blocking this test.
              </div>
            )}
          </div>

          {/* start CTA — gated on TEST-20's zero-question case: never offer to
              start a test with nothing eligible to ask. */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            {startable ? (
              <>
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
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 13px/1.5 var(--font-nunito)", color: "#c0392b", marginBottom: 12 }}>
                  <span aria-hidden style={{ fontSize: 16 }}>🚫</span>
                  Can&apos;t start yet
                </div>
                <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#6c6780", marginBottom: 16 }}>
                  {totalExcluded > 0
                    ? `Every claim in this topic is disputed, unsourced, or under review — there's nothing left to test until at least one is resolved.`
                    : `This topic has no verified or sourced claims yet, so there's nothing to test.`}
                </div>
                {disputedCount > 0 ? (
                  <Link
                    href={`/topics/conflicts?topic=${topicId}`}
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
                    Resolve conflicts →
                  </Link>
                ) : (
                  <Link
                    href={topicId ? `/topics/sources?topic=${topicId}` : "/new-topic"}
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
                    {topicId ? "View sources →" : "Start a topic →"}
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </AppShell>
  );
}
