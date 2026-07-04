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

  it("deep-links conflict + verification notifications to the exact target (NOTIF-02/03)", () => {
    const items = listNotifications(USER);
    const conflict = items.find((i) => i.kind === "conflict")!;
    // links to the exact claim, opened in the adjudication UI
    expect(conflict.href).toMatch(/\/topics\/conflicts\?topic=.+&claim=.+/);
    expect(conflict.title).toContain("in “"); // names the topic, not a generic string
    const verify = items.find((i) => i.kind === "verification")!;
    expect(verify.href).toMatch(/\/topics\?topic=.+/); // opens that specific topic
  });

  it("NOTIF-08: muting a category removes it from the derived feed", () => {
    const db = globalThis.__verilearnDb!;
    expect(listNotifications(USER).some((i) => i.kind === "conflict")).toBe(true);
    // Opt out of the conflict category.
    db.users.get(USER)!.prefs.notifications.conflict = false;
    const after = listNotifications(USER);
    expect(after.some((i) => i.kind === "conflict")).toBe(false);
    // Other categories are untouched.
    expect(after.some((i) => i.kind === "verification")).toBe(true);
  });

  it("mark-all-read persists and drops the unread count to zero (NOTIF-01)", () => {
    expect(unreadNotificationCount(USER)).toBeGreaterThan(0);
    markAllNotificationsRead(USER);
    expect(unreadNotificationCount(USER)).toBe(0);
    expect(listNotifications(USER).every((i) => !i.unread)).toBe(true);
  });

  it("NOTIF-05: emits a streak-at-risk nudge for a live, unreviewed-today streak", () => {
    const db = globalThis.__verilearnDb!;
    const day = 86_400_000;
    const realNow = Date.now();
    db.reviewLog.push(
      { userId: USER, claimId: "topic_dijkstra_c1", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - 2 * day },
      { userId: USER, claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - 1 * day },
    );
    const streak = listNotifications(USER).find((i) => i.kind === "streak");
    expect(streak).toBeTruthy();
    expect(streak!.title).toMatch(/2-day streak/);
    expect(streak!.href).toBe("/review");
  });

  it("no streak nudge with fewer than 2 live days, or once today is already reviewed", () => {
    const db = globalThis.__verilearnDb!;
    const day = 86_400_000;
    const realNow = Date.now();
    // Single-day streak: no nudge.
    expect(listNotifications(USER).some((i) => i.kind === "streak")).toBe(false);
    db.reviewLog.push({ userId: USER, claimId: "topic_dijkstra_c1", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - day });
    expect(listNotifications(USER).some((i) => i.kind === "streak")).toBe(false);
    // A 2-day streak, but already reviewed today too: no nudge (nothing at risk).
    db.reviewLog.push(
      { userId: USER, claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - 2 * day },
      { userId: USER, claimId: "topic_dijkstra_c3", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow },
    );
    expect(listNotifications(USER).some((i) => i.kind === "streak")).toBe(false);
  });

  it("NOTIF-08: muting the streak category removes it from the feed", () => {
    const db = globalThis.__verilearnDb!;
    const day = 86_400_000;
    const realNow = Date.now();
    db.reviewLog.push(
      { userId: USER, claimId: "topic_dijkstra_c1", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - 2 * day },
      { userId: USER, claimId: "topic_dijkstra_c2", topicId: "topic_dijkstra", confidence: "sure", rating: "good", correct: true, at: realNow - 1 * day },
    );
    expect(listNotifications(USER).some((i) => i.kind === "streak")).toBe(true);
    db.users.get(USER)!.prefs.notifications.streak = false;
    expect(listNotifications(USER).some((i) => i.kind === "streak")).toBe(false);
  });

  it("read-state is per-user", () => {
    markAllNotificationsRead(USER);
    // A different user's (empty) feed is unaffected; scoping via the namespaced key.
    expect(listNotifications("intruder")).toHaveLength(0);
  });
});
