import { describe, expect, it } from "vitest";
import {
  DualControlError,
  EpistemicFirewallError,
  TrustLedger,
  failClosed,
  trustBreakdown,
  verificationId,
  verifiedPercent,
  type VerificationActor,
} from "./trust";
import type { Claim, Evidence, VerificationEvent } from "./types";

const SYSTEM: VerificationActor = { id: "verifier", canVerify: true, isSME: false };
const LEARNER: VerificationActor = { id: "learner-1", canVerify: false, isSME: false };
const ADMIN: VerificationActor = { id: "root", canVerify: false, isSME: false };
const SME: VerificationActor = { id: "sme-1", canVerify: false, isSME: true };

function ev(claimId: string, state: VerificationEvent["state"], evidence: Partial<Evidence> = {}, extra: Partial<VerificationEvent> = {}): VerificationEvent {
  const at = 1_000 + Math.abs(hash(claimId + state));
  return {
    id: verificationId(claimId, at),
    claimId,
    state,
    producedBy: "verifier",
    producerVersion: "v1",
    at,
    evidence: { method: "citation", sourceId: "src-1", detail: "", confidence: 0.9, resolved: true, ...evidence },
    ...extra,
  };
}
function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
}

describe("epistemic firewall (I1)", () => {
  it("lets a system verifier record a trust state", () => {
    const l = new TrustLedger();
    l.record(SYSTEM, ev("c1", "verified_source"));
    expect(l.stateOf("c1")).toBe("verified_source");
  });

  it("forbids a learner from setting a trust state", () => {
    const l = new TrustLedger();
    expect(() => l.record(LEARNER, ev("c1", "verified_source"))).toThrow(EpistemicFirewallError);
  });

  it("forbids even platform root from setting a trust state", () => {
    const l = new TrustLedger();
    expect(() => l.record(ADMIN, ev("c1", "verified_execution"))).toThrow(EpistemicFirewallError);
  });

  it("requires dual control for an SME override", () => {
    const l = new TrustLedger();
    // SME with no reason/approver → rejected
    expect(() => l.record(SME, ev("c1", "sourced"))).toThrow(DualControlError);
    // SME approving their own override → rejected
    expect(() => l.record(SME, ev("c1", "sourced", {}, { smeReason: "x", smeApprovedBy: "sme-1" }))).toThrow(DualControlError);
    // SME with reason + distinct approver → allowed
    l.record(SME, ev("c1", "sourced", {}, { smeReason: "constrained to non-negative", smeApprovedBy: "sme-2" }));
    expect(l.stateOf("c1")).toBe("sourced");
  });
});

describe("source-hallucination guard", () => {
  it("rejects citation evidence with no resolved source id", () => {
    const l = new TrustLedger();
    expect(() => l.record(SYSTEM, ev("c1", "verified_source", { sourceId: undefined }))).toThrow(/hallucination/i);
  });
});

describe("fail-closed rendering", () => {
  it("downgrades unresolved verified evidence to unsupported", () => {
    expect(failClosed("verified_source", { method: "citation", sourceId: "s", detail: "", confidence: 1, resolved: false })).toBe("unsupported");
  });
  it("keeps disputed as disputed", () => {
    expect(failClosed("disputed", { method: "skeptic", detail: "", confidence: 0.4, resolved: true })).toBe("disputed");
  });
  it("an unverified claim reads as unsupported, never verified", () => {
    const l = new TrustLedger();
    expect(l.stateOf("never-seen")).toBe("unsupported");
  });
  it("latest verification wins", () => {
    const l = new TrustLedger();
    l.record(SYSTEM, ev("c1", "sourced"));
    l.record(SYSTEM, ev("c1", "disputed", { method: "skeptic", sourceId: undefined }));
    expect(l.stateOf("c1")).toBe("disputed");
    expect(l.history("c1")).toHaveLength(2);
  });
});

describe("aggregates", () => {
  const claims: Claim[] = [
    { id: "a", topicId: "t", sectionId: "s1", text: "" },
    { id: "b", topicId: "t", sectionId: "s1", text: "" },
    { id: "c", topicId: "t", sectionId: "s1", text: "" },
  ];
  it("computes verified percent and breakdown from a snapshot", () => {
    const l = new TrustLedger();
    l.record(SYSTEM, ev("a", "verified_execution", { method: "execution", sourceId: undefined }));
    l.record(SYSTEM, ev("b", "sourced"));
    l.record(SYSTEM, ev("c", "disputed", { method: "skeptic", sourceId: undefined }));
    const snap = l.snapshot(claims);
    expect(verifiedPercent(snap.values())).toBe(33);
    const bd = trustBreakdown(snap.values());
    expect(bd.verified_execution).toBe(1);
    expect(bd.sourced).toBe(1);
    expect(bd.disputed).toBe(1);
  });
});
