import DecisionSupportPanelView from "@/components/atlas/intelligence/DecisionSupportPanelView";
import type { DecisionSupportProjection } from "@/src/capabilities/intelligence/projections/DecisionSupportProjection";

export interface DecisionSupportPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface DecisionSupportPanel {
  readonly decisionSupportItems: readonly DecisionSupportProjection[];
  readonly totalDecisionSupportItems: number;
  readonly emptyState: DecisionSupportPanelEmptyState;
}

interface DecisionSupportPanelProps {
  readonly decisionSupportItems: readonly DecisionSupportProjection[];
}

function toDecisionSupportPanel(
  decisionSupportItems: readonly DecisionSupportProjection[],
): DecisionSupportPanel {
  return {
    decisionSupportItems,
    totalDecisionSupportItems: decisionSupportItems.length,
    emptyState: {
      title: "No decision support packages available",
      description: "Institutional decision support packages will appear here once analysis packages are available.",
    },
  };
}

export default function DecisionSupportPanel({ decisionSupportItems }: DecisionSupportPanelProps) {
  return <DecisionSupportPanelView panel={toDecisionSupportPanel(decisionSupportItems)} />;
}