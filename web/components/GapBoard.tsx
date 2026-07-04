"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import GapCloseButton from "@/components/GapCloseButton";
import type { GapBoard as GapBoardData, GapView } from "@/lib/services/gaps";

const SEVERITY: Record<GapView["severity"], { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "#c0392b", bg: "#fbeceb" },
  med: { label: "Medium", color: "#b4830f", bg: "#fbefdd" },
  low: { label: "Low", color: "#2e9c6a", bg: "#e4f4ec" },
};

const ORIGIN_LABEL: Record<GapView["origin"], string> = {
  review: "caught in review",
  task: "caught in a task",
  test: "caught in a test",
  conflict: "from a conflict",
  drill: "caught in a blind-spot drill",
};

const STATUS_BADGE: Record<GapView["status"], { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#c0392b", bg: "#fbeceb" },
  reopened: { label: "↻ Reopened", color: "#c0392b", bg: "#fbeceb" },
  watching: { label: "Watching", color: "#b4830f", bg: "#fbefdd" },
  closed: { label: "✓ Closed", color: "#2e9c6a", bg: "#e4f4ec" },
};

const CLAIM_TRUST: Record<string, { label: string; color: string }> = {
  verified_execution: { label: "claim: verified by execution", color: "#0e8c6b" },
  verified_source: { label: "claim: source-backed", color: "#2d6cdf" },
  sourced: { label: "claim: sourced", color: "#2d6cdf" },
  disputed: { label: "claim: disputed", color: "#c0392b" },
  unsupported: { label: "claim: unsupported", color: "#c0392b" },
  interpretive: { label: "claim: interpretive", color: "#6d5bd0" },
};

type Filter = "all" | "high" | "reopened";

function GapCard({ g, highlighted }: { g: GapView; highlighted: boolean }) {
  const sev = SEVERITY[g.severity];
  const st = STATUS_BADGE[g.status];
  const actionable = g.status !== "closed";
  // Jump-to / highlight target for the gap-opened/reopened notification (NOTIF-23).
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (highlighted) ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlighted]);
  return (
    <div
      ref={ref}
      role="listitem"
      style={{
        background: "#fff",
        borderRadius: 16,
        padding: "15px 16px",
        boxShadow: highlighted ? "0 0 0 3px #6d5bd0, 0 8px 22px -16px rgba(80,60,140,.3)" : "0 8px 22px -16px rgba(80,60,140,.3)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <span style={{ font: "800 10px var(--font-nunito)", color: st.color, background: st.bg, padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>{st.label}</span>
        <span style={{ font: "800 10px var(--font-nunito)", color: sev.color, background: sev.bg, padding: "4px 9px", borderRadius: 8, whiteSpace: "nowrap" }}>{sev.label}</span>
      </div>
      <div style={{ font: "700 13.5px/1.5 var(--font-nunito)", color: "#221f2e", marginBottom: 8 }}>{g.claimText}</div>
      <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>{g.topicTitle} · {ORIGIN_LABEL[g.origin]}</div>
      {g.claimState && CLAIM_TRUST[g.claimState] && (
        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, font: "700 10.5px var(--font-nunito)", color: CLAIM_TRUST[g.claimState].color }}>
          <span style={{ width: 8, height: 8, borderRadius: 3, background: CLAIM_TRUST[g.claimState].color }} />
          {CLAIM_TRUST[g.claimState].label}
        </div>
      )}
      <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #f0edf6", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
        <span style={{ font: "700 10px var(--font-nunito)", color: "#a7a1b8" }}>
          {g.history.length} event{g.history.length === 1 ? "" : "s"} · {g.successfulReviews} recall{g.successfulReviews === 1 ? "" : "s"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {actionable && (
            /* Practice handoff (GAP-09): Review is the surface that advances a gap
               toward closure — a correct recall moves open/reopened → watching → closed. */
            <Link href="/review" style={{ font: "800 10.5px var(--font-nunito)", color: "#6d5bd0", background: "#f2effc", padding: "6px 11px", borderRadius: 9, textDecoration: "none", whiteSpace: "nowrap" }}>
              Practice in Review ▸
            </Link>
          )}
          {g.origin === "conflict" && g.claimState === "disputed" && (
            <Link href={`/topics/conflicts?topic=${g.topicId}&claim=${g.claimId}`} style={{ font: "800 10.5px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "6px 11px", borderRadius: 9, textDecoration: "none", whiteSpace: "nowrap" }}>
              Adjudicate ▸
            </Link>
          )}
          {g.status === "watching" && <GapCloseButton gapId={g.id} canClose={g.canClose} hint={`needs ${Math.max(0, 2 - g.successfulReviews)} more to close`} />}
        </div>
      </div>
    </div>
  );
}

function Column({ title, tone, gaps, empty, highlightId }: { title: string; tone: string; gaps: GapView[]; empty: string; highlightId?: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ width: 9, height: 9, borderRadius: "50%", background: tone }} />
        <span style={{ font: "900 14px var(--font-nunito)" }}>{title}</span>
        <span style={{ font: "800 12px var(--font-nunito)", color: "#8b8699" }}>{gaps.length}</span>
      </div>
      {gaps.length === 0 ? (
        <div style={{ font: "600 12px/1.5 var(--font-nunito)", color: "#a7a1b8", background: "#faf9fc", borderRadius: 14, padding: "16px 14px" }}>{empty}</div>
      ) : (
        <div role="list" aria-label={`${title} gaps`} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {gaps.map((g) => <GapCard key={g.id} g={g} highlighted={g.id === highlightId} />)}
        </div>
      )}
    </div>
  );
}

const CHIPS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "high", label: "High severity" },
  { key: "reopened", label: "Reopened" },
];

export default function GapBoard({ board, highlightId }: { board: GapBoardData; highlightId?: string }) {
  const [filter, setFilter] = useState<Filter>("all");
  const apply = (gaps: GapView[]) =>
    filter === "high" ? gaps.filter((g) => g.severity === "high") : filter === "reopened" ? gaps.filter((g) => g.status === "reopened") : gaps;

  const active = apply(board.active);
  const watching = apply(board.watching);
  const closed = apply(board.closed);
  const shown = active.length + watching.length + closed.length;

  return (
    <>
      <div style={{ display: "flex", gap: 8 }} role="group" aria-label="Filter gaps">
        {CHIPS.map((c) => {
          const on = filter === c.key;
          return (
            <button
              key={c.key}
              type="button"
              onClick={() => setFilter(c.key)}
              aria-pressed={on}
              style={{ border: "none", cursor: "pointer", font: "800 12px var(--font-nunito)", color: on ? "#fff" : "#6c6780", background: on ? "#6d5bd0" : "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: on ? "none" : "0 6px 16px -12px rgba(80,60,140,.3)" }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Announce the filtered result to assistive tech on filter change (GAP-16). */}
      <div role="status" aria-live="polite" className="vl-sr-only">
        {shown} gap{shown === 1 ? "" : "s"} shown: {active.length} open, {watching.length} watching, {closed.length} closed.
      </div>

      {shown === 0 ? (
        <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", background: "#fff", borderRadius: 16, padding: "24px 20px", textAlign: "center", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
          No gaps match this filter.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 18, alignItems: "start" }}>
          <Column title="Open" tone="#c0392b" gaps={active} empty="Nothing here." highlightId={highlightId} />
          <Column title="Watching" tone="#c99a2b" gaps={watching} empty="Nothing here." highlightId={highlightId} />
          <Column title="Closed" tone="#2e9c6a" gaps={closed} empty="Nothing here." highlightId={highlightId} />
        </div>
      )}
    </>
  );
}
