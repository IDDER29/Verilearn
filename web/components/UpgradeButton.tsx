"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { activateDemoPlanAction, downgradeToFreeAction } from "@/app/billing-actions";

/**
 * Changes the account plan (demo, no charge — see billing-actions) and navigates
 * to reflect the result. Used in place of a real checkout CTA while billing is
 * Deferred, so the plan transition and its downstream effects are genuinely
 * exercised. Upgrades route to the success screen; downgrades refresh in place.
 */
export default function UpgradeButton({
  plan,
  label,
  busyLabel,
  style,
}: {
  plan: "pro" | "team" | "free";
  label: string;
  busyLabel?: string;
  style: CSSProperties;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        const { ok } = plan === "free" ? await downgradeToFreeAction() : await activateDemoPlanAction(plan);
        if (!ok) {
          setBusy(false);
          return;
        }
        if (plan === "free") router.refresh();
        else router.push("/upgrade/success");
      }}
      style={{ ...style, cursor: busy ? "default" : "pointer", opacity: busy ? 0.7 : 1 }}
    >
      {busy ? busyLabel ?? "Working…" : label}
    </button>
  );
}
