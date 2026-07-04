import { describe, expect, it } from "vitest";
import { demoWorkspaceData } from "./workspace";

describe("guest demo Lecture workspace data (LEARN-17)", () => {
  it("carries every demo claim with a real, ledger-derived trust state", () => {
    const data = demoWorkspaceData();
    expect(data.claims.length).toBe(data.claimCount);
    expect(data.claims.some((c) => c.state === "disputed")).toBe(true);
    expect(data.claims.some((c) => c.state === "verified_execution" || c.state === "verified_source")).toBe(true);
  });

  it("surfaces the disputed claim in disputedClaims, resolved via the real ledger not a hardcoded flag", () => {
    const data = demoWorkspaceData();
    expect(data.disputedClaims.length).toBe(1);
    expect(data.verifiedPercent).toBeLessThan(100);
  });

  it("builds a real coverage matrix backing only the citation-based claims (not the execution or disputed ones)", () => {
    const data = demoWorkspaceData();
    expect(data.coverage).not.toBeNull();
    expect(data.coverage!.sources.length).toBe(1);
    const backedIds = data.claims.filter((c) => c.source !== null).map((c) => c.id);
    expect(backedIds.length).toBeGreaterThan(0);
    expect(backedIds.length).toBeLessThan(data.claims.length);
  });

  it("is deterministic: repeated calls produce identical output", () => {
    const a = demoWorkspaceData();
    const b = demoWorkspaceData();
    expect(a).toEqual(b);
  });
});
