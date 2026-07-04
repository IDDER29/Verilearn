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
