import Link from "next/link";
import AppShell from "@/components/AppShell";
import { requireUser } from "@/lib/auth/current";
import { listTopicSummaries } from "@/lib/services/topics";
import { getDueCards } from "@/lib/services/review";
import { now } from "@/lib/ids";

export const metadata = { title: "My Tasks · VeriLearn" };

export default async function MyTasksPage() {
  const user = await requireUser();
  const dueCount = getDueCards(user.id, now()).length;
  const conflictCount = listTopicSummaries(user.id).reduce((n, t) => n + t.disputes, 0);
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

          {/* filter chips */}
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "8px 15px", borderRadius: 11 }}>All · 7</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>To do · 3</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>Revise · 2</span>
            <span style={{ font: "800 12px var(--font-nunito)", color: "#6c6780", background: "#fff", padding: "8px 15px", borderRadius: 11, boxShadow: "0 6px 16px -12px rgba(80,60,140,.3)" }}>Done · 2</span>
          </div>

          {/* overdue group */}
          <div>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#c0392b", marginBottom: 10 }}>Due today</div>
            <Link href="/topics/tasks" style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", marginBottom: 10, textDecoration: "none", color: "inherit", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#efe9ff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#6d5bd0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M8 6l-5 6 5 6M16 6l5 6-5 6" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Explain why Dijkstra fails on negative edges</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Dijkstra&apos;s algorithm · Task 1</div>
              </div>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#b4830f", background: "#fbefdd", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>Revise · 60%</span>
            </Link>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#fbeadf", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📼</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>{dueCount} flashcard{dueCount === 1 ? "" : "s"} due for review</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Spaced repetition</div>
              </div>
              <Link href="/review" style={{ textDecoration: "none", font: "800 11px var(--font-nunito)", color: "#fff", background: "#6d5bd0", padding: "8px 14px", borderRadius: 10, whiteSpace: "nowrap" }}>Start</Link>
            </div>
          </div>

          {/* upcoming */}
          <div>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 10 }}>This week</div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", marginBottom: 10, boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#fbefdd", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>⚖️</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Resolve {conflictCount} conflict{conflictCount === 1 ? "" : "s"}</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Across your topics</div>
              </div>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#c0392b", background: "#fbeceb", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>{conflictCount} open</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#eef2fb", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#3a63b0" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
                  <path d="M12 12l8-4.5M12 12v9M12 12L4 7.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)" }}>Trace the queue on a sample graph</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Dijkstra&apos;s algorithm · Task 2</div>
              </div>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#9a95a8", background: "#f3f1f9", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>To do</span>
            </div>
          </div>

          {/* done */}
          <div>
            <div style={{ font: "800 11px var(--font-nunito)", letterSpacing: ".06em", textTransform: "uppercase", color: "#a7a1b8", marginBottom: 10 }}>Completed</div>
            <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", borderRadius: 16, padding: "15px 17px", opacity: 0.7, boxShadow: "0 8px 22px -16px rgba(80,60,140,.3)" }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: "#e7f4ee", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="#2e9c6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ font: "800 14px var(--font-nunito)", textDecoration: "line-through", color: "#8b8699" }}>Pick the right data structure</div>
                <div style={{ font: "700 11.5px var(--font-nunito)", color: "#8b8699" }}>Dijkstra&apos;s algorithm · Task 3</div>
              </div>
              <span style={{ font: "800 11px var(--font-nunito)", color: "#2e9c6a", background: "#e4f4ec", padding: "6px 12px", borderRadius: 10, whiteSpace: "nowrap" }}>Passed</span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 22, textAlign: "center", boxShadow: "0 10px 30px -18px rgba(80,60,140,.28)" }}>
            <div style={{ font: "900 15px var(--font-nunito)", marginBottom: 14, textAlign: "left" }}>This week</div>
            <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto" }}>
              <div style={{ width: 120, height: 120, borderRadius: "50%", background: "conic-gradient(#6d5bd0 103deg,#eee9f7 0)" }} />
              <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <div style={{ font: "900 22px var(--font-nunito)" }}>2/7</div>
                <div style={{ font: "700 10px var(--font-nunito)", color: "#8b8699" }}>done</div>
              </div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(160deg,#221d2e,#3a3550)", borderRadius: 20, padding: 20, color: "#fff" }}>
            <div style={{ font: "900 14px var(--font-nunito)", marginBottom: 8 }}>🔥 6-day streak</div>
            <div style={{ font: "600 12px/1.55 var(--font-nunito)", color: "#c9c3d8" }}>Clear today&apos;s tasks to keep it alive. Two quick wins left.</div>
          </div>
        </div>
      </main>
    </AppShell>
  );
}
