import OperationsWorkspaceView from "@/components/atlas/operations/OperationsWorkspaceView";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";
import type { ActivityFeed } from "@/src/capabilities/operations/activity/ActivityFeed";
import type { WorkQueue } from "@/src/capabilities/operations/workqueue/WorkQueue";
import type { TimelinePanel } from "@/src/capabilities/operations/timeline/TimelinePanel";

export interface OperationsWorkspace {
  readonly operation: OperationsWorkspaceProjection["operation"];
  readonly tasks: OperationsWorkspaceProjection["tasks"];
  readonly assignments: OperationsWorkspaceProjection["assignments"];
  readonly workQueue: WorkQueue;
  readonly timelinePanel: TimelinePanel;
  readonly activityFeed: ActivityFeed;
}

interface OperationsWorkspaceProps {
  readonly projection: OperationsWorkspaceProjection;
  readonly className?: string;
}

function toTimelinePanel(projection: OperationsWorkspaceProjection): TimelinePanel {
  return {
    events: projection.timeline,
    emptyState: {
      title: "No timeline events",
      description: "Timeline events will appear here once operational activity is available.",
    },
  };
}

function toActivityFeed(projection: OperationsWorkspaceProjection): ActivityFeed {
  return {
    events: projection.timeline,
    emptyState: {
      title: "No activity yet",
      description: "Operational activity will appear here as timeline events become available.",
    },
  };
}

function toWorkQueue(projection: OperationsWorkspaceProjection): WorkQueue {
  return {
    queueItems: projection.assignments.map((assignment) => ({
      assignmentId: assignment.assignmentId,
      assigneeName: assignment.assigneeName,
      assignmentType: assignment.assignmentType,
      status: assignment.status,
      operationId: assignment.operationId,
      taskId: assignment.taskId,
    })),
    emptyState: {
      title: "No work queue items",
      description: "Work queue items will appear here once assignments are available.",
    },
    totalAssignments: projection.assignments.length,
  };
}

function toOperationsWorkspace(projection: OperationsWorkspaceProjection): OperationsWorkspace {
  return {
    operation: projection.operation,
    tasks: projection.tasks,
    assignments: projection.assignments,
    workQueue: toWorkQueue(projection),
    timelinePanel: toTimelinePanel(projection),
    activityFeed: toActivityFeed(projection),
  };
}

export default function OperationsWorkspace({ projection, className }: OperationsWorkspaceProps) {
  return <OperationsWorkspaceView workspace={toOperationsWorkspace(projection)} className={className} />;
}