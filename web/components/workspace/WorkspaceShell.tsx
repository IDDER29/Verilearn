"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";
import LectureTab from "./LectureTab";
import TasksTab from "./TasksTab";
import ConflictsTab from "./ConflictsTab";
import SourcesTab from "./SourcesTab";
import type { TabKey } from "./types";

/**
 * The Topic Workspace. Holds the active tab in client state and swaps the tab
 * body in place — the sidebar/shell never re-render, and switching is instant.
 * Each route (/topics, /topics/tasks, …) mounts this with a different `initial`
 * tab so deep links still land on the right tab.
 */
export default function WorkspaceShell({ initial = "lecture" }: { initial?: TabKey }) {
  const [tab, setTab] = useState<TabKey>(initial);
  return (
    <AppShell active="topics">
      {tab === "lecture" && <LectureTab onTab={setTab} />}
      {tab === "tasks" && <TasksTab onTab={setTab} />}
      {tab === "conflicts" && <ConflictsTab onTab={setTab} />}
      {tab === "sources" && <SourcesTab onTab={setTab} />}
    </AppShell>
  );
}
