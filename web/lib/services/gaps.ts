/**
 * Gap Map service — read views over the learner's tracked misconceptions for the
 * board (GAP-02/03/08/12). Pure read layer over the gap engine + store; all
 * lifecycle transitions live in `lib/domain/gap.ts`. Traces to GAP-02 (board),
 * GAP-08 (empty states), GAP-11/12 (severity + cross-topic surfacing).
 */
import { closeGap, MASTERY_THRESHOLD, type GapOrigin, type GapSeverity, type GapStatus, type GapTransitionReason } from "@/lib/domain/gap";
import type { TrustState } from "@/lib/domain/types";
import { getDb, gapsOf, ledgerFor } from "@/lib/store/db";
import { now } from "@/lib/ids";

export interface GapView {
  id: string;
  claimId: string;
  claimText: string;
  topicId: string;
  topicTitle: string;
  origin: GapOrigin;
  severity: GapSeverity;
  status: GapStatus;
  /** Read-only current trust state of the linked claim (gaps never mutate it). */
  claimState: TrustState | null;
  /** Append-only status history (GAP-03). */
  history: { at: number; to: GapStatus; reason: GapTransitionReason; detail?: string }[];
  /** Sustained correct recalls on the linked claim (evidence toward closure). */
  successfulReviews: number;
  /** True when a manual, evidence-gated close is currently permitted. */
  canClose: boolean;
  /** epoch ms of the most recent history event (last transition). */
  updatedAt: number;
}

function successesFor(userId: string, claimId: string): number {
  return getDb().reviewLog.filter((r) => r.userId === userId && r.claimId === claimId && r.correct).length;
}

/** All of the learner's gaps as display rows, most-recently-changed first. */
export function listGaps(userId: string): GapView[] {
  const db = getDb();
  return gapsOf(db, userId)
    .map(({ gap }) => {
      const topic = db.topics.get(gap.topicId);
      const claim = topic?.claims.find((c) => c.id === gap.claimId);
      const last = gap.history[gap.history.length - 1];
      const successfulReviews = successesFor(userId, gap.claimId);
      return {
        id: gap.id,
        claimId: gap.claimId,
        claimText: claim?.text ?? gap.claimId,
        topicId: gap.topicId,
        topicTitle: topic?.title ?? "Topic",
        origin: gap.origin,
        severity: gap.severity,
        status: gap.status,
        claimState: topic ? ledgerFor(topic).stateOf(gap.claimId) : null,
        history: gap.history.map((e) => ({ at: e.at, to: e.to, reason: e.reason, detail: e.detail })),
        successfulReviews,
        canClose: gap.status === "watching" && successfulReviews >= MASTERY_THRESHOLD,
        updatedAt: last?.at ?? 0,
      };
    })
    .sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Manually close a `watching` gap (GAP-03/09) — still evidence-gated: closure
 * requires sustained correct recalls ≥ MASTERY_THRESHOLD, so it can never be
 * closed by fiat. Returns an error otherwise (never fabricates a closed state).
 */
export function closeGapById(userId: string, gapId: string): { ok: boolean; error?: string } {
  const db = getDb();
  const rec = db.gaps.get(gapId);
  if (!rec || rec.userId !== userId) return { ok: false, error: "Gap not found." };
  if (rec.gap.status !== "watching") return { ok: false, error: "Only a watching gap can be closed." };
  const successes = successesFor(userId, rec.gap.claimId);
  if (successes < MASTERY_THRESHOLD) {
    return { ok: false, error: `Needs ${MASTERY_THRESHOLD - successes} more sustained correct recall${MASTERY_THRESHOLD - successes === 1 ? "" : "s"} before it can close.` };
  }
  rec.gap = closeGap(rec.gap, { successfulReviews: successes, detail: "manual close" }, now());
  return { ok: true };
}

export interface GapBoard {
  /** Attention zone: freshly open OR regressed (reopened). */
  active: GapView[];
  watching: GapView[];
  closed: GapView[];
  counts: { active: number; watching: number; closed: number; total: number };
}

const SEVERITY_RANK: Record<GapSeverity, number> = { high: 0, med: 1, low: 2 };

/** Group the learner's gaps into Open/Watching/Closed columns (GAP-02). */
export function gapBoard(userId: string): GapBoard {
  const gaps = listGaps(userId);
  const bySeverity = (a: GapView, b: GapView) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity] || b.updatedAt - a.updatedAt;
  const active = gaps.filter((g) => g.status === "open" || g.status === "reopened").sort(bySeverity);
  const watching = gaps.filter((g) => g.status === "watching").sort(bySeverity);
  const closed = gaps.filter((g) => g.status === "closed").sort(bySeverity);
  return {
    active,
    watching,
    closed,
    counts: { active: active.length, watching: watching.length, closed: closed.length, total: gaps.length },
  };
}
