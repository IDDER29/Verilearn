import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { createTopic, listTopicSummaries } from "./topics";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("createTopic — server-side gate (VERIFY-02)", () => {
  it("rejects a missing/short title, level, or goal (not just the title)", () => {
    expect(createTopic(USER, { title: "x", level: "I know some graphs", goal: "Understand it" }).ok).toBe(false);
    expect(createTopic(USER, { title: "Red-black trees", level: "no", goal: "Understand it" }).ok).toBe(false);
    expect(createTopic(USER, { title: "Red-black trees", level: "comfortable with BSTs", goal: "   " }).ok).toBe(false);
  });

  it("creates a topic and runs the pipeline when all three fields are valid", () => {
    globalThis.__verilearnDb!.users.get(USER)!.plan = "pro"; // lift the Free cap for this case
    const before = listTopicSummaries(USER).length;
    const r = createTopic(USER, { title: "Red-black trees", level: "comfortable with BSTs", goal: "Understand rotations" });
    expect(r.ok).toBe(true);
    expect(listTopicSummaries(USER).length).toBe(before + 1);
  });

  it("VERIFY-04: persists the real per-stage pipeline detail on the topic", () => {
    globalThis.__verilearnDb!.users.get(USER)!.plan = "pro";
    const r = createTopic(USER, { title: "AVL trees", level: "know BSTs well", goal: "understand balancing" });
    expect(r.ok).toBe(true);
    if (r.ok) {
      const topic = globalThis.__verilearnDb!.topics.get(r.topicId)!;
      expect(topic.pipelineStages && topic.pipelineStages.length).toBeGreaterThan(0);
      // every stage carries a non-empty real detail string
      expect(topic.pipelineStages!.every((s) => typeof s.detail === "string" && s.detail.length > 0)).toBe(true);
      expect(topic.pipelineStages!.some((s) => s.stage === "triage")).toBe(true);
    }
  });

  it("VERIFY-15: a topic that fails verification is marked failed with the failed stage recorded", () => {
    globalThis.__verilearnDb!.users.get(USER)!.plan = "pro";
    // "everything" is too broad → triage refuses → the run stops, non-ok.
    const r = createTopic(USER, { title: "everything", level: "I know a little", goal: "understand it all" });
    expect(r.ok).toBe(true); // the topic record still exists…
    if (r.ok) {
      const topic = globalThis.__verilearnDb!.topics.get(r.topicId)!;
      expect(topic.status).toBe("failed"); // …but flagged failed, never "ready"
      const stages = topic.pipelineStages!;
      expect(stages[stages.length - 1].status).toBe("failed"); // stopped at the failing stage
    }
  });

  it("enforces the Free 3-topic cap server-side", () => {
    // Seed user is Free with 3 topics already.
    const r = createTopic(USER, { title: "A fourth topic", level: "some background", goal: "learn it" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Free plan is limited/);
  });
});
