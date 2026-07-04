"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { can } from "@/lib/domain/rbac";
import {
  listAllCertificates,
  reinstateCertificateForAdmin,
  revokeCertificateForAdmin,
  type AdminCertActionResult,
  type AdminCertificateView,
} from "@/lib/services/certificates";
import {
  banUserForAdmin,
  listAllUsersForAdmin,
  unbanUserForAdmin,
  type AdminModerationResult,
  type AdminUserView,
} from "@/lib/services/moderation";
import {
  listAllClaimsForAdmin,
  quarantineClaimForAdmin,
  unquarantineClaimForAdmin,
  type AdminClaimView,
  type AdminQuarantineResult,
} from "@/lib/services/quarantine";
import { listAuditLogForAdmin, type AdminAuditView } from "@/lib/services/audit";
import type { AuditQuery } from "@/lib/domain/audit";
import {
  decideAppealForAdmin,
  listAppealsForAdmin,
  type AdminAppealResult,
  type AdminAppealView,
} from "@/lib/services/appeals";
import { now } from "@/lib/ids";

/** RBAC-gated: only a `cert:revoke`-holding role sees any real data (ADMIN-15). */
export async function listAdminCertificatesAction(): Promise<AdminCertificateView[]> {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "cert:revoke")) return [];
  return listAllCertificates();
}

export async function revokeCertificateAction(certId: string, reason: string): Promise<AdminCertActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = revokeCertificateForAdmin(user.id, user.role, certId, reason, now());
  if (r.ok) revalidatePath("/admin/certificates");
  return r;
}

/** Reinstate a wrongly-revoked certificate (ADMIN-22) — refuses a reviewer who is the same actor that revoked it. */
export async function reinstateCertificateAction(certId: string, reason: string): Promise<AdminCertActionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = reinstateCertificateForAdmin(user.id, user.role, certId, reason, now());
  if (r.ok) revalidatePath("/admin/certificates");
  return r;
}

/** RBAC-gated: only a `user:ban`-holding role sees any real data (ADMIN-16). */
export async function listAdminUsersAction(): Promise<AdminUserView[]> {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "user:ban")) return [];
  return listAllUsersForAdmin();
}

export async function banUserAction(targetUserId: string, reason: string): Promise<AdminModerationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = banUserForAdmin(user.id, user.role, targetUserId, reason, now());
  if (r.ok) revalidatePath("/admin/users");
  return r;
}

/** Unban a user — the second-approval half (ADMIN-16) — refuses a reviewer who is the same actor that banned it. */
export async function unbanUserAction(targetUserId: string, reason: string): Promise<AdminModerationResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = unbanUserForAdmin(user.id, user.role, targetUserId, reason, now());
  if (r.ok) revalidatePath("/admin/users");
  return r;
}

/** RBAC-gated: only an `integrity:quarantine`-holding role sees any real data (ADMIN-14). */
export async function listAdminClaimsAction(): Promise<AdminClaimView[]> {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "integrity:quarantine")) return [];
  return listAllClaimsForAdmin();
}

export async function quarantineClaimAction(claimId: string, topicId: string, reason: string): Promise<AdminQuarantineResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = quarantineClaimForAdmin(user.id, user.role, claimId, topicId, reason, now());
  if (r.ok) revalidatePath("/admin/quarantine");
  return r;
}

/** Clear a claim's quarantine (ADMIN-14) — never touches the claim's real ledger-derived trust state. */
export async function unquarantineClaimAction(claimId: string): Promise<AdminQuarantineResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = unquarantineClaimForAdmin(user.id, user.role, claimId, now());
  if (r.ok) revalidatePath("/admin/quarantine");
  return r;
}

/** RBAC-gated: only an `audit:read`-holding role sees any real data (ADMIN-20). */
export async function listAdminAuditAction(query: AuditQuery = {}): Promise<AdminAuditView[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return listAuditLogForAdmin(user.role, query);
}

/** RBAC-gated: only a `user:ban`-holding role sees any real data (AUTH-18). */
export async function listAdminAppealsAction(): Promise<AdminAppealView[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return listAppealsForAdmin(user.role);
}

/** Decide a pending ban appeal (AUTH-18) — approving genuinely unbans through the same reviewer-other-than-whoever-banned gate as ADMIN-16. */
export async function decideAppealAction(appealId: string, approve: boolean, reason: string): Promise<AdminAppealResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = decideAppealForAdmin(user.id, user.role, appealId, approve, reason, now());
  if (r.ok) revalidatePath("/admin/users");
  return r;
}
