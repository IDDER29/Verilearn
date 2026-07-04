import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { getDueCards } from "@/lib/services/review";
import { getDb } from "@/lib/store/db";
import { now } from "@/lib/ids";
import type { TaskRecord } from "@/lib/store/entities";

export const metadata = { title: "My Tasks · VeriLearn" };

function taskStatus(t: TaskRecord): { label: string; color: string; bg: string; kind: "todo" | "revise" | "done" } {
  if (t.passed === true) return { label: "Passed", color: "#2e9c6a", bg: "#e4f4ec", kind: "done" };
  if (t.passed === false) return { label: `Revise · ${t.scorePct ?? 0}%`, color: "#b4830f", bg: "#fbefdd", kind: "revise" };
  return { label: "To do", color: "#9a95a8", bg: "#f3f1f9", kind: "todo" };
}

function TaskRow({ t, title, done }: { t: TaskRecord; title: string; done?: boolean }) {
  const st = taskStatus(t);
  return (
    <Link
      href={`/topics/tasks?topic=${t.topicId}`}
      style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", marginBottom: 10, textDecoration: "none", color: "inherit", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)", opacity: done ? 0.7 : 1 }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 13, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ font: "800 14px var(--font-nunito)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...(done ? { textDecoration: "line-through", color: "#8b8699" } : {}) }}>{t.prompt}</div>
        <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>{title}</div>
      </div>
      <span style={{ font: "800 11px var(--font-nunito)", color: st.color, background: st.bg, padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>{st.label}</span>
    </Link>
  );
}

export default async function MyTasksPage() {
  const user = await requireUser();
  const db = getDb();
  const dueCount = getDueCards(user.id, now()).length;
  const conflictCount = listTopicSummaries(user.id).reduce((n, t) => n + t.disputes, 0);

  const tasks = [...db.tasks.values()].filter((t) => t.userId === user.id);
  const title = (topicId: string) => db.topics.get(topicId)?.title ?? "Topic";
  const revise = tasks.filter((t) => t.passed === false);
  const todo = tasks.filter((t) => t.passed === undefined);
  const done = tasks.filter((t) => t.passed === true);
  const total = tasks.length;
  const ringDeg = total ? Math.round((done.length / total) * 360) : 0;

  return (
    <AppShell active="tasks">
      <main
        style={{
          padding: "24px 26px 30px",
          display: "grid",
          gridTemplateColumns: "minmax(0,1fr) 300px",
          gap: 22,
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20, minWidth: 0 }}>
          <div>
            <div style={{ font: "900 24px var(--font-nunito)", letterSpacing: "-.02em" }}>My tasks ✍️</div>
            <div style={{ font: "600 13px var(--font-nunito)", color: "#8b8699", marginTop: 2 }}>Everything waiting on you, across all topics.</div>
          </div>

          {/* filter chips — real counts */}
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "8px 15px", borderRadius: 11 }}>All · {total}</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>To do · {todo.length}</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>Revise · {revise.length}</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>Done · {done.length}</span>
          </div>

          {/* due today: real review + conflict work */}
          {(dueCount > 0 || conflictCount > 0) && (
            <div>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#c0392b", marginBottom: 10 }}>Due today</div>
              {dueCount > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", marginBottom: 10, boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "#fbeadf", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📼</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 14px var(--font-nunito)" }}>{dueCount} flashcard{dueCount === 1 ? "" : "s"} due for review</div>
                    <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Spaced repetition</div>
                  </div>
                  <Link href="/review" style={{ textDecoration: "none", font: "800 11px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap" }}>Start</Link>
                </div>
              )}
              {conflictCount > 0 && (
                <Link href="/topics/conflicts" style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", textDecoration: "none", color: "inherit", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⚖️</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ font: "800 14px var(--font-nunito)" }}>Resolve {conflictCount} conflict{conflictCount === 1 ? "" : "s"}</div>
                    <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Across your topics</div>
                  </div>
                  <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>{conflictCount} open</span>
                </Link>
              )}
            </div>
          )}

          {/* needs revision */}
          {revise.length > 0 && (
            <div>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#b4830f", marginBottom: 10 }}>Needs revision</div>
              {revise.map((t) => <TaskRow key={t.id} t={t} title={title(t.topicId)} />)}
            </div>
          )}

          {/* to do */}
          {todo.length > 0 && (
            <div>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 10 }}>To do</div>
              {todo.map((t) => <TaskRow key={t.id} t={t} title={title(t.topicId)} />)}
            </div>
          )}

          {/* completed */}
          {done.length > 0 && (
            <div>
              <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 10 }}>Completed</div>
              {done.map((t) => <TaskRow key={t.id} t={t} title={title(t.topicId)} done />)}
            </div>
          )}

          {total === 0 && dueCount === 0 && conflictCount === 0 && (
            <div style={{ background: "#fff", borderRadius: 16, padding: "26px 20px", textAlign: "center", font: "600 13px var(--font-nunito)", color: "#8b8699", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              You&apos;re all caught up — nothing waiting across your topics.
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14, textAlign: "left" }}>Task progress</div>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: `conic-gradient(#6d5bd0 ${ringDeg}deg,#eee9f7 0)` }} />
              <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ font: "900 22px var(--font-nunito)" }}>{done.length}/{total}</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>passed</div>
              </div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 20, padding: 20, color: "#fff" }}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>✍️ Rubric-graded practice</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#c9c3d8" }}>
              {revise.length + todo.length > 0
                ? `${revise.length + todo.length} task${revise.length + todo.length === 1 ? "" : "s"} left — each is scored against its rubric before it counts.`
                : "Every task is passed. Your transfer signal reflects this on Progress."}
            </div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
