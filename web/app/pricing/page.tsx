import Link from "next/link";
import PlanTiers from "@/components/PlanTiers";
import { getCurrentUser } from "@/lib/auth/current";

export const metadata = { title: "Pricing · VeriLearn" };

/**
 * Public, unauthenticated pricing view (BILL-03). No `requireUser()` gate — the
 * tier copy that previously only existed behind `/upgrade` is now reachable
 * pre-signup. Selecting Pro/Team carries the plan intent through signup
 * (`?plan=`) so it survives the "select → signup → resume" hold-state; the
 * intended tier is highlighted back on `/upgrade` post-signup rather than
 * silently activated.
 */
export default async function PricingPage() {
  // An already-signed-in visitor sees this page too (it's public), but their
  // real plan state lives at /upgrade — point them there instead of guest CTAs.
  const user = await getCurrentUser();
  if (user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 26, textAlign: "center" }}>
        <div>
          <div style={{ font: "900 20px var(--font-nunito)", marginBottom: 10 }}>You&apos;re already signed in</div>
          <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>See your current plan and upgrade options.</div>
          <Link href="/upgrade" style={{ textDecoration: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "12px 24px", borderRadius: 13 }}>
            Go to your plan →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: 26, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 1000, maxWidth: "100%" }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 11, textDecoration: "none" }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "linear-gradient(135deg,#6d5bd0,#8b78e8)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 14px -4px rgba(109,91,208,.6)" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4L12 15.9 7.2 18.7l.9-5.4-3.9-3.8 5.4-.8z" stroke="#fff" strokeWidth="1.6" strokeLinejoin="round" />
                <path d="M9.3 12l1.9 1.9L15 10" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span style={{ font: "900 21px var(--font-nunito)", letterSpacing: "-.02em", color: "#221f2e" }}>VeriLearn</span>
          </Link>
          <Link href="/login" style={{ textDecoration: "none", color: "#6d5bd0", font: "800 13px var(--font-nunito)" }}>
            Sign in
          </Link>
        </div>

        <main style={{ display: "flex", flexDirection: "column", gap: 22 }}>
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
          <PlanTiers currentPlan={null} />

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

          <div style={{ textAlign: "center", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>Sign in</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
