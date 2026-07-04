import { describe, expect, it } from "vitest";
import {
  DEFAULT_FSRS_PARAMS,
  DEFAULT_FSRS_WEIGHTS,
  RATINGS,
  newCard,
  nextIntervals,
  retrievability,
  schedule,
  type FsrsCard,
  type Rating,
} from "./fsrs";

const DAY = 86_400_000;
const T0 = 1_000_000_000_000; // fixed epoch ms; keeps everything deterministic

/** A matured review card whose last review was `elapsedDays` in the past. */
function matureCard(elapsedDays: number, overrides: Partial<FsrsCard> = {}): FsrsCard {
  return {
    stability: 10,
    difficulty: 5,
    due: T0,
    lastReview: T0 - elapsedDays * DAY,
    reps: 5,
    lapses: 0,
    state: "review",
    ...overrides,
  };
}

describe("newCard factory", () => {
  it("produces a fresh, immediately-due new card", () => {
    const c = newCard(T0);
    expect(c).toEqual({
      stability: 0,
      difficulty: 0,
      due: T0,
      lastReview: null,
      reps: 0,
      lapses: 0,
      state: "new",
    });
  });
});

describe("default weights", () => {
  it("ships 17 FSRS-4.5 weights", () => {
    expect(DEFAULT_FSRS_WEIGHTS).toHaveLength(17);
    expect(DEFAULT_FSRS_PARAMS.requestRetention).toBe(0.9);
  });
});

describe("interval monotonicity across ratings (REVIEW-04)", () => {
  it("increases again → hard → good → easy for a new card", () => {
    const i = nextIntervals(newCard(T0), T0);
    expect(i.again).toBeLessThan(i.hard);
    expect(i.hard).toBeLessThan(i.good);
    expect(i.good).toBeLessThan(i.easy);
  });

  it("increases again → hard → good → easy for a matured review card", () => {
    const i = nextIntervals(matureCard(10), T0);
    expect(i.again).toBeLessThan(i.hard);
    expect(i.hard).toBeLessThan(i.good);
    expect(i.good).toBeLessThan(i.easy);
  });

  it("the 'again' projection is always under a day", () => {
    expect(nextIntervals(matureCard(10), T0).again).toBeLessThan(1);
    expect(nextIntervals(newCard(T0), T0).again).toBeLessThan(1);
  });

  it("schedule agrees with nextIntervals on the chosen rating's due date", () => {
    const card = matureCard(10);
    const proj = nextIntervals(card, T0);
    for (const rating of RATINGS) {
      const next = schedule(card, rating, T0);
      const expectedDue = T0 + Math.round(proj[rating] * DAY);
      expect(next.due).toBe(expectedDue);
    }
  });
});

describe("lapse behavior on 'again' (REVIEW-04)", () => {
  it("resets stability low, increments lapses, and enters relearning", () => {
    const card = matureCard(10, { stability: 40, lapses: 1 });
    const next = schedule(card, "again", T0);
    expect(next.state).toBe("relearning");
    expect(next.lapses).toBe(2);
    expect(next.stability).toBeLessThan(card.stability);
  });

  it("schedules the lapsed card in under a day", () => {
    const next = schedule(matureCard(10), "again", T0);
    expect(next.due - T0).toBeLessThan(DAY);
    expect(next.due).toBeGreaterThan(T0);
  });

  it("a successful rating graduates to review, not relearning, and does not lapse", () => {
    const next = schedule(matureCard(10), "good", T0);
    expect(next.state).toBe("review");
    expect(next.lapses).toBe(0);
    expect(next.due - T0).toBeGreaterThanOrEqual(DAY);
  });

  it("advances reps by exactly one per rating", () => {
    const card = matureCard(10);
    expect(schedule(card, "good", T0).reps).toBe(card.reps + 1);
    expect(schedule(card, "again", T0).reps).toBe(card.reps + 1);
  });
});

describe("difficulty clamping to [1, 10]", () => {
  it("stays within bounds after any single rating", () => {
    const card = matureCard(10);
    for (const rating of RATINGS) {
      const d = schedule(card, rating, T0).difficulty;
      expect(d).toBeGreaterThanOrEqual(1);
      expect(d).toBeLessThanOrEqual(10);
    }
  });

  it("clamps at the ceiling under repeated 'again'", () => {
    let card = matureCard(10, { difficulty: 9.5 });
    let t = T0;
    for (let k = 0; k < 20; k++) {
      card = schedule(card, "again", t);
      t += DAY;
    }
    expect(card.difficulty).toBe(10);
  });

  it("clamps at the floor under repeated 'easy'", () => {
    let card = matureCard(10, { difficulty: 1.5 });
    let t = T0;
    for (let k = 0; k < 20; k++) {
      card = schedule(card, "easy", t);
      t += DAY;
    }
    expect(card.difficulty).toBe(1);
  });
});

describe("retrievability decay over time", () => {
  it("is 1 for a never-reviewed card", () => {
    expect(retrievability(newCard(T0), T0)).toBe(1);
  });

  it("decays monotonically as time passes since last review", () => {
    const card = matureCard(0); // last reviewed exactly at T0
    const rNow = retrievability(card, T0);
    const rSoon = retrievability(card, T0 + 5 * DAY);
    const rLater = retrievability(card, T0 + 20 * DAY);
    expect(rNow).toBeCloseTo(1, 5);
    expect(rSoon).toBeLessThan(rNow);
    expect(rLater).toBeLessThan(rSoon);
    expect(rLater).toBeGreaterThan(0);
  });

  it("recovers ~target retention after one stability of elapsed time", () => {
    const card = matureCard(0, { stability: 10 });
    // At elapsed == stability, R should be ~0.9 (the model's default target).
    expect(retrievability(card, T0 + 10 * DAY)).toBeCloseTo(0.9, 2);
  });
});

describe("target retention affects intervals (REVIEW-04 / REVIEW-13)", () => {
  it("a higher target retention yields shorter intervals", () => {
    const card = matureCard(10);
    const relaxed = nextIntervals(card, T0, { requestRetention: 0.8 });
    const strict = nextIntervals(card, T0, { requestRetention: 0.95 });
    expect(strict.good).toBeLessThan(relaxed.good);
  });

  it("respects the maximum-interval cap", () => {
    const card = matureCard(10, { stability: 5000 });
    const next = schedule(card, "easy", T0, { maximumInterval: 30 });
    expect(next.due - T0).toBeLessThanOrEqual(30 * DAY + 1);
  });
});

describe("determinism", () => {
  it("produces identical output for identical inputs", () => {
    const card = matureCard(7);
    const a = schedule(card, "good", T0);
    const b = schedule(card, "good", T0);
    expect(a).toEqual(b);
  });

  it("does not mutate the input card", () => {
    const card = matureCard(7);
    const snapshot = { ...card };
    schedule(card, "again", T0);
    nextIntervals(card, T0);
    retrievability(card, T0 + DAY);
    expect(card).toEqual(snapshot);
  });

  it("is stable across all ratings on repeated calls", () => {
    const card = newCard(T0);
    for (const rating of RATINGS as Rating[]) {
      expect(schedule(card, rating, T0)).toEqual(schedule(card, rating, T0));
    }
  });
});
