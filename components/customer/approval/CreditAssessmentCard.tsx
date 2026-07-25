"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { CreditAssessmentOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface CreditAssessmentCardProps {
  readonly model?: CreditAssessmentOverviewModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function CreditAssessmentCard({ model, isLoading, error }: CreditAssessmentCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Credit & Approval Overview"
        subtitle="Credit assessment and institutional decision posture"
        message="Loading credit assessment..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Credit & Approval Overview"
        subtitle="Credit assessment and institutional decision posture"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Credit & Approval Overview"
        subtitle="Credit assessment and institutional decision posture"
      >
        <PanelEmptyState message="Credit assessment overview is not available." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Credit & Approval Overview"
      subtitle="Credit assessment and institutional decision posture"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Credit Assessment Status</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.creditAssessmentStatus}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Approval Stage</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.approvalStage}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Decision Readiness</p>
          <div className="mt-1">
            <StatusChip label={model.decisionReadiness.value} variant={model.decisionReadiness.variant} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Pending Approvers</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.pendingApprovers.length}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Pending Approvers</p>
          {model.pendingApprovers.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.pendingApprovers.map((approver) => (
                <li key={approver.id} className="text-sm text-slate-200">
                  {approver.name} ({approver.role})
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No pending approvers." />
          )}
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Policy Exceptions</p>
          {model.policyExceptions.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.policyExceptions.map((exception) => (
                <li key={exception} className="text-sm text-amber-200">{exception}</li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No policy exceptions detected." />
          )}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
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
          <PanelEmptyState message="No recommended approval action is currently available." />
        )}
      </article>
    </SectionCard>
  );
}
