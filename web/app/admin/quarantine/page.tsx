import AppShell from "@/components/AppShell";
import QuarantineAdmin from "@/components/admin/QuarantineAdmin";
import { requireUser } from "@/lib/auth/current";
import { can } from "@/lib/domain/rbac";
import { listAllClaimsForAdmin } from "@/lib/services/quarantine";

export const metadata = { title: "Claim quarantine · Admin · VeriLearn" };

/**
 * Real, RBAC-gated claim quarantine console (ADMIN-14): a signed-in user
 * without `integrity:quarantine` sees an honest "you don't have access"
 * state, never the data — the same shape as the certificate (ADMIN-15/22)
 * and user (ADMIN-16) admin consoles.
 */
export default async function AdminQuarantinePage() {
  const user = await requireUser();
  const authorized = can(user.role, "integrity:quarantine");

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", maxWidth: 720 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Admin</div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Claim quarantine</div>
        </div>

        {authorized ? (
          <QuarantineAdmin initial={listAllClaimsForAdmin()} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            You don&apos;t have access to this page. Claim integrity actions are restricted to the Trust &amp; Safety role.
          </div>
        )}
      </main>
    </AppShell>
  );
}
