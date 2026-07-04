import { describe, expect, it } from "vitest";
import {
  DEFAULT_PASS_BAR,
  MIN_READINESS_RECORDS,
  buildTest,
  eligibleClaims,
  isExpired,
  predictReadiness,
  scoreTest,
  type ReadinessSignals,
  type TestAnswer,
} from "./tests-engine";
import { TrustLedger, verificationId, type VerificationActor } from "./trust";
import type { Claim, Evidence, TrustState, VerificationEvent } from "./types";

const SYSTEM: VerificationActor = { id: "verifier", canVerify: true, isSME: false };

let atSeq = 1_000;
function ev(
  claimId: string,
  state: TrustState,
  evidence: Partial<Evidence> = {},
): VerificationEvent {
  const at = (atSeq += 1);
  return {
    id: verificationId(claimId, at),
    claimId,
    state,
    producedBy: "verifier",
    producerVersion: "v1",
    at,
    evidence: { method: "citation", sourceId: "src-1", detail: "", confidence: 0.9, resolved: true, ...evidence },
  };
}

function claim(id: string, sectionId = "s1"): Claim {
  return { id, topicId: "t1", sectionId, text: `claim ${id}` };
}

/** A ledger seeded so that each claim id maps to the given trust state. */
function seed(states: Record<string, TrustState>): TrustLedger {
  const l = new TrustLedger();
  for (const [id, state] of Object.entries(states)) {
    // Non-citation evidence for states that don't resolve to a source.
    const nonSource = state === "verified_execution" || state === "disputed" || state === "unsupported" || state === "interpretive";
    l.record(SYSTEM, ev(id, state, nonSource ? { method: state === "disputed" ? "skeptic" : "none", sourceId: undefined } : {}));
  }
  return l;
}

describe("eligibleClaims (TEST-02 spine rule)", () => {
  it("keeps verified & sourced claims, drops disputed/unsupported/interpretive", () => {
    const claims = ["a", "b", "c", "d", "e"].map((id) => claim(id));
    const ledger = seed({
      a: "verified_execution",
      b: "verified_source",
      c: "sourced",
      d: "disputed",
      e: "interpretive",
    });
    const eligible = eligibleClaims(claims, ledger).map((c) => c.id);
    expect(eligible).toEqual(["a", "b", "c"]);
  });

  it("a disputed claim can never be eligible", () => {
    const ledger = seed({ x: "disputed" });
    expect(eligibleClaims([claim("x")], ledger)).toEqual([]);
  });

  it("an unverified claim (no ledger entry, fail-closed to unsupported) is excluded", () => {
    const ledger = new TrustLedger();
    expect(eligibleClaims([claim("ghost")], ledger)).toEqual([]);
  });
});

describe("buildTest (TEST-02 deterministic, ledger-bound)", () => {
  it("draws questions only from eligible claims and never from disputed/unsupported", () => {
    const claims = ["a", "b", "c", "d"].map((id) => claim(id));
    const ledger = seed({ a: "sourced", b: "disputed", c: "verified_source", d: "unsupported" });
    const test = buildTest({ claims, ledger, count: 4, now: 5_000 });
    const ids = test.questions.map((q) => q.claimId);
    expect(ids).toEqual(["a", "c"]);
    expect(ids).not.toContain("b");
    expect(ids).not.toContain("d");
    expect(test.eligibleCount).toBe(2);
    expect(test.reducedCoverage).toBe(true); // wanted 4, only 2 eligible
    expect(test.startedAt).toBe(5_000);
  });

  it("selects deterministically by claim-id order (not input order), capped at count", () => {
    const claims = [claim("c3"), claim("c1"), claim("c2")];
    const ledger = seed({ c1: "sourced", c2: "sourced", c3: "sourced" });
    const test = buildTest({ claims, ledger, count: 2, now: 1 });
    expect(test.questions.map((q) => q.claimId)).toEqual(["c1", "c2"]);
    expect(test.reducedCoverage).toBe(false);
    expect(test.requestedCount).toBe(2);
  });

  it("binds each question to its claim's source and trust state", () => {
    const ledger = seed({ a: "verified_source" });
    const test = buildTest({ claims: [claim("a", "sec-2")], ledger, count: 1, now: 0 });
    expect(test.questions[0]).toMatchObject({
      claimId: "a",
      sectionId: "sec-2",
      trustState: "verified_source",
      sourceId: "src-1",
    });
  });

  it("returns an empty test with reducedCoverage when nothing is eligible", () => {
    const ledger = seed({ a: "disputed", b: "unsupported" });
    const test = buildTest({ claims: [claim("a"), claim("b")], ledger, count: 3, now: 9 });
    expect(test.questions).toEqual([]);
    expect(test.eligibleCount).toBe(0);
    expect(test.reducedCoverage).toBe(true);
  });
});

describe("scoreTest (pass bar boundary)", () => {
  const answers = (correct: number, total: number): TestAnswer[] =>
    Array.from({ length: total }, (_, i) => ({ correct: i < correct }));

  it("computes correct/total/pct", () => {
    const s = scoreTest(answers(3, 4));
    expect(s).toMatchObject({ correct: 3, total: 4, pct: 75, passBar: DEFAULT_PASS_BAR });
  });

  it("a score exactly at the default bar passes", () => {
    expect(scoreTest(answers(3, 4)).passed).toBe(true); // 75% == 75 bar
  });

  it("just below the bar fails", () => {
    const s = scoreTest(answers(7, 10)); // 70%
    expect(s.pct).toBe(70);
    expect(s.passed).toBe(false);
  });

  it("honors a custom pass bar (e.g. a 70% retake)", () => {
    expect(scoreTest(answers(7, 10), 70).passed).toBe(true);
  });

  it("an empty answer set scores 0% and fails", () => {
    const s = scoreTest([]);
    expect(s).toMatchObject({ correct: 0, total: 0, pct: 0, passed: false });
  });

  it("counts skipped answers as incorrect", () => {
    const s = scoreTest([{ correct: true }, { correct: false, skipped: true }]);
    expect(s.correct).toBe(1);
    expect(s.pct).toBe(50);
  });
});

describe("predictReadiness (TEST-01)", () => {
  const base: ReadinessSignals = { retention: 0.9, calibration: 0.8, coveredClaims: 10, reviewedClaims: 10 };

  it("produces a readiness within 0..100", () => {
    const r = predictReadiness(base);
    expect(r.readiness).toBeGreaterThanOrEqual(0);
    expect(r.readiness).toBeLessThanOrEqual(100);
    expect(r.lowConfidence).toBe(false);
    // 0.9*0.6 + 0.8*0.4 = 0.86 → 86, full coverage
    expect(r.readiness).toBe(86);
  });

  it("TASK-13: a strong task record nudges readiness up, a weak one down; absent → no change", () => {
    const none = predictReadiness(base).readiness; // 86
    const allPass = predictReadiness({ ...base, taskPassRate: 1 }).readiness;
    const allFail = predictReadiness({ ...base, taskPassRate: 0 }).readiness;
    expect(none).toBe(86);
    expect(allPass).toBeGreaterThan(none);
    expect(allFail).toBeLessThan(none);
    expect(allPass).toBeLessThanOrEqual(100);
    expect(allFail).toBeGreaterThanOrEqual(0);
  });

  it("clamps out-of-range signal inputs into 0..100", () => {
    const r = predictReadiness({ retention: 5, calibration: -2, coveredClaims: 4, reviewedClaims: 4 });
    expect(r.readiness).toBeGreaterThanOrEqual(0);
    expect(r.readiness).toBeLessThanOrEqual(100);
  });

  it("flags low confidence and returns 'not enough data yet' when there are no covered claims", () => {
    const r = predictReadiness({ retention: 0.9, calibration: 0.9, coveredClaims: 0, reviewedClaims: 0 });
    expect(r.readiness).toBe(0);
    expect(r.lowConfidence).toBe(true);
    expect(r.basis).toMatch(/not enough data/i);
  });

  it("flags low confidence when covered claims were verified but never reviewed, dragging readiness down", () => {
    const r = predictReadiness({ retention: 0.95, calibration: 0.95, coveredClaims: 8, reviewedClaims: 0 });
    expect(r.lowConfidence).toBe(true);
    expect(r.readiness).toBe(0); // zero coverage → suppressed
  });

  it("flags low confidence on thin review history (below the minimum)", () => {
    const r = predictReadiness({ retention: 0.9, calibration: 0.9, coveredClaims: 10, reviewedClaims: MIN_READINESS_RECORDS - 1 });
    expect(r.lowConfidence).toBe(true);
  });

  it("suppresses an artificially high readiness when disputed claims sit in scope", () => {
    const clean = predictReadiness(base);
    const withDisputed = predictReadiness({ ...base, disputedInScope: 5 });
    expect(withDisputed.readiness).toBeLessThan(clean.readiness);
    expect(withDisputed.readiness).toBeGreaterThanOrEqual(0);
  });
});

describe("isExpired (server-authoritative clock, TEST-19/22)", () => {
  it("is not expired before the duration elapses", () => {
    expect(isExpired(1_000, 60_000, 1_000 + 59_999)).toBe(false);
  });

  it("is expired exactly at the duration boundary", () => {
    expect(isExpired(1_000, 60_000, 1_000 + 60_000)).toBe(true);
  });

  it("is expired after the duration elapses", () => {
    expect(isExpired(1_000, 60_000, 1_000 + 120_000)).toBe(true);
  });

  it("cannot be reset backwards — an earlier 'now' than start is not expired", () => {
    expect(isExpired(5_000, 60_000, 4_000)).toBe(false);
  });
});
