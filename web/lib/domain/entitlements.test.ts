import { describe, expect, it } from "vitest";
import { assertEntitlementsWellFormed, ENTITLEMENTS, entitlementsFor, EntitlementCatalogError, PLAN_TIERS } from "./entitlements";

describe("entitlement catalog (ADMIN-07)", () => {
  it("has an entry for every plan tier", () => {
    for (const tier of PLAN_TIERS) {
      expect(ENTITLEMENTS[tier]).toBeDefined();
    }
  });

  it("free is capped at 3 active topics; pro and team are unlimited", () => {
    expect(entitlementsFor("free").maxActiveTopics).toBe(3);
    expect(entitlementsFor("pro").maxActiveTopics).toBe(Infinity);
    expect(entitlementsFor("team").maxActiveTopics).toBe(Infinity);
  });

  it("assertEntitlementsWellFormed passes on the shipped catalog (already ran once at module load)", () => {
    expect(assertEntitlementsWellFormed()).toBe(true);
  });

  it("EntitlementCatalogError is throwable and named (policy-layer rejection)", () => {
    const err = new EntitlementCatalogError('Tier "free" has an invalid maxActiveTopics value: 0.');
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("EntitlementCatalogError");
  });
});
