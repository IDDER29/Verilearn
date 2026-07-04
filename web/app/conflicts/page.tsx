import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listRankedConflicts } from "@/lib/services/conflicts";

export const metadata = { title: "Conflicts · VeriLearn" };

/** Importance band from a topic's verified% — most-broken topics read hottest. */
function band(pct: number): { label: string; color: string; bg: string } {
  if (pct < 50) return { label: "High impact", color: "#c0392b", bg: "#fbeceb" };
  if (pct < 80) return { label: "Medium impact", color: "#b4830f", bg: "#fbefdd" };
  return { label: "Low impact", color: "#2e9c6a", bg: "#e4f4ec" };
}

export default async function ConflictsInboxPage() {
  const user = await requireUser();
  const conflicts = listRankedConflicts(user.id);

  // Group ranked conflicts by topic (order preserved — most-broken topic first).
  const groups: { topicId: string; topicTitle: string; pct: number; items: typeof conflicts }[] = [];
  for (const c of conflicts) {
    let g = groups.find((x) => x.topicId === c.topicId);
    if (!g) {
      g = { topicId: c.topicId, topicTitle: c.topicTitle, pct: c.topicVerifiedPercent, items: [] };
      groups.push(g);
    }
    g.items.push(c);
  }

  return (
    <AppShell active="conflicts">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Conflict inbox ⚖️</div>
            <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>
              Every open dispute across your topics, most-impactful first. Open one to adjudicate it.
            </div>
          </div>

          {conflicts.length === 0 ? (
            <div style={{ background: "#fff", borderRadius: 22, padding: "40px 32px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ fontSize: 38, marginBottom: 10 }}>⚖️</div>
              <div style={{ font: "900 19px var(--font-nunito)", marginBottom: 6 }}>No open conflicts</div>
              <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 420, margin: "0 auto" }}>
                The Skeptic has nothing disputed across any of your topics right now. New disputes land here as it raises them.
              </div>
            </div>
          ) : (
            groups.map((g) => {
              const b = band(g.pct);
              return (
                <div key={g.topicId}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#6c6780" }}>{g.topicTitle}</div>
                    <span style={{ font: "800 10px var(--font-nunito)", color: b.color, background: b.bg, padding: "4px 9px", borderRadius: 8 }}>{b.label} · {g.pct}% verified</span>
                  </div>
                  {g.items.map((c) => (
                    <Link
                      key={c.claimId}
                      href={`/topics/conflicts?topic=${c.topicId}&claim=${c.claimId}`}
                      style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", marginBottom: 10, textDecoration: "none", color: "inherit", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}
                    >
                      <div style={{ width: 44, height: 44, borderRadius: 13, background: "#fbeceb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>🧐</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ font: "800 14px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>&quot;{c.claimText}&quot;</div>
                        <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Raised by the Skeptic · disputed</div>
                      </div>
                      <span style={{ font: "800 11px var(--font-nunito)", color: "#6d5bd0", background: "#f2effc", padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap" }}>Adjudicate →</span>
                    </Link>
                  ))}
                </div>
              );
            })
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 12 }}>Triage</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
              <div style={{ font: "900 30px var(--font-nunito)", color: conflicts.length ? "#c0392b" : "#2e9c6a" }}>{conflicts.length}</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>open across {groups.length} topic{groups.length === 1 ? "" : "s"}</div>
            </div>
            <div style={{ font: "600 12px/1.6 var(--font-nunito)", color: "#8b8699" }}>
              Disputed claims are held out of tests and certificates until you resolve them. Start with the highest-impact topic.
            </div>
          </div>
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 20, padding: 20, color: "#fff" }}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🧐 You stay the judge</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#c9c3d8" }}>
              The Skeptic only raises disputes — it never marks anything verified. You decide, and the system records the outcome.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
