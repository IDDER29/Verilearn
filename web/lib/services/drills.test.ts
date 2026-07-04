import { beforeEach, describe, expect, it } from "vitest";
import { toWatching } from "@/lib/domain/gap";
import { createDb, gapsOf, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { blindSpotOutcomes, blindSpotSummary, nextDrillFor, submitDrillAnswer } from "./drills";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("seeded error-drills (ANALYTICS-07 / REVIEW-06)", () => {
  it("serves the first not-yet-attempted drill for the learner's own topics", () => {
    const drill = nextDrillFor(USER);
    expect(drill).not.toBeNull();
    expect(drill!.topicTitle).toBe("Dijkstra's algorithm");
    expect(drill!.statement.length).toBeGreaterThan(0);
  });

  it("returns null once every drill has been attempted", () => {
    let drill = nextDrillFor(USER);
    while (drill) {
      submitDrillAnswer(USER, drill.id, true, SEED_NOW);
      drill = nextDrillFor(USER);
    }
    expect(nextDrillFor(USER)).toBeNull();
  });

  it("computes a genuine catch/miss verdict from the drill's real answer", () => {
    const correctGuess = submitDrillAnswer(USER, "drill_dijkstra_2", true, SEED_NOW); // isCorrect: true
    expect(correctGuess.ok).toBe(true);
    expect(correctGuess.caught).toBe(true);
    expect(correctGuess.actualCorrect).toBe(true);

    const wrongGuess = submitDrillAnswer(USER, "drill_dijkstra_1", true, SEED_NOW); // isCorrect: false
    expect(wrongGuess.ok).toBe(true);
    expect(wrongGuess.caught).toBe(false);
    expect(wrongGuess.explanation).toBeTruthy();
  });

  it("rejects a drill that doesn't exist", () => {
    const res = submitDrillAnswer(USER, "drill_nope", true, SEED_NOW);
    expect(res.ok).toBe(false);
  });

  it("rejects re-answering an already-answered drill", () => {
    submitDrillAnswer(USER, "drill_dijkstra_1", true, SEED_NOW);
    const again = submitDrillAnswer(USER, "drill_dijkstra_1", false, SEED_NOW);
    expect(again.ok).toBe(false);
    expect(again.error).toMatch(/already answered/i);
  });

  it("rejects a foreign learner's drill answer (fail-closed ownership)", () => {
    const res = submitDrillAnswer("someone_else", "drill_dijkstra_1", true, SEED_NOW);
    expect(res.ok).toBe(false);
  });

  it("REVIEW-14: honors the learner's Settings > Review 'seeded drills' toggle when off", () => {
    const db = globalThis.__verilearnDb!;
    const user = db.users.get(USER)!;
    db.users.set(USER, { ...user, prefs: { ...user.prefs, review: { ...user.prefs.review, drills: false } } });
    expect(nextDrillFor(USER)).toBeNull();
  });

  it("rejects drills on an archived topic", () => {
    const db = globalThis.__verilearnDb!;
    const topic = db.topics.get("topic_dijkstra")!;
    db.topics.set(topic.id, { ...topic, archived: true });
    const res = submitDrillAnswer(USER, "drill_dijkstra_1", true, SEED_NOW);
    expect(res.ok).toBe(false);
    expect(res.error).toMatch(/archived/i);
  });

  it("reports an honest 0/0 blind-spot summary before any attempt", () => {
    expect(blindSpotSummary(USER)).toEqual({ caught: 0, total: 0 });
  });

  it("tallies real catch/miss counts into the blind-spot summary", () => {
    submitDrillAnswer(USER, "drill_dijkstra_1", false, SEED_NOW); // caught (guess false, actual false)
    submitDrillAnswer(USER, "drill_dijkstra_2", false, SEED_NOW); // missed (guess false, actual true)
    expect(blindSpotSummary(USER)).toEqual({ caught: 1, total: 2 });
  });

  it("replays only attempts at-or-before asOf for the prior-window signal", () => {
    submitDrillAnswer(USER, "drill_dijkstra_1", false, SEED_NOW); // caught, at SEED_NOW
    submitDrillAnswer(USER, "drill_dijkstra_2", true, SEED_NOW + 1000); // caught, later

    expect(blindSpotOutcomes(USER, SEED_NOW)).toEqual([true]);
    expect(blindSpotOutcomes(USER)).toEqual([true, true]);
  });

  describe("GAP-07: a missed claim-anchored drill feeds the Gap Map", () => {
    it("opens a fresh gap on a missed drill for a claim with no tracked gap", () => {
      const before = gapsOf(globalThis.__verilearnDb!, USER).find((g) => g.gap.claimId === "topic_dijkstra_c1");
      expect(before).toBeUndefined();

      const res = submitDrillAnswer(USER, "drill_dijkstra_2", false, SEED_NOW); // isCorrect: true, guessed false → missed
      expect(res.caught).toBe(false);
      expect(res.gapReopened).toBe(true);

      const gap = gapsOf(globalThis.__verilearnDb!, USER).find((g) => g.gap.claimId === "topic_dijkstra_c1");
      expect(gap).toBeDefined();
      expect(gap!.gap.origin).toBe("drill");
      expect(gap!.gap.status).toBe("open");
    });

    it("does not touch the Gap Map when the drill is caught", () => {
      const res = submitDrillAnswer(USER, "drill_dijkstra_2", true, SEED_NOW); // caught
      expect(res.caught).toBe(true);
      expect(res.gapReopened).toBe(false);
      expect(gapsOf(globalThis.__verilearnDb!, USER).find((g) => g.gap.claimId === "topic_dijkstra_c1")).toBeUndefined();
    });

    it("regresses (reopens) an already-tracked gap on the same claim rather than duplicating it", () => {
      const db = globalThis.__verilearnDb!;
      // The seeded gap on topic_dijkstra_c6 (origin: conflict) — advance it to watching first
      // so a lapse has somewhere reopenable to regress to.
      const rec = gapsOf(db, USER).find((g) => g.gap.claimId === "topic_dijkstra_c6")!;
      rec.gap = toWatching(rec.gap, SEED_NOW);
      const countBefore = gapsOf(db, USER).length;

      const res = submitDrillAnswer(USER, "drill_dijkstra_1", true, SEED_NOW + 1); // isCorrect: false, guessed true → missed
      expect(res.gapReopened).toBe(true);

      const after = gapsOf(db, USER);
      expect(after.length).toBe(countBefore); // no duplicate gap opened
      const gap = after.find((g) => g.gap.claimId === "topic_dijkstra_c6")!;
      expect(gap.gap.status).toBe("reopened");
      expect(gap.gap.origin).toBe("conflict"); // origin trail is immutable — the original catch, not overwritten by the drill
    });

    it("never opens a gap for a drill with no claim anchor", () => {
      const db = globalThis.__verilearnDb!;
      db.drills.set("drill_unanchored", { id: "drill_unanchored", topicId: "topic_dijkstra", statement: "x", isCorrect: true, explanation: "y" });
      const before = gapsOf(db, USER).length;
      const res = submitDrillAnswer(USER, "drill_unanchored", false, SEED_NOW); // missed, but no claimId to anchor to
      expect(res.caught).toBe(false);
      expect(res.gapReopened).toBe(false);
      expect(gapsOf(db, USER).length).toBe(before);
    });
  });
});
