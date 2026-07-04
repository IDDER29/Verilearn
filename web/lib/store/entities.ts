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
  privacy: { analytics: boolean; communityVisible: boolean; emailUpdates: boolean };
  /** One-time UI flags (dismissed primers, etc.) — not learning behavior. */
  flags: { reviewPrimerSeen: boolean };
}

export function defaultPrefs(): UserPrefs {
  return {
    verification: { depth: "standard", showInterpretive: true, alertDisputes: true, executionSandbox: false, skepticAggressiveness: 55 },
    activeListening: { predict: true, pause: true, cloze: false, connection: false, closeGate: true, frequency: 2 },
    review: { targetRetention: 90, dailyLimit: 40, maxIntervalDays: 365, confidenceGate: true, drills: true, reminders: true },
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
  status: "verifying" | "ready";
  verifiedPercent: number;
  /** Real per-stage pipeline output (VERIFY-04), captured at creation. */
  pipelineStages?: { stage: string; detail: string }[];
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
