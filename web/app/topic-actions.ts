"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { createTopic } from "@/lib/services/topics";

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
