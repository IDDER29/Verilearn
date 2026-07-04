import { describe, expect, it } from "vitest";
import {
  GapEvidenceError,
  MASTERY_THRESHOLD,
  applyReviewOutcome,
  closeGap,
  noteOriginHit,
  onLapse,
  openGap,
  toWatching,
  type Gap,
  type OpenGapInput,
} from "./gap";

const SEED: OpenGapInput = {
  id: "gap-1",
  claimId: "claim-neg-edges",
  topicId: "topic-graphs",
  origin: "review",
  severity: "med",
};

/** Drive a fresh gap all the way to `closed` for reuse in reopen tests. */
function closedGap(now = 400): Gap {
  const open = openGap(SEED, 100);
  const watching = toWatching(open, 200);
  return closeGap(watching, { successfulReviews: MASTERY_THRESHOLD }, now);
}

describe("openGap (GAP-01/07 intake)", () => {
  it("creates an Open gap with a seeded created event (from: null)", () => {
    const g = openGap(SEED, 100);
    expect(g.status).toBe("open");
    expect(g.history).toHaveLength(1);
    expect(g.history[0]).toMatchObject({ at: 100, from: null, to: "open", reason: "created" });
  });

  it("defaults severity to med and preserves the origin", () => {
    const g = openGap({ id: "g", claimId: "c", topicId: "t", origin: "test" }, 1);
    expect(g.severity).toBe("med");
    expect(g.origin).toBe("test");
  });

  it("honors an explicit severity", () => {
    const g = openGap({ ...SEED, severity: "high" }, 1);
    expect(g.severity).toBe("high");
  });

  it("seeds contributingOrigins with just the founding origin", () => {
    const g = openGap(SEED, 100);
    expect(g.contributingOrigins).toEqual(["review"]);
  });
});

describe("noteOriginHit — explicit cross-origin merge policy (GAP-07)", () => {
  it("appends a genuinely new origin, leaving the founding origin unchanged", () => {
    const g = openGap(SEED, 100); // origin: review
    const hit = noteOriginHit(g, "test");
    expect(hit.origin).toBe("review"); // the founding channel is immutable
    expect(hit.contributingOrigins).toEqual(["review", "test"]);
  });

  it("is a no-op (same reference) when that origin already contributed", () => {
    const g = openGap(SEED, 100);
    const hit = noteOriginHit(g, "review");
    expect(hit).toBe(g);
  });

  it("is a no-op on a repeat hit from an already-recorded second origin", () => {
    const g = openGap(SEED, 100);
    const first = noteOriginHit(g, "task");
    const second = noteOriginHit(first, "task");
    expect(second).toBe(first);
    expect(second.contributingOrigins).toEqual(["review", "task"]);
  });

  it("accumulates three distinct origins in the order they hit", () => {
    let g = openGap(SEED, 100);
    g = noteOriginHit(g, "test");
    g = noteOriginHit(g, "drill");
    expect(g.contributingOrigins).toEqual(["review", "test", "drill"]);
  });

  it("never mutates history — provenance and lifecycle are tracked separately", () => {
    const g = openGap(SEED, 100);
    const hit = noteOriginHit(g, "conflict");
    expect(hit.history).toBe(g.history);
  });
});

describe("full lifecycle open → watching → closed (GAP-05)", () => {
  it("advances through each state, appending one event per transition", () => {
    const open = openGap(SEED, 100);
    const watching = toWatching(open, 200);
    const closed = closeGap(watching, { successfulReviews: 2 }, 300);

    expect(open.status).toBe("open");
    expect(watching.status).toBe("watching");
    expect(closed.status).toBe("closed");

    expect(open.history).toHaveLength(1);
    expect(watching.history).toHaveLength(2);
    expect(closed.history).toHaveLength(3);
    expect(closed.history.map((e) => e.reason)).toEqual(["created", "to-watching", "closed"]);
  });

  it("preserves origin, claimId, topicId, and severity across the lifecycle", () => {
    const closed = closedGap();
    expect(closed.origin).toBe("review");
    expect(closed.claimId).toBe("claim-neg-edges");
    expect(closed.topicId).toBe("topic-graphs");
    expect(closed.severity).toBe("med"); // unchanged: no lapse escalated it
  });

  it("does not mutate the input gap (transitions are pure)", () => {
    const open = openGap(SEED, 100);
    toWatching(open, 200);
    expect(open.status).toBe("open");
    expect(open.history).toHaveLength(1);
  });
});

describe("toWatching legality", () => {
  it("advances a reopened gap to watching", () => {
    const reopened = onLapse(closedGap(), 500);
    expect(reopened.status).toBe("reopened");
    const w = toWatching(reopened, 600);
    expect(w.status).toBe("watching");
  });

  it("is a no-op from watching or closed (returns the same gap)", () => {
    const watching = toWatching(openGap(SEED, 1), 2);
    expect(toWatching(watching, 3)).toBe(watching);

    const closed = closedGap();
    expect(toWatching(closed, 999)).toBe(closed);
  });
});

describe("closeGap requires evidence of mastery (GAP-05)", () => {
  it("throws GapEvidenceError when evidence is below threshold", () => {
    const watching = toWatching(openGap(SEED, 1), 2);
    expect(() => closeGap(watching, { successfulReviews: MASTERY_THRESHOLD - 1 }, 3)).toThrow(
      GapEvidenceError,
    );
  });

  it("closes when evidence meets the threshold", () => {
    const watching = toWatching(openGap(SEED, 1), 2);
    const closed = closeGap(watching, { successfulReviews: MASTERY_THRESHOLD }, 3);
    expect(closed.status).toBe("closed");
  });

  it("never auto-closes directly from Open — close is a no-op from Open", () => {
    const open = openGap(SEED, 1);
    // Even with abundant evidence, an Open gap must pass through Watching first.
    expect(closeGap(open, { successfulReviews: 99 }, 2)).toBe(open);
  });

  it("closing an already-closed gap is a no-op (illegal transition)", () => {
    const closed = closedGap();
    expect(closeGap(closed, { successfulReviews: 99 }, 900)).toBe(closed);
    expect(closed.history).toHaveLength(3);
  });
});

describe("onLapse auto-reopen — THE headline mechanic (GAP-06)", () => {
  it("auto-reopens a CLOSED gap on a later lapse, escalating severity", () => {
    const closed = closedGap(400);
    expect(closed.status).toBe("closed");
    expect(closed.severity).toBe("med");

    const reopened = onLapse(closed, 500);

    expect(reopened.status).toBe("reopened");
    expect(reopened.severity).toBe("high"); // med → high
    expect(reopened.history).toHaveLength(4);
    expect(reopened.history[3]).toMatchObject({
      from: "closed",
      to: "reopened",
      reason: "reopened-lapse",
      at: 500,
    });
    // The prior closed period is preserved, nothing overwritten.
    expect(reopened.history[2]).toMatchObject({ to: "closed" });
  });

  it("reopens a WATCHING gap too (a regression before the system trusted it)", () => {
    const watching = toWatching(openGap(SEED, 1), 2);
    const reopened = onLapse(watching, 3);
    expect(reopened.status).toBe("reopened");
    expect(reopened.history.at(-1)).toMatchObject({ from: "watching", to: "reopened" });
  });

  it("is a no-op when the gap is already Open or Reopened", () => {
    const open = openGap(SEED, 1);
    expect(onLapse(open, 2)).toBe(open);

    const reopened = onLapse(closedGap(), 500);
    expect(onLapse(reopened, 600)).toBe(reopened);
  });

  it("caps escalated severity at high across repeated reopen cycles", () => {
    // close → lapse (med→high) → rewatch → close → lapse (high stays high)
    let g = closedGap(400);
    g = onLapse(g, 500); // high
    g = toWatching(g, 600);
    g = closeGap(g, { successfulReviews: 2 }, 700);
    g = onLapse(g, 800);
    expect(g.severity).toBe("high");
  });
});

describe("applyReviewOutcome (GAP-06 / REVIEW-07)", () => {
  it("reopens a closed gap on a rating of Again", () => {
    const closed = closedGap();
    const reopened = applyReviewOutcome(closed, {
      claimId: closed.claimId,
      rating: "again",
      now: 500,
    });
    expect(reopened.status).toBe("reopened");
    expect(reopened.severity).toBe("high");
    expect(reopened.history.at(-1)).toMatchObject({ reason: "reopened-review-again", at: 500 });
  });

  it("a GOOD review does NOT reopen (returns the gap unchanged)", () => {
    const closed = closedGap();
    const same = applyReviewOutcome(closed, { claimId: closed.claimId, rating: "good", now: 500 });
    expect(same).toBe(closed);
    expect(same.status).toBe("closed");
    expect(same.history).toHaveLength(3);
  });

  it("does not reopen on hard or easy either", () => {
    const closed = closedGap();
    expect(applyReviewOutcome(closed, { claimId: closed.claimId, rating: "hard", now: 5 })).toBe(closed);
    expect(applyReviewOutcome(closed, { claimId: closed.claimId, rating: "easy", now: 5 })).toBe(closed);
  });

  it("ignores an Again outcome for a DIFFERENT claim (no-op)", () => {
    const closed = closedGap();
    const same = applyReviewOutcome(closed, { claimId: "some-other-claim", rating: "again", now: 500 });
    expect(same).toBe(closed);
  });

  it("is a no-op on an Open gap (nothing to reopen)", () => {
    const open = openGap(SEED, 1);
    expect(applyReviewOutcome(open, { claimId: open.claimId, rating: "again", now: 2 })).toBe(open);
  });
});

describe("history grows monotonically (append-only, GAP-06 invariant)", () => {
  it("never shrinks and adds exactly one event per successful transition", () => {
    const open = openGap(SEED, 100);
    const watching = toWatching(open, 200);
    const closed = closeGap(watching, { successfulReviews: 2 }, 300);
    const reopened = onLapse(closed, 400);
    const rewatch = toWatching(reopened, 500);

    const lengths = [open, watching, closed, reopened, rewatch].map((g) => g.history.length);
    expect(lengths).toEqual([1, 2, 3, 4, 5]);

    // Each stage's history is a prefix of the next (nothing overwritten).
    for (let i = 1; i < lengths.length; i++) {
      expect(lengths[i]).toBeGreaterThan(lengths[i - 1]);
    }
    // The original creation event still sits at index 0 at every stage.
    expect(rewatch.history[0]).toMatchObject({ from: null, to: "open", reason: "created" });
  });
});
