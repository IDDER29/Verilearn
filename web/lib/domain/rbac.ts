/**
 * RBAC — role-based access control derived from VeriLearn's personas, with a
 * hard epistemic firewall baked into the policy layer.
 *
 * Traces to: PRD domain 20 (Auth/identity), 36 (Platform Administration &
 * Trust & Safety), 39 (Security & Compliance).
 *  - ADMIN-05: separable permissions — spending, provisioning, operational,
 *    integrity, and epistemic authority never leak into one account. Roles have
 *    distinct, non-overlapping capability sets; no role can self-escalate; a
 *    single human may hold multiple hats but each hat is checked independently
 *    (no implicit grant). An attempt to grant a capability outside a role's
 *    firewall is rejected at the policy layer, not merely hidden in UI.
 *  - Epistemic-write is restricted: even the platform-root / trust-&-safety
 *    roles' capability sets EXCLUDE setting trust states. `trust:write` is a
 *    firewall permission granted to NO human role, and it can never be produced
 *    via break-glass either — only the system verifier / SME dual-control path
 *    in trust.ts may produce trust states (invariant I1).
 *  - Break-glass is audited, never a silent grant: `breakGlass` always returns
 *    an immutable audit record carrying the reason and a session watermark; a
 *    break-glass request for a firewall permission is recorded as denied.
 *
 * Pure & deterministic: no Date.now / Math.random / new Date. Timestamps and
 * session ids for audit records are caller-supplied (see trust.ts style).
 */

// ----------------------------------------------------------------------------
// Roles (the key personas, PRD domains 10–13 & 36)
// ----------------------------------------------------------------------------

export type Role =
  | "guest" // unauthenticated / read-limited visitor
  | "learner" // individual learner
  | "team_learner" // learner seated under an org tenant
  | "instructor" // educator running a cohort
  | "sme_reviewer" // subject-matter expert (dual-control review input)
  | "community_mod" // community moderation
  | "org_admin" // tenant admin: seats & roles (not spend)
  | "billing_admin" // tenant spend (not seats)
  | "support_agent" // vendor support (consent-gated, no impersonation by default)
  | "platform_admin" // vendor root/ops (infra only, zero epistemic authority)
  | "trust_safety_lead" // ledger-integrity: quarantine, ban, cert revocation
  | "compliance_dpo"; // data protection / compliance

/** Every role, for exhaustive iteration (invariant sweeps, tests, admin UI). */
export const ROLES: readonly Role[] = [
  "guest",
  "learner",
  "team_learner",
  "instructor",
  "sme_reviewer",
  "community_mod",
  "org_admin",
  "billing_admin",
  "support_agent",
  "platform_admin",
  "trust_safety_lead",
  "compliance_dpo",
];

// ----------------------------------------------------------------------------
// Permissions
// ----------------------------------------------------------------------------

export type Permission =
  // content / learning
  | "topic:create"
  | "topic:read"
  | "claim:read"
  | "claim:author" // draft claim text pre-verification (NOT a trust state)
  | "test:take"
  // epistemic surfaces
  | "conflict:view"
  | "conflict:resolve_own" // manage a Conflict thread on own content (non-epistemic)
  | "review:submit" // SME review submission (dual-control INPUT, not the write)
  | "source:promote" // SME-gated promotion of a source to authoritative
  | "trust:write" // FIREWALL — produce a trust state; granted to NO human role
  // community
  | "community:moderate"
  // org tenant administration (separable: seats vs spend)
  | "org:read"
  | "org:manage_seats"
  | "org:manage_roles"
  | "billing:manage"
  // support
  | "support:read_tickets"
  | "user:impersonate" // consent-gated; granted to NO role by default (break-glass)
  // trust & safety / integrity
  | "cert:revoke"
  | "integrity:quarantine"
  | "user:ban"
  // compliance / audit
  | "audit:read"
  | "compliance:export"
  | "dpo:manage"
  // platform operations (infra only)
  | "pipeline:operate"
  | "flags:manage"
  | "tenant:provision";

/**
 * The epistemic firewall set: permissions that produce or mutate trust truth.
 * These are granted to NO human role and can NEVER be obtained via break-glass —
 * only the system verifier / SME dual-control path in trust.ts may set a trust
 * state. Enforced by construction (see the load-time invariant check below).
 */
export const FIREWALL_PERMISSIONS: readonly Permission[] = ["trust:write"];

// ----------------------------------------------------------------------------
// The capability matrix (least-privilege; distinct, non-overlapping authority)
// ----------------------------------------------------------------------------

export const PERMISSIONS: Readonly<Record<Role, readonly Permission[]>> = {
  // Read-limited: browse public topics/claims only. No authoring, no test-taking.
  guest: ["topic:read", "claim:read"],

  learner: [
    "topic:create",
    "topic:read",
    "claim:read",
    "claim:author",
    "test:take",
    "conflict:view",
    "conflict:resolve_own",
  ],

  team_learner: [
    "topic:create",
    "topic:read",
    "claim:read",
    "claim:author",
    "test:take",
    "conflict:view",
    "conflict:resolve_own",
    "org:read",
  ],

  instructor: [
    "topic:create",
    "topic:read",
    "claim:read",
    "claim:author",
    "test:take",
    "conflict:view",
    "conflict:resolve_own",
    "org:read",
  ],

  // Epistemic INPUT only: submit reviews & promote sources under gating. NOT
  // trust:write, NOT moderation/ban (assigning SME grants no moderation power).
  sme_reviewer: [
    "topic:read",
    "claim:read",
    "conflict:view",
    "conflict:resolve_own",
    "review:submit",
    "source:promote",
  ],

  community_mod: ["topic:read", "claim:read", "conflict:view", "community:moderate"],

  // Seats & roles, but NOT spend and NOT ledger.
  org_admin: ["topic:read", "org:read", "org:manage_seats", "org:manage_roles"],

  // Spend, but NOT seats.
  billing_admin: ["org:read", "billing:manage"],

  // Support: read tickets only. Impersonation & revocation require escalation.
  support_agent: ["topic:read", "claim:read", "support:read_tickets"],

  // Vendor root/ops: infra only. Explicitly EXCLUDES trust:write, cert:revoke,
  // conflict/source epistemics, seats, and billing.
  platform_admin: [
    "topic:read",
    "claim:read",
    "pipeline:operate",
    "flags:manage",
    "tenant:provision",
    "audit:read",
  ],

  // Integrity actions, but NOT epistemic write (a revoke/quarantine is an
  // integrity action, not a trust-state write).
  trust_safety_lead: [
    "topic:read",
    "claim:read",
    "conflict:view",
    "cert:revoke",
    "integrity:quarantine",
    "user:ban",
    "audit:read",
  ],

  compliance_dpo: ["topic:read", "audit:read", "compliance:export", "dpo:manage"],
};

// ----------------------------------------------------------------------------
// Load-time invariant: the matrix must never grant a firewall permission.
// Rejected at the policy layer (ADMIN-05), by construction — not just in UI.
// ----------------------------------------------------------------------------

export class EpistemicWriteGrantError extends Error {
  constructor(role: Role, permission: Permission) {
    super(
      `Firewall violation: role "${role}" must not be granted epistemic-write permission "${permission}".`,
    );
    this.name = "EpistemicWriteGrantError";
  }
}

/**
 * Asserts no role is granted a firewall permission. Returns true if clean,
 * throws {@link EpistemicWriteGrantError} otherwise. Called once at module load
 * so a bad matrix fails fast rather than silently leaking epistemic authority.
 */
export function assertNoEpistemicWriteGrants(): boolean {
  for (const role of ROLES) {
    for (const perm of PERMISSIONS[role]) {
      if (FIREWALL_PERMISSIONS.includes(perm)) {
        throw new EpistemicWriteGrantError(role, perm);
      }
    }
  }
  return true;
}

assertNoEpistemicWriteGrants();

// ----------------------------------------------------------------------------
// Query API
// ----------------------------------------------------------------------------

/** The (frozen-in-spirit) capability set for a role. */
export function permissionsFor(role: Role): readonly Permission[] {
  return PERMISSIONS[role];
}

/**
 * Does `role` hold `permission`? Pure membership check — no implicit grants,
 * no wildcard, no self-escalation. A firewall permission always returns false.
 */
export function can(role: Role, permission: Permission): boolean {
  if (FIREWALL_PERMISSIONS.includes(permission)) return false;
  return PERMISSIONS[role].includes(permission);
}

/**
 * The epistemic firewall in one line: NO human role may write trust states.
 * Always false — there is no argument that makes it true. Trust states come
 * only from the system verifier / SME dual-control path in trust.ts.
 */
export function canWriteTrust(_role?: Role): boolean {
  return false;
}

// ----------------------------------------------------------------------------
// Break-glass (audited emergency elevation — never a silent grant)
// ----------------------------------------------------------------------------

/**
 * Permissions that are high-risk and, when reached via break-glass, require a
 * distinct second approver per policy (ADMIN-05 "announced/second-approved").
 */
export const SECOND_APPROVAL_PERMISSIONS: readonly Permission[] = [
  "user:impersonate",
  "user:ban",
  "cert:revoke",
  "integrity:quarantine",
  "tenant:provision",
];

export class BreakGlassReasonError extends Error {
  constructor() {
    super("Break-glass requires a non-empty reason and is flagged for after-the-fact review.");
    this.name = "BreakGlassReasonError";
  }
}

/**
 * An immutable audit record for a break-glass elevation attempt. Produced for
 * EVERY attempt (grant or deny) — break-glass is never a silent grant. When the
 * requested permission is inside the epistemic firewall, `granted` is false and
 * `forbidden` is true: the action is refused even under break-glass.
 */
export interface BreakGlassAudit {
  readonly kind: "break_glass";
  readonly role: Role;
  readonly permission: Permission;
  readonly reason: string;
  /** epoch ms, caller-supplied (keeps the module deterministic). */
  readonly at: number;
  /** watermark stamped into every log line for this session (caller-supplied). */
  readonly sessionId: string;
  /** True only if the elevation is permissible; false for firewall permissions. */
  readonly granted: boolean;
  /** True when the permission can never be broken-glass granted (firewall). */
  readonly forbidden: boolean;
  /** True when policy requires a distinct second approver before use. */
  readonly requiresSecondApproval: boolean;
  /** True when the role already holds the permission (elevation was unnecessary). */
  readonly alreadyHeld: boolean;
}

export interface BreakGlassOptions {
  /** epoch ms; defaults to 0 for a stable record when the caller omits it. */
  at?: number;
  /** log watermark; defaults to a deterministic value derived from the inputs. */
  sessionId?: string;
}

/**
 * Request break-glass elevation. Returns an audit record; never returns a bare
 * boolean and never silently grants. Throws {@link BreakGlassReasonError} if no
 * reason is supplied. A firewall permission (e.g. `trust:write`) yields a record
 * with `granted: false, forbidden: true` — the epistemic firewall holds even
 * here.
 */
export function breakGlass(
  role: Role,
  permission: Permission,
  reason: string,
  opts: BreakGlassOptions = {},
): BreakGlassAudit {
  if (!reason || reason.trim().length === 0) {
    throw new BreakGlassReasonError();
  }
  const forbidden = FIREWALL_PERMISSIONS.includes(permission);
  const alreadyHeld = PERMISSIONS[role].includes(permission);
  const at = opts.at ?? 0;
  const sessionId = opts.sessionId ?? `bg_${role}_${permission}_${at}`;
  return {
    kind: "break_glass",
    role,
    permission,
    reason: reason.trim(),
    at,
    sessionId,
    granted: !forbidden,
    forbidden,
    requiresSecondApproval: SECOND_APPROVAL_PERMISSIONS.includes(permission),
    alreadyHeld,
  };
}
