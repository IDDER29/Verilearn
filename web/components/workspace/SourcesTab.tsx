"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import WorkspaceTabs from "./WorkspaceTabs";
import type { TabKey, WorkspaceData } from "./types";
import type { TrustState } from "@/lib/domain/types";
import { addSourceAction, removeSourceAction, setPreferredSourceAction } from "@/app/source-actions";

/** One matrix cell coloured by how (if at all) a source backs the claim. */
function Cell({ filled, state, rowUnsupported }: { filled: boolean; state: TrustState | null; rowUnsupported: boolean }) {
  if (filled) {
    const bg = state === "verified_execution" ? "#0e8c6b" : "#2d6cdf";
    return (
      <span style={{ height: 36, borderRadius: 11, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </span>
    );
  }
  if (rowUnsupported) return <span style={{ height: 36, borderRadius: 11, background: "#fff", border: "1.5px dashed #e3b4af" }} />;
  return <span style={{ height: 36, borderRadius: 11, background: "#f1eff5" }} />;
}

const KIND_LABEL: Record<string, string> = {
  textbook: "Textbook",
  book: "Textbook",
  execution: "Verified by run",
  sandbox: "Verified by run",
  paper: "Paper",
  web: "Added source",
  docs: "Docs",
};

function SourceIcon({ kind }: { kind: string }) {
  if (kind === "execution" || kind === "sandbox") {
    return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
        <path d="M7 9.5l3 3-3 3M13 15.5h4" />
      </svg>
    );
  }
  if (kind === "web" || kind === "docs") {
    return (
      <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M3.2 9h17.6M3.2 15h17.6M12 3a15 15 0 010 18M12 3a15 15 0 000 18" />
      </svg>
    );
  }
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 5.5A1.5 1.5 0 015.5 4H11v15H5.5A1.5 1.5 0 014 17.5z" />
      <path d="M20 5.5A1.5 1.5 0 0018.5 4H13v15h5.5a1.5 1.5 0 001.5-1.5z" />
    </svg>
  );
}

function isUnsupportedRow(state: TrustState): boolean {
  return state === "disputed" || state === "unsupported";
}

export default function SourcesTab({ onTab, data = null }: { onTab: (t: TabKey) => void; data?: WorkspaceData | null }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [ref, setRef] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const cov = data?.coverage ?? null;
  const coveragePct = cov?.coveragePercent ?? 0;
  const backed = cov?.backedCount ?? 0;
  const total = data?.claimCount ?? 0;
  const unsupported = total - backed;
  const unsupportedRow = cov?.rows.find((r) => isUnsupportedRow(r.state));
  const unsupportedText = unsupportedRow?.claimText ?? data?.disputedClaims[0]?.text ?? "";
  const sources = cov?.sources ?? [];
  const gridCols = `minmax(0,1fr) ${sources.map(() => "64px").join(" ")}`;

  async function attach() {
    if (!data || !unsupportedRow || title.trim().length === 0) return;
    setSaving(true);
    setErr(null);
    const r = await addSourceAction(data.topicId, unsupportedRow.claimId, title, ref);
    setSaving(false);
    if (r.ok) {
      setTitle("");
      setRef("");
      router.refresh();
    } else {
      setErr(r.error ?? "Couldn't attach the source.");
    }
  }

  async function prefer(sourceId: string) {
    if (!data) return;
    const r = await setPreferredSourceAction(data.topicId, sourceId);
    if (r.ok) router.refresh();
  }

  async function remove(sourceId: string, backs: number) {
    if (!data) return;
    if (backs > 0 && !window.confirm(`This source backs ${backs} claim${backs === 1 ? "" : "s"}. Removing it will fail-close ${backs === 1 ? "that claim" : "those claims"} to unsupported until re-backed. Remove it?`)) return;
    const r = await removeSourceAction(data.topicId, sourceId);
    if (r.ok) router.refresh();
  }

  return (
    <main style={{ padding: "24px 26px 30px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <button
          type="button"
          onClick={() => onTab("lecture")}
          style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 18px -10px rgba(80,60,140,.25)", flexShrink: 0, border: "none", padding: 0, cursor: "pointer" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a4560" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: "700 12px var(--font-nunito)", color: "#9a95a8" }}>Topics / {data?.level ?? "Algorithms"}</div>
          <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{data?.title ?? "Topic"}</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12.5px var(--font-nunito)", color: "#3a63b0", background: "#e3ecfb", padding: "9px 15px", borderRadius: 12 }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 007 0l2-2a5 5 0 00-7-7l-1 1M14 11a5 5 0 00-7 0l-2 2a5 5 0 007 7l1-1" />
          </svg>
          {data?.sourceCount ?? sources.length} sources · {total} claims
        </div>
      </div>

      {/* tabs */}
      <WorkspaceTabs active="sources" onTab={onTab} />

      {/* source summary strip — real sources + backs-count */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, sources.length)},1fr)`, gap: 14 }}>
        {sources.length === 0 && (
          <div style={{ background: "#faf9fc", borderRadius: 18, padding: "16px 18px", font: "600 12.5px var(--font-nunito)", color: "#8b8699" }}>No sources on this topic yet.</div>
        )}
        {sources.map((s) => (
          <div key={s.id} style={{ background: "#eef7f1", borderRadius: 18, padding: "16px 18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ width: 42, height: 42, borderRadius: 13, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <SourceIcon kind={s.kind} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ font: "800 13.5px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.title}</div>
                <div style={{ font: "700 11px var(--font-nunito)", color: "#2e9c6a" }}>{KIND_LABEL[s.kind] ?? s.kind}</div>
              </div>
            </div>
            <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>
              Backs {cov?.backsBySource[s.id] ?? 0} claim{(cov?.backsBySource[s.id] ?? 0) === 1 ? "" : "s"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,.06)" }}>
              {s.preferred ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, font: "800 10.5px var(--font-nunito)", color: "#6d5bd0" }}>★ Preferred</span>
              ) : (
                <button type="button" onClick={() => prefer(s.id)} style={{ border: "none", background: "none", padding: 0, cursor: "pointer", font: "800 10.5px var(--font-nunito)", color: "#8b8699" }}>☆ Prefer</button>
              )}
              <button type="button" onClick={() => remove(s.id, cov?.backsBySource[s.id] ?? 0)} style={{ marginLeft: "auto", border: "none", background: "none", padding: 0, cursor: "pointer", font: "800 10.5px var(--font-nunito)", color: "#c0392b" }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {/* coverage matrix */}
      <div style={{ background: "#fff", borderRadius: 24, padding: "26px 28px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 20 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ font: "900 19px var(--font-nunito)", letterSpacing: "-.01em", whiteSpace: "nowrap" }}>Coverage map</div>
            <div style={{ font: "600 13px/1.5 var(--font-nunito)", color: "#8b8699", marginTop: 3 }}>Which source backs each claim. Empty rows are the claims to worry about.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, font: "800 12px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "9px 14px", borderRadius: 12, whiteSpace: "nowrap", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 4l9 15.5H3z" />
              <path d="M12 10v4M12 17h.01" />
            </svg>
            {unsupported} unsupported
          </div>
        </div>

        {/* column headers — real sources */}
        <div style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "end", marginBottom: 8 }}>
          <span style={{ font: "800 10.5px var(--font-nunito)", letterSpacing: ".05em", textTransform: "uppercase", color: "#a7a1b8" }}>Claim</span>
          {sources.map((s) => (
            <div key={s.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }} title={s.title}>
              <SourceIcon kind={s.kind} />
              <span style={{ font: "800 10px var(--font-nunito)", color: "#6c6780", maxWidth: 64, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.title}</span>
            </div>
          ))}
        </div>

        {/* rows — real coverage */}
        {(cov?.rows ?? []).map((r) => {
          const unsup = isUnsupportedRow(r.state);
          return (
            <div
              key={r.claimId}
              style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", padding: "11px 12px", borderRadius: 14, marginBottom: 8, ...(unsup ? { background: "#fdf2f1", border: "1.5px solid #f3d9d6" } : { background: "#faf9fc" }) }}
            >
              <span style={{ font: unsup ? "800 13.5px var(--font-nunito)" : "700 13.5px var(--font-nunito)", color: unsup ? "#c0392b" : "#221f2e", display: "flex", alignItems: "center", gap: 7, minWidth: 0 }}>
                {unsup && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <path d="M12 4l9 15.5H3z" />
                    <path d="M12 10v4M12 17h.01" />
                  </svg>
                )}
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.claimText}</span>
              </span>
              {r.cells.map((c) => (
                <Cell key={c.sourceId} filled={c.filled} state={c.state} rowUnsupported={unsup} />
              ))}
            </div>
          );
        })}

        {/* legend */}
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", marginTop: 18, paddingTop: 16, borderTop: "1px solid #f0edf6", font: "700 12px var(--font-nunito)", color: "#6c6780" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 15, height: 15, borderRadius: 5, background: "#0e8c6b" }} />Verified by execution
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 15, height: 15, borderRadius: 5, background: "#2d6cdf" }} />Backed by a source
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <span style={{ width: 15, height: 15, borderRadius: 5, background: "#fff", border: "1.5px dashed #e3b4af" }} />Unsupported
          </span>
        </div>
      </div>

      {/* bottom row: unsupported action + coverage health */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "stretch" }}>
        {/* unsupported spotlight */}
        {unsupported > 0 ? (
          <div style={{ background: "#221d2e", borderRadius: 24, padding: "24px 26px", color: "#fff", position: "relative", overflow: "hidden", display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(120% 140% at 90% 10%,rgba(192,57,43,.32),transparent 55%)" }} />
            <div style={{ position: "relative", width: 56, height: 56, borderRadius: 17, background: "rgba(255,255,255,.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f0a99f" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 4l9 15.5H3z" />
                <path d="M12 10v4M12 17h.01" />
              </svg>
            </div>
            <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#f0a99f", marginBottom: 5 }}>{unsupported} unsupported claim{unsupported === 1 ? "" : "s"}</div>
              <div style={{ font: "800 16px/1.4 var(--font-nunito)" }}>&quot;{unsupportedText}&quot; isn&apos;t backed by any source.</div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#c9c3d8", marginTop: 5 }}>The Skeptic flagged it — resolve the dispute to correct or qualify the claim.</div>
            </div>
            <button
              type="button"
              onClick={() => onTab("conflicts")}
              style={{ position: "relative", display: "flex", alignItems: "center", gap: 7, background: "#fff", color: "#221f2e", font: "800 13.5px var(--font-nunito)", padding: "12px 20px", borderRadius: 13, whiteSpace: "nowrap", flexShrink: 0, border: "none", cursor: "pointer" }}
            >
              Resolve in Conflicts
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        ) : (
          <div style={{ background: "#eef7f1", borderRadius: 24, padding: "24px 26px", display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 17, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12.5l2.5 2.5L16 9.5" />
              </svg>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 4 }}>Every claim is backed</div>
              <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#3d8763" }}>No unsupported claims — the whole topic rests on resolvable evidence.</div>
            </div>
          </div>
        )}

        {/* coverage health */}
        <div style={{ background: "#fff", borderRadius: 24, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ position: "relative", width: 88, height: 88, flexShrink: 0 }}>
            <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="44" cy="44" r="36" fill="none" stroke="#eee9f7" strokeWidth="11" />
              <circle cx="44" cy="44" r="36" fill="none" stroke="#0e8c6b" strokeWidth="11" strokeLinecap="round" strokeDasharray="226" strokeDashoffset={Math.round(226 * (1 - coveragePct / 100))} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ font: "900 20px var(--font-nunito)" }}>{coveragePct}%</div>
              <div style={{ font: "700 9.5px var(--font-nunito)", color: "#8b8699" }}>coverage</div>
            </div>
          </div>
          <div>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 4 }}>Coverage health</div>
            <div style={{ font: "600 12.5px/1.55 var(--font-nunito)", color: "#6c6780" }}>{backed} of {total} claims are backed by at least one source.</div>
          </div>
        </div>
      </div>

      {/* attach a source to the unsupported claim (TRUST-09) */}
      {unsupported > 0 && unsupportedRow && (
        <div style={{ background: "#fff", borderRadius: 24, padding: "24px 26px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 17px var(--font-nunito)", marginBottom: 4 }}>Attach a source</div>
          <div style={{ font: "600 12.5px/1.5 var(--font-nunito)", color: "#8b8699", marginBottom: 16 }}>
            Back &quot;{unsupportedRow.claimText}&quot; with a reference. It moves to <b>sourced</b> — the trust firewall means you provide the citation, the verifier records the state.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 12, alignItems: "start" }}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Source title (e.g. CLRS §24.3)"
              aria-label="Source title"
              style={{ boxSizing: "border-box", width: "100%", border: "1.5px solid #ece8f4", borderRadius: 12, padding: "11px 13px", font: "600 14px var(--font-nunito)", background: "#fbfafd", outline: "none" }}
            />
            <input
              type="text"
              value={ref}
              onChange={(e) => setRef(e.target.value)}
              placeholder="Reference / URL (optional)"
              aria-label="Source reference"
              style={{ boxSizing: "border-box", width: "100%", border: "1.5px solid #ece8f4", borderRadius: 12, padding: "11px 13px", font: "600 14px var(--font-nunito)", background: "#fbfafd", outline: "none" }}
            />
            <button
              type="button"
              onClick={attach}
              disabled={saving || title.trim().length === 0}
              style={{ border: "none", background: title.trim().length === 0 ? "#cdc6e8" : "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 22px", borderRadius: 12, cursor: saving || title.trim().length === 0 ? "default" : "pointer", whiteSpace: "nowrap" }}
            >
              {saving ? "Attaching…" : "Attach & back"}
            </button>
          </div>
          {err && <div style={{ font: "700 12px var(--font-nunito)", color: "#c0392b", marginTop: 10 }}>{err}</div>}
        </div>
      )}
    </main>
  );
}
