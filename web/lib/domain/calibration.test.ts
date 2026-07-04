import { describe, expect, it } from "vitest";
import {
  CALIBRATION_THRESHOLD,
  IMPLIED_PROBABILITY,
  MIN_RECORDS,
  calibrationScore,
  type CalibrationRecord,
  type CalibrationResult,
  type Confidence,
} from "./calibration";

/** Build `n` records at a fixed confidence with `correctCount` marked correct. */
function make(confidence: Confidence, n: number, correctCount: number): CalibrationRecord[] {
  return Array.from({ length: n }, (_, i) => ({ confidence, correct: i < correctCount }));
}

/** Narrow to the ok result (throws in tests if insufficient). */
function ok(records: readonly CalibrationRecord[]): CalibrationResult {
  const r = calibrationScore(records);
  if (r.status !== "ok") throw new Error(`expected ok, got ${r.status}`);
  return r;
}

describe("insufficient data (REVIEW-05 honest low-confidence state)", () => {
  it("returns insufficient_data with fewer than MIN_RECORDS records", () => {
    const r = calibrationScore(make("sure", MIN_RECORDS - 1, 2));
    expect(r.status).toBe("insufficient_data");
    if (r.status === "insufficient_data") {
      expect(r.count).toBe(MIN_RECORDS - 1);
      expect(r.required).toBe(MIN_RECORDS);
    }
  });

  it("returns insufficient_data for an empty set", () => {
    const r = calibrationScore([]);
    expect(r.status).toBe("insufficient_data");
    if (r.status === "insufficient_data") expect(r.count).toBe(0);
  });

  it("scores once exactly MIN_RECORDS records are present", () => {
    const r = calibrationScore(make("sure", MIN_RECORDS, MIN_RECORDS));
    expect(r.status).toBe("ok");
  });
});

describe("perfectly-calibrated set scores well", () => {
  it("sure→90% correct and guessing→30% correct reads well_calibrated with a high score", () => {
    // 10 sure, 9 correct (0.9 accuracy == implied); 10 guessing, 3 correct (0.3 == implied).
    const records = [...make("sure", 10, 9), ...make("guessing", 10, 3)];
    const r = ok(records);
    expect(r.direction).toBe("well_calibrated");
    // Mean implied (0.6) equals actual accuracy (0.6) → zero gap.
    expect(r.meanImpliedProbability).toBeCloseTo(0.6, 10);
    expect(r.actualAccuracy).toBeCloseTo(0.6, 10);
    expect(r.score).toBeGreaterThan(0.7);
  });

  it("gives a higher score to a well-calibrated set than to a wildly miscalibrated one", () => {
    const good = ok([...make("sure", 10, 9), ...make("guessing", 10, 3)]);
    const bad = ok(make("sure", 20, 2)); // sure but almost always wrong
    expect(good.score).toBeGreaterThan(bad.score);
  });
});

describe("direction of miscalibration (REVIEW-05)", () => {
  it("always-sure-but-often-wrong reads overconfident", () => {
    const r = ok(make("sure", 10, 2)); // implied 0.9, actual 0.2
    expect(r.direction).toBe("overconfident");
    expect(r.meanImpliedProbability - r.actualAccuracy).toBeGreaterThan(CALIBRATION_THRESHOLD);
  });

  it("always-guessing-but-often-right reads underconfident", () => {
    const r = ok(make("guessing", 10, 9)); // implied 0.3, actual 0.9
    expect(r.direction).toBe("underconfident");
    expect(r.actualAccuracy - r.meanImpliedProbability).toBeGreaterThan(CALIBRATION_THRESHOLD);
  });

  it("keeps a small gap inside the threshold as well_calibrated", () => {
    // implied 0.9, actual 0.85 → gap 0.05, safely inside the threshold band.
    const r = ok(make("sure", 20, 17));
    expect(Math.abs(r.meanImpliedProbability - r.actualAccuracy)).toBeLessThan(CALIBRATION_THRESHOLD);
    expect(r.direction).toBe("well_calibrated");
  });
});

describe("score bounds (Brier-style, inverted)", () => {
  it("a fully-correct always-sure set scores near 1", () => {
    const r = ok(make("sure", 20, 20)); // implied 0.9 vs outcome 1 → tiny error
    expect(r.score).toBeCloseTo(1 - 0.1 ** 2, 10); // 0.99
  });

  it("stays within [0,1]", () => {
    const r = ok([...make("sure", 5, 0), ...make("guessing", 5, 5)]);
    expect(r.score).toBeGreaterThanOrEqual(0);
    expect(r.score).toBeLessThanOrEqual(1);
  });
});

describe("per-bucket accuracy", () => {
  it("reports count, implied probability, and accuracy per bucket", () => {
    const records = [...make("sure", 4, 3), ...make("unsure", 2, 1), ...make("guessing", 4, 1)];
    const r = ok(records);
    expect(r.buckets.sure).toEqual({ count: 4, impliedProbability: IMPLIED_PROBABILITY.sure, accuracy: 0.75 });
    expect(r.buckets.unsure).toEqual({ count: 2, impliedProbability: IMPLIED_PROBABILITY.unsure, accuracy: 0.5 });
    expect(r.buckets.guessing).toEqual({ count: 4, impliedProbability: IMPLIED_PROBABILITY.guessing, accuracy: 0.25 });
  });

  it("reports null accuracy for an empty bucket", () => {
    const r = ok(make("sure", 6, 3));
    expect(r.buckets.sure.count).toBe(6);
    expect(r.buckets.unsure).toEqual({ count: 0, impliedProbability: IMPLIED_PROBABILITY.unsure, accuracy: null });
    expect(r.buckets.guessing.accuracy).toBeNull();
  });
});

describe("determinism", () => {
  it("returns identical results for identical inputs", () => {
    const records = [...make("sure", 6, 4), ...make("guessing", 4, 2)];
    expect(calibrationScore(records)).toEqual(calibrationScore(records));
  });
});
