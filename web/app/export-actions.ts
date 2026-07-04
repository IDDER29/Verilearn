"use server";

import { getCurrentUser } from "@/lib/auth/current";
import { buildDataExport } from "@/lib/services/export";
import { now } from "@/lib/ids";

/** Produce the learner's full data export as a JSON string (SETTINGS-13 / DSAR). */
export async function exportDataAction(): Promise<{ ok: boolean; json?: string; error?: string }> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Not signed in." };
  const data = buildDataExport(user.id, now());
  if (!data) return { ok: false, error: "No data to export." };
  return { ok: true, json: JSON.stringify(data, null, 2) };
}
