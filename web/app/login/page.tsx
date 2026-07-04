import Link from "next/link";
import AuthShell, { ErrorNote, fieldStyle, labelStyle, submitStyle } from "@/components/AuthShell";
import { loginAction } from "@/app/auth-actions";

export const metadata = { title: "Sign in · VeriLearn" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <AuthShell
      title="Welcome back 👋"
      subtitle="Sign in to your verified learning."
      footer={
        <>
          New here?{" "}
          <Link href="/signup" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>
            Create an account
          </Link>
        </>
      }
    >
      <ErrorNote error={error} />
      <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue="adeline@example.com" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" defaultValue="verilearn" style={fieldStyle} />
        </div>
        <button type="submit" style={submitStyle}>Sign in</button>
      </form>
      <div style={{ font: "600 11.5px var(--font-nunito)", color: "#a7a1b8", textAlign: "center", marginTop: 12 }}>
        Demo account is pre-filled — just press Sign in.
      </div>
    </AuthShell>
  );
}
