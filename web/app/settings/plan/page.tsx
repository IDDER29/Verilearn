import Link from "next/link";
import AppShell from "@/components/AppShell";
import SettingsNav from "@/components/SettingsNav";
import { requireUser } from "@/lib/auth/current";
import { activeTopicCount, listTopicSummaries } from "@/lib/services/topics";
import { entitlementsFor } from "@/lib/domain/entitlements";

export const metadata = { title: "Plan & billing · Settings · VeriLearn" };

const PLAN_LABEL: Record<string, string> = { free: "Free", pro: "Pro", team: "Teams" };

export default async function SettingsPlanPage() {
  const user = await requireUser();
  const summaries = listTopicSummaries(user.id);
  // Archived topics (BILL-12) don't count against the cap they were archived
  // to respect — this must match the exact same active-only count createTopic
  // enforces, or the usage meter and the actual cap could disagree (BILL-02/08).
  const topicCount = activeTopicCount(user.id);
  const cap = entitlementsFor(user.plan).maxActiveTopics;
  const planLabel = PLAN_LABEL[user.plan] ?? "Free";
  const atLimit = topicCount >= cap;
  // Real, traceable usage: every claim the pipeline has checked across the account.
  const claimsVerified = summaries.reduce((n, t) => n + t.claimCount, 0);
  return (
    <AppShell active="settings">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "210px minmax(0,1fr)",
          gap: 24,
          alignItems: "start",
        }}
      >
        <SettingsNav active="plan" />

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
            <div style={{ width: 46, height: 46, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="13" rx="2.5" />
                <path d="M2 10h20" />
              </svg>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>Plan &amp; billing</div>
              <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>Your subscription and payment details</div>
            </div>
          </div>

          {/* current plan */}
          <div style={{ position: "relative", background: "#211d2e", borderRadius: 20, padding: "24px 26px", overflow: "hidden", color: "#fff" }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 140% at 90% 15%,rgba(139,120,232,.4),transparent 55%)" }} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 10px var(--font-nunito)", letterSpacing: ".1em", textTransform: "uppercase", color: "#b3a7f0", marginBottom: 6 }}>Current plan</div>
                <div style={{ font: "900 22px var(--font-nunito)" }}>{planLabel}</div>
                <div style={{ font: "600 12.5px var(--font-nunito)", color: "#c9c3d8", marginTop: 4 }}>
                  {topicCount} active topic{topicCount === 1 ? "" : "s"} · {user.plan === "pro" ? "hard-mode verification" : "standard verification"}
                </div>
              </div>
              <Link href="/upgrade" style={{ textDecoration: "none", background: "#fff", color: "#221f2e", font: "800 13.5px var(--font-nunito)", padding: "12px 22px", borderRadius: 13, whiteSpace: "nowrap" }}>
                Upgrade to Pro
              </Link>
            </div>
          </div>

          {/* usage */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>This month&apos;s usage</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", marginBottom: 7 }}>
              <span>Active topics</span>
              <span style={{ color: "#8b8699" }}>{topicCount} of {cap === Infinity ? "∞" : cap}</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", overflow: "hidden", marginBottom: 16 }}>
              <div style={{ width: `${cap === Infinity ? 6 : Math.min(100, Math.round((topicCount / cap) * 100))}%`, height: "100%", background: atLimit ? "#c0392b" : "#6d5bd0" }} />
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", marginBottom: 7 }}>
              <span>Claims verified</span>
              <span style={{ color: "#8b8699" }}>{claimsVerified} across {summaries.length} topic{summaries.length === 1 ? "" : "s"}</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
              <div style={{ width: claimsVerified > 0 ? "100%" : "0%", height: "100%", background: "#6d5bd0" }} />
            </div>
            {atLimit && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, padding: "12px 14px", borderRadius: 12, background: "#fbeceb", font: "700 12px/1.5 var(--font-nunito)", color: "#c0392b" }}>
                <span>⚠️</span>
                You&apos;ve hit your topic limit — upgrade for unlimited topics.
              </div>
            )}
          </div>

          {/* payment method */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <span style={{ font: "800 15px var(--font-nunito)" }}>Payment method</span>
              <span style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>No card on file</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, padding: "14px 16px", border: "1.5px dashed #ddd8ce", borderRadius: 14, color: "#8b8699" }}>
              <div style={{ width: 40, height: 28, borderRadius: 6, background: "#f3f1f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a7a1b8" strokeWidth="1.9">
                  <rect x="2" y="6" width="20" height="13" rx="2.5" />
                  <path d="M2 10h20" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0, font: "700 13px var(--font-nunito)" }}>Add a card when you upgrade</div>
            </div>
          </div>

          {/* billing history */}
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>Billing history</div>
            <div style={{ textAlign: "center", padding: "24px 0", font: "700 13px var(--font-nunito)", color: "#a7a1b8" }}>
              No invoices yet — you&apos;re on the Free plan.
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
