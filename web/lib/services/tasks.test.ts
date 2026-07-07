import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { getTasks, gradeSubmission } from "./tasks";
import { quarantineClaimForAdmin } from "./quarantine";

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
    expect(tasks[0].type).toBe("reason"); // TASK-01: task carries a cognitive-demand type
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

  it("TASK-06: the model answer is gated behind a pass", () => {
    // Before any pass, getTasks must not leak the model answer.
    expect(getTasks(USER, "topic_dijkstra")[0].modelAnswer).toBeUndefined();
    // A failing grade doesn't reveal it either.
    const thin = gradeSubmission(USER, "task_dijkstra_1", "I don't really know the reason for that.");
    expect(thin.modelAnswer).toBeUndefined();
    // A pass returns it, and it's now exposed via getTasks.
    const good = gradeSubmission(USER, "task_dijkstra_1", "The greedy finality fails when a negative edge lowers a finalised distance; use Bellman-Ford.");
    expect(good.passed).toBe(true);
    expect(good.modelAnswer && good.modelAnswer.length).toBeGreaterThan(0);
    expect(getTasks(USER, "topic_dijkstra")[0].modelAnswer).toBeTruthy();
  });

  it("rejects empty answers and foreign tasks", () => {
    expect(gradeSubmission(USER, "task_dijkstra_1", "  ").ok).toBe(false);
    expect(gradeSubmission("intruder", "task_dijkstra_1", "x").ok).toBe(false);
  });

  it("BILL-12: refuses to grade a task on an archived topic", () => {
    const db = globalThis.__verilearnDb!;
    db.topics.get("topic_dijkstra")!.archived = true;
    const r = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/archived/i);
  });

  it("TASK-22: rejects a too-short submission and one that just echoes the prompt back", () => {
    const tooShort = gradeSubmission(USER, "task_dijkstra_1", "not sure why");
    expect(tooShort.ok).toBe(false);
    expect(tooShort.error).toMatch(/too short/i);

    const echoed = gradeSubmission(
      USER,
      "task_dijkstra_1",
      "Explain why Dijkstra's algorithm can fail on a graph with negative edge weights, and what to use instead.",
    );
    expect(echoed.ok).toBe(false);
    expect(echoed.error).toMatch(/question, not an answer/i);

    // A genuine (if thin) attempt of adequate length still grades normally.
    const genuine = gradeSubmission(USER, "task_dijkstra_1", "I don't really know the reason for that.");
    expect(genuine.ok).toBe(true);
    expect(genuine.passed).toBe(false);
  });

  it("TASK-14: a missed claim-anchored criterion opens a task-origin gap; a later hit advances it", () => {
    const db = globalThis.__verilearnDb!;
    const before = [...db.gaps.values()].filter((g) => g.userId === USER).length;

    // A thin answer misses every criterion → opens gaps on the anchored claims
    // (c2 and c5; c2's second criterion is a no-op on the now-open gap).
    const thin = gradeSubmission(USER, "task_dijkstra_1", "I don't really know the reason for that.");
    expect(thin.gapsOpened).toBe(2);
    const gaps = [...db.gaps.values()].filter((g) => g.userId === USER);
    expect(gaps.length).toBe(before + 2);
    const g2 = gaps.find((g) => g.gap.claimId === "topic_dijkstra_c2")!;
    expect(g2.gap.origin).toBe("task");
    expect(g2.gap.status).toBe("open");

    // A full pass hits every criterion → advances the tracked gaps toward closure.
    const good = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(good.passed).toBe(true);
    expect(good.gapsOpened).toBe(0); // hits open nothing
    const g2b = [...db.gaps.values()].find((g) => g.userId === USER && g.gap.claimId === "topic_dijkstra_c2")!;
    expect(g2b.gap.status).toBe("watching");
  });

  it("TASK-21: flags a recorded pass for re-verification when a criterion's claim later becomes disputed", () => {
    const db = globalThis.__verilearnDb!;
    // Pass the task cleanly.
    const good = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(good.passed).toBe(true);
    expect(getTasks(USER, "topic_dijkstra")[0].needsReverify).toBeFalsy();

    // A criterion of this task anchors to topic_dijkstra_c2 — dispute it.
    const topic = db.topics.get("topic_dijkstra")!;
    topic.events.push({
      id: "ve_task21",
      claimId: "topic_dijkstra_c2",
      state: "disputed",
      producedBy: "system:verifier",
      producerVersion: "test",
      at: SEED_NOW,
      evidence: { method: "skeptic", detail: "contested", confidence: 0.3, resolved: false },
    });

    const view = getTasks(USER, "topic_dijkstra")[0];
    expect(view.passed).toBe(true); // the historical record is preserved…
    expect(view.needsReverify).toBe(true); // …but flagged stale until re-verified
  });

  it("TASK-04: refuses to grade when a criterion anchors to a non-eligible claim", () => {
    // Point a criterion at the disputed claim → the rubric is no longer gradeable.
    const db = globalThis.__verilearnDb!;
    const task = db.tasks.get("task_dijkstra_1")!;
    task.rubric.criteria[0].claimId = "topic_dijkstra_c6"; // disputed
    const r = gradeSubmission(USER, "task_dijkstra_1", "greedy finality fails; use Bellman-Ford.");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/verified or sourced/i);
  });

  it("TASK-04: also refuses to grade when a criterion's claim is quarantined (ADMIN-14) — not just disputed", () => {
    // Quarantine doesn't touch the ledger state (verified_source stays verified_source),
    // so the write-side gate must layer isQuarantined on top the same way Tests/Review
    // do — otherwise a learner could bank a passing grade on content T&S has held out.
    const claimId = "topic_dijkstra_c2"; // this task's criterion 0, verified_source
    expect(quarantineClaimForAdmin("user_ts_reviewer1", "trust_safety_lead", claimId, "topic_dijkstra", "test", SEED_NOW).ok).toBe(true);
    const r = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(r.ok).toBe(false);
    expect(r.error).toMatch(/verified or sourced/i);
  });

  it("TASK-21: also flags a recorded pass stale when a criterion's claim is quarantined (ADMIN-14), not just disputed", () => {
    const good = gradeSubmission(USER, "task_dijkstra_1", "A negative edge can lower an already-finalised distance, breaking the greedy cut argument; use Bellman-Ford instead.");
    expect(good.passed).toBe(true);
    expect(getTasks(USER, "topic_dijkstra")[0].needsReverify).toBeFalsy();

    expect(quarantineClaimForAdmin("user_ts_reviewer1", "trust_safety_lead", "topic_dijkstra_c2", "topic_dijkstra", "test", SEED_NOW).ok).toBe(true);

    const view = getTasks(USER, "topic_dijkstra")[0];
    expect(view.passed).toBe(true); // the historical record is preserved…
    expect(view.needsReverify).toBe(true); // …but flagged stale, same as a dispute
  });
});
