import { describe, expect, it } from "vitest";
import { demoPipelineRun } from "./pipeline";

describe("guest demo pipeline run (VERIFY-22)", () => {
  it("runs the real six-stage pipeline to completion over the fixed demo topic", () => {
    const run = demoPipelineRun();
    expect(run.ok).toBe(true);
    expect(run.stages.length).toBe(6);
    expect(run.stages.every((s) => s.status === "done")).toBe(true);
    expect(run.claims.length).toBeGreaterThan(0);
  });

  it("is deterministic: repeated calls produce the same stage output every time", () => {
    const a = demoPipelineRun();
    const b = demoPipelineRun();
    expect(a.stages.map((s) => s.detail)).toEqual(b.stages.map((s) => s.detail));
    expect(a.claims.length).toBe(b.claims.length);
  });

  it("every claim carries a real trust state from the ledger", () => {
    const run = demoPipelineRun();
    expect(run.states.size).toBe(run.claims.length);
    for (const c of run.claims) expect(run.states.get(c.id)).toBeDefined();
  });
});
