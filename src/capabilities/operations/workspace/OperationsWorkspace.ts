import OperationsWorkspaceView from "@/components/atlas/operations/OperationsWorkspaceView";
import type { OperationsWorkspaceProjection } from "@/src/capabilities/operations/projections/OperationsWorkspaceProjection";
import type { ActivityFeed } from "@/src/capabilities/operations/activity/ActivityFeed";
import type { TimelinePanel } from "@/src/capabilities/operations/timeline/TimelinePanel";

export interface OperationsWorkspace {
  readonly operation: OperationsWorkspaceProjection["operation"];
  readonly tasks: OperationsWorkspaceProjection["tasks"];
  readonly assignments: OperationsWorkspaceProjection["assignments"];
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

function toOperationsWorkspace(projection: OperationsWorkspaceProjection): OperationsWorkspace {
  return {
    operation: projection.operation,
    tasks: projection.tasks,
    assignments: projection.assignments,
    timelinePanel: toTimelinePanel(projection),
    activityFeed: toActivityFeed(projection),
  };
}

export default function OperationsWorkspace({ projection, className }: OperationsWorkspaceProps) {
  return <OperationsWorkspaceView workspace={toOperationsWorkspace(projection)} className={className} />;
}