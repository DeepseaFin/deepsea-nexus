"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { InstitutionalHealthOverviewModel } from "@/lib/application/WorkspaceIntelligence";

export interface CustomerHealthCardProps {
  readonly model?: InstitutionalHealthOverviewModel | null;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function HealthItem({ label, value, variant }: { label: string; value: string; variant: "default" | "success" | "warning" | "danger" | "info" | undefined }) {
  return (
    <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">{label}</p>
      <div className="mt-1">
        <StatusChip label={value} variant={variant} />
      </div>
    </article>
  );
}

export default function CustomerHealthCard({ model, isLoading, error }: CustomerHealthCardProps) {
  if (isLoading) {
    return (
      <PanelLoadingState
        title="Institutional Health Overview"
        subtitle="At-a-glance operational health across onboarding dimensions"
        message="Loading institutional health overview..."
      />
    );
  }

  if (error) {
    return (
      <PanelErrorState
        title="Institutional Health Overview"
        subtitle="At-a-glance operational health across onboarding dimensions"
        message={error}
      />
    );
  }

  if (!model) {
    return (
      <SectionCard
        title="Institutional Health Overview"
        subtitle="At-a-glance operational health across onboarding dimensions"
      >
        <PanelEmptyState message="Institutional health overview is not available for this customer yet." />
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Institutional Health Overview"
      subtitle="At-a-glance operational health across onboarding dimensions"
    >
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <HealthItem
          label="Overall Customer Health"
          value={model.overallCustomerHealth.value}
          variant={model.overallCustomerHealth.variant}
        />
        <HealthItem
          label="Onboarding Health"
          value={model.onboardingHealth.value}
          variant={model.onboardingHealth.variant}
        />
        <HealthItem
          label="Documentation Completeness"
          value={model.documentationCompleteness.value}
          variant={model.documentationCompleteness.variant}
        />
        <HealthItem
          label="Approval Readiness"
          value={model.approvalReadiness.value}
          variant={model.approvalReadiness.variant}
        />
        <HealthItem
          label="Funding Readiness"
          value={model.fundingReadiness.value}
          variant={model.fundingReadiness.variant}
        />
        <HealthItem
          label="Relationship Health"
          value={model.relationshipHealth.value}
          variant={model.relationshipHealth.variant}
        />
        <HealthItem
          label="Operational Status"
          value={model.operationalStatus.value}
          variant={model.operationalStatus.variant}
        />
      </div>
    </SectionCard>
  );
}
