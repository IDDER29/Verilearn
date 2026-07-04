"use client";

import { useState } from "react";
import { BackButton } from "@/components/ui";
import WorkspaceTabs from "./WorkspaceTabs";
import type { TabKey, WorkspaceData } from "./types";

type Trust = "verified" | "sourced" | "disputed";

type Claim = {
  id: string;
  claim: string;
  trust: Trust;
  underline: string;
  source?: { icon: string; title: string; desc: string };
  confidence: string;
  confidenceColor: string;
};

const CLAIMS: Record<string, Claim> = {
  smallest: {
    id: "smallest",
    claim: '"Always pick the unvisited node with the smallest tentative distance."',
    trust: "verified",
    underline: "#0e8c6b",
    source: { icon: "🔬", title: "Execution sandbox", desc: "Ran on 12 sample graphs — the greedy pick held every time." },
    confidence: "High · 0.98",
    confidenceColor: "#2e9c6a",
  },
  correct: {
    id: "correct",
    claim: '"The greedy choice is guaranteed to be correct."',
    trust: "sourced",
    underline: "#2d6cdf",
    source: { icon: "📘", title: "CLRS · §24.3", desc: "Proof of correctness via the cut property — page 661." },
    confidence: "High · 0.94",
    confidenceColor: "#2e9c6a",
  },
  pq: {
    id: "pq",
    claim: '"The classic implementation uses a priority queue keyed by tentative distance."',
    trust: "sourced",
    underline: "#2d6cdf",
    source: { icon: "📘", title: "CLRS · §24.3", desc: "Priority-queue implementation, O((V+E) log V) — page 662." },
    confidence: "High · 0.91",
    confidenceColor: "#2e9c6a",
  },
  anygraph: {
    id: "anygraph",
    claim: '"It works on any weighted graph."',
    trust: "disputed",
    underline: "#c0392b",
    confidence: "Low · contested",
    confidenceColor: "#c0392b",
  },
};

const TRUST_BADGE: Record<Trust, { label: string; color: string; bg: string }> = {
  verified: { label: "✓ Verified by execution", color: "#0e8c6b", bg: "#e4f4ec" },
  sourced: { label: "◉ Backed by a source", color: "#2d6cdf", bg: "#e4ecfb" },
  disputed: { label: "⚠️ Disputed claim", color: "#c0392b", bg: "#fbeceb" },
};

const KIND_ICON: Record<string, string> = { execution: "🔬", sandbox: "🔬", textbook: "📘", book: "📘", paper: "📄", web: "🌐", docs: "📄" };

/** Map a real six-state trust value to the reader's 3-colour vocabulary. */
function trustView(state: string): { trust: Trust; underline: string } {
  if (state === "verified_execution") return { trust: "verified", underline: "#0e8c6b" };
  if (state === "verified_source" || state === "sourced") return { trust: "sourced", underline: "#2d6cdf" };
  return { trust: "disputed", underline: "#c0392b" };
}

/** Human confidence label + colour from the real verifier confidence (0..1). */
function confLabel(state: string, conf: number): { text: string; color: string } {
  if (state === "disputed") return { text: "Low · contested", color: "#c0392b" };
  if (conf >= 0.85) return { text: `High · ${conf.toFixed(2)}`, color: "#2e9c6a" };
  if (conf >= 0.6) return { text: `Medium · ${conf.toFixed(2)}`, color: "#b4830f" };
  return { text: `Low · ${conf.toFixed(2)}`, color: "#c0392b" };
}

// The three inline prose spans map to the topic's first real claims; the disputed
// callout maps to the topic's disputed claim. (Prose text itself is templated —
// full lecture generation is Deferred to the LLM author.)
const SPAN_TO_INDEX: Record<string, number> = { smallest: 0, correct: 1, pq: 2 };

export default function LectureTab({ onTab, data = null }: { onTab: (t: TabKey) => void; data?: WorkspaceData | null }) {
  const [selected, setSelected] = useState<string>("correct");

  // Resolve a prose-span key to a display claim from REAL ledger data when
  // available, falling back to the illustrative constants when data is absent.
  const resolveClaim = (key: string): Claim => {
    const fb = CLAIMS[key];
    if (!data) return fb;
    const real = key === "anygraph" ? data.claims.find((c) => c.state === "disputed") ?? null : data.claims[SPAN_TO_INDEX[key]] ?? null;
    if (!real) return fb;
    const tv = trustView(real.state);
    const cl = confLabel(real.state, real.confidence);
    return {
      id: key,
      claim: `"${real.text}"`,
      trust: tv.trust,
      underline: tv.underline,
      source: real.source ? { icon: KIND_ICON[real.source.kind] ?? "📄", title: real.source.title, desc: real.source.detail } : undefined,
      confidence: cl.text,
      confidenceColor: cl.color,
    };
  };

  const claim = resolveClaim(selected);
  const badge = TRUST_BADGE[claim.trust];

  // Ledger-computed aggregates (fall back to the illustrative Dijkstra numbers).
  const bd = data?.breakdown;
  const execCount = bd?.verified_execution ?? 3;
  const backedCount = (bd?.verified_source ?? 2) + (bd?.sourced ?? 0);
  const disputedCount = bd?.disputed ?? 1;
  const verifiedCount = (bd?.verified_execution ?? 3) + (bd?.verified_source ?? 0);
  const sourcedCount = bd?.sourced ?? 2;
  const title = data?.title ?? "Dijkstra's algorithm";
  const verifiedPct = data?.verifiedPercent ?? 83;

  // A render helper (not a nested component) so the same span can be reused inline
  // without creating a new component type each render.
  const claimSpan = (id: string, children: React.ReactNode) => {
    const c = resolveClaim(id);
    const isSel = selected === id;
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => setSelected(id)}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected(id)}
        style={{
          borderBottom: `2.5px solid ${c.underline}`,
          paddingBottom: 1,
          cursor: "pointer",
          background: isSel ? `${c.underline}1f` : "transparent",
          borderRadius: isSel ? 4 : 0,
          boxShadow: isSel ? `0 0 0 3px ${c.underline}1f` : "none",
          transition: "background .12s, box-shadow .12s",
        }}
      >
        {children}
      </span>
    );
  };

  return (
    <main style={{ padding: "24px 26px 30px", display: "grid", gridTemplateColumns: "minmax(0,1fr) 320px", gap: 24, alignItems: "start" }}>
      {/* ---- CENTER ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
        {/* breadcrumb row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <BackButton href="/" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / {data?.level ?? "Algorithms"}</div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "9px 15px", borderRadius: 12 }}>
            ✓ {verifiedPct}% verified
          </div>
        </div>

        {/* meta + section progress */}
        <div style={{ background: "#fff", borderRadius: 20, padding: "18px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 15, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>🧭</div>
            <div>
              <div style={{ font: "800 13px var(--font-nunito)", color: "#8b8699" }}>{data?.level ?? "Beginner"} · {data?.claimCount ?? 6} claims · {data?.sourceCount ?? 4} sources</div>
              <div style={{ font: "700 12px var(--font-nunito)", color: "#221f2e", marginTop: 2 }}>
                Trust: <span style={{ color: "#0e8c6b" }}>{verifiedCount} verified</span> · <span style={{ color: "#2d6cdf" }}>{sourcedCount} sourced</span> · <span style={{ color: "#c0392b" }}>{disputedCount} disputed</span>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <div style={{ display: "flex", justifyContent: "space-between", font: "700 11.5px var(--font-nunito)", color: "#8b8699", marginBottom: 6 }}>
              <span>Section 2 of 4</span>
              <span>50%</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: "#eee9f7", overflow: "hidden" }}>
              <div style={{ width: "50%", height: "100%", borderRadius: 5, background: "#6d5bd0" }} />
            </div>
          </div>
        </div>

        {/* tabs */}
        <WorkspaceTabs active="lecture" onTab={onTab} />

        {/* lecture reader */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          {/* section chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 22 }}>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#2e9c6a", background: "#e7f4ee", padding: "7px 13px", borderRadius: 11 }}>✓ Prereqs</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "7px 13px", borderRadius: 11 }}>§1 Core idea</span>
            <span style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "7px 13px", borderRadius: 11 }}>§2 Implementation</span>
            <span style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "7px 13px", borderRadius: 11 }}>§3 Limits</span>
          </div>

          <h2 style={{ font: "900 21px var(--font-nunito)", letterSpacing: "-.01em", margin: "0 0 14px" }}>The core idea: greedily grow the shortest-path tree</h2>
          <p style={{ font: "600 15px/1.85 var(--font-nunito)", color: "#3a3550", margin: "0 0 16px" }}>
            Dijkstra&apos;s algorithm finds the shortest path from a source node by repeatedly picking the{" "}
            {claimSpan("smallest", "unvisited node with the smallest tentative distance")}, then relaxing its neighbours. Each time a node is
            finalised, its shortest distance is {claimSpan("correct", "guaranteed to be correct")} — the greedy choice never has to be revised.
          </p>

          {/* highlighted disputed claim */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setSelected("anygraph")}
            onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setSelected("anygraph")}
            style={{
              background: "#fbeceb",
              borderLeft: "4px solid #c0392b",
              borderRadius: "0 14px 14px 0",
              padding: "14px 18px",
              margin: "0 0 18px",
              cursor: "pointer",
              boxShadow: selected === "anygraph" ? "0 0 0 3px rgba(192,57,43,.18)" : "none",
              transition: "box-shadow .12s",
            }}
          >
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#c0392b", marginBottom: 5 }}>⚠️ Disputed claim · the Skeptic flagged this</div>
            <div style={{ font: "700 14.5px/1.6 var(--font-nunito)", color: "#221f2e" }}>
              &quot;{data?.claims.find((c) => c.state === "disputed")?.text ?? "It works on any weighted graph."}&quot; — the Skeptic found no source that holds unconditionally.{" "}
              <button type="button" onClick={(e) => { e.stopPropagation(); onTab("conflicts"); }} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", color: "#c0392b", font: "800 14.5px var(--font-nunito)", textDecoration: "underline" }}>
                Tap Conflicts to resolve.
              </button>
            </div>
          </div>

          <p style={{ font: "600 15px/1.85 var(--font-nunito)", color: "#3a3550", margin: "0 0 22px" }}>
            The classic implementation uses a {claimSpan("pq", "priority queue keyed by tentative distance")}, giving an overall running time of
            O((V + E) log V).
          </p>

          {/* active listening prompt */}
          <div style={{ background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12px var(--font-nunito)", color: "#6d5bd0", marginBottom: 10 }}>🧠 Before you continue — one prompt to lock it in</div>
            <div style={{ font: "700 14.5px var(--font-nunito)", marginBottom: 10 }}>In your own words, why can the greedy choice never be wrong here?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input placeholder="Type your answer…" style={{ flex: 1, border: "1.5px solid #e3ddf6", borderRadius: 12, padding: "11px 14px", font: "600 14px var(--font-nunito)", background: "#fff", outline: "none" }} />
              <button style={{ border: "none", borderRadius: 12, background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "0 20px", cursor: "pointer", whiteSpace: "nowrap" }}>Submit</button>
            </div>
          </div>

          {/* gate + next */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>🔒 Answer the prompt to unlock the next section</div>
            <button style={{ border: "none", borderRadius: 13, background: "#e9e5f4", color: "#a29cb6", font: "800 14px var(--font-nunito)", padding: "12px 24px", cursor: "not-allowed", whiteSpace: "nowrap" }}>Next section →</button>
          </div>
        </div>
      </div>

      {/* ---- RIGHT: TRUST PANEL ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* section trust */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Section trust</div>
          <div style={{ height: 12, borderRadius: 6, overflow: "hidden", display: "flex", gap: 2, marginBottom: 14 }}>
            <span style={{ flex: execCount || 0.001, background: "#0e8c6b" }} />
            <span style={{ flex: backedCount || 0.001, background: "#2d6cdf" }} />
            <span style={{ flex: disputedCount || 0.001, background: "#c0392b" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
              <span style={{ width: 11, height: 11, borderRadius: 4, background: "#0e8c6b" }} />Verified by execution<span style={{ marginLeft: "auto", color: "#8b8699" }}>{execCount}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
              <span style={{ width: 11, height: 11, borderRadius: 4, background: "#2d6cdf" }} />Backed by a source<span style={{ marginLeft: "auto", color: "#8b8699" }}>{backedCount}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, font: "700 13px var(--font-nunito)" }}>
              <span style={{ width: 11, height: 11, borderRadius: 4, background: "#c0392b" }} />Disputed<span style={{ marginLeft: "auto", color: "#8b8699" }}>{disputedCount}</span>
            </div>
          </div>
        </div>

        {/* claim detail (interactive) */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#9a95a8", marginBottom: 10 }}>Selected claim</div>
          <div style={{ font: "700 15px/1.55 var(--font-nunito)", marginBottom: 14 }}>{claim.claim}</div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, font: "800 12px var(--font-nunito)", color: badge.color, background: badge.bg, padding: "6px 12px", borderRadius: 10, marginBottom: 14 }}>{badge.label}</div>
          {claim.source ? (
            <div style={{ background: "#f7f5fb", borderRadius: 14, padding: "13px 15px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>{claim.source.icon}</div>
                <div style={{ font: "800 12.5px var(--font-nunito)" }}>{claim.source.title}</div>
              </div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#6c6780" }}>{claim.source.desc}</div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onTab("conflicts")}
              style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "#fbeceb", border: "1px solid #f4d5d1", borderRadius: 14, padding: "13px 15px" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 6 }}>
                <div style={{ width: 30, height: 30, borderRadius: 9, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>⚠️</div>
                <div style={{ font: "800 12.5px var(--font-nunito)", color: "#c0392b" }}>No source backs this</div>
              </div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#a9564b" }}>The Skeptic flagged it — open Conflicts to add the missing constraint →</div>
            </button>
          )}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, font: "700 12.5px var(--font-nunito)" }}>
            <span style={{ color: "#8b8699" }}>Confidence</span>
            <span style={{ color: claim.confidenceColor }}>{claim.confidence}</span>
          </div>
        </div>

        {/* active listening checklist */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 14 }}>Active listening</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)" }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</span>Predict the section
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)" }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 12 }}>✓</span>Pause-point check
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)", color: "#6d5bd0" }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, border: "2px solid #6d5bd0", boxSizing: "border-box", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11 }}>3</span>Explain in your words
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", font: "700 13px var(--font-nunito)", color: "#b6b1c4" }}>
            <span style={{ width: 22, height: 22, borderRadius: 7, border: "2px solid #e0dced", boxSizing: "border-box" }} />Close the section
          </div>
        </div>
      </div>
    </main>
  );
}
