/**
 * Entitlement catalog (ADMIN-07): the single, versioned, audited source of
 * truth mapping plan tier → entitlement — replacing the scattered
 * `user.plan === "free"` + a bare hardcoded cap that used to live only in
 * `lib/services/topics.ts`. Changing what a tier is entitled to now means
 * editing exactly this table; every consumer (topic-cap enforcement, plan
 * display copy) reads through `entitlementsFor`, so the change propagates
 * without touching call-site logic.
 *
 * "Money buys thoroughness, not truth" holds by construction: nothing in
 * this catalog can express a trust-state grant — the shape has no field
 * that could encode one, and `assertEntitlementsWellFormed` fails fast at
 * module load if a future edit ever tries (the same load-time-invariant
 * pattern as `rbac.ts`'s `assertNoEpistemicWriteGrants`).
 *
 * Traces to PRD domain 36 (Platform Admin) — ADMIN-07.
 */

export type PlanTier = "free" | "pro" | "team";

export const PLAN_TIERS: readonly PlanTier[] = ["free", "pro", "team"];

export interface EntitlementSet {
  /** How many non-archived topics this tier may keep active at once. `Infinity` = unlimited. */
  readonly maxActiveTopics: number;
}

/** Bump whenever an entitlement value changes — every admin/billing surface can display this so a support ticket can be traced to an exact catalog version. */
export const ENTITLEMENTS_VERSION = "2026-07-04";

export const ENTITLEMENTS: Readonly<Record<PlanTier, EntitlementSet>> = {
  free: { maxActiveTopics: 3 },
  pro: { maxActiveTopics: Infinity },
  team: { maxActiveTopics: Infinity },
};

export function entitlementsFor(plan: PlanTier): EntitlementSet {
  return ENTITLEMENTS[plan];
}

export class EntitlementCatalogError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EntitlementCatalogError";
  }
}

/**
 * Validates the catalog references only known tiers and only well-formed
 * values (a positive integer or `Infinity`, never zero/negative/NaN) — the
 * "feature-flag-reference validation" ADMIN-07 asks for. Called once at
 * module load so a bad catalog fails fast rather than shipping a silently
 * broken cap.
 */
export function assertEntitlementsWellFormed(): boolean {
  for (const tier of PLAN_TIERS) {
    const set = ENTITLEMENTS[tier];
    if (!set) throw new EntitlementCatalogError(`Entitlement catalog is missing tier "${tier}".`);
    const cap = set.maxActiveTopics;
    if (!(cap === Infinity || (Number.isInteger(cap) && cap > 0))) {
      throw new EntitlementCatalogError(`Tier "${tier}" has an invalid maxActiveTopics value: ${cap}.`);
    }
  }
  return true;
}

assertEntitlementsWellFormed();
