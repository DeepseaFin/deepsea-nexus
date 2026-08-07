import type { Metadata } from 'next';
import WorkspaceOrchestrator from '@/components/workspace/WorkspaceOrchestrator';

export const metadata: Metadata = {
  title: 'Workspace Orchestrator v2 | Deepsea Nexus',
  description: 'Institutional orchestration layer connecting every Renaissance workspace.',
};

export default function WorkspaceOrchestratorV2Page() {
  return <WorkspaceOrchestrator />;
}
