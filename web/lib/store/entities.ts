/**
 * Persistence entities — domain objects plus the identity/ownership/tenant fields
 * needed to store them. Composes the pure domain types from lib/domain.
 * Traces to: AUTH (users/sessions), ORG (tenant), plus the learning domains.
 */
import type { FsrsCard } from "@/lib/domain/fsrs";
import type { Gap } from "@/lib/domain/gap";
import type { Rubric } from "@/lib/domain/rubric";
import type { Claim, Source, Topic, VerificationEvent } from "@/lib/domain/types";
import type { Role } from "@/lib/domain/rbac";

export type AgeBand = "adult" | "minor" | "unknown";

/**
 * Learner preferences. Verification/active-listening/review settings apply to
 * FUTURE lectures/sessions only — they never mutate the trust ledger (SETTINGS-08 /
 * invariant I1). Privacy toggles govern analytics/visibility/email.
 */
export type VerificationDepth = "minimal" | "standard" | "thorough";

export interface UserPrefs {
  /** How the verification pipeline runs on FUTURE topics (never rewrites past ledgers — I1/SETTINGS-08). */
  verification: { depth: VerificationDepth; showInterpretive: boolean; alertDisputes: boolean; executionSandbox: boolean; skepticAggressiveness: number };
  activeListening: { predict: boolean; pause: boolean; cloze: boolean; connection: boolean; closeGate: boolean; frequency: number };
  review: { targetRetention: number; dailyLimit: number; maxIntervalDays: number; confidenceGate: boolean; drills: boolean; reminders: boolean };
  /** Per-category in-app notification opt-in (NOTIF-08); enforced when the feed is derived. */
  notifications: { verification: boolean; review: boolean; conflict: boolean; test: boolean; streak: boolean; gap: boolean };
  privacy: { analytics: boolean; communityVisible: boolean; emailUpdates: boolean };
  /** One-time UI flags (dismissed primers, etc.) — not learning behavior. */
  flags: { reviewPrimerSeen: boolean };
}

export function defaultPrefs(): UserPrefs {
  return {
    verification: { depth: "standard", showInterpretive: true, alertDisputes: true, executionSandbox: false, skepticAggressiveness: 55 },
    activeListening: { predict: true, pause: true, cloze: false, connection: false, closeGate: true, frequency: 2 },
    review: { targetRetention: 90, dailyLimit: 40, maxIntervalDays: 365, confidenceGate: true, drills: true, reminders: true },
    notifications: { verification: true, review: true, conflict: true, test: true, streak: true, gap: true },
    privacy: { analytics: true, communityVisible: true, emailUpdates: false },
    flags: { reviewPrimerSeen: false },
  };
}

export interface User {
  id: string;
  email: string;
  /** scrypt hash "salt:hash" — never the raw password */
  passwordHash: string;
  displayName: string;
  role: Role;
  orgId?: string;
  /** Coarse age band drives COPPA/minor-safe defaults (SEC-11); birth year not stored for minors beyond the band. */
  ageBand: AgeBand;
  plan: "free" | "pro" | "team";
  createdAt: number;
  prefs: UserPrefs;
}

export interface Session {
  token: string;
  userId: string;
  expiresAt: number;
  createdAt: number;
  /** Raw request User-Agent captured at sign-in, if the client sent one (AUTH-12). */
  userAgent?: string;
}

export interface Org {
  id: string;
  name: string;
  plan: "team";
  seatLimit: number;
}

/** A topic and everything the ledger needs to reconstruct its trust states. */
export interface TopicRecord extends Topic {
  claims: Claim[];
  sources: Source[];
  /** append-only verification events; a TrustLedger is rebuilt from these on read */
  events: VerificationEvent[];
  /** `ready` = pipeline finished ok; `failed` = a stage stopped it (VERIFY-15); `verifying` = in flight. */
  status: "verifying" | "ready" | "failed";
  verifiedPercent: number;
  /** Real per-stage pipeline output (VERIFY-04), captured at creation — incl. the failed stage. */
  pipelineStages?: { stage: string; detail: string; status: "done" | "failed" }[];
  /**
   * Archived on a Free-plan downgrade past the topic cap (BILL-12): content and
   * trust ledger are preserved untouched — archiving is never deletion — but the
   * topic no longer counts against the active cap and is read-only until the
   * learner re-upgrades or frees up a slot.
   */
  archived?: boolean;
}

export interface ReviewCardRecord {
  id: string;
  userId: string;
  topicId: string;
  claimId: string;
  question: string;
  answer: string;
  sourceRef: string;
  fsrs: FsrsCard;
}

export interface GapRecord {
  userId: string;
  gap: Gap;
}

/**
 * A seeded error-drill (ANALYTICS-07 / REVIEW-06): a statement salted into
 * review that may be true or may be the deliberate seeded error, testing
 * whether the learner catches it rather than pattern-matching. Content is
 * hand-authored fixtures here (the same honest stand-in as the seeded task
 * rubric) — real Skeptic-generated drills are Deferred behind the LLM verifier.
 */
export interface DrillRecord {
  id: string;
  topicId: string;
  statement: string;
  /** Whether the statement, as written, is actually true. */
  isCorrect: boolean;
  /** The real fact, shown after the learner answers either way. */
  explanation: string;
}

/** One learner's attempt at a drill — per-user, unlike the shared DrillRecord content. */
export interface DrillAttempt {
  userId: string;
  drillId: string;
  topicId: string;
  guessedCorrect: boolean;
  /** True iff the learner's guess matched the drill's real answer — a genuine catch. */
  caught: boolean;
  at: number;
}

/** The cognitive demand a task makes (TASK-01) — shown as a label on each task. */
export type TaskType = "explain" | "reason" | "apply";

export interface TaskRecord {
  id: string;
  userId: string;
  topicId: string;
  /** What the task asks of the learner (Explain / Reason / Apply). */
  type: TaskType;
  prompt: string;
  rubric: Rubric;
  /** Reference answer, revealed only after a pass (TASK-06). */
  modelAnswer?: string;
  /** criterionId -> hit, once submitted */
  submissionHits?: Record<string, boolean>;
  submittedAnswer?: string;
  scorePct?: number;
  passed?: boolean;
  /** epoch ms of the most recent grade, once submitted (ANALYTICS-01 trend windows). */
  gradedAt?: number;
}

export interface TestRecord {
  id: string;
  userId: string;
  topicId: string;
  claimIds: string[];
  startedAt?: number;
  durationMs: number;
  passBar: number;
  scorePct?: number;
  passed?: boolean;
}

/** One graded review — feeds calibration (REVIEW-02) and the retention signal. */
export interface ReviewLogEntry {
  userId: string;
  claimId: string;
  topicId: string;
  confidence: "sure" | "unsure" | "guessing";
  rating: "again" | "hard" | "good" | "easy";
  correct: boolean;
  at: number;
}

export interface CertificateRecord {
  id: string;
  topicId: string;
  learnerId: string;
  issuedAt: number;
  testScorePct: number;
  revoked: boolean;
  revokedReason?: string;
  verifyCode: string;
}
