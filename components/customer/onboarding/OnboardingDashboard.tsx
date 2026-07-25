"use client";

import React from "react";
import EvidenceOverviewCard from "@/components/customer/evidence/EvidenceOverviewCard";
import CustomerHealthCard from "@/components/customer/onboarding/CustomerHealthCard";
import DecisionSummaryCard from "@/components/customer/onboarding/DecisionSummaryCard";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import FundingReadinessCard from "@/components/customer/onboarding/FundingReadinessCard";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { OnboardingDashboardModel } from "@/lib/application/WorkspaceIntelligence";
import type { WorkflowPriority } from "@/lib/customer/workflow/workflow.types";

interface OnboardingDashboardSectionState {
  readonly isLoading?: boolean;
  readonly error?: string;
}

export interface OnboardingDashboardSectionStates {
  readonly customerHealth?: OnboardingDashboardSectionState;
  readonly evidenceOverview?: OnboardingDashboardSectionState;
  readonly journey?: OnboardingDashboardSectionState;
  readonly fundingReadiness?: OnboardingDashboardSectionState;
  readonly decisionSummary?: OnboardingDashboardSectionState;
  readonly blockers?: OnboardingDashboardSectionState;
  readonly requiredDocuments?: OnboardingDashboardSectionState;
  readonly pendingApprovals?: OnboardingDashboardSectionState;
  readonly relationshipHealth?: OnboardingDashboardSectionState;
  readonly nextAction?: OnboardingDashboardSectionState;
}

export interface OnboardingDashboardProps {
  readonly model: OnboardingDashboardModel;
  readonly sectionStates?: OnboardingDashboardSectionStates;
}

function statusVariant(status: string): "default" | "success" | "warning" | "danger" | "info" {
  const normalized = status.toLowerCase();

  if (normalized.includes("ready") || normalized.includes("funded") || normalized.includes("active")) {
    return "success";
  }

  if (normalized.includes("progress") || normalized.includes("review")) {
    return "info";
  }

  if (normalized.includes("pending") || normalized.includes("attention")) {
    return "warning";
  }

  if (normalized.includes("blocked") || normalized.includes("critical") || normalized.includes("rejected")) {
    return "danger";
  }

  return "default";
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

interface StatefulSectionProps {
  readonly title: string;
  readonly subtitle: string;
  readonly state?: OnboardingDashboardSectionState;
  readonly children: React.ReactNode;
}

function StatefulSection({ title, subtitle, state, children }: StatefulSectionProps) {
  if (state?.isLoading) {
    return <PanelLoadingState title={title} subtitle={subtitle} message="Loading onboarding section..." />;
  }

  if (state?.error) {
    return <PanelErrorState title={title} subtitle={subtitle} message={state.error} />;
  }

  return (
    <SectionCard title={title} subtitle={subtitle}>
      {children}
    </SectionCard>
  );
}

export default function OnboardingDashboard({ model, sectionStates }: OnboardingDashboardProps) {
  return (
    <div className="space-y-4">
      <CustomerHealthCard
        model={model.institutionalHealthOverview}
        isLoading={sectionStates?.customerHealth?.isLoading}
        error={sectionStates?.customerHealth?.error}
      />

      <EvidenceOverviewCard
        model={model.evidenceOverview}
        isLoading={sectionStates?.evidenceOverview?.isLoading}
        error={sectionStates?.evidenceOverview?.error}
      />

      <FundingReadinessCard
        model={model.fundingReadinessAssessment}
        isLoading={sectionStates?.fundingReadiness?.isLoading}
        error={sectionStates?.fundingReadiness?.error}
      />

      <DecisionSummaryCard
        model={model.decisionSummary}
        isLoading={sectionStates?.decisionSummary?.isLoading}
        error={sectionStates?.decisionSummary?.error}
      />

      <StatefulSection
        title="Customer Onboarding Dashboard"
        subtitle="Single-screen onboarding journey view with lifecycle, readiness, and action context"
        state={sectionStates?.journey}
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Lifecycle Stage</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{model.currentLifecycleStage}</p>
          </article>

          <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Overall Progress</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{model.overallOnboardingProgress}</p>
          </article>

          <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Completion</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{model.completionPercentage}%</p>
          </article>

          <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Funding Readiness</p>
            <div className="mt-1">
              <StatusChip label={model.fundingReadiness} variant={statusVariant(model.fundingReadiness)} />
            </div>
          </article>
        </div>
      </StatefulSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <StatefulSection
          title="Critical Blockers"
          subtitle="Highest-priority blockers surfaced ahead of informational work"
          state={sectionStates?.blockers}
        >
          {model.criticalBlockers.length > 0 ? (
            <ol className="space-y-2.5">
              {model.criticalBlockers.map((blocker) => (
                <li key={blocker.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-slate-100">{blocker.title}</p>
                    <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(blocker.priority)}`}>
                      {blocker.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-300">{blocker.context}</p>
                </li>
              ))}
            </ol>
          ) : (
            <PanelEmptyState message="No critical blockers are active for this onboarding journey." />
          )}
        </StatefulSection>

        <StatefulSection
          title="Required Documents"
          subtitle="Mandatory document gaps that can block onboarding progression"
          state={sectionStates?.requiredDocuments}
        >
          {model.requiredDocuments.length > 0 ? (
            <ul className="space-y-2.5">
              {model.requiredDocuments.map((document) => (
                <li key={document.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-sm font-semibold text-slate-100">{document.documentName}</p>
                  <p className="mt-1 text-sm text-slate-300">{document.reason}</p>
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    Due: {document.dueLabel ?? "Not specified"}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No required documents are currently missing." />
          )}
        </StatefulSection>

        <StatefulSection
          title="Pending Approvals"
          subtitle="Approval decisions pending for onboarding progression"
          state={sectionStates?.pendingApprovals}
        >
          {model.pendingApprovals.length > 0 ? (
            <ul className="space-y-2.5">
              {model.pendingApprovals.map((approval) => (
                <li key={approval.id} className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                  <p className="text-sm font-semibold text-slate-100">{approval.title}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <span>Stage: {approval.currentStage}</span>
                    <span>Decision: {approval.decision}</span>
                    <span>Status: {approval.status}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <PanelEmptyState message="No pending approvals in the current onboarding lifecycle." />
          )}
        </StatefulSection>

        <StatefulSection
          title="Relationship Health"
          subtitle="Current customer relationship posture from existing projections"
          state={sectionStates?.relationshipHealth}
        >
          {model.relationshipHealth ? (
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-sm font-semibold text-slate-100">{model.relationshipHealth.relationshipName}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusChip label={model.relationshipHealth.status} variant={statusVariant(model.relationshipHealth.status)} />
                <StatusChip label={`Stage: ${model.relationshipHealth.stage}`} variant="default" />
              </div>
              <p className="mt-2 text-xs text-slate-400">
                Recent interactions: {model.relationshipHealth.recentInteractionCount}
              </p>
            </article>
          ) : (
            <PanelEmptyState message="Relationship health is not available for this customer yet." />
          )}
        </StatefulSection>
      </div>

      <StatefulSection
        title="Next Recommended Action"
        subtitle="Resolved by workspace intelligence and onboarding workflow priority"
        state={sectionStates?.nextAction}
      >
        {model.nextRecommendedAction ? (
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <p className="text-sm font-semibold text-slate-100">{model.nextRecommendedAction.title}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${priorityTone(model.nextRecommendedAction.priority)}`}>
                {model.nextRecommendedAction.priority}
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{model.nextRecommendedAction.description}</p>
            <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-slate-500">
              Owner: {model.nextRecommendedAction.owner}
            </p>
            <button
              type="button"
              aria-label={`Execute action: ${model.nextRecommendedAction.actionLabel}`}
              className="mt-3 rounded-md border border-cyan-700/50 bg-cyan-900/25 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-100 transition hover:border-cyan-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              {model.nextRecommendedAction.actionLabel}
            </button>
          </article>
        ) : (
          <PanelEmptyState message="No next recommended action is currently available." />
        )}
      </StatefulSection>
    </div>
  );
}
