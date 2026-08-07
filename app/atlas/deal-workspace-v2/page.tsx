import type { Metadata } from 'next';
import DealWorkspace from '@/components/workspace/DealWorkspace';

export const metadata: Metadata = {
  title: 'Deal Workspace v2 | Deepsea Nexus',
  description: 'Institutional workspace for one financing transaction lifecycle.',
};

export default function DealWorkspaceV2Page() {
  return <DealWorkspace />;
}
