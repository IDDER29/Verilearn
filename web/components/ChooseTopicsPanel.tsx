"use client";

/**
 * "Choose which topics stay active" downgrade prompt (BILL-12). The learner
 * picks exactly FREE_TOPIC_CAP topics; the rest are archived (content + trust
 * ledger untouched, never deleted) once confirmed, and only then does the
 * account actually move to Free.
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { confirmDowngradeWithTopicsAction } from "@/app/billing-actions";
import type { TopicSummary } from "@/lib/services/topics";

export default function ChooseTopicsPanel({ topics, cap }: { topics: TopicSummary[]; cap: number }) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < cap) next.add(id);
      return next;
    });
  }

  function confirm() {
    setError(null);
    startTransition(async () => {
      const r = await confirmDowngradeWithTopicsAction([...selected]);
      if (!r.ok) {
        setError(r.error ?? "Couldn't complete the downgrade.");
        return;
      }
      router.push("/settings/plan");
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div role="status" aria-live="polite" style={{ font: "700 12.5px var(--font-nunito)", color: selected.size === cap ? "#2e9c6a" : "#8b8699" }}>
        {selected.size} of {cap} selected
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {topics.map((t) => {
          const checked = selected.has(t.id);
          const disabled = !checked && selected.size >= cap;
          return (
            <label
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                background: "#fff",
                borderRadius: 16,
                padding: "14px 18px",
                boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <input type="checkbox" checked={checked} disabled={disabled} onChange={() => toggle(t.id)} style={{ width: 18, height: 18 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>{t.title}</div>
                <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>
                  {t.level} · {t.verifiedPercent}% verified{t.archived ? " · currently archived" : ""}
                </div>
              </div>
            </label>
          );
        })}
      </div>

      {error && <div style={{ font: "700 13px var(--font-nunito)", color: "#c0392b" }}>{error}</div>}

      <button
        type="button"
        onClick={confirm}
        disabled={selected.size !== cap || pending}
        style={{
          border: "none",
          background: "#6d5bd0",
          color: "#fff",
          font: "800 14px var(--font-nunito)",
          padding: "13px 22px",
          borderRadius: 13,
          cursor: selected.size === cap && !pending ? "pointer" : "not-allowed",
          opacity: selected.size === cap && !pending ? 1 : 0.55,
          alignSelf: "flex-start",
        }}
      >
        {pending ? "Archiving the rest…" : `Keep these ${cap} & downgrade to Free`}
      </button>
      <div style={{ font: "600 11px var(--font-nunito)", color: "#a7a1b8" }}>
        Everything else is archived, not deleted — your content and trust ledger stay exactly as they are, and you can reactivate by upgrading again.
      </div>
    </div>
  );
}
