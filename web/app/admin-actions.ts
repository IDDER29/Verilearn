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
