"use client";

import React from "react";
import { PanelEmptyState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { FundingActionItem, FundingPanelConfig } from "@/lib/customer/funding/funding-panel.types";

export interface FundingActionsProps {
  readonly config: FundingPanelConfig;
  readonly actions: readonly FundingActionItem[];
}

export default function FundingActions({ config, actions }: FundingActionsProps) {
  return (
    <SectionCard title={config.actionsTitle} subtitle={config.actionsSubtitle}>
      <div className="grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <button
            key={action.id}
            type="button"
            disabled={action.disabled}
            className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-left transition hover:border-cyan-600/45 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <p className="text-sm font-semibold text-slate-100">{action.label}</p>
            {action.description ? <p className="mt-1 text-sm text-slate-300">{action.description}</p> : null}
            {action.badge ? (
              <span className="mt-2 inline-flex rounded-full border border-slate-700 px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] text-slate-400">
                {action.badge}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {actions.length === 0 ? <PanelEmptyState message="No actions configured." /> : null}
    </SectionCard>
  );
}
