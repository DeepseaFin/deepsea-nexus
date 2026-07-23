import type { JourneyContext } from "@/lib/orchestration/JourneyContext";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";

export interface JourneyOrchestrator {
  orchestrate(context: JourneyContext): Promise<JourneyResult>;
}
