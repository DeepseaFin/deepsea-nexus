"use client";

import type { ReactNode } from 'react';
import { BellRing, FolderKanban, HandCoins, Sparkles, type LucideIcon } from 'lucide-react';
import type { WorkspaceSectionIconName } from '@/lib/workspace/WorkspaceContext';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

const sectionIcons: Record<WorkspaceSectionIconName, LucideIcon> = {
  sparkles: Sparkles,
  bell: BellRing,
  handCoins: HandCoins,
  folder: FolderKanban,
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
  const Icon = sectionIcons[iconName];

  return (
    <SectionCard title={title} icon={Icon}>
      {children}
    </SectionCard>
  );
}
