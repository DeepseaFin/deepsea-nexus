import ActivityFeedView from "@/components/atlas/operations/ActivityFeedView";
import type { TimelineEventProjection } from "@/src/capabilities/operations/projections/TimelineEventProjection";

export interface ActivityFeedEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface ActivityFeed {
  readonly events: readonly TimelineEventProjection[];
  readonly emptyState: ActivityFeedEmptyState;
}

interface ActivityFeedProps {
  readonly events: readonly TimelineEventProjection[];
  readonly className?: string;
}

function toActivityFeed(events: readonly TimelineEventProjection[]): ActivityFeed {
  return {
    events,
    emptyState: {
      title: "No activity yet",
      description: "Operational activity will appear here as timeline events become available.",
    },
  };
}

export default function ActivityFeed({ events, className }: ActivityFeedProps) {
  return <ActivityFeedView feed={toActivityFeed(events)} className={className} />;
}