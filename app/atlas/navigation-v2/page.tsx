import type { Metadata } from 'next';
import NavigationFramework from '@/components/workspace/NavigationFramework';

export const metadata: Metadata = {
  title: 'Institutional Navigation v2 | Deepsea Nexus',
  description: 'Unified institutional navigation hub for DNOS workspaces.',
};

export default function NavigationV2Page() {
  return <NavigationFramework />;
}
