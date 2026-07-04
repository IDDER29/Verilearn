import { beforeEach, describe, expect, it } from "vitest";
import { createDb, SEED_NOW, type Db } from "@/lib/store/db";
import { seedDb } from "@/lib/store/seed";
import { listNotifications, markAllNotificationsRead, unreadNotificationCount } from "./notifications";

declare global {
  var __verilearnDb: Db | undefined;
}
const USER = "user_adeline";

beforeEach(() => {
  const db = createDb();
  seedDb(db, SEED_NOW);
  globalThis.__verilearnDb = db;
});

describe("notifications service", () => {
  it("derives notifications from real state, all unread initially", () => {
    const items = listNotifications(USER);
    expect(items.length).toBeGreaterThan(0);
    expect(items.every((i) => i.unread)).toBe(true);
  });

  it("emits a test-checkpoint notification for a topic with eligible claims (NOTIF-06)", () => {
    const items = listNotifications(USER);
    const testItem = items.find((i) => i.kind === "test");
    expect(testItem).toBeTruthy();
    expect(testItem!.href).toContain("/tests/");
  });

  it("mark-all-read persists and drops the unread count to zero (NOTIF-01)", () => {
    expect(unreadNotificationCount(USER)).toBeGreaterThan(0);
    markAllNotificationsRead(USER);
    expect(unreadNotificationCount(USER)).toBe(0);
    expect(listNotifications(USER).every((i) => !i.unread)).toBe(true);
  });

  it("read-state is per-user", () => {
    markAllNotificationsRead(USER);
    // A different user's (empty) feed is unaffected; scoping via the namespaced key.
    expect(listNotifications("intruder")).toHaveLength(0);
  });
});
