# `web/components/admin` — Trust & Safety / admin consoles

The client components behind the `/admin/*` routes. Every one is **RBAC-gated** at the page/service level — a role without the right permission gets an honest no-access state, never the data. These are the first real uses of the `can(role, permission)` gate in the app (every other feature relies on ownership scoping).

| File | Console | Key rule |
|---|---|---|
| `CertificatesAdmin.tsx` | `/admin/certificates` | Revoke / reinstate a certificate. Reinstatement requires a **different** reviewer than whoever revoked it (ADMIN-22). |
| `UsersAdmin.tsx` | `/admin/users` | Ban / unban an account. Unban requires a reviewer other than whoever banned (ADMIN-16). |
| `AppealsAdmin.tsx` | `/admin/users` (section) | Approve / deny ban appeals; approving routes through the same `unbanUser` engine, so the reviewer-distinctness rule holds even for an appeal. |
| `QuarantineAdmin.tsx` | `/admin/quarantine` | Quarantine / clear a claim — an override that holds it out of eligibility without touching its ledger trust state. |
| `AuditLogAdmin.tsx` | `/admin/audit` | Read-only view of the append-only audit log, queryable by actor / target / action. |

## Notes

- Every revoke / ban / quarantine action lands in the central audit log (`services/audit.ts`), which snapshots the actor/target labels at write time so entries stay legible after the referenced records are deleted.
- Two seeded `trust_safety_lead` accounts (`reviewer1@example.com`, `reviewer2@example.com`) make the reviewer-distinctness rules reachable in a real sign-in, not just tests.
