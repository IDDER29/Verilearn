import Link from "next/link";
import DemoConflictPanel from "@/components/DemoConflictPanel";
import { getCurrentUser } from "@/lib/auth/current";
import { DEMO_TOPIC, demoSnapshot } from "@/lib/demo/scenario";

export const metadata = { title: "Live demo · VeriLearn" };

/**
 * Public, no-account guest showcase (TRUST-22). A `guest` can only ever read
 * (`lib/domain/rbac.ts` grants `topic:read`/`claim:read`, never a write), so
 * this page is structurally incapable of mutating anything real — it runs the
 * real trust-ledger engine on a fixed, ephemeral scenario that resets on
 * reload, then converts to sign-up.
 */
export default async function DemoPage() {
  const user = await getCurrentUser();
  const snapshot = demoSnapshot();

  return (
    <div style={{ minHeight: "100vh", padding: 26, display: "flex", justifyContent: "center" }}>
      <div style={{ width: 720, maxWidth: "100%" }}>
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
          <Link href={user ? "/" : "/login"} style={{ textDecoration: "none", color: "#6d5bd0", font: "800 13px var(--font-nunito)" }}>
            {user ? "Back to your account →" : "Sign in"}
          </Link>
        </div>

        <main style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <div style={{ font: "800 10px var(--font-nunito)", letterSpacing: ".12em", textTransform: "uppercase", color: "#8b6fd8", marginBottom: 8 }}>
              Live demo · no account needed
            </div>
            <div style={{ font: "900 24px/1.3 var(--font-nunito)", letterSpacing: "-.02em", marginBottom: 6 }}>{DEMO_TOPIC.title}</div>
            <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
              {DEMO_TOPIC.level} · a real slice of what a verified topic looks like — this page doesn&apos;t save anything you do here.
            </div>
          </div>

          <DemoConflictPanel initial={snapshot} />

          <div style={{ textAlign: "center", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            Ready for your own topics? <Link href="/signup" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>Sign up free</Link>
          </div>
        </main>
      </div>
    </div>
  );
}
