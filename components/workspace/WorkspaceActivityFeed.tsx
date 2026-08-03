"use client";

import { Check, FileText, FileUp, HandCoins, MessageCircle, type LucideIcon } from 'lucide-react';
import type { WorkspaceActivityIconName } from '@/lib/workspace/WorkspaceContext';
import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

const activityIcons: Record<WorkspaceActivityIconName, LucideIcon> = {
  fileUp: FileUp,
  check: Check,
  messageCircle: MessageCircle,
  handCoins: HandCoins,
  fileText: FileText,
};

export default function WorkspaceActivityFeed() {
  const context = useWorkspaceContext();

  return (
    <>
      <p className="text-sm text-slate-400">{context.activityFeed.subtitle}</p>

      <div className="mt-5 divide-y divide-slate-800 border-t border-slate-800/80">
        {context.activityFeed.items.map((item) => {
          const Icon = activityIcons[item.iconName];
          return (
            <article key={item.title} className="flex items-start gap-3 py-4">
              <div className="mt-0.5 rounded-lg border border-slate-800 bg-slate-900/60 p-1.5">
                <Icon className="h-4 w-4 text-slate-300" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="mt-1 text-sm text-slate-400">{item.detail}</p>
              </div>
              <p className="whitespace-nowrap text-xs text-slate-500">{item.time}</p>
            </article>
          );
        })}
      </div>
    </>
  );
}
