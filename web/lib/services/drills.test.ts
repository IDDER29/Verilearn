import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
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
});
