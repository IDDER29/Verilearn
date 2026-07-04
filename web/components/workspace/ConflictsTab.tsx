"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { reopenConflictAction, resolveConflictAction } from "@/app/conflict-actions";
import WorkspaceTabs from "./WorkspaceTabs";
import type { TabKey, WorkspaceData } from "./types";

export default function ConflictsTab({ onTab, data = null }: { onTab: (t: TabKey) => void; data?: WorkspaceData | null }) {
  const router = useRouter();
  const disputes = data?.disputedClaims ?? [];
  const [selIdx, setSelIdx] = useState(0);
  const disputed = disputes[selIdx] ?? disputes[0];
  const disputedText = disputed?.text ?? "";
  const [constraint, setConstraint] = useState("");
  const [saving, setSaving] = useState(false);
  const [resolved, setResolved] = useState(false);

  const claimCount = data?.claimCount ?? 0;
  const flagged = disputes.length;
  const held = Math.max(0, claimCount - flagged);

  const resolvedList = data?.resolvedClaims ?? [];

  async function reopen(claimId: string) {
    if (!data) return;
    const reason = window.prompt("Why are you reopening this conflict? (a reason is required)");
    if (!reason || !reason.trim()) return;
    const r = await reopenConflictAction(data.topicId, claimId, reason);
    if (r.ok) router.refresh();
  }

  async function recordResolution() {
    if (!data || !disputed || constraint.trim().length === 0) return;
    setSaving(true);
    const r = await resolveConflictAction(data.topicId, disputed.claimId, constraint);
    setSaving(false);
    if (r.ok) {
      setResolved(true);
      router.refresh();
    }
  }

  return (
    <main
      style={{
        padding: "24px 26px 30px",
        display: "grid",
        gridTemplateColumns: "minmax(0,1fr) 320px",
        gap: 24,
        alignItems: "start",
      }}
    >
      {/* ---- CENTER ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            type="button"
            onClick={() => onTab("lecture")}
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)",
              flexShrink: 0,
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / {data?.level ?? "Algorithms"}</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{data?.title ?? "Topic"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: flagged > 0 ? "#c0392b" : "#2e9c6a", background: flagged > 0 ? "#fbeceb" : "#e4f4ec", padding: "9px 15px", borderRadius: 12 }}>
            ⚖️ {flagged} open conflict{flagged === 1 ? "" : "s"}
          </div>
        </div>

        {/* tabs */}
        <WorkspaceTabs active="conflicts" onTab={onTab} />

        {flagged === 0 ? (
          /* honest empty state — nothing disputed */
          <div style={{ background: "#fff", borderRadius: 22, padding: "40px 32px", textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ fontSize: 38, marginBottom: 10 }}>⚖️</div>
            <div style={{ font: "900 19px var(--font-nunito)", marginBottom: 6 }}>Every claim is settled</div>
            <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699", maxWidth: 420, margin: "0 auto" }}>
              The Skeptic has no open disputes on this topic right now. If it flags a claim later, it&apos;ll appear here for you to adjudicate.
            </div>
          </div>
        ) : (
        <>
        {/* conflict list — one card per real open dispute, selectable */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {disputes.map((d, i) => {
            const sel = i === selIdx;
            return (
              <button
                key={d.claimId}
                type="button"
                onClick={() => { setSelIdx(i); setResolved(false); }}
                style={{ flex: "1 1 240px", textAlign: "left", cursor: "pointer", background: "#fff", borderRadius: 16, padding: "14px 16px", border: sel ? "2px solid #6d5bd0" : "1.5px solid #ece8f4", boxShadow: sel ? "0 12px 26px -14px rgba(109,91,208,.4)" : "none" }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b" }}>● OPEN</span>
                  <span style={{ font: "700 11px var(--font-nunito)", color: "#9a95a8" }}>Raised by the Skeptic</span>
                </div>
                <div style={{ font: "800 13.5px/1.4 var(--font-nunito)" }}>&quot;{d.text}&quot;</div>
              </button>
            );
          })}
        </div>

        {/* conflict detail */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          {/* disputed claim */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 12, background: "#f2effc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>🧐</div>
            <div>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#6d5bd0" }}>The Skeptic disputes a claim</div>
              <div style={{ font: "700 12.5px var(--font-nunito)", color: "#9a95a8" }}>Your call — pick the position that holds, and say why.</div>
            </div>
          </div>
          <div style={{ background: "#fbeceb", borderLeft: "4px solid #c0392b", borderRadius: "0 14px 14px 0", padding: "15px 18px", marginBottom: 22 }}>
            <div style={{ font: "800 15px/1.5 var(--font-nunito)", color: "#221f2e" }}>&quot;{disputedText}&quot;</div>
            <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8a5a56", marginTop: 6 }}>Flagged by the Skeptic — no source backs this claim as stated. Add the missing constraint or qualify it, and record why.</div>
          </div>

          {/* competing positions */}
          <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 12 }}>Competing positions</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
            <div style={{ border: "2px solid #6d5bd0", borderRadius: 16, padding: "16px 18px", background: "#f7f5fd", position: "relative" }}>
              <div style={{ position: "absolute", top: 14, right: 14, width: 22, height: 22, borderRadius: "50%", background: "#6d5bd0", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</div>
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>Restrict to non-negative</div>
              <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#6c6780" }}>Add the constraint: it&apos;s correct only on graphs with non-negative edge weights. Use Bellman-Ford otherwise.</div>
              <div style={{ marginTop: 10, font: "700 11.5px var(--font-nunito)", color: "#2d6cdf" }}>◉ Backed by CLRS §24.3</div>
            </div>
            <div style={{ border: "1.5px solid #ece8f4", borderRadius: 16, padding: "16px 18px", background: "#fff" }}>
              <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8, color: "#221f2e" }}>Keep as-is</div>
              <div style={{ font: "600 13px/1.6 var(--font-nunito)", color: "#8b8699" }}>Argue &quot;weighted&quot; implies non-negative in context, so the original wording is acceptable.</div>
              <div style={{ marginTop: 10, font: "700 11.5px var(--font-nunito)", color: "#b4690e" }}>△ Unsupported by sources</div>
            </div>
          </div>

          {/* resolution */}
          <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 10 }}>Your resolution</div>
          <textarea
            rows={3}
            value={constraint}
            onChange={(e) => setConstraint(e.target.value)}
            placeholder="State the constraint or correction that resolves this — e.g. the condition under which the claim holds, and the source that backs it."
            style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #ece8f4", borderRadius: 14, padding: "13px 15px", font: "600 14px/1.6 var(--font-nunito)", background: "#fbfafd", outline: "none", resize: "none", marginBottom: 18 }}
          />

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>🔄 Resolving updates the trust badges everywhere</div>
            <button
              type="button"
              onClick={recordResolution}
              disabled={saving || resolved || !data || constraint.trim().length === 0}
              style={{ border: "none", background: resolved ? "#0e8c6b" : constraint.trim().length === 0 ? "#cdc6e8" : "#6d5bd0", color: "#fff", font: "800 14px var(--font-nunito)", padding: "12px 24px", borderRadius: 13, cursor: saving || resolved || constraint.trim().length === 0 ? "default" : "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)", whiteSpace: "nowrap" }}
            >
              {resolved ? "Resolved ✓" : saving ? "Re-verifying…" : "Record resolution"}
            </button>
          </div>
        </div>
        </>
        )}

        {/* recently resolved — reopenable with a required reason (TRUST-13) */}
        {resolvedList.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 22, padding: "20px 24px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 4 }}>Recently resolved</div>
            <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginBottom: 12 }}>Reopening reverts the claim to disputed and re-excludes it from tests — a reason is required.</div>
            {resolvedList.map((c) => (
              <div key={c.claimId} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid #f5f3fa" }}>
                <span style={{ font: "800 10px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>✓ Resolved</span>
                <span style={{ flex: 1, minWidth: 0, font: "700 12.5px var(--font-nunito)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>&quot;{c.text}&quot;</span>
                <button type="button" onClick={() => reopen(c.claimId)} style={{ border: "1.5px solid #ece8f4", background: "#fff", color: "#c0392b", font: "800 11px var(--font-nunito)", padding: "7px 13px", borderRadius: 10, cursor: "pointer", whiteSpace: "nowrap" }}>Reopen</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ---- RIGHT ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* the skeptic */}
        <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 22, padding: 22, color: "#fff", boxShadow: "0 16px 34px -16px rgba(40,30,70,.7)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(255,255,255,.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧐</div>
            <div>
              <div style={{ font: "900 16px var(--font-nunito)" }}>The Skeptic</div>
              <div style={{ font: "700 11.5px var(--font-nunito)", color: "#b3a7f0" }}>Red-teams every topic</div>
            </div>
          </div>
          <div style={{ font: "600 13px/1.65 var(--font-nunito)", color: "#d8d3e8" }}>It stress-tests each claim against edge cases and sources, then flags anything it can break. You stay the judge.</div>
          <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>{claimCount}</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>claims tested</div>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>{flagged}</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>flagged</div>
            </div>
            <div>
              <div style={{ font: "900 20px var(--font-nunito)" }}>{held}</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#b3a7f0" }}>held up</div>
            </div>
          </div>
        </div>

        {/* what happens */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>When you resolve</div>
          <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ width: 26, height: 26, borderRadius: 9, background: "#e4f4ec", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>✅</span>The claim&apos;s badge updates in the lecture
          </div>
          <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ width: 26, height: 26, borderRadius: 9, background: "#e4ecfb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🔢</span>The conflict counter drops to 0
          </div>
          <div style={{ display: "flex", gap: 11, padding: "8px 0", font: "700 13px/1.4 var(--font-nunito)" }}>
            <span style={{ width: 26, height: 26, borderRadius: 9, background: "#f2effc", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>📌</span>Your reasoning is saved to the topic
          </div>
        </div>
      </div>
    </main>
  );
}
