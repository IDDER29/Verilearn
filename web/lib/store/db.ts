/**
 * In-memory database + repository. A single process-wide singleton, seeded once.
 * Structured as ports so a real DB (Postgres) can replace the maps later
 * (Deferred — infra). Durability to a JSON file is optional and off by default.
 */
import { TrustLedger } from "@/lib/domain/trust";
import type { TopicRecord } from "./entities";
import type {
  CertificateRecord,
  GapRecord,
  Org,
  ReviewCardRecord,
  ReviewLogEntry,
  Session,
  TaskRecord,
  TestRecord,
  User,
} from "./entities";
import { seedDb } from "./seed";

export interface Db {
  users: Map<string, User>;
  sessions: Map<string, Session>;
  orgs: Map<string, Org>;
  topics: Map<string, TopicRecord>;
  reviewCards: Map<string, ReviewCardRecord>;
  reviewLog: ReviewLogEntry[];
  gaps: Map<string, GapRecord>;
  tasks: Map<string, TaskRecord>;
  tests: Map<string, TestRecord>;
  certificates: Map<string, CertificateRecord>;
}

export function createDb(): Db {
  return {
    users: new Map(),
    sessions: new Map(),
    orgs: new Map(),
    topics: new Map(),
    reviewCards: new Map(),
    reviewLog: [],
    gaps: new Map(),
    tasks: new Map(),
    tests: new Map(),
    certificates: new Map(),
  };
}

/** Rebuild a claim ledger for a topic from its stored (already-authorized) events. */
export function ledgerFor(topic: TopicRecord): TrustLedger {
  return new TrustLedger().load(topic.events);
}

/** Topics owned by a user (tenant/ownership scoping — never leak across users). */
export function topicsOf(db: Db, userId: string): TopicRecord[] {
  return [...db.topics.values()].filter((t) => t.ownerId === userId);
}

export function reviewCardsOf(db: Db, userId: string): ReviewCardRecord[] {
  return [...db.reviewCards.values()].filter((c) => c.userId === userId);
}

export function gapsOf(db: Db, userId: string): GapRecord[] {
  return [...db.gaps.values()].filter((g) => g.userId === userId);
}

export function userByEmail(db: Db, email: string): User | undefined {
  const norm = email.trim().toLowerCase();
  return [...db.users.values()].find((u) => u.email.toLowerCase() === norm);
}

// --- process singleton -------------------------------------------------------

/** Fixed seed epoch so demo data is deterministic (2026-07-01T00:00:00Z). */
export const SEED_NOW = 1_782_432_000_000;

declare global {
  // eslint-disable-next-line no-var
  var __verilearnDb: Db | undefined;
}

/** The shared, seeded database for this server process. */
export function getDb(): Db {
  if (!globalThis.__verilearnDb) {
    const db = createDb();
    seedDb(db, SEED_NOW);
    globalThis.__verilearnDb = db;
  }
  return globalThis.__verilearnDb;
}
