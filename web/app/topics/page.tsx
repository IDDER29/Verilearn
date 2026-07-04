import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { requireUser } from "@/lib/auth/current";
import { loadWorkspaceData } from "@/lib/services/workspace";

export const metadata = { title: "Topic Workspace · VeriLearn" };

export default async function TopicWorkspacePage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const user = await requireUser();
  const { topic } = await searchParams;
  return <WorkspaceShell initial="lecture" data={loadWorkspaceData(user.id, topic)} />;
}
