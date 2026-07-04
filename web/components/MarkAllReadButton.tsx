"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { markAllReadAction } from "@/app/notification-actions";

/** Marks every notification read (NOTIF-01), then refreshes the list. */
export default function MarkAllReadButton({ disabled }: { disabled?: boolean }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  return (
    <button
      type="button"
      disabled={busy || disabled}
      onClick={async () => {
        setBusy(true);
        const { ok } = await markAllReadAction();
        setBusy(false);
        if (ok) router.refresh();
      }}
      style={{
        border: "1.5px solid #ece8f4",
        background: "#fff",
        color: "#6c6780",
        font: "800 12px var(--font-nunito)",
        padding: "9px 15px",
        borderRadius: 12,
        cursor: busy || disabled ? "default" : "pointer",
        opacity: disabled ? 0.55 : 1,
      }}
    >
      {busy ? "Marking…" : "Mark all read"}
    </button>
  );
}
