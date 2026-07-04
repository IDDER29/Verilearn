import Link from "next/link";
import AppShell from "@/components/AppShell";
import GapBoard from "@/components/GapBoard";
import { requireUser } from "@/lib/auth/current";
import { gapBoard } from "@/lib/services/gaps";

export const metadata = { title: "Gap Map · VeriLearn" };

export default async function GapMapPage({ searchParams }: { searchParams: Promise<{ gap?: string }> }) {
  const user = await requireUser();
  const board = gapBoard(user.id);
  const { gap: highlightId } = await searchParams;

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
          <GapBoard board={board} highlightId={highlightId} />
        )}
      </main>
    </AppShell>
  );
}
