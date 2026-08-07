import type { Metadata } from 'next';
import FacilityWorkspace from '@/components/workspace/FacilityWorkspace';

export const metadata: Metadata = {
  title: 'Facility Workspace v2 | Deepsea Nexus',
  description: 'Operational cockpit for customer banking facilities.',
};

export default function FacilityWorkspaceV2Page() {
  return <FacilityWorkspace />;
}
