"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { createTopic } from "@/lib/services/topics";
import { getDb } from "@/lib/store/db";

export interface CreateTopicResult {
  ok: boolean;
  topicId?: string;
  error?: string;
}

/** Called from the New Topic client form. Creates + verifies a topic for the current user. */
export async function createTopicAction(input: { title: string; level: string; goal: string }): Promise<CreateTopicResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const result = createTopic(user.id, input);
  if (result.ok) revalidatePath("/");
  return result;
}

export interface PipelineInfo {
  ok: boolean;
  title?: string;
  ready?: boolean;
  /** True when the run stopped at a failed stage — drives the recoverable failure UI (VERIFY-15). */
  failed?: boolean;
  /** The stage key that failed (if any), so the screen can name where it stopped. */
  failedStage?: string;
  /** Real per-stage detail + status from the run (VERIFY-04). */
  stages?: { stage: string; detail: string; status: "done" | "failed" }[];
}

/** Real pipeline output for a topic, for the /pipeline screen (VERIFY-04/15). */
export async function pipelineInfoAction(topicId: string): Promise<PipelineInfo> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== user.id) return { ok: false };
  const stages = topic.pipelineStages ?? [];
  return {
    ok: true,
    title: topic.title,
    ready: topic.status === "ready",
    failed: topic.status === "failed",
    failedStage: stages.find((s) => s.status === "failed")?.stage,
    stages,
  };
}
