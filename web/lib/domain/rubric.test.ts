import { describe, expect, it } from "vitest";
import {
  MalformedRubricError,
  MIN_SUBSTANCE_WORDS,
  PASS_THRESHOLD,
  UngradeableCriterionError,
  assertRubricGradeable,
  checkSubstance,
  grade,
  gradeSubmission,
  hitsFor,
  keywordMatcher,
  type Criterion,
  type Rubric,
  type Submission,
} from "./rubric";
import type { TrustState } from "./types";

function crit(id: string, weight: number, extra: Partial<Criterion> = {}): Criterion {
  return { id, text: `criterion ${id}`, weight, sourceId: `src-${id}`, ...extra };
}

function rubric(criteria: Criterion[], id = "r1"): Rubric {
  return { id, taskId: "task-1", criteria };
}

describe("weighted scoring (TASK-03)", () => {
  it("weights criteria — hitting the heavy criterion outscores hitting the light one", () => {
    const r = rubric([crit("a", 3), crit("b", 1)]);
    // hit only the weight-3 criterion → 3/4 = 75%
    expect(grade(r, { a: true, b: false }).scorePct).toBe(75);
    // hit only the weight-1 criterion → 1/4 = 25%
    expect(grade(r, { a: false, b: true }).scorePct).toBe(25);
  });

  it("all hit → 100%, none hit → 0%", () => {
    const r = rubric([crit("a", 2), crit("b", 5), crit("c", 3)]);
    expect(grade(r, { a: true, b: true, c: true }).scorePct).toBe(100);
    expect(grade(r, {}).scorePct).toBe(0);
  });

  it("a criterion absent from the hit map is treated as missing (fail-closed)", () => {
    const r = rubric([crit("a", 1), crit("b", 1)]);
    const res = grade(r, { a: true }); // b omitted
    expect(res.scorePct).toBe(50);
    expect(res.hit.map((c) => c.id)).toEqual(["a"]);
    expect(res.missing.map((c) => c.id)).toEqual(["b"]);
  });
});

describe("the 75% pass boundary (TASK-03, inclusive)", () => {
  it("74% fails", () => {
    const r = rubric([crit("a", 74), crit("b", 26)]);
    const res = grade(r, { a: true, b: false });
    expect(res.scorePct).toBe(74);
    expect(res.passed).toBe(false);
  });

  it("exactly 75% passes (inclusive bar)", () => {
    const r = rubric([crit("a", 75), crit("b", 25)]);
    const res = grade(r, { a: true, b: false });
    expect(res.scorePct).toBe(75);
    expect(res.passed).toBe(true);
  });

  it("exactly 3-of-4 equal weights = 75% passes despite float division", () => {
    const r = rubric([crit("a", 1), crit("b", 1), crit("c", 1), crit("d", 1)]);
    const res = grade(r, { a: true, b: true, c: true, d: false });
    expect(res.passed).toBe(true);
    expect(res.scorePct).toBe(75);
  });

  it("PASS_THRESHOLD is the fixed 0.75 invariant", () => {
    expect(PASS_THRESHOLD).toBe(0.75);
  });
});

describe("hit / missing partition and traceability (TASK-03, TASK-04)", () => {
  it("hit and missing partition the rubric with no overlap, in rubric order", () => {
    const r = rubric([crit("a", 1), crit("b", 1), crit("c", 1)]);
    const res = grade(r, { a: true, b: false, c: true });
    expect(res.hit.map((c) => c.id)).toEqual(["a", "c"]);
    expect(res.missing.map((c) => c.id)).toEqual(["b"]);
    // union == all criteria, disjoint
    const all = [...res.hit, ...res.missing].map((c) => c.id).sort();
    expect(all).toEqual(["a", "b", "c"]);
  });

  it("every criterion in the result retains its sourceId", () => {
    const r = rubric([crit("a", 1), crit("b", 1)]);
    const res = grade(r, { a: true, b: false });
    expect(res.hit[0].sourceId).toBe("src-a");
    expect(res.missing[0].sourceId).toBe("src-b");
    for (const c of [...res.hit, ...res.missing]) {
      expect(c.sourceId).toBeTruthy();
    }
  });
});

describe("revise-to-pass (TASK-05)", () => {
  it("a re-grade with more hits flips passed from false to true against the same rubric", () => {
    const r = rubric([crit("a", 1), crit("b", 1), crit("c", 1), crit("d", 1)]);
    const first = grade(r, { a: true, b: true }); // 50%
    expect(first.passed).toBe(false);
    expect(first.scorePct).toBe(50);

    const revised = grade(r, { a: true, b: true, c: true }); // 75%
    expect(revised.passed).toBe(true);
    expect(revised.scorePct).toBe(75);
  });
});

describe("malformed rubric rejection (TASK-03, TASK-04)", () => {
  it("rejects a hit that references an unknown criterion", () => {
    const r = rubric([crit("a", 1)]);
    expect(() => grade(r, { a: true, ghost: true })).toThrow(MalformedRubricError);
  });

  it("rejects a criterion with no sourceId (must be source-anchored)", () => {
    const r = rubric([{ id: "a", text: "x", weight: 1, sourceId: "" }]);
    expect(() => grade(r, { a: true })).toThrow(/anchored to a source/);
  });

  it("rejects a non-positive weight", () => {
    const r = rubric([crit("a", 0)]);
    expect(() => grade(r, {})).toThrow(MalformedRubricError);
  });

  it("rejects a duplicate criterion id", () => {
    const r = rubric([crit("a", 1), crit("a", 1)]);
    expect(() => grade(r, {})).toThrow(/duplicate/);
  });

  it("rejects an empty rubric", () => {
    expect(() => grade(rubric([]), {})).toThrow(/at least one criterion/);
  });
});

describe("default keyword matcher + hitsFor / gradeSubmission", () => {
  const r = rubric([
    crit("cut", 1, { keywords: ["cut", "property"] }),
    crit("negative", 1, { keywords: ["negative", "edge"] }),
    crit("nokw", 1), // no keywords → never auto-matched
  ]);
  const sub: Submission = {
    id: "s1",
    answer: "The Cut Property assumption breaks once an edge can be negative.",
  };

  it("matches a criterion only when all keywords are present (case-insensitive)", () => {
    expect(keywordMatcher(r.criteria[0], sub)).toBe(true); // cut + property
    expect(keywordMatcher(r.criteria[1], sub)).toBe(true); // negative + edge
  });

  it("a criterion with no keywords reads as missing (fail-closed)", () => {
    expect(keywordMatcher(r.criteria[2], sub)).toBe(false);
  });

  it("misses when not every keyword is present", () => {
    const partial: Submission = { id: "s2", answer: "something about the cut only" };
    expect(keywordMatcher(r.criteria[0], partial)).toBe(false);
  });

  it("hitsFor produces a deterministic hit map over all criteria", () => {
    expect(hitsFor(r, sub)).toEqual({ cut: true, negative: true, nokw: false });
  });

  it("gradeSubmission composes matching + grading", () => {
    const res = gradeSubmission(r, sub);
    expect(res.hit.map((c) => c.id).sort()).toEqual(["cut", "negative"]);
    expect(res.missing.map((c) => c.id)).toEqual(["nokw"]);
    expect(res.scorePct).toBe(67); // 2/3
    expect(res.passed).toBe(false);
  });

  it("accepts a custom injected matcher", () => {
    const alwaysHit = () => true;
    expect(hitsFor(r, sub, alwaysHit)).toEqual({ cut: true, negative: true, nokw: true });
  });
});

describe("minimum-substance gate (TASK-22)", () => {
  const prompt = "Explain why the greedy approach fails here.";

  it(`rejects fewer than ${MIN_SUBSTANCE_WORDS} words`, () => {
    expect(checkSubstance("not sure why", prompt)).toEqual({ ok: false, reason: "too_short" });
    expect(checkSubstance("dunno", prompt)).toEqual({ ok: false, reason: "too_short" });
  });

  it("rejects the prompt copied back verbatim, case/punctuation-insensitively", () => {
    expect(checkSubstance(prompt, prompt)).toEqual({ ok: false, reason: "copies_prompt" });
    expect(checkSubstance("EXPLAIN WHY THE GREEDY APPROACH FAILS HERE", prompt)).toEqual({ ok: false, reason: "copies_prompt" });
  });

  it("accepts a genuine attempt of adequate length that isn't the prompt", () => {
    expect(checkSubstance("The greedy pick can't be undone once a lighter edge shows up later.", prompt)).toEqual({ ok: true });
  });
});

describe("trust-state gating (TASK-04 / TASK-09)", () => {
  const eligible: Record<string, TrustState> = {
    "claim-verified": "verified_source",
    "claim-exec": "verified_execution",
    "claim-sourced": "sourced",
    "claim-disputed": "disputed",
    "claim-interpretive": "interpretive",
    "claim-unsupported": "unsupported",
  };

  it("passes when every criterion anchors to a test-eligible claim", () => {
    const r = rubric([
      crit("a", 1, { claimId: "claim-verified" }),
      crit("b", 1, { claimId: "claim-exec" }),
      crit("c", 1, { claimId: "claim-sourced" }),
    ]);
    expect(() => assertRubricGradeable(r, eligible)).not.toThrow();
  });

  it("rejects a criterion anchored to a disputed claim (never grade disagreement as wrong)", () => {
    const r = rubric([crit("a", 1, { claimId: "claim-disputed" })]);
    expect(() => assertRubricGradeable(r, eligible)).toThrow(UngradeableCriterionError);
  });

  it("rejects interpretive and unsupported anchors too", () => {
    const rInterp = rubric([crit("a", 1, { claimId: "claim-interpretive" })]);
    const rUnsup = rubric([crit("a", 1, { claimId: "claim-unsupported" })]);
    expect(() => assertRubricGradeable(rInterp, eligible)).toThrow(UngradeableCriterionError);
    expect(() => assertRubricGradeable(rUnsup, eligible)).toThrow(UngradeableCriterionError);
  });

  it("rejects a criterion with no resolvable claim (unresolved is not gradeable)", () => {
    const rNoClaim = rubric([crit("a", 1)]);
    const rUnknown = rubric([crit("a", 1, { claimId: "claim-missing" })]);
    expect(() => assertRubricGradeable(rNoClaim, eligible)).toThrow(UngradeableCriterionError);
    expect(() => assertRubricGradeable(rUnknown, eligible)).toThrow(UngradeableCriterionError);
  });
});
