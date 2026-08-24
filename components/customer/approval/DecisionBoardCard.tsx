"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import type { InstitutionalDecisionBoardModel } from "@/lib/application/WorkspaceIntelligence";

export interface DecisionBoardCardProps {
  readonly model?: InstitutionalDecisionBoardModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function DecisionBoardCard({ model, isLoading, error }: DecisionBoardCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Institutional Decision Board"
        subtitle="Primary summary for institutional decision-making"
        message="Loading decision board..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Institutional Decision Board"
        subtitle="Primary summary for institutional decision-making"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Institutional Decision Board"
        subtitle="Primary summary for institutional decision-making"
      >
        <PanelEmptyState message="Decision board data is not available for this customer yet." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Institutional Decision Board"
      subtitle="Primary summary for institutional decision-making"
    >
      <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Institutional Recommendation</p>
        <p className="mt-1 text-sm font-semibold text-slate-100">{model.institutionalRecommendation}</p>
      </article>

      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Credit Assessment Summary</p>
          <p className="mt-1 text-sm text-slate-100">{model.creditAssessmentSummary}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Approval Workflow Status</p>
          <p className="mt-1 text-sm text-slate-100">{model.approvalWorkflowStatus}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Evidence Sufficiency</p>
          <p className="mt-1 text-sm text-slate-100">{model.evidenceSufficiency}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Funding Readiness</p>
          <p className="mt-1 text-sm text-slate-100">{model.fundingReadiness}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Critical Blockers</p>
          <p className="mt-1 text-sm text-slate-100">{model.criticalBlockers.length}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Critical Blockers</p>
          {model.criticalBlockers.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.criticalBlockers.map((blocker) => (
                <li key={blocker.id} className="text-sm text-rose-200">
                  {blocker.title} ({blocker.priority})
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No critical blockers in the current decision view." />
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recommended Next Action</p>
          {model.recommendedNextAction ? (
            <div className="mt-2">
              <p className="text-sm font-semibold text-slate-100">{model.recommendedNextAction.title}</p>
              <p className="mt-1 text-sm text-slate-300">{model.recommendedNextAction.description}</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                Owner: {model.recommendedNextAction.owner} • Priority: {model.recommendedNextAction.priority}
              </p>
            </div>
          ) : (
            <PanelEmptyState message="No recommended action is currently available." />
          )}
        </article>
      </div>
    </SectionCard>
  );
}
