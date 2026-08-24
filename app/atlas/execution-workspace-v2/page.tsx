import type { Metadata } from 'next';
import ExecutionWorkspace from '@/components/workspace/ExecutionWorkspace';

export const metadata: Metadata = {
  title: 'Execution Workspace v2 | Deepsea Nexus',
  description: 'Operational execution room for approved financing transactions.',
};

export default function ExecutionWorkspaceV2Page() {
  return <ExecutionWorkspace />;
}
