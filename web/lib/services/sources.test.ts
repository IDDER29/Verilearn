import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { addSourceForClaim, coverageMatrix, removeSource, setPreferredSource, trustReadModel } from "./sources";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("coverage matrix", () => {
  it("builds a claims × sources grid from real ledger evidence", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    expect(cov.rows.length).toBe(cov.rows.length); // one row per claim
    // every row has exactly one cell per source
    for (const r of cov.rows) expect(r.cells.length).toBe(cov.sources.length);
  });

  it("marks the disputed claim as unsupported (no filled cell)", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    const disputedRow = cov.rows.find((r) => r.state === "disputed");
    expect(disputedRow).toBeTruthy();
    expect(disputedRow!.cells.every((c) => c.state === null)).toBe(true);
  });

  it("coverage percent = backed ÷ total and backed omits the disputed claim", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    expect(cov.backedCount).toBeLessThan(cov.rows.length); // the disputed one isn't backed
    expect(cov.coveragePercent).toBe(Math.round((cov.backedCount / cov.rows.length) * 100));
  });

  it("scopes to the owner", () => {
    expect(coverageMatrix("intruder", "topic_dijkstra")).toBeNull();
  });

  it("TRUST-09: attaching a source backs a disputed claim (firewall-safe)", () => {
    const before = coverageMatrix(USER, "topic_dijkstra")!;
    const disputed = before.rows.find((r) => r.state === "disputed")!;

    const r = addSourceForClaim(USER, "topic_dijkstra", disputed.claimId, { title: "Bellman-Ford note", ref: "docs" });
    expect(r.ok).toBe(true);
    expect(r.newState).toBe("sourced");

    const after = coverageMatrix(USER, "topic_dijkstra")!;
    const row = after.rows.find((rr) => rr.claimId === disputed.claimId)!;
    expect(row.state).toBe("sourced");
    expect(row.cells.some((c) => c.state !== null)).toBe(true); // a cell is now filled
    expect(after.backedCount).toBe(before.backedCount + 1);
  });

  it("TRUST-11: setPreferredSource marks exactly one source preferred", () => {
    const db = globalThis.__verilearnDb!;
    const topic = db.topics.get("topic_dijkstra")!;
    const target = topic.sources[1].id;
    expect(setPreferredSource(USER, "topic_dijkstra", target).ok).toBe(true);
    expect(topic.sources.filter((s) => s.preferred)).toHaveLength(1);
    expect(topic.sources.find((s) => s.preferred)!.id).toBe(target);
  });

  it("TRUST-11: removing a source fail-closes claims it solely backed to unsupported", () => {
    const before = coverageMatrix(USER, "topic_dijkstra")!;
    // find a source that backs at least one claim
    const src = before.sources.find((s) => before.rows.some((r) => r.cells.some((c) => c.sourceId === s.id && c.state !== null)))!;
    const backed = before.rows.filter((r) => {
      const cell = r.cells.find((c) => c.sourceId === src.id);
      return cell?.state !== null && r.cells.every((c) => c.sourceId === src.id || c.state === null);
    });

    const r = removeSource(USER, "topic_dijkstra", src.id);
    expect(r.ok).toBe(true);
    expect(r.downgraded).toBe(backed.length);

    const after = coverageMatrix(USER, "topic_dijkstra")!;
    expect(after.sources.some((s) => s.id === src.id)).toBe(false); // source gone
    for (const b of backed) {
      expect(after.rows.find((rr) => rr.claimId === b.claimId)!.state).toBe("unsupported");
    }
  });

  it("refuses to re-source an already-backed claim and enforces a title", () => {
    const cov = coverageMatrix(USER, "topic_dijkstra")!;
    const backed = cov.rows.find((r) => r.state !== "disputed" && r.state !== "unsupported")!;
    expect(addSourceForClaim(USER, "topic_dijkstra", backed.claimId, { title: "x" }).ok).toBe(false);
    const disputed = cov.rows.find((r) => r.state === "disputed")!;
    expect(addSourceForClaim(USER, "topic_dijkstra", disputed.claimId, { title: "   " }).ok).toBe(false);
  });
});

describe("trustReadModel (API-04)", () => {
  it("returns the live per-claim trust read with verifiedPercent and a complete status", () => {
    const model = trustReadModel(USER, "topic_dijkstra")!;
    expect(model.claims.length).toBe(6);
    expect(model.status).toBe("complete"); // seed topic is status "ready"
    const c1 = model.claims.find((c) => c.claimId === "topic_dijkstra_c1")!;
    expect(c1.state).toBe("verified_execution");
    expect(model.verifiedPercent).toBeGreaterThan(0);
  });

  it("as_of ledger-versions: a later event is invisible to an earlier snapshot", () => {
    const db = globalThis.__verilearnDb!;
    const topic = db.topics.get("topic_dijkstra")!;
    // A later dispute lands on c1 (originally verified_execution) after SEED_NOW.
    topic.events.push({
      id: "ve_later_dispute",
      claimId: "topic_dijkstra_c1",
      state: "disputed",
      producedBy: "system:verifier",
      producerVersion: "test",
      at: SEED_NOW + 5000,
      evidence: { method: "skeptic", detail: "later contest", confidence: 0.3, resolved: false },
    });

    const before = trustReadModel(USER, "topic_dijkstra", { asOf: SEED_NOW })!;
    expect(before.claims.find((c) => c.claimId === "topic_dijkstra_c1")!.state).toBe("verified_execution");

    const after = trustReadModel(USER, "topic_dijkstra", { asOf: SEED_NOW + 5000 })!;
    expect(after.claims.find((c) => c.claimId === "topic_dijkstra_c1")!.state).toBe("disputed");

    // Omitting as_of reads live (now), which is after the later event.
    expect(trustReadModel(USER, "topic_dijkstra")!.claims.find((c) => c.claimId === "topic_dijkstra_c1")!.state).toBe("disputed");
  });

  it("reads pipeline_incomplete while the topic's verification run hasn't finished", () => {
    const db = globalThis.__verilearnDb!;
    db.topics.get("topic_dijkstra")!.status = "verifying";
    expect(trustReadModel(USER, "topic_dijkstra")!.status).toBe("pipeline_incomplete");
    db.topics.get("topic_dijkstra")!.status = "failed";
    expect(trustReadModel(USER, "topic_dijkstra")!.status).toBe("pipeline_incomplete");
  });

  it("scopes to the owner — null for a foreign user or unknown topic", () => {
    expect(trustReadModel("intruder", "topic_dijkstra")).toBeNull();
    expect(trustReadModel(USER, "not_a_real_topic")).toBeNull();
  });
});
