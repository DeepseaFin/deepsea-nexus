import ExecutiveWorkspaceView from "@/components/atlas/intelligence/ExecutiveWorkspaceView";
import type { KPIPanel } from "@/src/capabilities/intelligence/kpi/KPIPanel";
import type { KPIProjection } from "@/src/capabilities/intelligence/projections/KPIProjection";

export interface ExecutiveWorkspace {
  readonly kpiPanel: KPIPanel;
}

interface ExecutiveWorkspaceProps {
  readonly kpis: readonly KPIProjection[];
  readonly className?: string;
}

function toKPIPanel(kpis: readonly KPIProjection[]): KPIPanel {
  return {
    kpis,
    emptyState: {
      title: "No KPIs available",
      description: "Institutional KPIs will appear here once metrics are available.",
    },
    totalKPIs: kpis.length,
  };
}

function toExecutiveWorkspace(kpis: readonly KPIProjection[]): ExecutiveWorkspace {
  return {
    kpiPanel: toKPIPanel(kpis),
  };
}

export default function ExecutiveWorkspace({ kpis, className }: ExecutiveWorkspaceProps) {
  return <ExecutiveWorkspaceView workspace={toExecutiveWorkspace(kpis)} className={className} />;
}