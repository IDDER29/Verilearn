import Link from "next/link";
import AppShell from "@/components/AppShell";

export const metadata = { title: "Upgrade Success · VeriLearn" };

export default function UpgradeSuccessPage() {
  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 22 }}>
        <style>{"@keyframes vlpop{0%{opacity:0;transform:scale(.5)}70%{opacity:1;transform:scale(1.08)}100%{transform:scale(1)}}"}</style>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 16, minHeight: 560 }}>
          <div style={{ width: 88, height: 88, borderRadius: "50%", background: "linear-gradient(135deg,#6d5bd0,#8b78e8)", display: "flex", alignItems: "center", justifyContent: "center", animation: "vlpop .5s cubic-bezier(.34,1.56,.64,1)", boxShadow: "0 20px 40px -14px rgba(109,91,208,.6)" }}>
            <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <div style={{ font: "900 30px var(--font-nunito)", letterSpacing: "-.02em" }}>Welcome to Pro! 🎉</div>
          <div style={{ font: "600 14.5px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 400 }}>
            Your upgrade is live. Unlimited topics, thorough verification and the Skeptic on hard mode are unlocked.
          </div>

          <div style={{ display: "flex", gap: 14, marginTop: 8 }}>
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3v18M3 12h18" />
                </svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ font: "900 15px var(--font-nunito)" }}>∞</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Topics</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#eef7f1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3c4 2 6.5 2 8 1.5V12c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V4.5C5.5 5 8 5 12 3z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ font: "900 15px var(--font-nunito)" }}>Thorough</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Verification</div>
              </div>
            </div>
            <div style={{ background: "#fff", borderRadius: 16, padding: "16px 20px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 11 }}>
              <div style={{ width: 38, height: 38, borderRadius: 12, background: "#221d2e", display: "flex", alignItems: "center", justifyContent: "center" }}>🧐</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ font: "900 15px var(--font-nunito)" }}>Hard mode</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>Skeptic</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <Link
              href="/new-topic"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 8, background: "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", padding: "14px 24px", borderRadius: 14, boxShadow: "0 12px 26px -10px rgba(109,91,208,.7)" }}
            >
              Start a Pro topic
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </Link>
            <Link
              href="/"
              style={{ textDecoration: "none", border: "1.5px solid #ece8f4", background: "#fff", color: "#4a4560", font: "800 14px var(--font-nunito)", padding: "14px 24px", borderRadius: 14 }}
            >
              Back to dashboard
            </Link>
          </div>
          <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginTop: 4 }}>
            A receipt was emailed to adeline@example.com
          </div>
        </div>
      </main>
    </AppShell>
  );
}
