"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { FundingReadinessAssessmentModel } from "@/lib/application/WorkspaceIntelligence";
import type { WorkflowPriority } from "@/lib/customer/workflow/workflow.types";

export interface FundingReadinessCardProps {
  readonly model?: FundingReadinessAssessmentModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function statusVariant(status: FundingReadinessAssessmentModel["status"]):
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info" {
  if (status === "Funding Ready") {
    return "success";
  }

  if (status === "Ready for Review") {
    return "info";
  }

  if (status === "In Progress") {
    return "warning";
  }

  return "danger";
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

export default function FundingReadinessCard({ model, isLoading, error }: FundingReadinessCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Funding Readiness Assessment"
        subtitle="Funding qualification and blockers for this onboarding journey"
        message="Loading funding readiness assessment..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Funding Readiness Assessment"
        subtitle="Funding qualification and blockers for this onboarding journey"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Funding Readiness Assessment"
        subtitle="Funding qualification and blockers for this onboarding journey"
      >
        <PanelEmptyState message="Funding readiness assessment is not available right now." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Funding Readiness Assessment"
      subtitle="Funding qualification and blockers for this onboarding journey"
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Readiness Score</p>
          <p className="mt-1 text-xl font-semibold text-slate-100">{model.score}</p>
          <p className="text-xs text-slate-400">out of 100</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Readiness Status</p>
          <div className="mt-1">
            <StatusChip label={model.status} variant={statusVariant(model.status)} />
          </div>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Pending Approvals</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.pendingApprovals.length}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Outstanding Documents</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{model.outstandingDocuments.length}</p>
        </article>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Missing Requirements</p>
          {model.missingRequirements.length > 0 ? (
            <ul className="mt-2 space-y-1.5">
              {model.missingRequirements.map((requirement) => (
                <li key={requirement} className="text-sm text-slate-300">
                  {requirement}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-slate-400">No missing requirements.</p>
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
        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Recommended Next Action</p>
        {model.recommendedNextAction ? (
          <div className="mt-2">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{model.recommendedNextAction.title}</p>
              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(model.recommendedNextAction.priority)}`}
              >
                {model.recommendedNextAction.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{model.recommendedNextAction.description}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              Owner: {model.recommendedNextAction.owner}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm text-slate-400">No recommended funding action at this time.</p>
        )}
      </article>
    </SectionCard>
  );
}
