import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import type { WorkspaceData } from "@/components/workspace/types";
import { requireUser } from "@/lib/auth/current";
import { getTopicView, listTopicSummaries } from "@/lib/services/topics";

export const metadata = { title: "Topic Workspace · VeriLearn" };

export default async function TopicWorkspacePage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const user = await requireUser();
  const { topic } = await searchParams;
  const summaries = listTopicSummaries(user.id);
  const topicId = topic ?? summaries[0]?.id;
  const view = topicId ? getTopicView(user.id, topicId) : null;
  const data: WorkspaceData | null = view
    ? {
        topicId: view.topic.id,
        title: view.topic.title,
        level: view.topic.level,
        claimCount: view.topic.claims.length,
        sourceCount: view.topic.sources.length,
        verifiedPercent: view.verifiedPercent,
        breakdown: view.breakdown,
      }
    : null;
  return <WorkspaceShell initial="lecture" data={data} />;
}
