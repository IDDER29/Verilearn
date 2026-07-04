import { describe, expect, it } from "vitest";
import { appendAuditEntry, AuditLogError, queryAuditLog, type AuditLogEntry } from "./audit";

function entry(overrides: Partial<AuditLogEntry> = {}): AuditLogEntry {
  return {
    id: "audit_1",
    at: 100,
    actorId: "user_1",
    actorRole: "trust_safety_lead",
    action: "cert_revoke",
    targetType: "certificate",
    targetId: "cert_1",
    reason: "fraud",
    before: {},
    after: {},
    ...overrides,
  };
}

describe("audit log (ADMIN-20)", () => {
  it("appends a well-formed entry", () => {
    const log: AuditLogEntry[] = [];
    appendAuditEntry(log, entry());
    expect(log).toHaveLength(1);
    expect(log[0].id).toBe("audit_1");
  });

  it("refuses a malformed entry — missing actor, target, or reason", () => {
    const log: AuditLogEntry[] = [];
    expect(() => appendAuditEntry(log, entry({ actorId: "" }))).toThrow(AuditLogError);
    expect(() => appendAuditEntry(log, entry({ targetId: "" }))).toThrow(AuditLogError);
    expect(() => appendAuditEntry(log, entry({ reason: "   " }))).toThrow(AuditLogError);
    expect(log).toHaveLength(0);
  });

  it("queries newest-first and filters by actor/target/type/action", () => {
    const log: AuditLogEntry[] = [];
    appendAuditEntry(log, entry({ id: "a1", at: 100, actorId: "user_1", targetId: "cert_1", action: "cert_revoke", targetType: "certificate" }));
    appendAuditEntry(log, entry({ id: "a2", at: 200, actorId: "user_2", targetId: "user_9", action: "user_ban", targetType: "user" }));
    appendAuditEntry(log, entry({ id: "a3", at: 300, actorId: "user_1", targetId: "claim_1", action: "claim_quarantine", targetType: "claim" }));

    expect(queryAuditLog(log).map((e) => e.id)).toEqual(["a3", "a2", "a1"]);
    expect(queryAuditLog(log, { actorId: "user_1" }).map((e) => e.id)).toEqual(["a3", "a1"]);
    expect(queryAuditLog(log, { targetType: "user" }).map((e) => e.id)).toEqual(["a2"]);
    expect(queryAuditLog(log, { action: "claim_quarantine" }).map((e) => e.id)).toEqual(["a3"]);
    expect(queryAuditLog(log, { targetId: "cert_1" }).map((e) => e.id)).toEqual(["a1"]);
  });

  it("does not mutate the original log array when querying", () => {
    const log: AuditLogEntry[] = [];
    appendAuditEntry(log, entry({ id: "a1", at: 100 }));
    appendAuditEntry(log, entry({ id: "a2", at: 200 }));
    const original = [...log];
    queryAuditLog(log);
    expect(log).toEqual(original);
  });
});
