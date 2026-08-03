import type { Metadata } from 'next';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';
import { WorkspaceEngine } from '@/lib/workspace/WorkspaceEngine';

export const metadata: Metadata = {
  title: 'Workspace v2 | Deepsea Nexus',
  description: 'Institutional operating workspace for relationship managers.',
};

export default function WorkspaceV2Page() {
  const context = WorkspaceEngine.getWorkspace('relationshipManager');

  return <WorkspaceShell context={context} />;
}
