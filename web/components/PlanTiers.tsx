import Link from "next/link";
import UpgradeButton from "@/components/UpgradeButton";

/**
 * The three pricing tiers — shared between the authenticated `/upgrade` page
 * and the public `/pricing` page (BILL-03), so plan copy is a single source of
 * truth. `currentPlan` is `null` for a guest (not signed in): CTAs route into
 * signup instead of the real plan-change action, and `?plan=` is carried
 * through signup so the chosen tier survives the "select → signup → resume"
 * hold-state (`intentPlan` highlights it once the learner is back on
 * `/upgrade` post-signup).
 */
export default function PlanTiers({
  currentPlan,
  intentPlan,
}: {
  currentPlan: "free" | "pro" | "team" | null;
  intentPlan?: "pro" | "team";
}) {
  const guest = currentPlan === null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, alignItems: "start" }}>
      {/* free */}
      <div style={{ background: "#fff", borderRadius: 22, padding: 26, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
        <div style={{ font: "800 14px var(--font-nunito)", color: "#8b8699" }}>Free</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
          <span style={{ font: "900 34px var(--font-nunito)" }}>$0</span>
          <span style={{ font: "700 13px var(--font-nunito)", color: "#8b8699" }}>/ mo</span>
        </div>
        <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>
          {currentPlan === "free" ? "Your current plan" : "Basics, free forever"}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>3 active topics
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Standard verification
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Spaced review
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)", color: "#b6b1c4" }}>
            <span style={{ flexShrink: 0 }}>—</span>Skeptic hard mode
          </div>
        </div>
        {guest ? (
          <Link
            href="/signup"
            style={{ display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fbfafd", color: "#4a4560", font: "800 13.5px var(--font-nunito)" }}
          >
            Get started free
          </Link>
        ) : currentPlan === "free" ? (
          <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fbfafd", color: "#8b8699", font: "800 13.5px var(--font-nunito)", cursor: "default" }}>
            Current plan
          </button>
        ) : (
          <UpgradeButton
            plan="free"
            label="Downgrade to Free"
            busyLabel="Downgrading…"
            style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fff", color: "#8b8699", font: "800 13.5px var(--font-nunito)" }}
          />
        )}
      </div>

      {/* pro (featured) */}
      <div style={{ background: "#fff", borderRadius: 22, padding: 26, boxShadow: intentPlan === "pro" ? "0 24px 50px -16px rgba(109,91,208,.6)" : "0 20px 44px -18px rgba(109,91,208,.5)", border: "2.5px solid #6d5bd0", position: "relative" }}>
        <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", font: "800 10px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#fff", background: "#6d5bd0", padding: "5px 14px", borderRadius: 9, whiteSpace: "nowrap" }}>
          {intentPlan === "pro" ? "Continue where you left off" : "Most popular"}
        </div>
        <div style={{ font: "800 14px var(--font-nunito)", color: "#6d5bd0" }}>Pro</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
          <span style={{ font: "900 34px var(--font-nunito)" }}>$12</span>
          <span style={{ font: "700 13px var(--font-nunito)", color: "#8b8699" }}>/ mo</span>
        </div>
        <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>Billed annually · save 20%</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>
            <b>Unlimited</b>&nbsp;topics
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Thorough verification
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Skeptic on hard mode
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Bring your own sources
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Priority support
          </div>
        </div>
        {guest ? (
          <Link
            href="/signup?plan=pro"
            style={{ display: "block", textAlign: "center", width: "100%", boxSizing: "border-box", textDecoration: "none", marginTop: 22, padding: 13, border: "none", borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
          >
            Sign up for Pro
          </Link>
        ) : currentPlan === "pro" ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", boxSizing: "border-box", marginTop: 22, padding: 13, borderRadius: 13, background: "#f3eefc", color: "#6d5bd0", font: "800 14px var(--font-nunito)" }}>
            <span style={{ flexShrink: 0 }}>✓</span>Current plan
          </div>
        ) : (
          <UpgradeButton
            plan="pro"
            label={intentPlan === "pro" ? "Continue to Pro →" : "Upgrade to Pro"}
            style={{ display: "block", textAlign: "center", width: "100%", boxSizing: "border-box", marginTop: 22, padding: 13, border: "none", borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
          />
        )}
      </div>

      {/* teams */}
      <div style={{ background: "#fff", borderRadius: 22, padding: 26, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
        <div style={{ font: "800 14px var(--font-nunito)", color: "#3a63b0" }}>Teams</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
          <span style={{ font: "900 34px var(--font-nunito)" }}>$9</span>
          <span style={{ font: "700 13px var(--font-nunito)", color: "#8b8699" }}>/ seat</span>
        </div>
        <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>Min. 5 seats</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Everything in Pro
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Shared topic library
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>Admin &amp; analytics
          </div>
          <div style={{ display: "flex", gap: 9, font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ color: "#2e9c6a", flexShrink: 0 }}>✓</span>SSO
          </div>
        </div>
        {!guest && currentPlan === "team" ? (
          <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fbfafd", color: "#8b8699", font: "800 13.5px var(--font-nunito)", cursor: "default" }}>
            Current plan
          </button>
        ) : (
          <a
            href="mailto:sales@verilearn.example"
            style={{ display: "block", boxSizing: "border-box", textAlign: "center", textDecoration: "none", width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #6d5bd0", borderRadius: 13, background: "#fff", color: "#6d5bd0", font: "800 13.5px var(--font-nunito)" }}
          >
            Contact sales
          </a>
        )}
      </div>
    </div>
  );
}
