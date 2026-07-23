import ExecutiveWorkspaceView from "@/components/atlas/intelligence/ExecutiveWorkspaceView";
import type { KPIPanel } from "@/src/capabilities/intelligence/kpi/KPIPanel";
import type { KPIProjection } from "@/src/capabilities/intelligence/projections/KPIProjection";
import type { ObservationProjection } from "@/src/capabilities/intelligence/projections/ObservationProjection";
import type { ScorecardPanel } from "@/src/capabilities/intelligence/scorecard/ScorecardPanel";
import type { ObservationPanel } from "@/src/capabilities/intelligence/observation/ObservationPanel";
import type { ScorecardProjection } from "@/src/capabilities/intelligence/projections/ScorecardProjection";

export interface ExecutiveWorkspace {
  readonly kpiPanel: KPIPanel;
  readonly scorecardPanel: ScorecardPanel;
  readonly observationPanel: ObservationPanel;
}

interface ExecutiveWorkspaceProps {
  readonly kpis: readonly KPIProjection[];
  readonly scorecards: readonly ScorecardProjection[];
  readonly observations: readonly ObservationProjection[];
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

function toObservationPanel(observations: readonly ObservationProjection[]): ObservationPanel {
  return {
    observations,
    totalObservations: observations.length,
    emptyState: {
      title: "No observations available",
      description: "Institutional observations will appear here once findings are available.",
    },
  };
}

function toExecutiveWorkspace(
  kpis: readonly KPIProjection[],
  scorecards: readonly ScorecardProjection[],
  observations: readonly ObservationProjection[],
): ExecutiveWorkspace {
  return {
    kpiPanel: toKPIPanel(kpis),
    scorecardPanel: toScorecardPanel(scorecards),
    observationPanel: toObservationPanel(observations),
  };
}

export default function ExecutiveWorkspace({ kpis, scorecards, observations, className }: ExecutiveWorkspaceProps) {
  return <ExecutiveWorkspaceView workspace={toExecutiveWorkspace(kpis, scorecards, observations)} className={className} />;
}