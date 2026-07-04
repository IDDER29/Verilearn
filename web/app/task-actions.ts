"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/current";
import { getTasks, gradeSubmission, type GradeSubmissionResult, type TaskView } from "@/lib/services/tasks";

export async function getTasksAction(topicId: string): Promise<TaskView[]> {
  const user = await getCurrentUser();
  if (!user) return [];
  return getTasks(user.id, topicId);
}

export async function gradeTaskAction(taskId: string, answer: string): Promise<GradeSubmissionResult> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "Please sign in again." };
  const r = gradeSubmission(user.id, taskId, answer);
  if (r.ok) revalidatePath("/topics");
  return r;
}
