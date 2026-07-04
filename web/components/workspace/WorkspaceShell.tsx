"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LectureTab from "./LectureTab";
import TasksTab from "./TasksTab";
import ConflictsTab from "./ConflictsTab";
import SourcesTab from "./SourcesTab";
import type { TabKey, WorkspaceData } from "./types";

/**
 * The Topic Workspace. Holds the active tab in client state and swaps the tab
 * body in place — the sidebar/shell never re-render, and switching is instant.
 * Each route (/topics, /topics/tasks, …) mounts this with a different `initial`
 * tab so deep links still land on the right tab. `data` carries the real topic's
 * ledger-computed aggregates.
 */
export default function WorkspaceShell({ initial = "lecture", data = null }: { initial?: TabKey; data?: WorkspaceData | null }) {
  const [tab, setTab] = useState<TabKey>(initial);
  return (
    <AppShell active="topics">
      {tab === "lecture" && <LectureTab onTab={setTab} data={data} />}
      {tab === "tasks" && <TasksTab onTab={setTab} data={data} />}
      {tab === "conflicts" && <ConflictsTab onTab={setTab} data={data} />}
      {tab === "sources" && <SourcesTab onTab={setTab} data={data} />}
    </AppShell>
  );
}
