import AssignmentPanelView from "@/components/atlas/operations/AssignmentPanelView";
import type { AssignmentProjection } from "@/src/capabilities/operations/projections/AssignmentProjection";

export interface AssignmentPanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface AssignmentPanel {
  readonly assignments: readonly AssignmentProjection[];
  readonly emptyState: AssignmentPanelEmptyState;
}

interface AssignmentPanelProps {
  readonly assignments: readonly AssignmentProjection[];
  readonly className?: string;
}

function toAssignmentPanel(assignments: readonly AssignmentProjection[]): AssignmentPanel {
  return {
    assignments,
    emptyState: {
      title: "No assignments",
      description: "Assignments will appear here once operational ownership is available.",
    },
  };
}

export default function AssignmentPanel({ assignments, className }: AssignmentPanelProps) {
  return <AssignmentPanelView panel={toAssignmentPanel(assignments)} className={className} />;
}