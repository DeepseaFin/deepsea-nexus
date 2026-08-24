import type { RelationshipEvent } from "@/lib/relationship/relationshipEvent";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";

export type RelationshipTimelineBuildInput = {
  businessId: string;
  events?: RelationshipEvent[];
};

function toTimestamp(value: string): number {
  const parsed = new Date(value);
  const time = parsed.getTime();

  if (Number.isNaN(time)) {
    return 0;
  }

  return time;
}

export class RelationshipTimelineEngine {
  build(input: RelationshipTimelineBuildInput): RelationshipTimeline {
    return {
      businessId: input.businessId,
      events: this.sort(input.events ?? []),
    };
  }

  append(timeline: RelationshipTimeline, event: RelationshipEvent): RelationshipTimeline {
    return {
      businessId: timeline.businessId,
      events: this.sort([...timeline.events, event]),
    };
  }

  sort(events: RelationshipEvent[]): RelationshipEvent[] {
    return [...events].sort((left, right) => {
      const timeDifference = toTimestamp(right.occurredAt) - toTimestamp(left.occurredAt);

      if (timeDifference !== 0) {
        return timeDifference;
      }

      return left.id.localeCompare(right.id);
    });
  }
}

export const relationshipTimelineEngine = new RelationshipTimelineEngine();
