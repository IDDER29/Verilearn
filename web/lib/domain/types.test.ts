import { describe, expect, it } from "vitest";
import { TRUST_LABEL, isTestEligible, type TrustState } from "./types";

/**
 * The canonical non-colour trust vocabulary (A11Y-01): every one of the six
 * trust states must map to a distinct, non-empty glyph + label in the single
 * shared contract, so no surface has to invent its own reduced vocabulary.
 */
describe("canonical trust vocabulary (A11Y-01)", () => {
  const ALL: TrustState[] = ["verified_execution", "verified_source", "sourced", "disputed", "unsupported", "interpretive"];

  it("maps all six states to a non-empty glyph + label", () => {
    expect(Object.keys(TRUST_LABEL).sort()).toEqual([...ALL].sort());
    for (const s of ALL) {
      expect(TRUST_LABEL[s].glyph.length).toBeGreaterThan(0);
      expect(TRUST_LABEL[s].label.length).toBeGreaterThan(0);
    }
  });

  it("gives each state a distinct label and glyph (no collapsing)", () => {
    const labels = ALL.map((s) => TRUST_LABEL[s].label);
    const glyphs = ALL.map((s) => TRUST_LABEL[s].glyph);
    expect(new Set(labels).size).toBe(ALL.length);
    expect(new Set(glyphs).size).toBe(ALL.length);
  });

  it("keeps only verified/sourced test-eligible (contested states excluded)", () => {
    expect(isTestEligible("verified_execution")).toBe(true);
    expect(isTestEligible("verified_source")).toBe(true);
    expect(isTestEligible("sourced")).toBe(true);
    expect(isTestEligible("disputed")).toBe(false);
    expect(isTestEligible("unsupported")).toBe(false);
    expect(isTestEligible("interpretive")).toBe(false);
  });
});
