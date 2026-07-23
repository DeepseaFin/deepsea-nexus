import ExecutiveWorkspaceView from "@/components/atlas/intelligence/ExecutiveWorkspaceView";
import type { KPIPanel } from "@/src/capabilities/intelligence/kpi/KPIPanel";
import type { KPIProjection } from "@/src/capabilities/intelligence/projections/KPIProjection";
import type { ScorecardPanel } from "@/src/capabilities/intelligence/scorecard/ScorecardPanel";
import type { ScorecardProjection } from "@/src/capabilities/intelligence/projections/ScorecardProjection";

export interface ExecutiveWorkspace {
  readonly kpiPanel: KPIPanel;
  readonly scorecardPanel: ScorecardPanel;
}

interface ExecutiveWorkspaceProps {
  readonly kpis: readonly KPIProjection[];
  readonly scorecards: readonly ScorecardProjection[];
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

function toScorecardPanel(scorecards: readonly ScorecardProjection[]): ScorecardPanel {
  return {
    scorecards,
    emptyState: {
      title: "No scorecards available",
      description: "Institutional scorecards will appear here once groupings are available.",
    },
    totalScorecards: scorecards.length,
  };
}

function toExecutiveWorkspace(
  kpis: readonly KPIProjection[],
  scorecards: readonly ScorecardProjection[],
): ExecutiveWorkspace {
  return {
    kpiPanel: toKPIPanel(kpis),
    scorecardPanel: toScorecardPanel(scorecards),
  };
}

export default function ExecutiveWorkspace({ kpis, scorecards, className }: ExecutiveWorkspaceProps) {
  return <ExecutiveWorkspaceView workspace={toExecutiveWorkspace(kpis, scorecards)} className={className} />;
}