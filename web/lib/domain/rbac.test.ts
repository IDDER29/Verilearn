import { describe, expect, it } from "vitest";
import {
  BreakGlassReasonError,
  EpistemicWriteGrantError,
  FIREWALL_PERMISSIONS,
  PERMISSIONS,
  ROLES,
  SECOND_APPROVAL_PERMISSIONS,
  assertNoEpistemicWriteGrants,
  breakGlass,
  can,
  canWriteTrust,
  permissionsFor,
  type Permission,
  type Role,
} from "./rbac";

describe("least-privilege matrix", () => {
  it("exposes exactly the twelve persona roles", () => {
    expect(ROLES).toHaveLength(12);
    expect(new Set(ROLES).size).toBe(12); // no dupes
    expect(ROLES).toContain("platform_admin");
    expect(ROLES).toContain("trust_safety_lead");
  });

  it("permissionsFor returns the role's declared set", () => {
    expect(permissionsFor("guest")).toEqual(PERMISSIONS.guest);
    expect(permissionsFor("org_admin")).toEqual(PERMISSIONS.org_admin);
  });

  it("has a capability entry for every role", () => {
    for (const role of ROLES) {
      expect(Array.isArray(PERMISSIONS[role])).toBe(true);
    }
  });
});

describe("can() — positive grants", () => {
  it("grants seat management to org_admin only", () => {
    expect(can("org_admin", "org:manage_seats")).toBe(true);
  });
  it("grants spend to billing_admin only", () => {
    expect(can("billing_admin", "billing:manage")).toBe(true);
  });
  it("grants infra ops to platform_admin", () => {
    expect(can("platform_admin", "pipeline:operate")).toBe(true);
    expect(can("platform_admin", "tenant:provision")).toBe(true);
  });
  it("grants integrity actions to trust_safety_lead", () => {
    expect(can("trust_safety_lead", "cert:revoke")).toBe(true);
    expect(can("trust_safety_lead", "integrity:quarantine")).toBe(true);
    expect(can("trust_safety_lead", "user:ban")).toBe(true);
  });
});

describe("separation of authority (ADMIN-05)", () => {
  it("a learner cannot manage org seats", () => {
    expect(can("learner", "org:manage_seats")).toBe(false);
    expect(can("team_learner", "org:manage_seats")).toBe(false);
  });

  it("org_admin controls seats but NOT spend; billing_admin the reverse", () => {
    expect(can("org_admin", "billing:manage")).toBe(false);
    expect(can("billing_admin", "org:manage_seats")).toBe(false);
  });

  it("support cannot revoke certs without escalation", () => {
    expect(can("support_agent", "cert:revoke")).toBe(false);
    // and impersonation is granted to no role by default
    expect(can("support_agent", "user:impersonate")).toBe(false);
  });

  it("assigning the SME role grants no moderation or ban power", () => {
    expect(can("sme_reviewer", "community:moderate")).toBe(false);
    expect(can("sme_reviewer", "user:ban")).toBe(false);
    // but it does grant epistemic INPUT (review submission, source promotion)
    expect(can("sme_reviewer", "review:submit")).toBe(true);
    expect(can("sme_reviewer", "source:promote")).toBe(true);
  });

  it("platform_admin operates infra but touches no epistemic/integrity surface", () => {
    expect(can("platform_admin", "cert:revoke")).toBe(false);
    expect(can("platform_admin", "source:promote")).toBe(false);
    expect(can("platform_admin", "org:manage_seats")).toBe(false);
    expect(can("platform_admin", "billing:manage")).toBe(false);
  });

  it("user:impersonate is granted to no role at all (default-deny)", () => {
    for (const role of ROLES) {
      expect(can(role, "user:impersonate")).toBe(false);
    }
  });
});

describe("epistemic firewall — no human role has trust:write (invariant I1)", () => {
  it("canWriteTrust() is always false, for every role and with no role", () => {
    expect(canWriteTrust()).toBe(false);
    for (const role of ROLES) {
      expect(canWriteTrust(role)).toBe(false);
    }
  });

  it("can(role, 'trust:write') is false for EVERY role", () => {
    for (const role of ROLES) {
      expect(can(role, "trust:write")).toBe(false);
    }
  });

  it("no role's declared capability set contains any firewall permission", () => {
    for (const role of ROLES) {
      for (const perm of FIREWALL_PERMISSIONS) {
        expect(PERMISSIONS[role]).not.toContain(perm);
      }
    }
  });

  it("assertNoEpistemicWriteGrants passes on the shipped matrix", () => {
    expect(assertNoEpistemicWriteGrants()).toBe(true);
  });

  it("EpistemicWriteGrantError is throwable and named (policy-layer rejection)", () => {
    const err = new EpistemicWriteGrantError("platform_admin", "trust:write");
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe("EpistemicWriteGrantError");
    expect(err.message).toMatch(/trust:write/);
  });
});

describe("guest is read-only / limited", () => {
  it("guest may read topics and claims", () => {
    expect(can("guest", "topic:read")).toBe(true);
    expect(can("guest", "claim:read")).toBe(true);
  });
  it("guest cannot create, author, take tests, or write trust", () => {
    expect(can("guest", "topic:create")).toBe(false);
    expect(can("guest", "claim:author")).toBe(false);
    expect(can("guest", "test:take")).toBe(false);
    expect(can("guest", "trust:write")).toBe(false);
  });
  it("guest holds only read permissions", () => {
    for (const perm of PERMISSIONS.guest) {
      expect(perm.endsWith(":read")).toBe(true);
    }
  });
});

describe("break-glass — audited, never a silent grant", () => {
  it("returns an audit record carrying the reason and a watermark", () => {
    const rec = breakGlass("support_agent", "cert:revoke", "INC-42 emergency revoke", {
      at: 1_700,
      sessionId: "bg-abc",
    });
    expect(rec.kind).toBe("break_glass");
    expect(rec.role).toBe("support_agent");
    expect(rec.permission).toBe("cert:revoke");
    expect(rec.reason).toBe("INC-42 emergency revoke");
    expect(rec.at).toBe(1_700);
    expect(rec.sessionId).toBe("bg-abc");
    expect(rec.granted).toBe(true);
  });

  it("flags second-approval for high-risk permissions", () => {
    const rec = breakGlass("support_agent", "user:impersonate", "consented account access");
    expect(rec.requiresSecondApproval).toBe(true);
    expect(SECOND_APPROVAL_PERMISSIONS).toContain("user:impersonate");
  });

  it("does NOT require second approval for low-risk elevation", () => {
    const rec = breakGlass("guest", "topic:create", "author on behalf during migration");
    expect(rec.requiresSecondApproval).toBe(false);
    expect(rec.granted).toBe(true);
  });

  it("refuses a firewall permission even under break-glass (granted:false, forbidden:true)", () => {
    const rec = breakGlass("platform_admin", "trust:write", "tried to certify a claim");
    expect(rec.granted).toBe(false);
    expect(rec.forbidden).toBe(true);
  });

  it("records whether the role already held the permission", () => {
    expect(breakGlass("org_admin", "org:manage_seats", "reason").alreadyHeld).toBe(true);
    expect(breakGlass("support_agent", "cert:revoke", "reason").alreadyHeld).toBe(false);
  });

  it("throws when no reason is supplied (never silent)", () => {
    expect(() => breakGlass("platform_admin", "user:ban", "")).toThrow(BreakGlassReasonError);
    expect(() => breakGlass("platform_admin", "user:ban", "   ")).toThrow(BreakGlassReasonError);
  });

  it("trims the reason and derives a deterministic sessionId when omitted", () => {
    const rec = breakGlass("trust_safety_lead", "user:ban", "  ring takedown  ");
    expect(rec.reason).toBe("ring takedown");
    expect(rec.sessionId).toBe("bg_trust_safety_lead_user:ban_0");
    expect(rec.at).toBe(0);
  });

  it("is deterministic — same inputs produce an identical record", () => {
    const a = breakGlass("trust_safety_lead", "cert:revoke", "INC-9", { at: 5, sessionId: "s" });
    const b = breakGlass("trust_safety_lead", "cert:revoke", "INC-9", { at: 5, sessionId: "s" });
    expect(a).toEqual(b);
  });
});

describe("type-level exhaustiveness helpers compile and hold", () => {
  it("every Permission string used here is a member of the union", () => {
    // A representative spread across authority domains — compile-time checked.
    const sample: Permission[] = [
      "topic:read",
      "org:manage_seats",
      "billing:manage",
      "cert:revoke",
      "trust:write",
      "audit:read",
      "pipeline:operate",
    ];
    expect(sample).toHaveLength(7);
  });
  it("every Role string is a member of the union", () => {
    const sample: Role[] = ["guest", "learner", "platform_admin", "compliance_dpo"];
    expect(sample.every((r) => (ROLES as readonly Role[]).includes(r))).toBe(true);
  });
});
