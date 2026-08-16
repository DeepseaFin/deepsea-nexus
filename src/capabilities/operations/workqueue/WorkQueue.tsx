import WorkQueueView from "@/components/atlas/operations/WorkQueueView";
import type { AssignmentProjection } from "@/src/capabilities/operations/projections/AssignmentProjection";

export interface WorkQueueEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface WorkQueueItem {
  readonly assignmentId: string;
  readonly assigneeName: string;
  readonly assignmentType: string;
  readonly status: string;
  readonly operationId: string;
  readonly taskId?: string;
}

export interface WorkQueue {
  readonly queueItems: readonly WorkQueueItem[];
  readonly emptyState: WorkQueueEmptyState;
  readonly totalAssignments: number;
}

interface WorkQueueProps {
  readonly assignments: readonly AssignmentProjection[];
  readonly className?: string;
}

function toQueueItems(assignments: readonly AssignmentProjection[]): readonly WorkQueueItem[] {
  return assignments.map((assignment) => ({
    assignmentId: assignment.assignmentId,
    assigneeName: assignment.assigneeName,
    assignmentType: assignment.assignmentType,
    status: assignment.status,
    operationId: assignment.operationId,
    taskId: assignment.taskId,
  }));
}

function toWorkQueue(assignments: readonly AssignmentProjection[]): WorkQueue {
  return {
    queueItems: toQueueItems(assignments),
    emptyState: {
      title: "No work queue items",
      description: "Work queue items will appear here once assignments are available.",
    },
    totalAssignments: assignments.length,
  };
}

export default function WorkQueue({ assignments, className }: WorkQueueProps) {
  return <WorkQueueView queue={toWorkQueue(assignments)} className={className} />;
}