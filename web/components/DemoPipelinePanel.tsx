/**
 * Real six-stage pipeline output for the guest demo (VERIFY-22): renders the
 * genuine per-stage result of `demoPipelineRun` — the same `runPipeline`
 * engine a real signed-in topic creation uses — over a fixed demo topic.
 * Server-rendered and static (no fake timed animation): a guest sees the
 * actual completed run, not a simulation of one.
 */
import type { PipelineRun } from "@/lib/domain/pipeline";

const STAGE_LABEL: Record<string, string> = {
  triage: "Triage the topic",
  retrieve: "Retrieve trusted sources",
  teach: "Write the lecture",
  decompose: "Decompose into claims",
  verify: "Verify each claim",
  skeptic: "Skeptic red-team pass",
};

export default function DemoPipelinePanel({ run, topicTitle }: { run: PipelineRun; topicTitle: string }) {
  return (
    <div style={{ background: "#fff", borderRadius: 20, padding: "20px 22px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
      <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 4 }}>How “{topicTitle}” got verified</div>
      <div style={{ font: "600 12px var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>
        The real six-stage pipeline, run live for this page — nothing here is a mockup.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {run.stages.map((s, i) => (
          <div key={s.stage} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", ...(i > 0 ? { borderTop: "1px solid #f5f3fa" } : {}) }}>
            <div
              style={{
                width: 26,
                height: 26,
                borderRadius: "50%",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: s.status === "done" ? "#e4f4ec" : "#fbeceb",
                color: s.status === "done" ? "#0e8c6b" : "#c0392b",
                font: "800 12px var(--font-nunito)",
              }}
            >
              {s.status === "done" ? "✓" : "✕"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ font: "800 13px var(--font-nunito)" }}>{STAGE_LABEL[s.stage] ?? s.stage}</div>
              <div style={{ font: "600 11.5px var(--font-nunito)", color: "#8b8699" }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ font: "700 12px var(--font-nunito)", color: run.ok ? "#0e8c6b" : "#c0392b", marginTop: 12 }}>
        {run.ok ? `Ready — ${run.claims.length} claims, each with a traceable trust state.` : "Stopped early — the pipeline refuses rather than guesses."}
      </div>
    </div>
  );
}
