import Link from "next/link";
import AppShell from "@/components/AppShell";
import ChooseTopicsPanel from "@/components/ChooseTopicsPanel";
import { requireUser } from "@/lib/auth/current";
import { FREE_TOPIC_CAP, listTopicSummaries } from "@/lib/services/topics";

export const metadata = { title: "Choose your topics · VeriLearn" };

/**
 * The "choose which topics stay active" downgrade prompt (BILL-12). Reached
 * only when a downgrade-to-Free attempt finds more active topics than the
 * Free cap allows — the account is NOT yet downgraded when this renders.
 */
export default async function ChooseTopicsPage() {
  const user = await requireUser();
  const topics = listTopicSummaries(user.id);
  const activeCount = topics.filter((t) => !t.archived).length;

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20, maxWidth: 640 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/settings/plan"
            style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)", flexShrink: 0 }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </Link>
          <div>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Downgrade to Free</div>
            <div style={{ font: "900 22px var(--font-nunito)", letterSpacing: "-.02em" }}>Choose your {FREE_TOPIC_CAP} active topics</div>
          </div>
        </div>

        {activeCount <= FREE_TOPIC_CAP ? (
          <div style={{ background: "#fff", borderRadius: 20, padding: "24px 22px", font: "600 13.5px/1.6 var(--font-nunito)", color: "#8b8699" }}>
            You already have {activeCount} active topic{activeCount === 1 ? "" : "s"} — at or under the Free plan&apos;s limit of {FREE_TOPIC_CAP}, so no choice is needed.{" "}
            <Link href="/settings/plan" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>Go to Plan &amp; billing →</Link>
          </div>
        ) : (
          <>
            <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699" }}>
              The Free plan supports {FREE_TOPIC_CAP} active topics; you have {activeCount}. Pick the ones to keep active — the rest are archived, never deleted.
            </div>
            <ChooseTopicsPanel topics={topics} cap={FREE_TOPIC_CAP} />
          </>
        )}
      </main>
    </AppShell>
  );
}
