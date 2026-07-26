"use client";

import ExecutiveDashboardInsights from "@/components/customer/dashboard/ExecutiveDashboardInsights";
import ExecutiveDashboardKPIs from "@/components/customer/dashboard/ExecutiveDashboardKPIs";
import ExecutiveDashboardStatusCard from "@/components/customer/dashboard/ExecutiveDashboardStatusCard";
import EmptyState from "@/components/customer/shared/EmptyState";
import ErrorState from "@/components/customer/shared/ErrorState";
import LoadingState from "@/components/customer/shared/LoadingState";
import Section from "@/components/customer/shared/Section";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface ExecutiveDashboardProps {
  readonly dashboard?: ExecutiveRelationshipDashboardViewModel;
  readonly workspace?: RelationshipWorkspaceViewModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

export default function ExecutiveDashboard({
  dashboard,
  workspace,
  isLoading = false,
  error,
}: ExecutiveDashboardProps) {
  if (isLoading) {
    return <LoadingState title="Executive Dashboard" message="Loading executive summary" />;
  }

  if (error) {
    return <ErrorState title="Executive Dashboard" message={`Unable to render executive section: ${error}`} />;
  }

  if (!dashboard) {
    return (
      <Section title="Executive Dashboard" subtitle="No executive summary is currently available">
        <EmptyState message="Executive dashboard data is not available in this workspace." />
      </Section>
    );
  }

  return (
    <div className="space-y-5">
      <Section title="Executive Dashboard" subtitle={dashboard.executiveSummary.headline}>
        <ExecutiveDashboardKPIs dashboard={dashboard} workspace={workspace} />
      </Section>

      <div className="grid gap-5 xl:grid-cols-2">
        <ExecutiveDashboardStatusCard dashboard={dashboard} workspace={workspace} />
        <ExecutiveDashboardInsights dashboard={dashboard} />
      </div>
    </div>
  );
}
