import type { TrustState } from "@/lib/domain/types";

export type TabKey = "lecture" | "tasks" | "conflicts" | "sources";

/** One claim with its real ledger verification detail, for the lecture reader. */
export interface LectureClaim {
  id: string;
  text: string;
  sectionId: string;
  state: TrustState;
  /** Backing source (title/kind) resolved from the latest verification event, if any. */
  source: { title: string; kind: string; detail: string } | null;
  /** 0..1 verifier confidence from the latest event. */
  confidence: number;
  /** How the state was reached ("execution" / "citation" / "skeptic"). */
  method: string;
}

/** Real topic data threaded into the workspace tabs (ledger-computed aggregates). */
export interface WorkspaceData {
  topicId: string;
  title: string;
  level: string;
  claimCount: number;
  sourceCount: number;
  verifiedPercent: number;
  breakdown: Record<TrustState, number>;
  /** Every claim with real ledger detail (state, source, confidence). */
  claims: LectureClaim[];
  disputedClaims: { claimId: string; text: string }[];
  /** Claims that were disputed and later resolved — reopenable (TRUST-13). */
  resolvedClaims: { claimId: string; text: string }[];
  coverage: {
    sources: { id: string; title: string; kind: string; preferred: boolean }[];
    rows: { claimId: string; claimText: string; state: TrustState; cells: { sourceId: string; filled: boolean; state: TrustState | null }[] }[];
    coveragePercent: number;
    backedCount: number;
    /** Per-source count of claims it backs, keyed by source id. */
    backsBySource: Record<string, number>;
  } | null;
}

export const TAB_ROUTE: Record<TabKey, string> = {
  lecture: "/topics",
  tasks: "/topics/tasks",
  conflicts: "/topics/conflicts",
  sources: "/topics/sources",
};
