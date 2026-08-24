import type { OperationId } from "@/lib/operations/OperationId";
import type { TimelineEvent } from "@/lib/operations/timeline/TimelineEvent";
import type { TimelineEventId } from "@/lib/operations/timeline/TimelineEventId";
import type { TimelineEventMetadata } from "@/lib/operations/timeline/TimelineEventMetadata";
import type { TimelineEventType } from "@/lib/operations/timeline/TimelineEventType";

export interface CreateTimelineEventInput {
  readonly timelineEventId: TimelineEventId;
  readonly operationId: OperationId;
  readonly eventType: TimelineEventType;
  readonly title: string;
  readonly description: string;
  readonly occurredAt: string;
  readonly actor: string;
  readonly metadata: TimelineEventMetadata;
}

export interface TimelineEventService {
  create(input: CreateTimelineEventInput): Promise<TimelineEvent>;
  get(timelineEventId: TimelineEventId): Promise<TimelineEvent | null>;
  listByOperationId(operationId: OperationId): Promise<readonly TimelineEvent[]>;
  listByType(eventType: TimelineEventType): Promise<readonly TimelineEvent[]>;
}