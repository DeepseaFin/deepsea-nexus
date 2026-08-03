import type { Metadata } from 'next';
import RelationshipWorkspace from '@/components/workspace/RelationshipWorkspace';

export const metadata: Metadata = {
  title: 'Relationship Workspace v2 | Deepsea Nexus',
  description: 'Single-customer institutional relationship workspace.',
};

export default function RelationshipWorkspaceV2Page() {
  return <RelationshipWorkspace />;
}
