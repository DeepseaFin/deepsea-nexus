"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type {
  RelationshipNextAction,
  RelationshipPanelConfig,
} from "@/lib/customer/relationship/relationship-panel.types";

function priorityTone(priority: RelationshipNextAction["priority"]): string {
  if (priority === "high") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  if (priority === "medium") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
}

export interface NextActionsCardProps {
  readonly config: RelationshipPanelConfig;
  readonly actions: readonly RelationshipNextAction[];
}

export default function NextActionsCard({ config, actions }: NextActionsCardProps) {
  return (
    <SectionCard title={config.nextActionsTitle} subtitle={config.nextActionsSubtitle}>
      <ul className="space-y-2.5" aria-label="Recommended relationship actions">
        {actions.map((action) => (
          <li key={action.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{action.title}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(action.priority)}`}
              >
                {action.priority}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              <span>Owner: {action.owner}</span>
              <span>Due: {action.dueDate}</span>
              <span>Status: {action.status}</span>
            </div>
          </li>
        ))}

        {actions.length === 0 ? <PanelEmptyState asListItem message="No actions configured for this context." /> : null}
      </ul>
    </SectionCard>
  );
}
