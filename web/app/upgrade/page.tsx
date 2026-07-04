import Link from "next/link";
import AppShell from "@/components/AppShell";
import PlanTiers from "@/components/PlanTiers";
import { requireUser } from "@/lib/auth/current";

export const metadata = { title: "Upgrade · VeriLearn" };

export default async function UpgradePage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const user = await requireUser();
  const plan = user.plan;
  // Plan intent carried through signup (BILL-03): a guest who picked Pro/Team on
  // /pricing lands back here post-signup with that tier highlighted, not silently
  // activated — the learner still clicks to confirm.
  const { plan: intentRaw } = await searchParams;
  const intentPlan = (intentRaw === "pro" || intentRaw === "team") && plan !== intentRaw ? intentRaw : undefined;
  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/"
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
          <div>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Plan &amp; billing</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Go Verified Pro 🚀</div>
          </div>
        </div>

        {/* hero */}
        <div style={{ position: "relative", background: "#211d2e", borderRadius: 24, padding: "30px 34px", overflow: "hidden", textAlign: "center" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(90% 130% at 50% 0%,rgba(139,120,232,.4),transparent 55%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ font: "800 10px var(--font-nunito)", letterSpacing: ".14em", textTransform: "uppercase", color: "#b3a7f0", marginBottom: 10 }}>
              Learn deeper, trust more
            </div>
            <div style={{ font: "900 27px/1.2 var(--font-nunito)", color: "#fff", maxWidth: 560, margin: "0 auto" }}>
              Unlimited topics, the Skeptic on hard mode, and thorough verification on everything you learn.
            </div>
          </div>
        </div>

        {/* plans */}
        <PlanTiers currentPlan={plan} intentPlan={intentPlan} />

        {/* compare strip */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 20, padding: "18px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0, font: "600 13px/1.55 var(--font-nunito)", color: "#6c6780" }}>
            <b style={{ color: "#221f2e" }}>30-day money-back guarantee.</b> Cancel anytime — your verified lectures stay yours, on any plan.
          </div>
        </div>
      </main>
    </AppShell>
  );
}
