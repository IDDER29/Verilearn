import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { gradeCard } from "./review";
import { progressFor, signalDisplay } from "./progress";

declare global {
  var __verilearnDb: Db | undefined;
}

const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("progress signals", () => {
  it("reports honest empty signals before any activity", () => {
    const { signals } = progressFor(USER);
    expect(signals.retention.value).toBeNull();
    expect(signals.retention.confidence).toBe("none");
    expect(signals.transfer.value).toBeNull();
    expect(signals.blindSpot.value).toBeNull();
  });

  it("has exactly the four canonical signals and no vanity fields", () => {
    const { signals } = progressFor(USER);
    expect(Object.keys(signals).sort()).toEqual(["blindSpot", "calibration", "retention", "transfer"]);
  });

  it("computes retention from real graded reviews", () => {
    // grade 3 good, 1 again → retention 75%
    gradeCard(USER, "rc_topic_dijkstra_c1", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c2", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c3", "sure", "good", SEED_NOW);
    gradeCard(USER, "rc_topic_dijkstra_c4", "guessing", "again", SEED_NOW);
    const { signals, reviewCount } = progressFor(USER);
    expect(reviewCount).toBe(4);
    expect(signals.retention.value).toBeCloseTo(0.75, 5);
    expect(signals.retention.confidence).not.toBe("none");
  });

  it("signalDisplay renders empty and populated states honestly", () => {
    expect(signalDisplay(null, "none")).toEqual({ text: "—", sub: "Not enough data yet" });
    expect(signalDisplay(0.83, "ok").text).toBe("83%");
    expect(signalDisplay(0.5, "low").sub).toMatch(/low confidence/i);
  });
});
