import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";

export const metadata = { title: "Upgrade · VeriLearn" };

export default async function UpgradePage() {
  const user = await requireUser();
  const plan = user.plan;
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18, alignItems: "start" }}>
          {/* free */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 26, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "800 14px var(--font-nunito)", color: "#8b8699" }}>Free</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, margin: "8px 0 4px" }}>
              <span style={{ font: "900 34px var(--font-nunito)" }}>$0</span>
              <span style={{ font: "700 13px var(--font-nunito)", color: "#8b8699" }}>/ mo</span>
            </div>
            <div style={{ font: "600 12.5px var(--font-nunito)", color: "#8b8699", marginBottom: 18 }}>{plan === "free" ? "Your current plan" : "Basics, free forever"}</div>
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
            {plan === "free" ? (
              <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fbfafd", color: "#8b8699", font: "800 13.5px var(--font-nunito)", cursor: "default" }}>
                Current plan
              </button>
            ) : (
              <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fff", color: "#8b8699", font: "800 13.5px var(--font-nunito)", cursor: "pointer" }}>
                Downgrade to Free
              </button>
            )}
          </div>

          {/* pro (featured) */}
          <div style={{ background: "#fff", borderRadius: 22, padding: 26, boxShadow: "0 20px 44px -18px rgba(109,91,208,.5)", border: "2.5px solid #6d5bd0", position: "relative" }}>
            <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", font: "800 10px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#fff", background: "#6d5bd0", padding: "5px 14px", borderRadius: 9, whiteSpace: "nowrap" }}>
              Most popular
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
            {plan === "pro" ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, width: "100%", boxSizing: "border-box", marginTop: 22, padding: 13, borderRadius: 13, background: "#f3eefc", color: "#6d5bd0", font: "800 14px var(--font-nunito)" }}>
                <span style={{ flexShrink: 0 }}>✓</span>Current plan
              </div>
            ) : (
              <Link
                href="/upgrade/checkout"
                style={{ display: "block", textAlign: "center", width: "100%", boxSizing: "border-box", marginTop: 22, padding: 13, border: "none", borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", textDecoration: "none", boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
              >
                Upgrade to Pro
              </Link>
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
            {plan === "team" ? (
              <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #ece8f4", borderRadius: 13, background: "#fbfafd", color: "#8b8699", font: "800 13.5px var(--font-nunito)", cursor: "default" }}>
                Current plan
              </button>
            ) : (
              <button style={{ width: "100%", marginTop: 22, padding: 13, border: "1.5px solid #6d5bd0", borderRadius: 13, background: "#fff", color: "#6d5bd0", font: "800 13.5px var(--font-nunito)", cursor: "pointer" }}>
                Contact sales
              </button>
            )}
          </div>
        </div>

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
