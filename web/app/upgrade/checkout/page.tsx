import AppShell from "@/components/AppShell";
import CheckoutPanel from "@/components/CheckoutPanel";
import Link from "next/link";

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

        <CheckoutPanel />
      </main>
    </AppShell>
  );
}
