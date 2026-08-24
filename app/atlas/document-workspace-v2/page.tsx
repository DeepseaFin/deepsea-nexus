import type { Metadata } from 'next';
import DocumentWorkspace from '@/components/workspace/DocumentWorkspace';

export const metadata: Metadata = {
  title: 'Document Workspace v2 | Deepsea Nexus',
  description: 'Institutional document control room for deal, facility, and compliance artifacts.',
};

export default function DocumentWorkspaceV2Page() {
  return <DocumentWorkspace />;
}
