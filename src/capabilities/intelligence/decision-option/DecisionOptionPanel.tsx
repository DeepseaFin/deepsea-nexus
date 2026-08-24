import DecisionOptionPanelView from "@/components/atlas/intelligence/DecisionOptionPanelView";
import type { DecisionOptionProjection } from "@/src/capabilities/intelligence/projections/DecisionOptionProjection";

export interface DecisionOptionPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface DecisionOptionPanel {
  readonly decisionOptions: readonly DecisionOptionProjection[];
  readonly totalDecisionOptions: number;
  readonly emptyState: DecisionOptionPanelEmptyState;
}

interface DecisionOptionPanelProps {
  readonly decisionOptions: readonly DecisionOptionProjection[];
}

function toDecisionOptionPanel(
  decisionOptions: readonly DecisionOptionProjection[],
): DecisionOptionPanel {
  return {
    decisionOptions,
    totalDecisionOptions: decisionOptions.length,
    emptyState: {
      title: "No decision options available",
      description: "Institutional decision options will appear here once option packages are available.",
    },
  };
}

export default function DecisionOptionPanel({ decisionOptions }: DecisionOptionPanelProps) {
  return <DecisionOptionPanelView panel={toDecisionOptionPanel(decisionOptions)} />;
}