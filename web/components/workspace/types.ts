export type TabKey = "lecture" | "tasks" | "conflicts" | "sources";

export const TAB_ROUTE: Record<TabKey, string> = {
  lecture: "/topics",
  tasks: "/topics/tasks",
  conflicts: "/topics/conflicts",
  sources: "/topics/sources",
};
