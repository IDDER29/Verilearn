"use client";

/**
 * Interactive half of the (demo, no-charge) checkout screen (BILL-04): a real
 * billing-cycle toggle that recomputes the order summary, and a "Pay" button
 * that genuinely activates the plan the same way UpgradeButton does elsewhere
 * — not just a static link to the success screen. Card fields stay plain
 * (Deferred: real Stripe tokenization needs a vendor account).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateDemoPlanAction } from "@/app/billing-actions";

type Cycle = "annual" | "monthly";

const PRICE = {
  annual: { perMonth: 12, subtotal: 144, saving: 36, total: 144, cadence: "per month" },
  monthly: { perMonth: 15, subtotal: 15, saving: 0, total: 15, cadence: "per month" },
} as const;

function cardStyle(active: boolean): React.CSSProperties {
  return {
    border: active ? "2px solid #6d5bd0" : "2px solid #ece8f4",
    background: active ? "#f7f5fd" : "#fff",
    borderRadius: 15,
    padding: 16,
    position: "relative",
    cursor: "pointer",
    textAlign: "left",
    width: "100%",
    font: "inherit",
    color: "inherit",
  };
}

export default function CheckoutPanel() {
  const [cycle, setCycle] = useState<Cycle>("annual");
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const price = PRICE[cycle];

  async function pay() {
    setBusy(true);
    const { ok } = await activateDemoPlanAction("pro");
    if (!ok) {
      setBusy(false);
      return;
    }
    router.push("/upgrade/success");
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 22, alignItems: "start" }}>
      {/* payment form */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {/* billing cycle */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>Billing cycle</div>
          <div role="radiogroup" aria-label="Billing cycle" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <button type="button" role="radio" aria-checked={cycle === "annual"} onClick={() => setCycle("annual")} style={cardStyle(cycle === "annual")}>
              <div style={{ position: "absolute", top: 12, right: 12, font: "800 9px var(--font-nunito)", color: "#fff", background: "#2e9c6a", padding: "3px 8px", borderRadius: 7 }}>
                SAVE 20%
              </div>
              <div style={{ font: "800 14px var(--font-nunito)" }}>Annual</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 5 }}>
                <span style={{ font: "900 24px var(--font-nunito)", color: "#6d5bd0" }}>$12</span>
                <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>/mo</span>
              </div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>$144 billed yearly</div>
            </button>
            <button type="button" role="radio" aria-checked={cycle === "monthly"} onClick={() => setCycle("monthly")} style={cardStyle(cycle === "monthly")}>
              <div style={{ font: "800 14px var(--font-nunito)", color: cycle === "monthly" ? undefined : "#4a4560" }}>Monthly</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 5 }}>
                <span style={{ font: "900 24px var(--font-nunito)" }}>$15</span>
                <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>/mo</span>
              </div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>Billed monthly</div>
            </button>
          </div>
        </div>

        {/* payment details — Deferred: real Stripe tokenization needs a vendor account */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 16 }}>Payment details</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 }}>Cardholder name</div>
            <input
              type="text"
              defaultValue="Adeline Watson"
              style={{ width: "100%", boxSizing: "border-box", font: "600 14px var(--font-nunito)", padding: "11px 13px", border: "1.5px solid #ece8f4", borderRadius: 12, background: "#fbfafd" }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 }}>Card number</div>
            <div style={{ position: "relative" }}>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                style={{ width: "100%", boxSizing: "border-box", font: "600 14px var(--font-nunito)", padding: "11px 13px", border: "1.5px solid #ece8f4", borderRadius: 12, background: "#fbfafd" }}
              />
              <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", display: "flex", gap: 4 }}>
                <span style={{ width: 26, height: 16, borderRadius: 3, background: "#eef2fb" }} />
                <span style={{ width: 26, height: 16, borderRadius: 3, background: "#fbefdd" }} />
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 }}>Expiry</div>
              <input
                type="text"
                placeholder="MM / YY"
                style={{ width: "100%", boxSizing: "border-box", font: "600 14px var(--font-nunito)", padding: "11px 13px", border: "1.5px solid #ece8f4", borderRadius: 12, background: "#fbfafd" }}
              />
            </div>
            <div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#6c6780", marginBottom: 6 }}>CVC</div>
              <input
                type="text"
                placeholder="123"
                style={{ width: "100%", boxSizing: "border-box", font: "600 14px var(--font-nunito)", padding: "11px 13px", border: "1.5px solid #ece8f4", borderRadius: 12, background: "#fbfafd" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* order summary — recomputes with the real selected cycle */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 16 }}>Order summary</div>
          <div style={{ display: "flex", alignItems: "center", gap: 11, paddingBottom: 14, borderBottom: "1px solid #f0edf6", marginBottom: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg,#6d5bd0,#8b78e8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" />
                <circle cx="12" cy="9.5" r="1.6" />
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 13.5px var(--font-nunito)" }}>VeriLearn Pro</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{cycle === "annual" ? "Annual" : "Monthly"} · {price.cadence}</div>
            </div>
            <span style={{ font: "800 14px var(--font-nunito)" }}>${price.perMonth}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", color: "#6c6780", marginBottom: 8 }}>
            <span>Subtotal</span>
            <span>${price.subtotal.toFixed(2)}</span>
          </div>
          {price.saving > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", color: "#2e9c6a", marginBottom: 8 }}>
              <span>Annual saving</span>
              <span>−${price.saving.toFixed(2)}</span>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", font: "900 16px var(--font-nunito)", paddingTop: 12, borderTop: "1px solid #f0edf6" }}>
            <span>Total</span>
            <span>${price.total.toFixed(2)}</span>
          </div>
          <button
            type="button"
            onClick={pay}
            disabled={busy}
            style={{ display: "block", textAlign: "center", width: "100%", boxSizing: "border-box", marginTop: 18, padding: 14, border: "none", borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14.5px var(--font-nunito)", cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1, boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
          >
            {busy ? "Processing…" : `🔒 Pay $${price.total.toFixed(2)} & upgrade`}
          </button>
          <div style={{ font: "600 11px/1.5 var(--font-nunito)", color: "#8b8699", textAlign: "center", marginTop: 10 }}>
            Secured by Stripe · 30-day money-back
          </div>
        </div>
      </div>
    </div>
  );
}
