import Link from "next/link";
import AuthShell from "@/components/AuthShell";
import AppealForm from "@/components/AppealForm";

export const metadata = { title: "Appeal a ban · VeriLearn" };

/**
 * Real, unauthenticated ban-appeal entry point (AUTH-18) — a banned account
 * fails `authenticate()`/`signIn()` before ever reaching a signed-in action,
 * so this is the only path back in. Submits by email + message; the honest
 * outcome (submitted / already-pending / not-actually-banned / unknown
 * account) is whatever `submitAppealForBannedUser` actually determined.
 */
export default function AppealPage() {
  return (
    <AuthShell
      title="Appeal a ban"
      subtitle="A Trust & Safety reviewer will look into it."
      footer={
        <>
          Not banned?{" "}
          <Link href="/login" style={{ color: "#6d5bd0", fontWeight: 800, textDecoration: "none" }}>
            Back to sign in
          </Link>
        </>
      }
    >
      <AppealForm />
    </AuthShell>
  );
}
