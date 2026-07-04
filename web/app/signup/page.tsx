import Link from "next/link";
import AuthShell, { ErrorNote, fieldStyle, labelStyle, submitStyle } from "@/components/AuthShell";
import { signupAction } from "@/app/auth-actions";

export const metadata = { title: "Create account · VeriLearn" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string; plan?: string }> }) {
  const { error, plan } = await searchParams;
  return (
    <AuthShell
      title="Learn things you can trust ✨"
      subtitle="Create your account to start a verified topic."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>
            Sign in
          </Link>
        </>
      }
    >
      <ErrorNote error={error} />
      {(plan === "pro" || plan === "team") && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 12, padding: "10px 13px", font: "700 12px var(--font-nunito)", color: "#6d5bd0", marginBottom: 14 }}>
          <span aria-hidden>✦</span> Continuing with {plan === "pro" ? "Pro" : "Teams"} — you&apos;ll confirm it on the next screen.
        </div>
      )}
      <form action={signupAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Carries the plan picked on /pricing through the signup POST (BILL-03) so
            the intent survives account creation without silently activating it. */}
        {(plan === "pro" || plan === "team") && <input type="hidden" name="plan" value={plan} />}
        <div>
          <label style={labelStyle} htmlFor="displayName">Name</label>
          <input id="displayName" name="displayName" required autoComplete="name" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="birthYear">Year of birth</label>
          <input id="birthYear" name="birthYear" type="number" required inputMode="numeric" placeholder="e.g. 1998" style={fieldStyle} />
          <div style={{ font: "600 11px var(--font-nunito)", color: "#a7a1b8", margin: "6px 0 0 2px" }}>
            We ask to keep VeriLearn safe for younger learners (COPPA). Under-13 needs a parent.
          </div>
        </div>
        <button type="submit" style={submitStyle}>Create account</button>
      </form>
    </AuthShell>
  );
}
