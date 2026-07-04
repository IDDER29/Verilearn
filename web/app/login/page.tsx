import Link from "next/link";
import AuthShell, { ErrorNote, fieldStyle, labelStyle, submitStyle } from "@/components/AuthShell";
import { loginAction } from "@/app/auth-actions";

export const metadata = { title: "Sign in · VeriLearn" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string; code?: string }> }) {
  const { error, code } = await searchParams;
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
      {code === "account_banned" && (
        <div style={{ textAlign: "center", marginBottom: 14 }}>
          <Link href="/appeal" style={{ color: "#c0392b", fontWeight: 800, font: "800 12.5px var(--font-nunito)", textDecoration: "none" }}>
            Appeal this ban →
          </Link>
        </div>
      )}
      <form action={loginAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" defaultValue="adeline@example.com" style={fieldStyle} />
        </div>
        <div>
          <label style={labelStyle} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" defaultValue="verilearn" style={fieldStyle} />
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 8, font: "700 12.5px var(--font-nunito)", color: "#6c6780", cursor: "pointer" }}>
          <input id="rememberMe" name="rememberMe" type="checkbox" defaultChecked style={{ width: 15, height: 15 }} />
          Remember me on this device
        </label>
        <button type="submit" style={submitStyle}>Sign in</button>
      </form>
      <div style={{ font: "600 11.5px var(--font-nunito)", color: "#a7a1b8", textAlign: "center", marginTop: 12 }}>
        Demo account is pre-filled — just press Sign in.
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        <Link href="/demo" style={{ color: "#6d5bd0", fontWeight: 800, font: "800 12px var(--font-nunito)", textDecoration: "none" }}>
          Or try the live demo — no account needed →
        </Link>
      </div>
    </AuthShell>
  );
}
