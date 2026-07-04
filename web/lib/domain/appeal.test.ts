import { describe, expect, it } from "vitest";
import { AppealError, decideAppeal, submitAppeal, type Appeal } from "./appeal";

const NOW = 1_782_432_000_000;

describe("submitAppeal (AUTH-18)", () => {
  it("creates a pending appeal with the message, user, and timestamp", () => {
    const appeal = submitAppeal("appeal_1", "user_1", "I was banned by mistake", NOW);
    expect(appeal.status).toBe("pending");
    expect(appeal.userId).toBe("user_1");
    expect(appeal.message).toBe("I was banned by mistake");
    expect(appeal.submittedAt).toBe(NOW);
  });

  it("refuses an empty message", () => {
    expect(() => submitAppeal("appeal_1", "user_1", "   ", NOW)).toThrow(AppealError);
  });
});

describe("decideAppeal (AUTH-18)", () => {
  function pending(): Appeal {
    return submitAppeal("appeal_1", "user_1", "Please reconsider", NOW);
  }

  it("approves with a reviewer and a reason, keeping the message as history", () => {
    const decided = decideAppeal(pending(), true, "reviewer_1", "Investigated — false positive", NOW + 1);
    expect(decided.status).toBe("approved");
    expect(decided.decidedBy).toBe("reviewer_1");
    expect(decided.decisionReason).toBe("Investigated — false positive");
    expect(decided.message).toBe("Please reconsider");
  });

  it("denies with a reviewer and a reason", () => {
    const decided = decideAppeal(pending(), false, "reviewer_1", "Ban stands — repeated violations", NOW + 1);
    expect(decided.status).toBe("denied");
    expect(decided.decidedBy).toBe("reviewer_1");
  });

  it("refuses an empty reason on either decision", () => {
    expect(() => decideAppeal(pending(), true, "reviewer_1", "  ", NOW + 1)).toThrow(AppealError);
    expect(() => decideAppeal(pending(), false, "reviewer_1", "", NOW + 1)).toThrow(AppealError);
  });

  it("refuses to re-decide an already-decided appeal", () => {
    const decided = decideAppeal(pending(), true, "reviewer_1", "Approved", NOW + 1);
    expect(() => decideAppeal(decided, false, "reviewer_2", "Actually no", NOW + 2)).toThrow(/already been decided/i);
  });
});
