import type { Metadata } from 'next';
import ConversationsWorkspace from '@/components/workspace/ConversationsWorkspace';

export const metadata: Metadata = {
  title: 'Institutional Conversations v2 | Deepsea Nexus',
  description: 'Institutional collaboration workspace for notes and conversations.',
};

export default function ConversationsV2Page() {
  return <ConversationsWorkspace />;
}
