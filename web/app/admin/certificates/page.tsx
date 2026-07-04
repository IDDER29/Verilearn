import AppShell from "@/components/AppShell";
import CertificatesAdmin from "@/components/admin/CertificatesAdmin";
import { requireUser } from "@/lib/auth/current";
import { can } from "@/lib/domain/rbac";
import { listAllCertificates } from "@/lib/services/certificates";

export const metadata = { title: "Certificates · Admin · VeriLearn" };

/**
 * Real, RBAC-gated admin console (ADMIN-15/22): the first genuine use of the
 * `can()` permission gate anywhere in this app (every prior feature relied on
 * ownership scoping, since every seeded account has been a learner). A signed-
 * in user without `cert:revoke` sees an honest "you don't have access" state,
 * never the data.
 */
export default async function AdminCertificatesPage() {
  const user = await requireUser();
  const authorized = can(user.role, "cert:revoke");

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", maxWidth: 720 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Admin</div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Certificates</div>
        </div>

        {authorized ? (
          <CertificatesAdmin initial={listAllCertificates()} />
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            You don&apos;t have access to this page. Certificate revocation is restricted to the Trust &amp; Safety role.
          </div>
        )}
      </main>
    </AppShell>
  );
}
