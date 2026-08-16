import KPIPanelView from "@/components/atlas/intelligence/KPIPanelView";
import type { KPIProjection } from "@/src/capabilities/intelligence/projections/KPIProjection";

export interface KPIPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface KPIPanel {
  readonly kpis: readonly KPIProjection[];
  readonly emptyState: KPIPanelEmptyState;
  readonly totalKPIs: number;
}

interface KPIPanelProps {
  readonly kpis: readonly KPIProjection[];
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

export default function KPIPanel({ kpis }: KPIPanelProps) {
  return <KPIPanelView panel={toKPIPanel(kpis)} />;
}