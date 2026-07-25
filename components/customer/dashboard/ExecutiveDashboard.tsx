"use client";

import ExecutiveDashboardInsights from "@/components/customer/dashboard/ExecutiveDashboardInsights";
import ExecutiveDashboardKPIs from "@/components/customer/dashboard/ExecutiveDashboardKPIs";
import ExecutiveDashboardStatusCard from "@/components/customer/dashboard/ExecutiveDashboardStatusCard";
import SectionCard from "@/components/ui/SectionCard";
import type { ExecutiveRelationshipDashboardViewModel } from "@/lib/customer/ExecutiveRelationshipDashboardViewModel";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface ExecutiveDashboardProps {
  readonly dashboard: ExecutiveRelationshipDashboardViewModel;
  readonly workspace?: RelationshipWorkspaceViewModel;
}

export default function ExecutiveDashboard({
  dashboard,
  workspace,
}: ExecutiveDashboardProps) {
  return (
    <div className="space-y-4">
      <SectionCard title="Executive Dashboard" subtitle={dashboard.executiveSummary.headline}>
        <ExecutiveDashboardKPIs dashboard={dashboard} workspace={workspace} />
      </SectionCard>

      <div className="grid gap-4 xl:grid-cols-2">
        <ExecutiveDashboardStatusCard dashboard={dashboard} workspace={workspace} />
        <ExecutiveDashboardInsights dashboard={dashboard} />
      </div>
    </div>
  );
}
