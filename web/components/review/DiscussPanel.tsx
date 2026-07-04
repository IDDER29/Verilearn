"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { raiseDisputeAction } from "@/app/conflict-actions";
import { gradeCardAction } from "@/app/review-actions";
import type { DiscussContext } from "@/lib/services/review";

/**
 * The real action panel behind Discuss (REVIEW-08): "Raise a conflict" and
 * "Track as a gap" now call the same real engines the Conflicts tab and the
 * review grading flow use — a rejected attempt (empty reason, stale claim)
 * surfaces the genuine error, never a silently-ignored click. The Skeptic's
 * reply above this panel stays canned pending the real LLM Skeptic (Deferred);
 * this panel is the part of the story that didn't need one.
 */
export default function DiscussPanel({ ctx }: { ctx: DiscussContext }) {
  const router = useRouter();
  const [openReason, setOpenReason] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmRaiseConflict() {
    if (!reason.trim()) return;
    setBusy(true);
    const r = await raiseDisputeAction(ctx.topicId, ctx.claimId, reason);
    setBusy(false);
    if (r.ok) router.push(`/topics/conflicts?topic=${ctx.topicId}&claim=${ctx.claimId}`);
    else setError(r.error ?? "Couldn't raise a conflict.");
  }

  async function trackAsGap() {
    setBusy(true);
    const r = await gradeCardAction(ctx.cardId, "unsure", "again");
    setBusy(false);
    if (r.ok) router.push("/review");
    else setError(r.error ?? "Couldn't track this as a gap.");
  }

  return (
    <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
      <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 6 }}>What do you want to do?</div>
      <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>Your decision updates the card &amp; its trust.</div>

      {openReason ? (
        <div style={{ background: "#fbeceb", border: "1px solid #f3d9d6", borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}>
          <div style={{ font: "800 12.5px var(--font-nunito)", color: "#c0392b", marginBottom: 8 }}>Why are you disputing this?</div>
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain the issue…"
            aria-label="Reason"
            style={{ width: "100%", boxSizing: "border-box", border: "1.5px solid #f3d9d6", borderRadius: 10, padding: "9px 11px", font: "600 12.5px var(--font-nunito)", background: "#fff", resize: "none", marginBottom: 8 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              disabled={busy || !reason.trim()}
              onClick={confirmRaiseConflict}
              style={{ border: "none", background: "#c0392b", color: "#fff", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
            >
              {busy ? "Raising…" : "Confirm"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => { setOpenReason(false); setReason(""); setError(null); }}
              style={{ border: "1.5px solid #f3d9d6", background: "#fff", color: "#a9564b", font: "800 12px var(--font-nunito)", padding: "8px 14px", borderRadius: 10, cursor: busy ? "default" : "pointer" }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => { setOpenReason(true); setError(null); }}
          style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, cursor: "pointer", background: "#fbeceb", border: "1px solid #f3d9d6", borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}
        >
          <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#c0392b" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 21V4M5 4h11l-2 3.5L16 11H5" />
            </svg>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "800 13px var(--font-nunito)", color: "#c0392b" }}>Raise a conflict</div>
            <div style={{ font: "600 11px var(--font-nunito)", color: "#a96b64" }}>Escalate for the topic to resolve</div>
          </div>
        </button>
      )}

      <button
        type="button"
        disabled={busy}
        onClick={trackAsGap}
        style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, cursor: busy ? "default" : "pointer", background: "#f2effc", border: "1px solid #e3ddf6", borderRadius: 14, padding: "13px 15px", marginBottom: 10 }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "800 13px var(--font-nunito)", color: "#6d5bd0" }}>{busy ? "Working…" : "Track as a gap"}</div>
          <div style={{ font: "600 11px var(--font-nunito)", color: "#948ab5" }}>Revisit until it&apos;s solid</div>
        </div>
      </button>

      <button
        type="button"
        disabled={busy}
        onClick={() => router.push("/review")}
        style={{ width: "100%", textAlign: "left", display: "flex", alignItems: "center", gap: 10, cursor: busy ? "default" : "pointer", background: "#eef7f1", border: "1px solid #cdeadd", borderRadius: 14, padding: "13px 15px" }}
      >
        <div style={{ width: 34, height: 34, borderRadius: 11, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "800 13px var(--font-nunito)", color: "#2e9c6a" }}>Accept &amp; continue</div>
          <div style={{ font: "600 11px var(--font-nunito)", color: "#6ba888" }}>Back to your review</div>
        </div>
      </button>

      {error && <div style={{ font: "700 11.5px var(--font-nunito)", color: "#c0392b", marginTop: 10 }}>{error}</div>}
    </div>
  );
}
