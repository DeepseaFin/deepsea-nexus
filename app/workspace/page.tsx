import type { Metadata } from 'next';
import DeepseaHome from '@/components/workspace/DeepseaHome';

export const metadata: Metadata = {
  title: 'Workspace | Deepsea Nexus',
  description: 'Morning workspace prototype for an institutional relationship manager.',
};

export default function WorkspacePage() {
  return <DeepseaHome />;
}
