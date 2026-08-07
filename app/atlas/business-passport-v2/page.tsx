import type { Metadata } from 'next';
import BusinessPassportWorkspace from '@/components/workspace/BusinessPassportWorkspace';

export const metadata: Metadata = {
  title: 'Business Passport Workspace v2 | Deepsea Nexus',
  description: 'Executive business passport workspace for institutional digital identity.',
};

export default function BusinessPassportV2Page() {
  return <BusinessPassportWorkspace />;
}
