import type { TimelineEvent } from "@/lib/operations/timeline/TimelineEvent";
import type {
  TimelineEventProjection,
  TimelineEventProjectionSummaryMetadata,
} from "@/src/capabilities/operations/projections/TimelineEventProjection";

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return date.toISOString();
}

function toSummaryMetadata(timelineEvent: TimelineEvent): TimelineEventProjectionSummaryMetadata {
  return {
    sourceSystem: timelineEvent.metadata.sourceSystem ?? "Unknown source",
    sourceReference: timelineEvent.metadata.sourceReference ?? "Unavailable reference",
    tags: timelineEvent.metadata.tags ?? [],
    attributeCount: Object.keys(timelineEvent.metadata.attributes ?? {}).length,
  };
}

export function getTimelineEventProjection(timelineEvent: TimelineEvent): TimelineEventProjection {
  return {
    timelineEventId: timelineEvent.timelineEventId.toString(),
    operationId: timelineEvent.operationId.toString(),
    eventType: timelineEvent.eventType,
    title: timelineEvent.title,
    description: timelineEvent.description,
    actor: timelineEvent.actor,
    occurredAt: formatTimestamp(timelineEvent.occurredAt),
    summaryMetadata: toSummaryMetadata(timelineEvent),
  };
}