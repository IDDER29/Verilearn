import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTestableTopics } from "@/lib/services/tests";
import { readinessFor } from "@/lib/services/progress";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";

export const metadata = { title: "Tests · VeriLearn" };

const detailHref = (topicId: string) => `/tests/${topicId}?topic=${topicId}`;

/** Colour for a readiness / score percent — green ≥67, amber ≥34, else red. */
function tone(pct: number): string {
  return pct >= 67 ? "#2e9c6a" : pct >= 34 ? "#b4830f" : "#c0392b";
}

export default async function TestsPage() {
  const user = await requireUser();
  const db = getDb();
  // Most-ready first, then most eligible claims — the best test to take now leads.
  const testable = listTestableTopics(user.id)
    .filter((t) => t.eligibleCount > 0)
    .sort((a, b) => b.readinessPercent - a.readinessPercent || b.eligibleCount - a.eligibleCount);
  const featured = testable[0];
  // Real predicted readiness for the featured topic (tested engine); "—" until reviewed.
  const heroReady = featured ? readinessFor(user.id, featured.topicId, now()) : null;
  const heroPct = heroReady && heroReady.reviewed > 0 && heroReady.pct !== null ? heroReady.pct : null;
  const heroDeg = heroPct === null ? 0 : Math.round((heroPct / 100) * 360);
  const DETAIL_HREF = featured ? detailHref(featured.topicId) : "/tests";

  // Real "scheduled" list: every test-ready topic.
  // Real past results: this learner's issued certificates, newest first.
  const certs = [...db.certificates.values()]
    .filter((c) => c.learnerId === user.id)
    .sort((a, b) => b.issuedAt - a.issuedAt);
  const topicTitle = (topicId: string) => db.topics.get(topicId)?.title ?? "Topic";

  return (
    <AppShell active="tests">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Upcoming tests 🎯</div>
          <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
            Timed, verified check-ins — questions drawn only from claims that passed the Skeptic.
          </div>
        </div>

        {/* next test hero + readiness */}
        <div
          style={{
            position: "relative",
            background: "#211d2e",
            borderRadius: 24,
            padding: "28px 32px",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            gap: 28,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(120% 150% at 88% 15%,rgba(139,120,232,.42),transparent 55%)",
            }}
          />
          <div
            style={{
              position: "relative",
              width: 96,
              height: 96,
              flexShrink: 0,
              borderRadius: "50%",
              background: `conic-gradient(#8b78e8 ${heroDeg}deg,rgba(255,255,255,.14) 0)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 74,
                height: 74,
                borderRadius: "50%",
                background: "#211d2e",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
            >
              <span style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>{heroPct === null ? "—" : `${heroPct}%`}</span>
              <span style={{ font: "700 9px var(--font-nunito)", color: "#b3a7f0" }}>ready</span>
            </div>
          </div>
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <div
              style={{
                font: "800 10px var(--font-nunito)",
                letterSpacing: ".12em",
                textTransform: "uppercase",
                color: "#b3a7f0",
                marginBottom: 6,
              }}
            >
              {featured ? "Next test" : "No test ready"}
            </div>
            <div style={{ font: "900 23px/1.2 var(--font-nunito)", color: "#fff" }}>
              {featured ? `${featured.title} — Checkpoint` : "No topics to test yet"}
            </div>
            <div
              style={{
                display: "flex",
                gap: 18,
                marginTop: 10,
                font: "700 12.5px var(--font-nunito)",
                color: "#c9c3d8",
              }}
            >
              <span>📝 {featured ? featured.eligibleCount : 0} eligible claims</span>
              <span>🕑 20 min</span>
              <span>✓ pass ≥ 75%</span>
              {featured && featured.excludedCount > 0 && <span style={{ color: "#f0a99f" }}>⚠ {featured.excludedCount} excluded (disputed/unsupported)</span>}
            </div>
          </div>
          {featured && (
            <Link
              href={DETAIL_HREF}
              style={{
                position: "relative",
                textDecoration: "none",
                background: "#fff",
                color: "#221f2e",
                font: "800 13.5px var(--font-nunito)",
                padding: "13px 22px",
                borderRadius: 14,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              Review &amp; start
            </Link>
          )}
        </div>

        {/* scheduled list — every test-ready topic, real eligibility + readiness */}
        <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8" }}>
          Test-ready topics
        </div>

        {testable.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, padding: "24px 20px", font: "600 13px var(--font-nunito)", color: "#8b8699", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
            No topics are test-ready yet — a test unlocks once a topic has verified or sourced claims the Skeptic hasn&apos;t disputed.
          </div>
        ) : (
          testable.map((t) => (
            <Link
              key={t.topicId}
              href={detailHref(t.topicId)}
              style={{ display: "flex", alignItems: "center", gap: 16, background: "#fff", borderRadius: 18, padding: "18px 20px", textDecoration: "none", color: "inherit", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}
            >
              <div style={{ width: 52, height: 52, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-2 5-4 1 2-5z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
                  <span style={{ font: "800 15px var(--font-nunito)" }}>{t.title}</span>
                  {t.excludedCount > 0 && (
                    <span style={{ font: "800 10px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "3px 9px", borderRadius: 8 }}>
                      {t.excludedCount} excluded
                    </span>
                  )}
                </div>
                <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
                  Checkpoint · {t.eligibleCount} eligible claim{t.eligibleCount === 1 ? "" : "s"} · 20 min · pass ≥ 75%
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
                  <span style={{ font: "700 11px var(--font-nunito)", color: tone(t.readinessPercent), flexShrink: 0 }}>{t.readinessPercent}% ready</span>
                  <div style={{ flex: 1, maxWidth: 180, height: 6, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}>
                    <div style={{ width: `${t.readinessPercent}%`, height: "100%", background: tone(t.readinessPercent) }} />
                  </div>
                </div>
              </div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
          ))
        )}

        {/* past results — real issued certificates */}
        <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginTop: 6 }}>
          Past results
        </div>
        {certs.length === 0 ? (
          <div style={{ background: "#fff", borderRadius: 18, padding: "20px", font: "600 13px var(--font-nunito)", color: "#8b8699", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
            No tests taken yet — pass a checkpoint to earn your first verified certificate.
          </div>
        ) : (
          <div style={{ background: "#fff", borderRadius: 18, padding: "8px 20px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
            {certs.map((c, i) => {
              const passed = c.testScorePct >= 75;
              return (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", ...(i < certs.length - 1 ? { borderBottom: "1px solid #f5f3fa" } : {}) }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: passed ? "#e7f4ee" : "#fbeceb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {passed ? (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
                    ) : (
                      <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 9l-6 6M9 9l6 6" /></svg>
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 13.5px var(--font-nunito)" }}>{topicTitle(c.topicId)} — Checkpoint</div>
                    <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>
                      {c.revoked ? "Revoked" : "Verified"} · {c.verifyCode}
                    </div>
                  </div>
                  <span style={{ font: "900 15px var(--font-nunito)", color: passed ? "#2e9c6a" : "#c0392b" }}>
                    {passed ? "Passed" : "Missed"} · {c.testScorePct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </AppShell>
  );
}
