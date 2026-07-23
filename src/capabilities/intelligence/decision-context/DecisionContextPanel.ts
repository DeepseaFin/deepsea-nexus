import DecisionContextPanelView from "@/components/atlas/intelligence/DecisionContextPanelView";
import type { DecisionContextProjection } from "@/src/capabilities/intelligence/projections/DecisionContextProjection";

export interface DecisionContextPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface DecisionContextPanel {
  readonly decisionContexts: readonly DecisionContextProjection[];
  readonly totalDecisionContexts: number;
  readonly emptyState: DecisionContextPanelEmptyState;
}

interface DecisionContextPanelProps {
  readonly decisionContexts: readonly DecisionContextProjection[];
}

function toDecisionContextPanel(
  decisionContexts: readonly DecisionContextProjection[],
): DecisionContextPanel {
  return {
    decisionContexts,
    totalDecisionContexts: decisionContexts.length,
    emptyState: {
      title: "No decision contexts available",
      description: "Institutional decision contexts will appear here once context packages are available.",
    },
  };
}

export default function DecisionContextPanel({ decisionContexts }: DecisionContextPanelProps) {
  return <DecisionContextPanelView panel={toDecisionContextPanel(decisionContexts)} />;
}