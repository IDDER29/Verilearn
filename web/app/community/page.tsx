import Link from "next/link";
import AppShell from "@/components/AppShell";
import { Avatar, Card, SpotlightCard, StatusPill } from "@/components/ui";

export const metadata = { title: "Community · VeriLearn" };

const THREAD_HREF = "/community/dijkstra-any-graph";

type Thread = {
  href: string;
  emoji: string;
  avatarBg: string;
  title: string;
  meta: string;
  tag: { label: string; color: string; bg: string };
  replies: number;
};

const THREADS: Thread[] = [
  {
    href: THREAD_HREF,
    emoji: "🧑‍💻",
    avatarBg: "linear-gradient(135deg,#cfe4ff,#e4ecff)",
    title: 'Is the "works on any graph" claim actually wrong, or just imprecise?',
    meta: "Dijkstra's algorithm · Priya N. · 2h ago",
    tag: { label: "Disputed claim", color: "#c0392b", bg: "#fbeceb" },
    replies: 12,
  },
  {
    href: THREAD_HREF,
    emoji: "🧑‍🏫",
    avatarBg: "linear-gradient(135deg,#d7f0e2,#e9f7ef)",
    title: "Best source for the Merkle-tree second-preimage proof?",
    meta: "Merkle trees · Sofia L. · 5h ago",
    tag: { label: "Sources", color: "#3a63b0", bg: "#e3ecfb" },
    replies: 7,
  },
  {
    href: THREAD_HREF,
    emoji: "🧑‍🎨",
    avatarBg: "linear-gradient(135deg,#f6d8e8,#efe4ff)",
    title: "Study group: binary search edge cases this Saturday?",
    meta: "Binary search · Adeline W. · 1d ago",
    tag: { label: "Study group", color: "#6d5bd0", bg: "#f1eefb" },
    replies: 21,
  },
];

const CONTRIBUTORS = [
  { name: "Marcus P.", answers: "142 helpful answers", emoji: "🧑‍💻", bg: "linear-gradient(135deg,#cfe4ff,#e4ecff)", medal: "🥇", medalColor: "#6d5bd0" },
  { name: "Sofia L.", answers: "98 helpful answers", emoji: "🧑‍🏫", bg: "linear-gradient(135deg,#d7f0e2,#e9f7ef)", medal: "🥈", medalColor: "#221f2e" },
  { name: "Dev K.", answers: "76 helpful answers", emoji: "🧑", bg: "#fbeadf", medal: "🥉", medalColor: "#221f2e" },
];

export default function CommunityPage() {
  return (
    <AppShell active="community">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        {/* left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Community 👥</div>
              <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
                Where learners debate the claims the Skeptic flagged.
              </div>
            </div>
            <button
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "11px 17px",
                borderRadius: 13,
                border: "none",
                background: "#6d5bd0",
                color: "#fff",
                font: "800 13px var(--font-nunito)",
                cursor: "pointer",
                boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)",
                whiteSpace: "nowrap",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" style={{ flexShrink: 0 }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
              New thread
            </button>
          </div>

          {/* featured debate */}
          <div style={{ position: "relative", background: "#211d2e", borderRadius: 22, padding: "26px 28px", overflow: "hidden" }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "radial-gradient(120% 140% at 88% 15%,rgba(139,120,232,.42),transparent 55%)",
              }}
            />
            <div style={{ position: "relative" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  font: "800 10px var(--font-nunito)",
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#211d2e",
                  background: "#f0a99f",
                  padding: "4px 10px",
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                🔥 Hot debate
              </div>
              <Link
                href={THREAD_HREF}
                style={{ textDecoration: "none", color: "#fff", font: "900 21px/1.3 var(--font-nunito)", maxWidth: "70%", display: "block" }}
              >
                &quot;Does Dijkstra really need a priority queue, or is a plain array fine for dense graphs?&quot;
              </Link>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  marginTop: 16,
                  position: "relative",
                  font: "700 12px var(--font-nunito)",
                  color: "#c9c3d8",
                }}
              >
                <span>💬 34 replies</span>
                <span>👍 128</span>
                <span>Started by Marcus P.</span>
              </div>
            </div>
          </div>

          {/* thread list */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {THREADS.map((t, i) => (
              <Link key={i} href={t.href} style={{ textDecoration: "none", color: "inherit" }}>
                <Card radius={18} padding="16px 18px" boxShadow="0 8px 22px -16px rgba(80,60,140,.3)" style={{ display: "flex", gap: 14 }}>
                  <Avatar emoji={t.emoji} size={44} background={t.avatarBg} fontSize={20} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 14.5px var(--font-nunito)" }}>{t.title}</div>
                    <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>{t.meta}</div>
                    <div style={{ display: "flex", gap: 8, marginTop: 9, alignItems: "center" }}>
                      <StatusPill label={t.tag.label} color={t.tag.color} bg={t.tag.bg} />
                      <span style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>💬 {t.replies}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* right rail */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <Card padding={20}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14 }}>Top contributors</div>
            {CONTRIBUTORS.map((c, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 11,
                  padding: "8px 0",
                  ...(i > 0 ? { borderTop: "1px solid #f5f3fa" } : {}),
                }}
              >
                <Avatar emoji={c.emoji} size={36} background={c.bg} fontSize={17} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ font: "800 13px var(--font-nunito)" }}>{c.name}</div>
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{c.answers}</div>
                </div>
                <span style={{ font: "900 13px var(--font-nunito)", color: c.medalColor }}>{c.medal}</span>
              </div>
            ))}
          </Card>

          <SpotlightCard padding={20}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🛡️ Verified answers only</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#c9c3d8" }}>
              Community answers can be promoted to a topic&apos;s sources — once the Skeptic checks them.
            </div>
          </SpotlightCard>
        </div>
      </main>
    </AppShell>
  );
}
