import TimelinePanelView from "@/components/atlas/operations/TimelinePanelView";
import type { TimelineEventProjection } from "@/src/capabilities/operations/projections/TimelineEventProjection";

export interface TimelinePanelEmptyState {
  readonly title: string;
  readonly description: string;
}

export interface TimelinePanel {
  readonly events: readonly TimelineEventProjection[];
  readonly emptyState: TimelinePanelEmptyState;
}

interface TimelinePanelProps {
  readonly events: readonly TimelineEventProjection[];
  readonly className?: string;
}

function toTimelinePanel(events: readonly TimelineEventProjection[]): TimelinePanel {
  return {
    events,
    emptyState: {
      title: "No timeline events",
      description: "Timeline events will appear here once operational activity is available.",
    },
  };
}

export default function TimelinePanel({ events, className }: TimelinePanelProps) {
  return <TimelinePanelView panel={toTimelinePanel(events)} className={className} />;
}