import type { OperationId } from "@/lib/operations/OperationId";
import type { TimelineEvent } from "@/lib/operations/timeline/TimelineEvent";
import type { TimelineEventId } from "@/lib/operations/timeline/TimelineEventId";
import type { TimelineEventType } from "@/lib/operations/timeline/TimelineEventType";

export interface TimelineEventRepository {
  findById(timelineEventId: TimelineEventId): Promise<TimelineEvent | null>;
  save(timelineEvent: TimelineEvent): Promise<void>;
  listByOperationId(operationId: OperationId): Promise<readonly TimelineEvent[]>;
  listByType(eventType: TimelineEventType): Promise<readonly TimelineEvent[]>;
}