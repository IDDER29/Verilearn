import Link from "next/link";
import AuthShell, { ErrorNote, fieldStyle, labelStyle, submitStyle } from "@/components/AuthShell";
import { signupAction } from "@/app/auth-actions";

export const metadata = { title: "Create account · VeriLearn" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
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
      <form action={signupAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
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
