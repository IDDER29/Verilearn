/**
 * DSAR / data-export service (SETTINGS-13). Serializes everything the platform
 * holds about a learner into a faithful JSON bundle: profile + prefs, every
 * topic with its full claim ledger (trust states, sources, coverage), the review
 * log + FSRS schedule, the gap map with history, tasks, and certificates. No
 * external infra — a pure read over the store, deterministic given the store.
 */
import { getDb, gapsOf, ledgerFor, reviewCardsOf, topicsOf } from "@/lib/store/db";
import { coverageMatrix } from "./sources";

export interface DataExport {
  exportedAt: number;
  user: { id: string; email: string; displayName: string; role: string; plan: string; ageBand: string; createdAt: number };
  prefs: unknown;
  topics: unknown[];
  reviewCards: unknown[];
  reviewLog: unknown[];
  gaps: unknown[];
  tasks: unknown[];
  certificates: unknown[];
}

/** Build the full export bundle for a user (SETTINGS-13). `at` stamps the export time. */
export function buildDataExport(userId: string, at: number): DataExport | null {
  const db = getDb();
  const user = db.users.get(userId);
  if (!user) return null;

  const topics = topicsOf(db, userId).map((t) => {
    const ledger = ledgerFor(t);
    const cov = coverageMatrix(userId, t.id);
    return {
      id: t.id,
      title: t.title,
      level: t.level,
      status: t.status,
      verifiedPercent: t.verifiedPercent,
      claims: t.claims.map((c) => ({ id: c.id, sectionId: c.sectionId, text: c.text, trustState: ledger.stateOf(c.id) })),
      sources: t.sources,
      events: t.events, // append-only verification ledger — the honest audit trail
      coverage: cov ? { coveragePercent: cov.coveragePercent, backedCount: cov.backedCount } : null,
    };
  });

  return {
    exportedAt: at,
    user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, plan: user.plan, ageBand: user.ageBand, createdAt: user.createdAt },
    prefs: user.prefs,
    topics,
    reviewCards: reviewCardsOf(db, userId).map((c) => ({ id: c.id, topicId: c.topicId, claimId: c.claimId, question: c.question, fsrs: c.fsrs })),
    reviewLog: db.reviewLog.filter((r) => r.userId === userId),
    gaps: gapsOf(db, userId).map((g) => g.gap),
    tasks: [...db.tasks.values()].filter((t) => t.userId === userId),
    certificates: [...db.certificates.values()].filter((c) => c.learnerId === userId),
  };
}
