/**
 * Real Lecture-reader claims for the guest demo (LEARN-17): the same
 * underlined-claim + claim→evidence treatment the signed-in Lecture tab uses,
 * built from `demoWorkspaceData` — real `TrustLedger`-derived states, never
 * fabricated, just never persisted. A simplified, guest-appropriate layout
 * (no app-shell chrome, no other workspace tabs — there's no demo data for
 * Tasks/Sources, so this stays a focused, honest reading view).
 */
import type { WorkspaceData } from "@/components/workspace/types";
import { TRUST_LABEL, type TrustState } from "@/lib/domain/types";

const STATE_COLOR: Record<TrustState, { color: string; bg: string }> = {
  verified_execution: { color: "#0e8c6b", bg: "#e7f4ee" },
  verified_source: { color: "#2d6cdf", bg: "#e7effb" },
  sourced: { color: "#2d6cdf", bg: "#e7effb" },
  disputed: { color: "#c0392b", bg: "#fbeceb" },
  unsupported: { color: "#c0392b", bg: "#fbeceb" },
  interpretive: { color: "#6d5bd0", bg: "#efe9ff" },
};

export default function DemoLecturePanel({ data }: { data: WorkspaceData }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
      <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 4 }}>{data.title} — the Lecture reader</div>
      <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
        Every claim below carries its real trust state from the ledger — {data.verifiedPercent}% verified.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.claims.map((c, i) => {
          const tone = STATE_COLOR[c.state];
          const label = TRUST_LABEL[c.state];
          return (
            <div key={c.id} style={{ padding: "10px 0", ...(i > 0 ? { borderTop: "1px solid #f0edf6" } : {}) }}>
              <div style={{ font: "700 13.5px/1.5 var(--font-nunito)", color: "#221f2e", marginBottom: 6 }}>{c.text}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span style={{ font: "800 10.5px var(--font-nunito)", color: tone.color, background: tone.bg, padding: "3px 9px", borderRadius: 8 }}>
                  {label.glyph} {label.label}
                </span>
                {c.source && <span style={{ font: "600 11px var(--font-nunito)", color: "#8b8699" }}>{c.source.title}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
