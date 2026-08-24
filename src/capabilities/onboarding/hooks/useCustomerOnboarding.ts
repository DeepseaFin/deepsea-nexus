"use client";

import { useMemo, useState } from "react";
import type {
  CustomerOnboardingState,
  CustomerOnboardingStatus,
  CustomerOnboardingStep,
} from "@/src/capabilities/onboarding/types/CustomerOnboardingState";

export interface UseCustomerOnboardingResult {
  readonly onboarding: CustomerOnboardingState;
  readonly completionPercentage: number;
  readonly currentStep: CustomerOnboardingStep;
  goToNext: () => void;
  goToPrevious: () => void;
  completeCurrentStep: () => void;
  pause: () => void;
  resume: () => void;
}

type UseCustomerOnboardingInput = {
  readonly initialState: CustomerOnboardingState;
};

function toStatus(value: CustomerOnboardingStatus): CustomerOnboardingStatus {
  return value;
}

export function useCustomerOnboarding(input: UseCustomerOnboardingInput): UseCustomerOnboardingResult {
  const [onboarding, setOnboarding] = useState<CustomerOnboardingState>(input.initialState);

  const currentStepIndex = onboarding.steps.findIndex((step) => step.id === onboarding.currentStepId);

  const completionPercentage = useMemo(() => {
    const completed = onboarding.steps.filter((step) => step.status === "completed").length;
    return Math.round((completed / onboarding.steps.length) * 100);
  }, [onboarding.steps]);

  const currentStep = onboarding.steps[currentStepIndex] ?? onboarding.steps[0];

  const goToStepByIndex = (targetIndex: number): void => {
    if (targetIndex < 0 || targetIndex >= onboarding.steps.length) {
      return;
    }

    const targetStep = onboarding.steps[targetIndex];
    setOnboarding((previous) => ({
      ...previous,
      currentStepId: targetStep.id,
      status: toStatus(previous.status === "paused" ? "in_progress" : previous.status),
    }));
  };

  const goToNext = (): void => {
    goToStepByIndex(currentStepIndex + 1);
  };

  const goToPrevious = (): void => {
    goToStepByIndex(currentStepIndex - 1);
  };

  const completeCurrentStep = (): void => {
    setOnboarding((previous) => {
      const activeIndex = previous.steps.findIndex((step) => step.id === previous.currentStepId);
      if (activeIndex < 0) {
        return previous;
      }

      const updatedSteps = previous.steps.map((step, index) => {
        if (index < activeIndex) {
          return { ...step, status: "completed" as const };
        }

        if (index === activeIndex) {
          return { ...step, status: "completed" as const };
        }

        if (index === activeIndex + 1 && step.status === "pending") {
          return { ...step, status: "in_progress" as const };
        }

        return step;
      });

      const nextStep = updatedSteps[activeIndex + 1];
      const isLast = activeIndex === updatedSteps.length - 1;

      return {
        ...previous,
        steps: updatedSteps,
        currentStepId: isLast ? previous.currentStepId : nextStep.id,
        status: isLast ? "completed" : "in_progress",
      };
    });
  };

  const pause = (): void => {
    setOnboarding((previous) => ({ ...previous, status: "paused" }));
  };

  const resume = (): void => {
    setOnboarding((previous) => ({ ...previous, status: "in_progress" }));
  };

  return {
    onboarding,
    completionPercentage,
    currentStep,
    goToNext,
    goToPrevious,
    completeCurrentStep,
    pause,
    resume,
  };
}
