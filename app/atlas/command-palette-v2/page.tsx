import type { Metadata } from 'next';
import GlobalCommandPalette from '@/components/workspace/GlobalCommandPalette';

export const metadata: Metadata = {
  title: 'Command Palette v2 | Deepsea Nexus',
  description: 'Institutional command palette for navigating and executing DNOS actions.',
};

export default function CommandPaletteV2Page() {
  return <GlobalCommandPalette />;
}
