import type { JourneyContext } from "@/lib/orchestration/JourneyContext";

export interface InstitutionalPipelineContext {
  readonly pipelineId: string;
  readonly pipelineVersion: string;
  readonly journeyContext: JourneyContext;
  readonly recommendationId: string;
}
