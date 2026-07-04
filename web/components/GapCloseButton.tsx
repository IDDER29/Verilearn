"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { closeGapAction } from "@/app/gap-actions";

/** Manual, evidence-gated "Mark closed" for a watching gap (GAP-03). */
export default function GapCloseButton({ gapId, canClose, hint }: { gapId: string; canClose: boolean; hint: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!canClose) {
    return <span style={{ font: "700 10.5px var(--font-nunito)", color: "#a7a1b8" }}>{hint}</span>;
  }
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
      <button
        type="button"
        disabled={busy}
        onClick={async (e) => {
          e.preventDefault();
          e.stopPropagation();
          setBusy(true);
          const r = await closeGapAction(gapId);
          setBusy(false);
          if (r.ok) router.refresh();
          else setErr(r.error ?? "Couldn't close.");
        }}
        style={{ border: "none", background: "#e4f4ec", color: "#2e9c6a", font: "800 10.5px var(--font-nunito)", padding: "5px 10px", borderRadius: 8, cursor: busy ? "default" : "pointer" }}
      >
        {busy ? "Closing…" : "✓ Mark closed"}
      </button>
      {err && <span style={{ font: "700 10px var(--font-nunito)", color: "#c0392b" }}>{err}</span>}
    </span>
  );
}
