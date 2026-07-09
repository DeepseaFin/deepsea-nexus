'use client';

import type { ReactNode } from 'react';
import { Activity, Database, FileText } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type OracleSectionIcon = 'database' | 'fileText' | 'activity';

type OracleSectionCardProps = {
  title: string;
  icon: OracleSectionIcon;
  children: ReactNode;
  className?: string;
};

const ICONS = {
  database: Database,
  fileText: FileText,
  activity: Activity,
} as const;

export default function OracleSectionCard({ title, icon, children, className }: OracleSectionCardProps) {
  const Icon = ICONS[icon];

  return (
    <SectionCard title={title} icon={Icon} className={className}>
      {children}
    </SectionCard>
  );
}
