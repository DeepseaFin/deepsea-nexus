import { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { JourneyRecommendation } from "@/lib/journey/domain/JourneyRecommendation";
import type { JourneyState } from "@/lib/journey/domain/JourneyState";

export interface RecommendationInput {
  readonly title: string;
  readonly description: string;
  readonly priority: JourneyRecommendation["priority"];
  readonly generatedAt: string;
}

export interface JourneyRecommendationEngine {
  fromInputs(inputs: readonly RecommendationInput[]): readonly JourneyRecommendation[];
  forState(state: JourneyState, generatedAt: string): readonly JourneyRecommendation[];
}

export function createJourneyRecommendationEngine(): JourneyRecommendationEngine {
  return {
    fromInputs(inputs: readonly RecommendationInput[]): readonly JourneyRecommendation[] {
      return inputs.map((input) => ({
        title: input.title,
        description: input.description,
        priority: input.priority,
        generatedAt: input.generatedAt,
      }));
    },

    forState(state: JourneyState, generatedAt: string): readonly JourneyRecommendation[] {
      if (state.status === JourneyStatus.Paused) {
        return [
          {
            title: "Resume Journey",
            description: "Resume the journey from the recorded resume point.",
            priority: "high",
            generatedAt,
          },
        ];
      }

      if (state.currentStep === JourneyStep.DocumentCollection) {
        return [
          {
            title: "Complete Required Documents",
            description: "Finalize required documents before Oracle processing.",
            priority: "medium",
            generatedAt,
          },
        ];
      }

      return [];
    },
  };
}