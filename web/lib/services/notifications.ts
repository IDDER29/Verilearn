/**
 * Notifications service — derives the in-app notification center from real state
 * (NOTIF-01): verification-done topics, reviews due, and conflicts raised. No
 * separate store yet; these are computed views over the existing data.
 */
import { getDb, reviewCardsOf } from "@/lib/store/db";
import { listConflicts } from "./conflicts";
import { listTopicSummaries } from "./topics";
import { now } from "@/lib/ids";

export type NotificationKind = "verification" | "review" | "conflict";

export interface NotificationItem {
  id: string;
  kind: NotificationKind;
  title: string;
  detail: string;
  href: string;
  unread: boolean;
}

export function listNotifications(userId: string): NotificationItem[] {
  const items: NotificationItem[] = [];
  const topics = listTopicSummaries(userId);

  for (const t of topics.filter((t) => t.status === "ready")) {
    items.push({
      id: `notif_verify_${t.id}`,
      kind: "verification",
      title: `“${t.title}” is verified and ready`,
      detail: `${t.verifiedPercent}% of claims verified · open the lecture`,
      href: "/topics",
      unread: true,
    });
  }

  const due = reviewCardsOf(getDb(), userId).filter((c) => c.fsrs.due <= now()).length;
  if (due > 0) {
    items.push({
      id: "notif_review_due",
      kind: "review",
      title: `${due} flashcard${due === 1 ? "" : "s"} due for review`,
      detail: "Spaced review keeps what you learned from fading",
      href: "/review",
      unread: true,
    });
  }

  for (const c of listConflicts(userId)) {
    items.push({
      id: `notif_conflict_${c.claimId}`,
      kind: "conflict",
      title: "The Skeptic flagged a disputed claim",
      detail: `${c.topicTitle}: “${c.claimText}”`,
      href: "/topics/conflicts",
      unread: true,
    });
  }

  return items;
}
