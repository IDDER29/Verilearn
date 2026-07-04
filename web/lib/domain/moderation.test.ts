import { describe, expect, it } from "vitest";
import { banUser, ModerationError, unbanUser, type Bannable } from "./moderation";

const NOW = 1_782_432_000_000;

function user(overrides: Partial<Bannable> = {}): Bannable {
  return { banned: false, ...overrides };
}

describe("banUser (ADMIN-16)", () => {
  it("bans an account with a reason, actor, and timestamp", () => {
    const banned = banUser(user(), "Repeated harassment reports", NOW, "actor_1");
    expect(banned.banned).toBe(true);
    expect(banned.bannedReason).toBe("Repeated harassment reports");
    expect(banned.bannedAt).toBe(NOW);
    expect(banned.bannedBy).toBe("actor_1");
  });

  it("refuses an empty reason", () => {
    expect(() => banUser(user(), "  ", NOW, "actor_1")).toThrow(ModerationError);
  });

  it("refuses to double-ban an already-banned account", () => {
    const banned = banUser(user(), "reason", NOW, "actor_1");
    expect(() => banUser(banned, "another reason", NOW, "actor_2")).toThrow(/already banned/i);
  });
});

describe("unbanUser (ADMIN-16 — the second-approval half)", () => {
  it("unbans with a reason, keeping the prior ban as history", () => {
    const banned = banUser(user(), "fraud", NOW, "actor_1");
    const unbanned = unbanUser(banned, "actor_2", "Appeal upheld — false positive", NOW + 1);
    expect(unbanned.banned).toBe(false);
    expect(unbanned.unbannedBy).toBe("actor_2");
    expect(unbanned.unbannedReason).toBe("Appeal upheld — false positive");
    expect(unbanned.bannedReason).toBe("fraud"); // history kept, never erased
  });

  it("refuses to unban an account that isn't banned", () => {
    expect(() => unbanUser(user(), "actor_2", "reason", NOW)).toThrow(/isn't banned/i);
  });

  it("refuses an empty reason", () => {
    const banned = banUser(user(), "fraud", NOW, "actor_1");
    expect(() => unbanUser(banned, "actor_2", "  ", NOW + 1)).toThrow(ModerationError);
  });

  it("refuses a reviewer who is the same actor that banned it (reviewer-other-than-actor gate)", () => {
    const banned = banUser(user(), "fraud", NOW, "actor_1");
    expect(() => unbanUser(banned, "actor_1", "changed my mind", NOW + 1)).toThrow(/other than whoever banned/i);
  });
});
