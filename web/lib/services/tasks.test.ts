import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { getTasks, gradeSubmission } from "./tasks";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("tasks service (produce step)", () => {
  it("exposes the seeded source-anchored task with its rubric", () => {
    const tasks = getTasks(USER, "topic_dijkstra");
    expect(tasks).toHaveLength(1);
    expect(tasks[0].criteria).toHaveLength(3);
    expect(tasks[0].criteria.every((c) => c.sourceId)).toBe(true); // each criterion source-traced
  });

  it("grades a full answer as a pass and a thin answer as a fail (revise-to-pass)", () => {
    const good = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(good.passed).toBe(true);
    expect(good.scorePct).toBe(100);

    const thin = gradeSubmission(USER, "task_dijkstra_1", "It just doesn't work sometimes.");
    expect(thin.passed).toBe(false);
    expect(thin.scorePct).toBeLessThan(75);

    // re-grade with a better answer flips to pass (revise-to-pass) and persists
    const revised = gradeSubmission(USER, "task_dijkstra_1", "greedy finality fails when a negative edge appears; Bellman-Ford handles it.");
    expect(revised.passed).toBe(true);
    expect(getTasks(USER, "topic_dijkstra")[0].passed).toBe(true);
  });

  it("rejects empty answers and foreign tasks", () => {
    expect(gradeSubmission(USER, "task_dijkstra_1", "  ").ok).toBe(false);
    expect(gradeSubmission("intruder", "task_dijkstra_1", "x").ok).toBe(false);
  });
});
