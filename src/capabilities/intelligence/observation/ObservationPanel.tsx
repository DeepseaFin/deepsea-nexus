import ObservationPanelView from "@/components/atlas/intelligence/ObservationPanelView";
import type { ObservationProjection } from "@/src/capabilities/intelligence/projections/ObservationProjection";

export interface ObservationPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface ObservationPanel {
  readonly observations: readonly ObservationProjection[];
  readonly totalObservations: number;
  readonly emptyState: ObservationPanelEmptyState;
}

interface ObservationPanelProps {
  readonly observations: readonly ObservationProjection[];
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

export default function ObservationPanel({ observations }: ObservationPanelProps) {
  return <ObservationPanelView panel={toObservationPanel(observations)} />;
}