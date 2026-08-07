import type { Metadata } from 'next';
import EvidenceWorkspace from '@/components/workspace/EvidenceWorkspace';

export const metadata: Metadata = {
  title: 'Evidence Workspace v2 | Deepsea Nexus',
  description: 'Institutional evidence control room for customer, facility, and deal investigation workflows.',
};

export default function EvidenceWorkspaceV2Page() {
  return <EvidenceWorkspace />;
}
