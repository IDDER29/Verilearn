import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { activeTopicCount, chooseFreeTopics, createTopic, FREE_TOPIC_CAP, listTopicSummaries, searchClaims } from "./topics";

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

  it("BILL-12: archived topics don't count against the cap, so a new one can be created", () => {
    const db = globalThis.__verilearnDb!;
    const someId = [...db.topics.keys()].find((id) => db.topics.get(id)!.ownerId === USER)!;
    db.topics.get(someId)!.archived = true;
    const r = createTopic(USER, { title: "Room again", level: "some background", goal: "learn it" });
    expect(r.ok).toBe(true);
  });
});

describe("chooseFreeTopics (BILL-12)", () => {
  it("archives everything not kept, and restores a previously-archived kept topic", () => {
    const db = globalThis.__verilearnDb!;
    // Two extra topics (simulating a former Pro account) plus the 3 seeded ones.
    db.users.get(USER)!.plan = "pro"; // lift the cap just to seed them
    const extra = createTopic(USER, { title: "Extra topic", level: "some background", goal: "learn it" });
    const r2 = createTopic(USER, { title: "Extra topic 2", level: "some background", goal: "learn it" });
    db.users.get(USER)!.plan = "free";
    void extra;

    const owned = listTopicSummaries(USER);
    expect(owned.length).toBe(5);
    const keep = owned.slice(0, FREE_TOPIC_CAP).map((t) => t.id);

    const result = chooseFreeTopics(USER, keep);
    expect(result.ok).toBe(true);
    expect(activeTopicCount(USER)).toBe(FREE_TOPIC_CAP);
    const after = listTopicSummaries(USER);
    for (const t of after) expect(t.archived).toBe(!keep.includes(t.id));

    void r2;
  });

  it("refuses a selection that isn't exactly the cap size", () => {
    const db = globalThis.__verilearnDb!;
    db.users.get(USER)!.plan = "pro";
    createTopic(USER, { title: "Extra topic", level: "some background", goal: "learn it" });
    db.users.get(USER)!.plan = "free";

    const owned = listTopicSummaries(USER);
    expect(owned.length).toBe(4);
    expect(chooseFreeTopics(USER, owned.slice(0, 1).map((t) => t.id)).ok).toBe(false); // too few
    expect(chooseFreeTopics(USER, owned.map((t) => t.id)).ok).toBe(false); // too many (all 4)
  });

  it("refuses a topic id the caller doesn't own", () => {
    const owned = listTopicSummaries(USER);
    const keep = [owned[0].id, owned[1].id, "not_mine"];
    expect(chooseFreeTopics(USER, keep).ok).toBe(false);
  });

  it("content and trust ledger are untouched by archiving — never deletion", () => {
    const db = globalThis.__verilearnDb!;
    const owned = listTopicSummaries(USER);
    const keep = owned.slice(0, FREE_TOPIC_CAP).map((t) => t.id);
    chooseFreeTopics(USER, keep);
    // every owned topic (archived or not) is still a real, readable record
    for (const t of owned) expect(db.topics.get(t.id)).toBeTruthy();
  });
});

describe("searchClaims — cross-topic claim search (HOME-07)", () => {
  it("finds the actual disputed claims across MULTIPLE topics, not just topics that have one", () => {
    const results = searchClaims(USER, "disputed");
    const topicIds = new Set(results.map((r) => r.topicId));
    expect(topicIds.size).toBeGreaterThan(1); // dijkstra AND merkle each have a disputed claim
    expect(results.every((r) => r.state === "disputed")).toBe(true);
    expect(results.every((r) => r.topicTitle.length > 0)).toBe(true);
  });

  it("finds a claim by free-text substring, case-insensitively", () => {
    const results = searchClaims(USER, "priority queue");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].text.toLowerCase()).toContain("priority queue");
  });

  it("the 'verified' operator only matches genuinely verified claims", () => {
    const results = searchClaims(USER, "verified");
    expect(results.length).toBeGreaterThan(0);
    expect(results.every((r) => r.state === "verified_execution" || r.state === "verified_source")).toBe(true);
  });

  it("returns nothing for an empty query, and nothing for a foreign/unowned account", () => {
    expect(searchClaims(USER, "")).toEqual([]);
    expect(searchClaims("someone_else", "disputed")).toEqual([]);
  });
});
