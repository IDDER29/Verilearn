import AppShell from "@/components/AppShell";
import AuditLogAdmin from "@/components/admin/AuditLogAdmin";
import { requireUser } from "@/lib/auth/current";
import { can } from "@/lib/domain/rbac";
import { listAuditLogForAdmin } from "@/lib/services/audit";

export const metadata = { title: "Audit log · Admin · VeriLearn" };

/**
 * Real, RBAC-gated central audit console (ADMIN-20): a signed-in user
 * without `audit:read` sees an honest "you don't have access" state, never
 * the data — the same shape as the certificate (ADMIN-15/22), user
 * (ADMIN-16), and quarantine (ADMIN-14) admin consoles.
 */
export default async function AdminAuditPage() {
  const user = await requireUser();
  const authorized = can(user.role, "audit:read");

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", maxWidth: 760 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Admin</div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Audit log</div>
        </div>

        {authorized ? (
          <AuditLogAdmin initial={listAuditLogForAdmin(user.role)} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            You don&apos;t have access to this page. The audit log is restricted to Trust &amp; Safety, Compliance, and Platform Admin roles.
          </div>
        )}
      </main>
    </AppShell>
  );
}
