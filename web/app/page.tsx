import Link from "next/link";
import AppShell from "@/components/AppShell";
import { StatCard, TrustBar } from "@/components/ui";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { getDb, reviewCardsOf } from "@/lib/store/db";
import { now } from "@/lib/ids";

export const metadata = { title: "Dashboard · VeriLearn" };

const EMOJI: Record<string, string> = { dijkstra: "🧭", merkle: "🌳", "binary search": "🔍" };
function topicEmoji(title: string): string {
  const key = Object.keys(EMOJI).find((k) => title.toLowerCase().includes(k));
  return key ? EMOJI[key] : "📗";
}

export default async function DashboardPage() {
  const user = await requireUser();
  const topics = listTopicSummaries(user.id);
  const dueCount = reviewCardsOf(getDb(), user.id).filter((c) => c.fsrs.due <= now()).length;
  const conflicts = topics.reduce((n, t) => n + t.disputes, 0);
  return (
    <AppShell active="dashboard">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 316px",
          gap: 24,
          alignItems: "start",
        }}
      >
        {/* ---- CENTER COLUMN ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          {/* top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 25px var(--font-nunito)", letterSpacing: "-.02em" }}>
                Welcome back, {user.displayName} 👋
              </div>
              <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                You have {dueCount} review{dueCount === 1 ? "" : "s"} due and {conflicts} open conflict{conflicts === 1 ? "" : "s"} today.
              </div>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "#fff",
                borderRadius: 15,
                padding: "11px 16px",
                width: 250,
                boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
              }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4-4" />
              </svg>
              <input
                placeholder="Search topics…"
                style={{
                  border: "none",
                  outline: "none",
                  background: "none",
                  font: "600 13.5px var(--font-nunito)",
                  color: "#221f2e",
                  width: "100%",
                }}
              />
            </div>
            <Link
              href="/notifications"
              style={{
                width: 46,
                height: 46,
                borderRadius: 15,
                background: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
                position: "relative",
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9a6 6 0 1112 0c0 5 2 6 2 6H4s2-1 2-6M10 20a2 2 0 004 0" />
              </svg>
              <span
                style={{
                  position: "absolute",
                  top: 11,
                  right: 12,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f0563a",
                  border: "2px solid #fff",
                }}
              />
            </Link>
          </div>

          {/* hero */}
          <div
            style={{
              position: "relative",
              background: "#211d2e",
              borderRadius: 24,
              padding: "34px 36px",
              overflow: "hidden",
              minHeight: 186,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(120% 140% at 85% 20%,rgba(139,120,232,.4),transparent 55%)",
              }}
            />
            <div style={{ position: "relative", maxWidth: "60%" }}>
              <div
                style={{
                  font: "800 11px var(--font-nunito)",
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  color: "#b3a7f0",
                  marginBottom: 10,
                }}
              >
                Verified Learning
              </div>
              <div style={{ font: "900 30px/1.15 var(--font-nunito)", letterSpacing: "-.02em", color: "#fff" }}>
                Learn things you can<br />actually trust ✨
              </div>
              <Link
                href="/new-topic"
                style={{
                  display: "inline-block",
                  textDecoration: "none",
                  marginTop: 18,
                  padding: "12px 26px",
                  borderRadius: 14,
                  background: "#fff",
                  color: "#221f2e",
                  font: "800 14px var(--font-nunito)",
                  whiteSpace: "nowrap",
                }}
              >
                Start a topic
              </Link>
            </div>
            <div
              style={{
                position: "absolute",
                right: 30,
                top: "50%",
                transform: "translateY(-50%)",
                width: 220,
                height: 150,
                borderRadius: 20,
                backgroundColor: "#332d47",
                backgroundImage:
                  "repeating-linear-gradient(135deg,rgba(255,255,255,.14) 0 8px,transparent 8px 16px)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: 10,
              }}
            >
              <span
                style={{
                  font: "700 10px var(--font-nunito)",
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: "#8a83a8",
                }}
              >
                illustration
              </span>
            </div>
          </div>

          {/* stat cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <StatCard
              bg="#fdf3d0"
              labelColor="#9a7f3a"
              value="24"
              label="Verified topics"
              icon={
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#d19a2b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 5a1 1 0 011-1h5a2 2 0 012 2 2 2 0 012-2h5a1 1 0 011 1v13a1 1 0 01-1 1h-6a1 1 0 00-1 1 1 1 0 00-1-1H5a1 1 0 01-1-1z" />
                </svg>
              }
            />
            <StatCard
              bg="#dcefe4"
              labelColor="#3d8763"
              value="128"
              label="Claims checked"
              icon={
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              }
            />
            <StatCard
              bg="#dce8fb"
              labelColor="#3a63b0"
              value="10"
              label="Certificates"
              icon={
                <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#3a6fd4" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="9" r="5" />
                  <path d="M8.5 13.5L7 21l5-2.5L17 21l-1.5-7.5" />
                </svg>
              }
            />
          </div>

          {/* class list */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
              <span style={{ font: "900 18px var(--font-nunito)", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>My topics</span>
              <Link
                href="/topics"
                style={{
                  textDecoration: "none",
                  background: "#f3f1f9",
                  color: "#6d5bd0",
                  font: "800 12.5px var(--font-nunito)",
                  padding: "8px 16px",
                  borderRadius: 11,
                }}
              >
                See all
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 150px 130px",
                gap: 12,
                font: "800 11px var(--font-nunito)",
                letterSpacing: ".04em",
                textTransform: "uppercase",
                color: "#a7a1b8",
                padding: "0 4px 12px",
                borderBottom: "1px solid #f0edf6",
              }}
            >
              <span>Topic</span>
              <span>Trust progress</span>
              <span>Status</span>
            </div>

            {topics.length === 0 && (
              <div style={{ padding: "26px 4px", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
                No topics yet.{" "}
                <Link href="/new-topic" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>Start your first topic →</Link>
              </div>
            )}
            {topics.map((t, i) => {
              const verified = t.breakdown.verified_execution + t.breakdown.verified_source;
              const pct = (n: number) => Math.round((n / Math.max(1, t.claimCount)) * 100);
              const segments = [
                { color: "#0e8c6b", pct: pct(verified) },
                { color: "#2d6cdf", pct: pct(t.breakdown.sourced) },
                { color: "#b4690e", pct: pct(t.breakdown.disputed) },
              ].filter((s) => s.pct > 0);
              const status =
                t.disputes > 0
                  ? { label: `● ${t.disputes} dispute${t.disputes > 1 ? "s" : ""}`, color: "#b4690e", bg: "#fbefdd" }
                  : t.verifiedPercent === 100
                    ? { label: "✓ Verified", color: "#3a63b0", bg: "#e3ecfb" }
                    : { label: "● On track", color: "#2e9c6a", bg: "#e4f4ec" };
              return (
                <div key={t.id} style={{ display: "grid", gridTemplateColumns: "1fr 150px 130px", gap: 12, alignItems: "center", padding: "14px 4px", ...(i < topics.length - 1 ? { borderBottom: "1px solid #f5f3fa" } : {}) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 13, minWidth: 0 }}>
                    <div style={{ width: 44, height: 44, borderRadius: 14, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{topicEmoji(t.title)}</div>
                    <Link href="/topics" style={{ minWidth: 0, textDecoration: "none", color: "inherit" }}>
                      <div style={{ font: "800 14.5px var(--font-nunito)" }}>{t.title}</div>
                      <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>{t.level} · {t.claimCount} claims</div>
                    </Link>
                  </div>
                  <div>
                    <div style={{ font: "800 12px var(--font-nunito)", marginBottom: 6 }}>{t.verifiedPercent}% verified</div>
                    <TrustBar height={7} radius={4} gap={1} track="#eee9f7" segments={segments} />
                  </div>
                  <span style={{ justifySelf: "start", font: "800 11.5px var(--font-nunito)", color: status.color, background: status.bg, padding: "6px 12px", borderRadius: 10 }}>{status.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- RIGHT PANEL ---- */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* profile */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{ border: "none", background: "none", cursor: "pointer", color: "#b6b1c4", fontSize: 18, lineHeight: 1 }}>⋯</button>
            </div>
            <div
              style={{
                width: 88,
                height: 88,
                borderRadius: "50%",
                margin: "2px auto 14px",
                background: "linear-gradient(135deg,#f6d8e8,#efe4ff)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 42,
                border: "3px solid #f3eefc",
              }}
            >
              🧑‍🎨
            </div>
            <div style={{ font: "900 18px var(--font-nunito)" }}>Adeline Watson</div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                font: "800 12px var(--font-nunito)",
                color: "#6d5bd0",
                background: "#f1eefb",
                padding: "5px 12px",
                borderRadius: 10,
                marginTop: 8,
                whiteSpace: "nowrap",
              }}
            >
              Verified Learner 🌟
            </div>
          </div>

          {/* activity */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ font: "800 13px var(--font-nunito)", color: "#8b8699" }}>Study activity</div>
                <div style={{ font: "900 24px var(--font-nunito)", marginTop: 2 }}>
                  3.5 <span style={{ fontSize: 15, color: "#8b8699" }}>hrs</span>
                </div>
              </div>
              <button
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  border: "1px solid #ece8f4",
                  background: "#fbfafd",
                  font: "800 12px var(--font-nunito)",
                  color: "#4a4560",
                  padding: "7px 12px",
                  borderRadius: 11,
                  cursor: "pointer",
                }}
              >
                Weekly
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, height: 118 }}>
              {[
                { h: "55%", label: "Mon" },
                { h: "78%", label: "Tue" },
                { h: "48%", label: "Wed" },
                { h: "40%", label: "Thu" },
              ].map((b) => (
                <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", maxWidth: 22, height: b.h, borderRadius: 7, background: "#e4defa" }} />
                  <span style={{ font: "700 10px var(--font-nunito)", color: "#a7a1b8" }}>{b.label}</span>
                </div>
              ))}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end", position: "relative" }}>
                <div style={{ position: "absolute", top: -4, background: "#221f2e", color: "#fff", font: "800 9px var(--font-nunito)", padding: "3px 7px", borderRadius: 7 }}>10 hrs</div>
                <div style={{ width: "100%", maxWidth: 22, height: "92%", borderRadius: 7, background: "#6d5bd0" }} />
                <span style={{ font: "700 10px var(--font-nunito)", color: "#6d5bd0" }}>Fri</span>
              </div>
              {[
                { h: "60%", label: "Sat" },
                { h: "84%", label: "Sun" },
              ].map((b) => (
                <div key={b.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", maxWidth: 22, height: b.h, borderRadius: 7, background: "#e4defa" }} />
                  <span style={{ font: "700 10px var(--font-nunito)", color: "#a7a1b8" }}>{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* task list */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ font: "900 16px var(--font-nunito)" }}>To review</span>
              <button style={{ border: "none", background: "none", cursor: "pointer", color: "#b6b1c4", fontSize: 18, lineHeight: 1 }}>⋯</button>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fbeadf", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>📼</div>
              <Link href="/review" style={{ flex: 1, minWidth: 0, textDecoration: "none", color: "inherit" }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>4 flashcards due</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Spaced review · today</div>
              </Link>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⚖️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Resolve 2 conflicts</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Merkle trees · Nov 14</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", borderTop: "1px solid #f5f3fa" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "#e7f3ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>✍️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Finish 1 task</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Dijkstra · Nov 13</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          {/* upcoming tests */}
          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ font: "900 16px var(--font-nunito)" }}>Upcoming tests</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "4px 9px", borderRadius: 8 }}>3 soon</span>
            </div>
            <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
              Verified check-ins on what you&apos;ve learned
            </div>

            <Link href="/tests/dijkstra-checkpoint" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M15 9l-2 5-4 1 2-5z" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Dijkstra&apos;s algorithm</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>
                  Checkpoint · <span style={{ color: "#c0392b", fontWeight: 800 }}>in 2 days</span>
                </div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/tests" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #f5f3fa", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#e9f7ef", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M12 7l4-2M12 11l5-2.5" />
                  <path d="M6 21h12" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Merkle trees</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>
                  Checkpoint · <span style={{ color: "#b4830f", fontWeight: 800 }}>18 Jul</span>
                </div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>
            <Link href="/tests" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #f5f3fa", textDecoration: "none", color: "inherit" }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#e2ecfb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4-4" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)" }}>Binary search</div>
                <div style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>
                  Mastery test · <span style={{ color: "#8b8699", fontWeight: 800 }}>24 Jul</span>
                </div>
              </div>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 6l6 6-6 6" />
              </svg>
            </Link>

            <Link
              href="/tests"
              style={{
                display: "block",
                textAlign: "center",
                textDecoration: "none",
                marginTop: 14,
                padding: 12,
                borderRadius: 13,
                background: "#221f2e",
                color: "#fff",
                font: "800 13px var(--font-nunito)",
              }}
            >
              See all upcoming tests
            </Link>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
