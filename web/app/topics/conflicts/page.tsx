import WorkspaceShell from "@/components/workspace/WorkspaceShell";
import { requireUser } from "@/lib/auth/current";
import { loadWorkspaceData } from "@/lib/services/workspace";

export const metadata = { title: "Conflicts · VeriLearn" };

export default async function ConflictsPage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const user = await requireUser();
  const { topic } = await searchParams;
  return <WorkspaceShell initial="conflicts" data={loadWorkspaceData(user.id, topic)} />;
}
