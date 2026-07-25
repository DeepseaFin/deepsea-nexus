"use client";

import React from "react";
import ApprovalStage from "@/components/customer/approval/ApprovalStage";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ApprovalWorkflowOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface ApprovalWorkflowCardProps {
  readonly model?: ApprovalWorkflowOverviewModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function ApprovalWorkflowCard({ model, isLoading, error }: ApprovalWorkflowCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Approval Workflow"
        subtitle="Current workflow posture across approval stages and conditions"
        message="Loading approval workflow..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Approval Workflow"
        subtitle="Current workflow posture across approval stages and conditions"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Approval Workflow"
        subtitle="Current workflow posture across approval stages and conditions"
      >
        <PanelEmptyState message="Approval workflow is not available for this customer yet." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Approval Workflow"
      subtitle="Current workflow posture across approval stages and conditions"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Approval Stage</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.currentApprovalStage}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Completed Approvals</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.completedApprovals}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Pending Approvers</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.pendingApprovers.length}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Final Approval Readiness</p>
          <div className="mt-1">
            <StatusChip
              label={model.estimatedReadinessForFinalApproval.value}
              variant={model.estimatedReadinessForFinalApproval.variant}
            />
          </div>
        </article>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Workflow Stages</p>
          {model.stages.length > 0 ? (
            <ol className="mt-2 space-y-2.5">
              {model.stages.map((stage) => (
                <ApprovalStage key={stage.id} stage={stage} />
              ))}
            </ol>
          ) : (
            <PanelEmptyState message="No approval stages available." />
          )}
        </article>

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

          <p className="mt-4 text-[11px] uppercase tracking-[0.12em] text-slate-500">Escalations</p>
          {model.escalations.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.escalations.map((escalation) => (
                <li key={escalation} className="text-sm text-rose-200">{escalation}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No escalations available.</p>
          )}
        </article>
      </div>

      <article className="mt-4 rounded-lg border border-slate-800 bg-slate-950/70 p-3">
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Outstanding Approval Conditions</p>
        {model.outstandingApprovalConditions.length > 0 ? (
          <ul className="mt-2 space-y-1.5">
            {model.outstandingApprovalConditions.map((condition) => (
              <li key={condition} className="text-sm text-amber-200">{condition}</li>
            ))}
          </ul>
        ) : (
          <PanelEmptyState message="No outstanding approval conditions." />
        )}
      </article>
    </SectionCard>
  );
}
