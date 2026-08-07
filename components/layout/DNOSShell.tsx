"use client";

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import DNOSSidebar from '@/components/layout/DNOSSidebar';
import DNOSStatusBar from '@/components/layout/DNOSStatusBar';
import DNOSTopbar from '@/components/layout/DNOSTopbar';

export interface DNOSShellProps {
  readonly children: ReactNode;
}

function toTitle(segment: string): string {
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export default function DNOSShell({ children }: DNOSShellProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const currentWorkspace = toTitle(segments.at(-1) ?? 'Atlas');

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <DNOSSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <DNOSTopbar title={currentWorkspace} />
        <main className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </main>
        <DNOSStatusBar workspace={currentWorkspace} />
      </div>
    </div>
  );
}
