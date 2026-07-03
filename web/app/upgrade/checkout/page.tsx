import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Checkout · VeriLearn" };

export default function CheckoutPage() {
  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 22, maxWidth: 900 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link
            href="/upgrade"
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
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Checkout · Pro plan</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Complete your upgrade</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 22, alignItems: "start" }}>
          {/* payment form */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {/* billing cycle */}
            <div style={{ background: "#fff", borderRadius: 22, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
              <div style={{ font: "800 15px var(--font-nunito)", marginBottom: 14 }}>Billing cycle</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div style={{ border: "2px solid #6d5bd0", background: "#f7f5fd", borderRadius: 15, padding: 16, position: "relative" }}>
                  <div style={{ position: "absolute", top: 12, right: 12, font: "800 9px var(--font-nunito)", color: "#fff", background: "#2e9c6a", padding: "3px 8px", borderRadius: 7 }}>
                    SAVE 20%
                  </div>
                  <div style={{ font: "800 14px var(--font-nunito)" }}>Annual</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 5 }}>
                    <span style={{ font: "900 24px var(--font-nunito)", color: "#6d5bd0" }}>$12</span>
                    <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>/mo</span>
                  </div>
                  <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>$144 billed yearly</div>
                </div>
                <div style={{ border: "2px solid #ece8f4", background: "#fff", borderRadius: 15, padding: 16 }}>
                  <div style={{ font: "800 14px var(--font-nunito)", color: "#4a4560" }}>Monthly</div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 5 }}>
                    <span style={{ font: "900 24px var(--font-nunito)" }}>$15</span>
                    <span style={{ font: "700 12px var(--font-nunito)", color: "#8b8699" }}>/mo</span>
                  </div>
                  <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>Billed monthly</div>
                </div>
              </div>
            </div>

            {/* payment details */}
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

          {/* order summary */}
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
                  <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Annual · per month</div>
                </div>
                <span style={{ font: "800 14px var(--font-nunito)" }}>$12</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", color: "#6c6780", marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>$144.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", font: "700 12.5px var(--font-nunito)", color: "#2e9c6a", marginBottom: 8 }}>
                <span>Annual saving</span>
                <span>−$36.00</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", font: "900 16px var(--font-nunito)", paddingTop: 12, borderTop: "1px solid #f0edf6" }}>
                <span>Total</span>
                <span>$144.00</span>
              </div>
              <Link
                href="/upgrade/success"
                style={{ display: "block", textAlign: "center", width: "100%", boxSizing: "border-box", marginTop: 18, padding: 14, border: "none", borderRadius: 13, background: "#6d5bd0", color: "#fff", font: "800 14.5px var(--font-nunito)", textDecoration: "none", boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
              >
                🔒 Pay $144 &amp; upgrade
              </Link>
              <div style={{ font: "600 11px/1.5 var(--font-nunito)", color: "#8b8699", textAlign: "center", marginTop: 10 }}>
                Secured by Stripe · 30-day money-back
              </div>
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
