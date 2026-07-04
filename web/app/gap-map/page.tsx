import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { gapBoard, type GapView } from "@/lib/services/gaps";

export const metadata = { title: "Gap Map · VeriLearn" };

const SEVERITY: Record<GapView["severity"], { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "#c0392b", bg: "#fbeceb" },
  med: { label: "Medium", color: "#b4830f", bg: "#fbefdd" },
  low: { label: "Low", color: "#2e9c6a", bg: "#e4f4ec" },
};

const ORIGIN_LABEL: Record<GapView["origin"], string> = {
  review: "caught in review",
  task: "caught in a task",
  test: "caught in a test",
  conflict: "from a conflict",
};

const STATUS_BADGE: Record<GapView["status"], { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#c0392b", bg: "#fbeceb" },
  reopened: { label: "↻ Reopened", color: "#c0392b", bg: "#fbeceb" },
  watching: { label: "Watching", color: "#b4830f", bg: "#fbefdd" },
  closed: { label: "✓ Closed", color: "#2e9c6a", bg: "#e4f4ec" },
};

const CLAIM_TRUST: Record<string, { label: string; color: string }> = {
  verified_execution: { label: "claim: verified by execution", color: "#0e8c6b" },
  verified_source: { label: "claim: source-backed", color: "#2d6cdf" },
  sourced: { label: "claim: sourced", color: "#2d6cdf" },
  disputed: { label: "claim: disputed", color: "#c0392b" },
  unsupported: { label: "claim: unsupported", color: "#c0392b" },
  interpretive: { label: "claim: interpretive", color: "#6d5bd0" },
};

function GapCard({ g }: { g: GapView }) {
  const sev = SEVERITY[g.severity];
  const st = STATUS_BADGE[g.status];
  return (
    <Link
      href={`/topics/conflicts?topic=${g.topicId}`}
      style={{ display: "block", textDecoration: "none", color: "inherit", background: "#fff", borderRadius: 16, padding: "15px 16px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <span style={{ font: "800 10px var(--font-nunito)", color: st.color, background: st.bg, padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>{st.label}</span>
        <span style={{ font: "800 10px var(--font-nunito)", color: sev.color, background: sev.bg, padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>{sev.label}</span>
      </div>
      <div style={{ font: "700 13.5px/1.5 var(--font-nunito)", color: "#221f2e", marginBottom: 8 }}>{g.claimText}</div>
      <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{g.topicTitle} · {ORIGIN_LABEL[g.origin]}</div>
      {g.claimState && CLAIM_TRUST[g.claimState] && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, font: "700 10.5px var(--font-nunito)", color: CLAIM_TRUST[g.claimState].color }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: CLAIM_TRUST[g.claimState].color }} />
          {CLAIM_TRUST[g.claimState].label}
        </div>
      )}
    </Link>
  );
}

function Column({ title, tone, gaps, empty }: { title: string; tone: string; gaps: GapView[]; empty: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: tone }} />
        <span style={{ font: "900 14px var(--font-nunito)" }}>{title}</span>
        <span style={{ font: "800 12px var(--font-nunito)", color: "#8b8699" }}>{gaps.length}</span>
      </div>
      {gaps.length === 0 ? (
        <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#a7a1b8", background: "#faf9fc", borderRadius: 14, padding: "16px 14px" }}>{empty}</div>
      ) : (
        gaps.map((g) => <GapCard key={g.id} g={g} />)
      )}
    </div>
  );
}

export default async function GapMapPage() {
  const user = await requireUser();
  const board = gapBoard(user.id);

  return (
    <AppShell active="gaps">
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
        <div>
          <div style={{ font: "900 25px var(--font-nunito)", letterSpacing: "-.02em" }}>Gap Map 🎯</div>
          <div style={{ font: "600 13.5px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
            The durable memory of what you got wrong. A closed gap auto-reopens the moment you lapse on it again — closure tracks evidence, never a vanity checkbox.
          </div>
        </div>

        {board.counts.total === 0 ? (
          <div style={{ background: "#fff", borderRadius: 22, padding: "44px 32px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🎯</div>
            <div style={{ font: "900 20px var(--font-nunito)", marginBottom: 6 }}>No gaps tracked</div>
            <div style={{ font: "600 13.5px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 460, margin: "0 auto" }}>
              As you review, take tasks, sit tests, and resolve conflicts, any misconception you hit is tracked here — with its origin, severity, and lifecycle. Nothing is here yet because you haven&apos;t slipped on anything.
            </div>
            <Link href="/review" style={{ textDecoration: "none", display: "inline-block", marginTop: 18, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "12px 24px", borderRadius: 13 }}>
              Start a review session
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, alignItems: "start" }}>
            <Column title="Open" tone="#c0392b" gaps={board.active} empty="No open gaps — nothing needs your attention right now." />
            <Column title="Watching" tone="#c99a2b" gaps={board.watching} empty="No gaps being watched. Recall one correctly and it moves here on its way to closed." />
            <Column title="Closed" tone="#2e9c6a" gaps={board.closed} empty="No gaps closed yet. Closing one takes sustained correct recall — not a manual tick." />
          </div>
        )}
      </main>
    </AppShell>
  );
}
