import { describe, expect, it } from "vitest";
import {
  LOW_CONFIDENCE_SAMPLE,
  SIGNAL_KEYS,
  computeSignals,
  type CalibrationSummary,
  type Signals,
} from "./signals";

/** `n` boolean outcomes with the first `hits` marked true. */
function outcomes(n: number, hits: number): boolean[] {
  return Array.from({ length: n }, (_, i) => i < hits);
}

const calib = (over: Partial<CalibrationSummary> = {}): CalibrationSummary => ({
  score: 0.8,
  direction: "well_calibrated",
  count: 10,
  ...over,
});

describe("shape: exactly four honest signals, no vanity fields (ANALYTICS-01)", () => {
  it("returns exactly the four signal keys and nothing else", () => {
    const s = computeSignals({});
    expect(Object.keys(s).sort()).toEqual([...SIGNAL_KEYS].sort());
    expect(Object.keys(s)).toHaveLength(4);
  });

  it("exposes exactly four canonical signal keys", () => {
    expect(SIGNAL_KEYS).toEqual(["retention", "transfer", "calibration", "blindSpot"]);
    expect(new Set(SIGNAL_KEYS).size).toBe(4);
  });

  it("carries no vanity fields (streaks, points, minutes, badges)", () => {
    const s = computeSignals({ reviews: outcomes(6, 4) }) as unknown as Record<string, unknown>;
    for (const banned of ["streak", "streaks", "points", "minutes", "minutesWatched", "badges", "score"]) {
      expect(s).not.toHaveProperty(banned);
    }
  });

  it("every signal has value / confidence / provenance and nothing else", () => {
    const s = computeSignals({ reviews: outcomes(6, 3) });
    for (const key of SIGNAL_KEYS) {
      expect(Object.keys(s[key as keyof Signals]).sort()).toEqual(["confidence", "provenance", "value"]);
    }
  });
});

describe("honest empty state — no data → null/none (ANALYTICS-08)", () => {
  it("all four signals are null/none with no inputs at all", () => {
    const s = computeSignals();
    for (const key of SIGNAL_KEYS) {
      const sig = s[key as keyof Signals];
      expect(sig.value).toBeNull();
      expect(sig.confidence).toBe("none");
      expect(sig.provenance).toMatch(/no data yet/);
    }
  });

  it("treats empty arrays and null calibration the same as absent (never a fake 0%)", () => {
    const s = computeSignals({ reviews: [], tasks: [], drills: [], calibration: null });
    for (const key of SIGNAL_KEYS) {
      expect(s[key as keyof Signals].value).toBeNull();
      expect(s[key as keyof Signals].confidence).toBe("none");
    }
  });

  it("a calibration summary with count 0 is empty, not a fabricated score", () => {
    const s = computeSignals({ calibration: calib({ count: 0, score: 0.5 }) });
    expect(s.calibration.value).toBeNull();
    expect(s.calibration.confidence).toBe("none");
  });
});

describe("low-confidence under the small-sample threshold (ANALYTICS-09)", () => {
  it("marks a sparse retention sample low but still reports the rate", () => {
    const s = computeSignals({ reviews: outcomes(LOW_CONFIDENCE_SAMPLE - 1, 2) });
    expect(s.retention.confidence).toBe("low");
    expect(s.retention.value).toBeCloseTo(2 / (LOW_CONFIDENCE_SAMPLE - 1), 10);
  });

  it("marks a sparse calibration summary low", () => {
    const s = computeSignals({ calibration: calib({ count: LOW_CONFIDENCE_SAMPLE - 1 }) });
    expect(s.calibration.confidence).toBe("low");
    expect(s.calibration.value).toBe(0.8);
  });

  it("promotes to ok exactly at the threshold", () => {
    const low = computeSignals({ tasks: outcomes(LOW_CONFIDENCE_SAMPLE - 1, 1) });
    const ok = computeSignals({ tasks: outcomes(LOW_CONFIDENCE_SAMPLE, 1) });
    expect(low.transfer.confidence).toBe("low");
    expect(ok.transfer.confidence).toBe("ok");
  });
});

describe("healthy inputs — numeric values with provenance", () => {
  it("retention = review recall rate with a tracing provenance", () => {
    const s = computeSignals({ reviews: outcomes(10, 7) });
    expect(s.retention.value).toBeCloseTo(0.7, 10);
    expect(s.retention.confidence).toBe("ok");
    expect(s.retention.provenance).toBe("retention ← FSRS review recall: 7/10");
  });

  it("transfer = applied-task pass rate", () => {
    const s = computeSignals({ tasks: outcomes(8, 6) });
    expect(s.transfer.value).toBeCloseTo(0.75, 10);
    expect(s.transfer.confidence).toBe("ok");
    expect(s.transfer.provenance).toContain("rubric-graded applied tasks");
    expect(s.transfer.provenance).toContain("6/8");
  });

  it("blindSpot = seeded-error-drill catch rate (caught/total)", () => {
    const s = computeSignals({ drills: outcomes(10, 4) });
    expect(s.blindSpot.value).toBeCloseTo(0.4, 10);
    expect(s.blindSpot.confidence).toBe("ok");
    expect(s.blindSpot.provenance).toBe("blind-spot ← seeded error-drill catch rate: 4/10");
  });

  it("calibration carries the score and names the direction in provenance", () => {
    const s = computeSignals({ calibration: calib({ score: 0.72, direction: "overconfident", count: 12 }) });
    expect(s.calibration.value).toBe(0.72);
    expect(s.calibration.confidence).toBe("ok");
    expect(s.calibration.provenance).toContain("overconfident");
    expect(s.calibration.provenance).toContain("n=12");
  });

  it("all-correct and all-wrong rates read 1 and 0, never null", () => {
    const perfect = computeSignals({ reviews: outcomes(6, 6) });
    const zero = computeSignals({ reviews: outcomes(6, 0) });
    expect(perfect.retention.value).toBe(1);
    expect(zero.retention.value).toBe(0); // a genuine, earned zero (distinct from empty)
    expect(zero.retention.confidence).toBe("ok");
  });
});

describe("signals degrade independently", () => {
  it("a missing source blanks only its own card, not the others", () => {
    const s = computeSignals({ reviews: outcomes(8, 6) }); // only retention has data
    expect(s.retention.confidence).toBe("ok");
    expect(s.transfer.confidence).toBe("none");
    expect(s.calibration.confidence).toBe("none");
    expect(s.blindSpot.confidence).toBe("none");
  });
});

describe("determinism", () => {
  it("identical inputs yield identical results", () => {
    const input = { reviews: outcomes(6, 4), tasks: outcomes(5, 3), drills: outcomes(7, 5), calibration: calib() };
    expect(computeSignals(input)).toEqual(computeSignals(input));
  });
});
