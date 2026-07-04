import type { TrustState } from "@/lib/domain/types";

export type TabKey = "lecture" | "tasks" | "conflicts" | "sources";

/** Real topic data threaded into the workspace tabs (ledger-computed aggregates). */
export interface WorkspaceData {
  topicId: string;
  title: string;
  level: string;
  claimCount: number;
  sourceCount: number;
  verifiedPercent: number;
  breakdown: Record<TrustState, number>;
  disputedClaims: { claimId: string; text: string }[];
  coverage: {
    sources: { id: string; title: string; kind: string }[];
    rows: { claimId: string; claimText: string; state: TrustState; cells: { sourceId: string; filled: boolean }[] }[];
    coveragePercent: number;
    backedCount: number;
  } | null;
}

export const TAB_ROUTE: Record<TabKey, string> = {
  lecture: "/topics",
  tasks: "/topics/tasks",
  conflicts: "/topics/conflicts",
  sources: "/topics/sources",
};
