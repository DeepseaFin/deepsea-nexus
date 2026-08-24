import type { Metadata } from 'next';
import OracleWorkspace from '@/components/workspace/OracleWorkspace';

export const metadata: Metadata = {
  title: 'Oracle Workspace v2 | Deepsea Nexus',
  description: 'Institutional intelligence workspace for credit, evidence, and decision analysis.',
};

export default function OracleWorkspaceV2Page() {
  return <OracleWorkspace />;
}
