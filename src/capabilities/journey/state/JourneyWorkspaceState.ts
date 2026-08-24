import type { JourneyProgress, JourneyRecommendation, JourneyState, JourneyStep, JourneyTimelineEvent } from "@/lib/journey";

export interface JourneyWorkspaceState {
  readonly journeyState: JourneyState;
  readonly steps: readonly JourneyStep[];
  readonly progress: JourneyProgress;
  readonly recommendations: readonly JourneyRecommendation[];
  readonly timeline: readonly JourneyTimelineEvent[];
  readonly missingItems: readonly string[];
  readonly nextAction: string;
  readonly actions: readonly string[];
}