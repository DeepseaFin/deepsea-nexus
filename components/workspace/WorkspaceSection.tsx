"use client";

import type { ReactNode } from 'react';
import type { WorkspaceSectionIconName } from '@/lib/workspace/WorkspaceContext';
import SectionCard, { type SectionCardIconKey } from '@/components/atlas/intelligence/SectionCard';

const sectionIconKeys: Record<WorkspaceSectionIconName, SectionCardIconKey> = {
  sparkles: 'sparkles',
  bell: 'bell-ring',
  handCoins: 'hand-coins',
  folder: 'folder-kanban',
};

export default function WorkspaceSection({
  title,
  iconName,
  children,
}: {
  title: string;
  iconName: WorkspaceSectionIconName;
  children: ReactNode;
}) {
  const iconKey = sectionIconKeys[iconName];

  return (
    <SectionCard title={title} iconKey={iconKey}>
      {children}
    </SectionCard>
  );
}
