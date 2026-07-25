"use client";

import ExecutiveDashboardInsights from "@/components/customer/dashboard/ExecutiveDashboardInsights";
import ExecutiveDashboardKPIs from "@/components/customer/dashboard/ExecutiveDashboardKPIs";
import ExecutiveDashboardStatusCard from "@/components/customer/dashboard/ExecutiveDashboardStatusCard";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
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
    return <PanelLoadingState title="Executive Dashboard" subtitle="Loading executive summary" />;
  }

  if (error) {
    return <PanelErrorState title="Executive Dashboard" subtitle="Unable to render executive section" message={error} />;
  }

  if (!dashboard) {
    return (
      <SectionCard title="Executive Dashboard" subtitle="No executive summary is currently available">
        <PanelEmptyState message="Executive dashboard data is not available in this workspace." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Executive Dashboard" subtitle={dashboard.executiveSummary.headline}>
        <ExecutiveDashboardKPIs dashboard={dashboard} workspace={workspace} />
      </SectionCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <ExecutiveDashboardStatusCard dashboard={dashboard} workspace={workspace} />
        <ExecutiveDashboardInsights dashboard={dashboard} />
      </div>
    </div>
  );
}
