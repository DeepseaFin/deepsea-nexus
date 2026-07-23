import type { OperationId } from "@/lib/operations/OperationId";
import type { TimelineEventId } from "@/lib/operations/timeline/TimelineEventId";
import type { TimelineEventMetadata } from "@/lib/operations/timeline/TimelineEventMetadata";
import type { TimelineEventType } from "@/lib/operations/timeline/TimelineEventType";

export interface TimelineEvent {
  readonly timelineEventId: TimelineEventId;
  readonly operationId: OperationId;
  readonly eventType: TimelineEventType;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly actor: string;
  readonly metadata: TimelineEventMetadata;
}