"use client";

import { useMemo, useState } from "react";
import type {
  CommercialWorkflowState,
  CommercialWorkflowStep,
  CommercialWorkflowStepId,
} from "@/src/capabilities/commercial/types/CommercialWorkflowState";

const STEP_ORDER: readonly CommercialWorkflowStepId[] = [
  "institution_summary",
  "create_opportunity",
  "receivable_details",
  "indicative_pricing",
  "term_sheet_preview",
  "ready_for_approval",
];

type UseCommercialWorkflowInput = {
  readonly initialState: Omit<CommercialWorkflowState, "currentStepId" | "steps">;
};

export interface UseCommercialWorkflowResult {
  readonly state: CommercialWorkflowState;
  readonly isFirstStep: boolean;
  readonly isLastStep: boolean;
  goToStep: (stepId: CommercialWorkflowStepId) => void;
  goToNext: () => void;
  goToPrevious: () => void;
}

function toStepDefinitions(currentStepId: CommercialWorkflowStepId, furthestStepIndex: number): readonly CommercialWorkflowStep[] {
  const titles: Record<CommercialWorkflowStepId, { title: string; subtitle: string }> = {
    institution_summary: {
      title: "Institution Summary",
      subtitle: "Review Business Passport context",
    },
    create_opportunity: {
      title: "Create Opportunity",
      subtitle: "Capture commercial opportunity draft",
    },
    receivable_details: {
      title: "Receivable Details",
      subtitle: "Record receivable portfolio profile",
    },
    indicative_pricing: {
      title: "Indicative Pricing",
      subtitle: "Review static indicative terms",
    },
    term_sheet_preview: {
      title: "Term Sheet Preview",
      subtitle: "Inspect institutional term summary",
    },
    ready_for_approval: {
      title: "Ready for Approval",
      subtitle: "Commercial package is ready to route",
    },
  };

  return STEP_ORDER.map((id, index) => {
    const status: CommercialWorkflowStep["status"] =
      index < STEP_ORDER.indexOf(currentStepId)
        ? "completed"
        : id === currentStepId
          ? "in_progress"
          : "pending";

    if (index > furthestStepIndex && status === "completed") {
      return {
        id,
        ...titles[id],
        status: "pending",
      };
    }

    return {
      id,
      ...titles[id],
      status,
    };
  });
}

export function useCommercialWorkflow(input: UseCommercialWorkflowInput): UseCommercialWorkflowResult {
  const [currentStepId, setCurrentStepId] = useState<CommercialWorkflowStepId>("institution_summary");
  const [furthestStepIndex, setFurthestStepIndex] = useState<number>(0);

  const currentIndex = STEP_ORDER.indexOf(currentStepId);
  const isFirstStep = currentIndex === 0;
  const isLastStep = currentIndex === STEP_ORDER.length - 1;

  const state: CommercialWorkflowState = useMemo(
    () => ({
      ...input.initialState,
      currentStepId,
      steps: toStepDefinitions(currentStepId, furthestStepIndex),
    }),
    [currentStepId, furthestStepIndex, input.initialState],
  );

  const goToStep = (stepId: CommercialWorkflowStepId): void => {
    const targetIndex = STEP_ORDER.indexOf(stepId);
    if (targetIndex < 0 || targetIndex > furthestStepIndex) {
      return;
    }

    setCurrentStepId(stepId);
  };

  const goToNext = (): void => {
    if (isLastStep) {
      return;
    }

    const nextIndex = currentIndex + 1;
    setCurrentStepId(STEP_ORDER[nextIndex]);
    setFurthestStepIndex((previous) => Math.max(previous, nextIndex));
  };

  const goToPrevious = (): void => {
    if (isFirstStep) {
      return;
    }

    setCurrentStepId(STEP_ORDER[currentIndex - 1]);
  };

  return {
    state,
    isFirstStep,
    isLastStep,
    goToStep,
    goToNext,
    goToPrevious,
  };
}
