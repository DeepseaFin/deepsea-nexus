import type { Metadata } from 'next';
import UniversalSearchWorkspace from '@/components/workspace/UniversalSearchWorkspace';

export const metadata: Metadata = {
  title: 'Universal Search v2 | Deepsea Nexus',
  description: 'Institutional universal search workspace for customers, facilities, deals, documents, evidence, and knowledge.',
};

export default function SearchV2Page() {
  return <UniversalSearchWorkspace />;
}
