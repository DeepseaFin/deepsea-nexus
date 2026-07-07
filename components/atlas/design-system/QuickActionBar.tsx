'use client';

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export type QuickAction = {
  label: string;
  href: string;
};

export default function QuickActionBar({ actions }: { actions: QuickAction[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {actions.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 transition hover:border-cyan-600/40 hover:text-cyan-200"
        >
          {action.label}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      ))}
    </div>
  );
}
