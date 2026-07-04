import { beforeEach, describe, expect, it } from "vitest";
import { TrustLedger } from "@/lib/domain/trust";
import { createDb, ledgerFor, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { getPrefs, updatePrefs } from "./prefs";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("preferences service", () => {
  it("returns default prefs for the seeded user", () => {
    const p = getPrefs(USER)!;
    expect(p.review.targetRetention).toBe(90);
    expect(p.activeListening.closeGate).toBe(true);
  });

  it("patches one section without touching the others", () => {
    updatePrefs(USER, "review", { targetRetention: 85, drills: false });
    const p = getPrefs(USER)!;
    expect(p.review.targetRetention).toBe(85);
    expect(p.review.drills).toBe(false);
    expect(p.review.dailyLimit).toBe(40); // untouched
    expect(p.activeListening.predict).toBe(true); // other section untouched
  });

  it("SETTINGS-08: changing verification/review prefs never mutates the ledger", () => {
    const topic = globalThis.__verilearnDb!.topics.get("topic_dijkstra")!;
    const before = ledgerFor(topic).snapshot(topic.claims);
    updatePrefs(USER, "activeListening", { closeGate: false, cloze: true });
    updatePrefs(USER, "review", { confidenceGate: false });
    const after = new TrustLedger().load(topic.events).snapshot(topic.claims);
    expect([...after.entries()]).toEqual([...before.entries()]); // ledger unchanged
  });

  it("returns null for an unknown user", () => {
    expect(getPrefs("nobody")).toBeNull();
    expect(updatePrefs("nobody", "privacy", { analytics: false })).toBeNull();
  });
});
