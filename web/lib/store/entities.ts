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

export interface TaskRecord {
  id: string;
  userId: string;
  topicId: string;
  prompt: string;
  rubric: Rubric;
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
