"use client";

import { FileUp, HandCoins, Search, UserPlus, type LucideIcon } from 'lucide-react';
import type { WorkspaceQuickActionIconName } from '@/lib/workspace/WorkspaceContext';
import { useWorkspaceContext } from '@/lib/workspace/WorkspaceProvider';

const quickActionIcons: Record<WorkspaceQuickActionIconName, LucideIcon> = {
  userPlus: UserPlus,
  handCoins: HandCoins,
  fileUp: FileUp,
  search: Search,
};

export default function WorkspaceQuickActions() {
  const context = useWorkspaceContext();

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {context.quickActions.map((item) => {
        const Icon = quickActionIcons[item.iconName];
        return (
          <button
            key={item.title}
            type="button"
            className="flex min-h-[136px] w-full flex-col items-start justify-between rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-left transition hover:border-cyan-700/45 hover:bg-slate-900/70"
          >
            <Icon className="h-5 w-5 text-cyan-300" />
            <div>
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <p className="mt-1 text-xs text-slate-400">{item.description}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
