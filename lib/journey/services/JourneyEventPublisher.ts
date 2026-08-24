import type { JourneyExecutionContext } from "@/lib/journey/types/JourneyExecutionContext";

export interface JourneyEvent {
  readonly type: string;
  readonly context: JourneyExecutionContext;
  readonly payload: Readonly<Record<string, unknown>>;
}

export interface JourneyEventPublisher {
  publish(event: JourneyEvent): Promise<void>;
  publishMany(events: readonly JourneyEvent[]): Promise<void>;
}