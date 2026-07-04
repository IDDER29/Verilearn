import AppShell from "@/components/AppShell";
import UsersAdmin from "@/components/admin/UsersAdmin";
import AppealsAdmin from "@/components/admin/AppealsAdmin";
import { requireUser } from "@/lib/auth/current";
import { can } from "@/lib/domain/rbac";
import { listAllUsersForAdmin } from "@/lib/services/moderation";
import { listAppealsForAdmin } from "@/lib/services/appeals";

export const metadata = { title: "Users · Admin · VeriLearn" };

/**
 * Real, RBAC-gated moderation console (ADMIN-16): a signed-in user without
 * `user:ban` sees an honest "you don't have access" state, never the data —
 * the same shape as the certificate admin console (ADMIN-15/22).
 */
export default async function AdminUsersPage() {
  const user = await requireUser();
  const authorized = can(user.role, "user:ban");

  return (
    <AppShell>
      <main style={{ padding: "24px 26px 30px", maxWidth: 720 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Admin</div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>Users</div>
        </div>

        {authorized ? (
          <>
            <AppealsAdmin initial={listAppealsForAdmin(user.role)} />
            <UsersAdmin initial={listAllUsersForAdmin()} />
          </>
        ) : (
          <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", font: "600 13px var(--font-nunito)", color: "#8b8699" }}>
            You don&apos;t have access to this page. Account moderation is restricted to the Trust &amp; Safety role.
          </div>
        )}
      </main>
    </AppShell>
  );
}
