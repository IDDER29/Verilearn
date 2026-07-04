import { describe, expect, it } from "vitest";
import { closeGap, onLapse, toWatching } from "@/lib/domain/gap";
import { eligibleClaims } from "@/lib/domain/tests-engine";
import { createDb, ledgerFor, reviewCardsOf, topicsOf, userByEmail, SEED_NOW } from "./db";
import { seedDb } from "./seed";

function freshDb() {
  const db = createDb();
  seedDb(db, SEED_NOW);
  return db;
}

describe("seed + store integration", () => {
  it("seeds the demo learner and three topics", () => {
    const db = freshDb();
    expect(db.topics.size).toBe(3);
    expect(userByEmail(db, "ADELINE@example.com")?.displayName).toBe("Adeline");
  });

  it("scopes topics by owner (no cross-user leakage)", () => {
    const db = freshDb();
    expect(topicsOf(db, "user_adeline")).toHaveLength(3);
    expect(topicsOf(db, "someone_else")).toHaveLength(0);
  });

  it("computes trust bars from the real ledger, not hard-coded", () => {
    const db = freshDb();
    const dijkstra = db.topics.get("topic_dijkstra")!;
    // 5 of 6 claims verified → 83%
    expect(dijkstra.verifiedPercent).toBe(83);
    const ledger = ledgerFor(dijkstra);
    expect(ledger.stateOf("topic_dijkstra_c6")).toBe("disputed");
  });

  it("keeps a disputed claim off the test-eligible set", () => {
    const db = freshDb();
    const dijkstra = db.topics.get("topic_dijkstra")!;
    const ledger = ledgerFor(dijkstra);
    const eligible = eligibleClaims(dijkstra.claims, ledger);
    expect(eligible.map((c) => c.id)).not.toContain("topic_dijkstra_c6");
    expect(eligible).toHaveLength(5);
  });

  it("rehydrates the ledger from stored events deterministically", () => {
    const db = freshDb();
    const t = db.topics.get("topic_binsearch")!;
    const a = ledgerFor(t).snapshot(t.claims);
    const b = ledgerFor(t).snapshot(t.claims);
    expect([...a.entries()]).toEqual([...b.entries()]);
  });

  it("provisions review cards for the learner", () => {
    const db = freshDb();
    expect(reviewCardsOf(db, "user_adeline")).toHaveLength(4);
  });

  it("a closed gap auto-reopens on a later lapse (GAP-06, through stored data)", () => {
    const db = freshDb();
    const rec = db.gaps.get("gap_1")!;
    // open → watching → closed (earned), then a later lapse → must reopen
    const watching = toWatching(rec.gap, SEED_NOW + 500);
    const closed = closeGap(watching, { successfulReviews: 3 }, SEED_NOW + 1000);
    expect(closed.status).toBe("closed");
    const reopened = onLapse(closed, SEED_NOW + 5000);
    expect(reopened.status).toBe("reopened");
  });
});
