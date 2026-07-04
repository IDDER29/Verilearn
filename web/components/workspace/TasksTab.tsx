"use client";

/**
 * Topic Workspace — Tasks tab. The "produce" step of the learning loop:
 * a write-in answer is graded against a source-anchored rubric (each criterion
 * traces to a canonical source), ≥75% to pass, revise-to-pass.
 * Traces to TASK-04 (source-traced rubric), TASK.
 */

import { useEffect, useState } from "react";
import { getTasksAction, gradeTaskAction } from "@/app/task-actions";
import WorkspaceTabs from "./WorkspaceTabs";
import type { TabKey, WorkspaceData } from "./types";

type TaskView = Awaited<ReturnType<typeof getTasksAction>>[number];
type Grade = { scorePct: number; passed: boolean; hitIds: string[]; missingIds: string[] };

const PASS_BAR = 75;

export default function TasksTab({ onTab, data = null }: { onTab: (t: TabKey) => void; data?: WorkspaceData | null }) {
  const [tasks, setTasks] = useState<TaskView[] | null>(data?.topicId ? null : []);
  const [task, setTask] = useState<TaskView | null>(null);
  const [answer, setAnswer] = useState("");
  const [grade, setGrade] = useState<Grade | null>(null);
  const [grading, setGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // On mount, load the topic's tasks and seed state from the first one.
  useEffect(() => {
    const topicId = data?.topicId;
    if (!topicId) return;
    getTasksAction(topicId).then((ts) => {
      setTasks(ts);
      const first = ts[0] ?? null;
      setTask(first);
      if (first) {
        setAnswer(first.submittedAnswer ?? "");
        if (first.scorePct !== undefined && first.passed !== undefined) {
          setGrade({ scorePct: first.scorePct, passed: first.passed, hitIds: first.hit, missingIds: first.missing });
        }
      }
    });
  }, [data?.topicId]);

  async function submit() {
    if (!task || !answer.trim() || grading) return;
    setGrading(true);
    setError(null);
    const r = await gradeTaskAction(task.id, answer);
    setGrading(false);
    if (!r.ok) {
      setError(r.error ?? "Could not grade your answer.");
      return;
    }
    const hitIds = r.hitIds ?? [];
    const missingIds = r.missingIds ?? [];
    setGrade({ scorePct: r.scorePct ?? 0, passed: r.passed ?? false, hitIds, missingIds });
    setTasks((prev) =>
      prev
        ? prev.map((t) =>
            t.id === task.id
              ? { ...t, submittedAnswer: answer, scorePct: r.scorePct, passed: r.passed, hit: hitIds, missing: missingIds }
              : t,
          )
        : prev,
    );
  }

  const criteria = task?.criteria ?? [];
  const isHit = (id: string) => (grade ? grade.hitIds.includes(id) : false);
  const sourceLabel = [...new Set(criteria.map((c) => c.sourceId))].join(" · ");

  // Right-column progress derived from real task states.
  const list = tasks ?? [];
  const total = list.length;
  const passedCount = list.filter((t) => t.passed).length;
  const reviseCount = list.filter((t) => t.scorePct !== undefined && !t.passed).length;
  const todoCount = list.filter((t) => t.scorePct === undefined).length;
  const ringPct = total ? passedCount / total : 0;
  const ringOffset = 352 * (1 - ringPct);

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
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>{data?.title ?? "Dijkstra’s algorithm"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, font: "800 12.5px var(--font-nunito)", color: "#9a7f2a", background: "#fbefdd", padding: "9px 15px", borderRadius: 12 }}>
            ✍️ {passedCount} of {total} tasks passed
          </div>
        </div>

        {/* tabs */}
        <WorkspaceTabs active="tasks" onTab={onTab} />

        {/* active task */}
        <div style={{ background: "#fff", borderRadius: 22, padding: "26px 30px", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          {tasks === null ? (
            <div style={{ font: "700 14px var(--font-nunito)", color: "#8b8699" }}>Loading your task…</div>
          ) : !task ? (
            <div style={{ font: "700 14px var(--font-nunito)", color: "#8b8699" }}>No tasks yet for this topic — they appear once the topic is built.</div>
          ) : (
            <>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#6d5bd0", marginBottom: 8 }}>
                Task · {task.type === "explain" ? "Explain" : task.type === "apply" ? "Apply" : "Reason"}
              </div>
              <h2 style={{ font: "900 20px/1.35 var(--font-nunito)", letterSpacing: "-.01em", margin: "0 0 18px" }}>{task.prompt}</h2>

              {/* write-in answer */}
              <div style={{ font: "800 11px var(--font-nunito)", color: "#9a95a8", marginBottom: 8 }}>YOUR ANSWER</div>
              <textarea
                rows={5}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Explain it in your own words…"
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  background: "#f7f5fb",
                  border: "1.5px solid #ece8f4",
                  borderRadius: 14,
                  padding: "15px 17px",
                  font: "600 14.5px/1.7 var(--font-nunito)",
                  color: "#3a3550",
                  outline: "none",
                  resize: "vertical",
                  marginBottom: 18,
                }}
              />

              {error && (
                <div style={{ font: "700 13px var(--font-nunito)", color: "#c0392b", marginBottom: 14 }}>{error}</div>
              )}

              {/* grade */}
              {grade && (
                <div style={{ background: grade.passed ? "#e4f4ec" : "#fbefdd", borderRadius: 16, padding: "16px 18px", marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9, font: "900 15px var(--font-nunito)", color: grade.passed ? "#0e8c6b" : "#9a7f2a" }}>
                      {grade.passed ? "✅ Passed" : "🟡 Not yet a pass"}
                    </div>
                    <div style={{ font: "900 18px var(--font-nunito)", color: grade.passed ? "#0e8c6b" : "#9a7f2a" }}>{grade.scorePct}%</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                    {criteria.map((c) =>
                      isHit(c.id) ? (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, font: "700 13.5px var(--font-nunito)" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 7, background: "#0e8c6b", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, flexShrink: 0 }}>✓</span>
                          {c.text}
                        </div>
                      ) : (
                        <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10, font: "700 13.5px var(--font-nunito)", color: "#9a95a8" }}>
                          <span style={{ width: 20, height: 20, borderRadius: 7, border: "2px solid #d8c9a3", boxSizing: "border-box", flexShrink: 0 }} />
                          Missing: <b style={{ color: "#3a3550" }}>{c.text}</b>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}

              {/* revise-to-pass */}
              {grade && !grade.passed && (
                <div style={{ background: "#f2effc", border: "1.5px solid #e3ddf6", borderRadius: 16, padding: "16px 18px", marginBottom: 22 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, font: "800 12px var(--font-nunito)", color: "#6d5bd0", marginBottom: 8 }}>💡 Revise to pass</div>
                  <div style={{ font: "700 14.5px var(--font-nunito)" }}>
                    You&apos;re at {grade.scorePct}% — you need ≥ {PASS_BAR}%. Fold the missing points into your answer above and resubmit.
                  </div>
                </div>
              )}

              {/* actions */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, paddingTop: 18, borderTop: "1px solid #f0edf6" }}>
                <span style={{ font: "700 13px var(--font-nunito)", color: "#9a95a8" }}>Model answer unlocks at a pass (≥ {PASS_BAR}%)</span>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    disabled={!grade?.passed}
                    style={{ border: "1.5px solid #ece8f4", background: "#fbfafd", color: "#6c6780", font: "800 13.5px var(--font-nunito)", padding: "11px 20px", borderRadius: 13, cursor: grade?.passed ? "pointer" : "not-allowed", opacity: grade?.passed ? 1 : 0.55 }}
                  >
                    See model answer
                  </button>
                  <button
                    type="button"
                    onClick={submit}
                    disabled={grading || !answer.trim()}
                    style={{ border: "none", background: "#6d5bd0", color: "#fff", font: "800 13.5px var(--font-nunito)", padding: "11px 22px", borderRadius: 13, cursor: grading || !answer.trim() ? "not-allowed" : "pointer", boxShadow: "0 10px 22px -8px rgba(109,91,208,.7)", opacity: grading || !answer.trim() ? 0.7 : 1 }}
                  >
                    {grading ? "Grading…" : grade ? "Revise & resubmit" : "Submit answer"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---- RIGHT ---- */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {/* progress */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)", textAlign: "center" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 16, textAlign: "left" }}>Task progress</div>
          <div style={{ position: "relative", width: 132, height: 132, margin: "0 auto 8px" }}>
            <svg width="132" height="132" viewBox="0 0 132 132" style={{ transform: "rotate(-90deg)" }}>
              <circle cx="66" cy="66" r="56" fill="none" stroke="#eee9f7" strokeWidth="14" />
              <circle cx="66" cy="66" r="56" fill="none" stroke="#6d5bd0" strokeWidth="14" strokeLinecap="round" strokeDasharray="352" strokeDashoffset={ringOffset} />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <div style={{ font: "900 26px var(--font-nunito)" }}>{passedCount}/{total}</div>
              <div style={{ font: "700 11px var(--font-nunito)", color: "#8b8699" }}>passed</div>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, font: "700 12px var(--font-nunito)", marginTop: 6 }}>
            <span style={{ color: "#2e9c6a" }}>● {passedCount} passed</span>
            <span style={{ color: "#9a7f2a" }}>● {reviseCount} revise</span>
            <span style={{ color: "#9a95a8" }}>● {todoCount} to do</span>
          </div>
        </div>

        {/* rubric */}
        <div style={{ background: "#fff", borderRadius: 22, padding: 22, boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
          <div style={{ font: "900 16px var(--font-nunito)", marginBottom: 6 }}>How it&apos;s graded</div>
          <div style={{ font: "600 12.5px/1.6 var(--font-nunito)", color: "#8b8699", marginBottom: 14 }}>Your answer is scored against a rubric built from the topic&apos;s verified sources — not a keyword match.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {criteria.length === 0 ? (
              <div style={{ font: "700 12.5px var(--font-nunito)", color: "#9a95a8" }}>Rubric appears with the task.</div>
            ) : (
              criteria.map((c) => {
                const hit = isHit(c.id);
                return (
                  <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, font: "700 12.5px/1.4 var(--font-nunito)", color: hit || !grade ? undefined : "#9a95a8" }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: hit || !grade ? "#0e8c6b" : "#d8c9a3", marginTop: 3, flexShrink: 0 }} />
                    {c.text}
                  </div>
                );
              })
            )}
          </div>
          {sourceLabel && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0edf6", font: "700 12px var(--font-nunito)", color: "#8b8699" }}>
              Source · <span style={{ color: "#2d6cdf" }}>{sourceLabel}</span>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
