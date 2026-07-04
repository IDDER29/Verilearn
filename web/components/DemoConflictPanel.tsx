"use client";

/**
 * The interactive half of the guest demo (TRUST-22): a real, adjudicable-
 * looking conflict the visitor can resolve without an account. Nothing here
 * persists — reload the page and the dispute is back, since the server action
 * runs on a fresh, throwaway ledger every time.
 */

import { useState, useTransition } from "react";
import Link from "next/link";
import { resolveDemoConflictAction } from "@/app/demo-actions";
import { DEMO_SOURCE, type DemoSnapshot } from "@/lib/demo/scenario";
import { TRUST_LABEL, type TrustState } from "@/lib/domain/types";

const STATE_COLOR: Record<TrustState, { color: string; bg: string }> = {
  verified_execution: { color: "#0e8c6b", bg: "#e4f4ec" },
  verified_source: { color: "#2d6cdf", bg: "#eaf1fd" },
  sourced: { color: "#2d6cdf", bg: "#eaf1fd" },
  disputed: { color: "#c0392b", bg: "#fbeceb" },
  unsupported: { color: "#c0392b", bg: "#fbeceb" },
  interpretive: { color: "#6d5bd0", bg: "#f2effc" },
};

export default function DemoConflictPanel({ initial }: { initial: DemoSnapshot }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [resolved, setResolved] = useState(false);
  const [pending, startTransition] = useTransition();

  function resolve() {
    startTransition(async () => {
      const next = await resolveDemoConflictAction();
      setSnapshot(next);
      setResolved(true);
    });
  }

  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "22px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ font: "900 15px var(--font-nunito)" }}>Verification coverage</div>
        <div style={{ font: "900 16px var(--font-nunito)", color: "#6d5bd0" }}>{snapshot.verifiedPercent}% verified</div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 16 }}>
        {snapshot.claims.map((c) => {
          const st = STATE_COLOR[c.state];
          const label = TRUST_LABEL[c.state];
          return (
            <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, background: "#faf9fc" }}>
              <span aria-hidden style={{ color: st.color, fontWeight: 800 }}>{label.glyph}</span>
              <span style={{ flex: 1, font: "700 13px/1.4 var(--font-nunito)", color: "#3a3550" }}>{c.text}</span>
              <span style={{ font: "800 10.5px var(--font-nunito)", color: st.color, background: st.bg, padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>
                {label.label}
              </span>
            </div>
          );
        })}
      </div>

      {!resolved ? (
        <div style={{ background: "#fbeceb", border: "1.5px solid #f3d9d6", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ font: "800 12.5px var(--font-nunito)", color: "#c0392b", marginBottom: 6 }}>
            ⚠ The Skeptic flagged a claim — try resolving it
          </div>
          <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#4a4560", marginBottom: 12 }}>
            Add the missing constraint (&quot;only non-negative edge weights&quot;) and cite {DEMO_SOURCE.title} — the SYSTEM verifier (never you) re-checks it and, if it holds, moves the claim to Verified.
          </div>
          <button
            type="button"
            onClick={resolve}
            disabled={pending}
            style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13px var(--font-nunito)", padding: "10px 18px", borderRadius: 12, cursor: pending ? "default" : "pointer", opacity: pending ? 0.7 : 1 }}
          >
            {pending ? "Re-verifying…" : "Add constraint + source → resolve"}
          </button>
        </div>
      ) : (
        <div style={{ background: "#e4f4ec", border: "1.5px solid #cdeadd", borderRadius: 14, padding: "14px 16px" }}>
          <div style={{ font: "800 12.5px var(--font-nunito)", color: "#0e8c6b", marginBottom: 6 }}>✓ Resolved by the system verifier</div>
          <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#4a4560", marginBottom: 12 }}>
            That&apos;s the real epistemic firewall: you supplied the reasoning, but only the verifier writes the trust state — never you. This demo doesn&apos;t save anything; create an account to keep your own topics.
          </div>
          <Link
            href="/signup"
            style={{ display: "inline-block", textDecoration: "none", background: "#6d5bd0", color: "#fff", font: "800 13px var(--font-nunito)", padding: "10px 18px", borderRadius: 12 }}
          >
            Sign up free →
          </Link>
        </div>
      )}
    </div>
  );
}
