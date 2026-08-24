"use client";

import React from "react";
import ConfidenceIndicator from "@/components/customer/insights/ConfidenceIndicator";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { InstitutionalDecisionSummaryModel } from "@/lib/application/WorkspaceIntelligence";
import type { WorkflowPriority } from "@/lib/customer/workflow/workflow.types";

export interface DecisionSummaryCardProps {
  readonly model?: InstitutionalDecisionSummaryModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function priorityTone(priority: WorkflowPriority): string {
  if (priority === "critical") {
    return "border-rose-700/50 bg-rose-900/25 text-rose-200";
  }

  if (priority === "high") {
    return "border-orange-700/50 bg-orange-900/25 text-orange-200";
  }

  if (priority === "medium") {
    return "border-amber-700/50 bg-amber-900/25 text-amber-200";
  }

  return "border-emerald-700/50 bg-emerald-900/25 text-emerald-200";
}

export default function DecisionSummaryCard({ model, isLoading, error }: DecisionSummaryCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Institutional Decision Summary"
        subtitle="Recommendation rationale and priority actions for onboarding decisions"
        message="Loading decision summary..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Institutional Decision Summary"
        subtitle="Recommendation rationale and priority actions for onboarding decisions"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Institutional Decision Summary"
        subtitle="Recommendation rationale and priority actions for onboarding decisions"
      >
        <PanelEmptyState message="Decision summary is not available for this customer yet." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Institutional Decision Summary"
      subtitle="Recommendation rationale and priority actions for onboarding decisions"
    >
      <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Funding Recommendation</p>
        <p className="mt-1 text-sm text-slate-100">{model.fundingRecommendation}</p>
        {model.confidenceIndicator ? (
          <div className="mt-2">
            <ConfidenceIndicator value={model.confidenceIndicator} />
          </div>
        ) : null}
      </article>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Key Strengths</p>
          {model.keyStrengths.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.keyStrengths.map((strength) => (
                <li key={strength} className="text-sm text-slate-300">
                  {strength}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No strengths are currently available.</p>
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Critical Blockers</p>
          {model.criticalBlockers.length > 0 ? (
            <ul className="mt-2 space-y-2">
              {model.criticalBlockers.map((blocker) => (
                <li key={blocker.id} className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm text-slate-100">{blocker.title}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(blocker.priority)}`}>
                      {blocker.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-400">{blocker.context}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No critical blockers.</p>
          )}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Required Next Actions</p>
        {model.requiredNextActions.length > 0 ? (
          <ol className="mt-2 space-y-2.5">
            {model.requiredNextActions.map((action, index) => (
              <li key={`${action.title}-${index}`} className="rounded-md border border-slate-800 bg-slate-900/60 p-2.5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-semibold text-slate-100">{action.title}</p>
                  <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(action.priority)}`}>
                    {action.priority}
                  </span>
                </div>
                <p className="mt-1 text-sm text-slate-300">{action.description}</p>
                <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">Owner: {action.owner}</p>
              </li>
            ))}
          </ol>
        ) : (
          <PanelEmptyState message="No required next actions are available." />
        )}
      </article>
    </SectionCard>
  );
}
