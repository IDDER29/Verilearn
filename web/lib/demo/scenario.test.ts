import { describe, expect, it } from "vitest";
import { DEMO_DISPUTED_CLAIM_ID, demoSnapshot, resolveDemoConflict } from "./scenario";

describe("guest demo scenario (TRUST-22)", () => {
  it("starts with a mix of trust states, including one disputed claim", () => {
    const snap = demoSnapshot();
    expect(snap.claims.length).toBeGreaterThan(1);
    expect(snap.claims.some((c) => c.state === "disputed")).toBe(true);
    expect(snap.claims.some((c) => c.state === "verified_execution" || c.state === "verified_source")).toBe(true);
    // The disputed claim is excluded from the verified percentage.
    expect(snap.verifiedPercent).toBeLessThan(100);
  });

  it("resolving moves the disputed claim to a verified state via the real ledger engine", () => {
    const before = demoSnapshot();
    const disputed = before.claims.find((c) => c.id === DEMO_DISPUTED_CLAIM_ID)!;
    expect(disputed.state).toBe("disputed");

    const after = resolveDemoConflict(5_000);
    const resolved = after.claims.find((c) => c.id === DEMO_DISPUTED_CLAIM_ID)!;
    expect(resolved.state).toBe("verified_source");
    expect(after.verifiedPercent).toBeGreaterThan(before.verifiedPercent);
  });

  it("is stateless/ephemeral: repeated calls never accumulate or leak state across each other", () => {
    resolveDemoConflict(1_000);
    resolveDemoConflict(2_000);
    // A fresh snapshot always starts from the same fixed baseline — nothing persisted.
    const snap = demoSnapshot();
    expect(snap.claims.find((c) => c.id === DEMO_DISPUTED_CLAIM_ID)!.state).toBe("disputed");
  });
});
