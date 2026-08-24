import type { BusinessId } from "@/lib/journey/domain/Journey";
import type { JourneyId } from "@/lib/journey/domain/Journey";

export interface JourneyExecutionContext {
  readonly journeyId: JourneyId;
  readonly businessId: BusinessId;
  readonly actor: string;
  readonly occurredAt: string;
  readonly sessionId?: string;
  readonly correlationId?: string;
  readonly metadata?: Readonly<Record<string, string>>;
}