"use client";

import React from "react";
import { AlertCircle } from "lucide-react";
import DashboardSection from "@/components/dashboard/DashboardSection";
import StatusChip from "@/components/ui/StatusChip";
import type { DashboardPriorityAction } from "@/lib/dashboard/dashboard.types";

export interface PriorityActionsPanelProps {
  readonly actions: readonly DashboardPriorityAction[];
}

export default function PriorityActionsPanel({ actions }: PriorityActionsPanelProps) {
  return (
    <DashboardSection
      title="Priority Actions"
      subtitle="Role-prioritized actions for current institutional context"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {actions.map((action) => {
          const Icon = action.icon ?? AlertCircle;
          return (
            <article
              key={action.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 text-cyan-300">
                  <Icon className="h-4 w-4" />
                </div>
                <StatusChip label={action.severity} variant={action.severity} />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-100">{action.title}</h3>
              <p className="mt-1 text-sm text-slate-400">{action.description}</p>
              <button
                type="button"
                onClick={action.onAction}
                className="mt-3 rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200 transition hover:border-cyan-600/40"
              >
                {action.actionLabel}
              </button>
            </article>
          );
        })}
      </div>
    </DashboardSection>
  );
}
