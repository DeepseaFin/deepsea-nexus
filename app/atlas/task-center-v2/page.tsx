import type { Metadata } from 'next';
import InstitutionalTaskCenter from '@/components/workspace/InstitutionalTaskCenter';

export const metadata: Metadata = {
  title: 'Institutional Task Center v2 | Deepsea Nexus',
  description: 'Institutional task management workspace for DNOS responsibilities and approvals.',
};

export default function TaskCenterV2Page() {
  return <InstitutionalTaskCenter />;
}
