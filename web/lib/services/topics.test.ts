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

  it("enforces the Free 3-topic cap server-side", () => {
    // Seed user is Free with 3 topics already.
    const r = createTopic(USER, { title: "A fourth topic", level: "some background", goal: "learn it" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/Free plan is limited/);
  });
});
