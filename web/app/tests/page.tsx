import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTestableTopics } from "@/lib/services/tests";

export const metadata = { title: "Tests · VeriLearn" };

const DETAIL_HREF = "/tests/dijkstra-checkpoint";

export default async function TestsPage() {
  const user = await requireUser();
  const featured = listTestableTopics(user.id)[0];
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
              background: "conic-gradient(#8b78e8 306deg,rgba(255,255,255,.14) 0)",
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
              <span style={{ font: "900 22px var(--font-nunito)", lineHeight: 1 }}>85%</span>
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
              Next test · in 2 days
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
              <span>📝 {featured ? featured.eligibleCount : 12} eligible claims</span>
              <span>🕑 20 min</span>
              <span>✓ pass ≥ 75%</span>
              {featured && featured.excludedCount > 0 && <span style={{ color: "#f0a99f" }}>⚠ {featured.excludedCount} excluded (disputed/unsupported)</span>}
            </div>
          </div>
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
        </div>

        {/* scheduled list */}
        <div
          style={{
            font: "800 11px var(--font-nunito)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#a7a1b8",
          }}
        >
          Scheduled
        </div>

        <Link
          href={DETAIL_HREF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#fff",
            borderRadius: 18,
            padding: "18px 20px",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              background: "#efe9ff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M15 9l-2 5-4 1 2-5z" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Dijkstra&apos;s algorithm</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "3px 9px", borderRadius: 8 }}>
                In 2 days
              </span>
            </div>
            <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
              Checkpoint · 12 questions · 20 min · covers §1–§3
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a", flexShrink: 0 }}>85% ready</span>
              <div style={{ flex: 1, maxWidth: 180, height: 6, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "85%", height: "100%", background: "#2e9c6a" }} />
              </div>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>

        <Link
          href={DETAIL_HREF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#fff",
            borderRadius: 18,
            padding: "18px 20px",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              background: "#e9f7ef",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3v18M12 7l4-2M12 11l5-2.5" />
              <path d="M6 21h12" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Merkle trees</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#b4830f", background: "#fbefdd", padding: "3px 9px", borderRadius: 8 }}>
                18 Jul
              </span>
            </div>
            <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
              Checkpoint · 10 questions · 18 min · covers all sections
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#b4830f", flexShrink: 0 }}>58% ready</span>
              <div style={{ flex: 1, maxWidth: 180, height: 6, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "58%", height: "100%", background: "#c99a2b" }} />
              </div>
              <span style={{ font: "700 10.5px var(--font-nunito)", color: "#c0392b" }}>· 1 disputed claim to resolve</span>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>

        <Link
          href={DETAIL_HREF}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "#fff",
            borderRadius: 18,
            padding: "18px 20px",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 15,
              background: "#e2ecfb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4-4" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 4 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Binary search</span>
              <span style={{ font: "800 10px var(--font-nunito)", color: "#8b8699", background: "#f3f1f9", padding: "3px 9px", borderRadius: 8 }}>
                24 Jul
              </span>
            </div>
            <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699" }}>
              Mastery test · 15 questions · 25 min · timed, no hints
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 9 }}>
              <span style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a", flexShrink: 0 }}>96% ready</span>
              <div style={{ flex: 1, maxWidth: 180, height: 6, borderRadius: 4, background: "#eee9f7", overflow: "hidden" }}>
                <div style={{ width: "96%", height: "100%", background: "#2e9c6a" }} />
              </div>
            </div>
          </div>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c3bed1" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l6 6-6 6" />
          </svg>
        </Link>

        {/* past results */}
        <div
          style={{
            font: "800 11px var(--font-nunito)",
            letterSpacing: ".06em",
            textTransform: "uppercase",
            color: "#a7a1b8",
            marginTop: 6,
          }}
        >
          Past results
        </div>
        <div style={{ background: "#fff", borderRadius: 18, padding: "8px 20px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", borderBottom: "1px solid #f5f3fa" }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#e7f4ee",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>Hashing basics — Checkpoint</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Taken 28 Jun · 9/12 correct</div>
            </div>
            <span style={{ font: "900 15px var(--font-nunito)", color: "#2e9c6a" }}>Passed · 75%</span>
          </div>
          <Link
            href="/tests/retake"
            style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 0", textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "#fbeceb",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 9l-6 6M9 9l6 6" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>Graph traversal — Mastery test</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>Taken 20 Jun · 8/15 correct · retake available</div>
            </div>
            <span style={{ font: "900 15px var(--font-nunito)", color: "#c0392b" }}>Missed · 53%</span>
          </Link>
        </div>
      </main>
    </AppShell>
  );
}
