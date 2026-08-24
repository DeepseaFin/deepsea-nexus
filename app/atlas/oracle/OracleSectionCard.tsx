'use client';

import type { ReactNode } from 'react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type OracleSectionIcon = 'database' | 'fileText' | 'activity';

type OracleSectionCardProps = {
  title: string;
  icon: OracleSectionIcon;
  children: ReactNode;
  className?: string;
};

const ICON_KEYS = {
  database: 'building-2',
  fileText: 'file-text',
  activity: 'activity',
} as const;

export default function OracleSectionCard({ title, icon, children, className }: OracleSectionCardProps) {
  const iconKey = ICON_KEYS[icon];

  return (
    <SectionCard title={title} iconKey={iconKey} className={className}>
      {children}
    </SectionCard>
  );
}
