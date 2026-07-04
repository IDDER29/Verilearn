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
  /** Real per-stage detail from the run (VERIFY-04). */
  stages?: { stage: string; detail: string }[];
}

/** Real pipeline output for a topic, for the /pipeline screen (VERIFY-04). */
export async function pipelineInfoAction(topicId: string): Promise<PipelineInfo> {
  const user = await getCurrentUser();
  if (!user) return { ok: false };
  const topic = getDb().topics.get(topicId);
  if (!topic || topic.ownerId !== user.id) return { ok: false };
  return { ok: true, title: topic.title, ready: topic.status === "ready", stages: topic.pipelineStages ?? [] };
}
