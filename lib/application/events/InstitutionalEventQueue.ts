import type { InstitutionalEvent } from "@/lib/application/events/InstitutionalEvent";

const priorityWeight: Readonly<Record<InstitutionalEvent["priority"], number>> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function compareEvents(left: InstitutionalEvent, right: InstitutionalEvent): number {
  const weightDelta = priorityWeight[right.priority] - priorityWeight[left.priority];

  if (weightDelta !== 0) {
    return weightDelta;
  }

  return Date.parse(right.occurredAt) - Date.parse(left.occurredAt);
}

export class InstitutionalEventQueue {
  private readonly events: InstitutionalEvent[];

  constructor(initialEvents: readonly InstitutionalEvent[] = []) {
    this.events = [...initialEvents];
  }

  enqueue(event: InstitutionalEvent): void {
    this.events.push(event);
  }

  enqueueMany(events: readonly InstitutionalEvent[]): void {
    this.events.push(...events);
  }

  toArray(): readonly InstitutionalEvent[] {
    return [...this.events];
  }

  prioritized(): readonly InstitutionalEvent[] {
    return [...this.events].sort(compareEvents);
  }

  peekPrioritized(): InstitutionalEvent | null {
    const prioritized = this.prioritized();
    return prioritized[0] ?? null;
  }

  clear(): void {
    this.events.length = 0;
  }
}
