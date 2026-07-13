import { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { JourneyProgress } from "@/lib/journey/domain/JourneyProgress";

const DEFAULT_STEP_ORDER: readonly JourneyStep[] = [
  JourneyStep.BeginRelationship,
  JourneyStep.Identity,
  JourneyStep.DocumentCollection,
  JourneyStep.OracleProcessing,
  JourneyStep.EvidenceValidation,
  JourneyStep.KnowledgeGeneration,
  JourneyStep.BusinessPassport,
  JourneyStep.CreditReadiness,
  JourneyStep.Approval,
  JourneyStep.Completed,
];

export interface JourneyStepResolver {
  resolveActiveStep(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): JourneyStep;
  resolveCompletedSteps(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): readonly JourneyStep[];
  resolveRemainingSteps(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): readonly JourneyStep[];
  resolveProgress(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): JourneyProgress;
}

export interface JourneyStepResolverDependencies {
  readonly stepOrder?: readonly JourneyStep[];
}

export function createJourneyStepResolver(
  dependencies: JourneyStepResolverDependencies = {},
): JourneyStepResolver {
  const stepOrder = dependencies.stepOrder ?? DEFAULT_STEP_ORDER;

  const normalizeCompletedSteps = (completedSteps: readonly JourneyStep[]): readonly JourneyStep[] => {
    const unique = new Set(completedSteps);
    return stepOrder.filter((step) => unique.has(step));
  };

  return {
    resolveActiveStep(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): JourneyStep {
      if (completedSteps.includes(JourneyStep.Completed)) {
        return JourneyStep.Completed;
      }

      return currentStep;
    },

    resolveCompletedSteps(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): readonly JourneyStep[] {
      const normalized = normalizeCompletedSteps(completedSteps);
      const activeStep = this.resolveActiveStep(currentStep, normalized);

      if (activeStep === JourneyStep.Completed) {
        return stepOrder;
      }

      const activeIndex = stepOrder.indexOf(activeStep);
      return normalized.filter((step) => stepOrder.indexOf(step) <= activeIndex);
    },

    resolveRemainingSteps(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): readonly JourneyStep[] {
      const resolvedCompleted = this.resolveCompletedSteps(currentStep, completedSteps);
      const activeStep = this.resolveActiveStep(currentStep, resolvedCompleted);

      if (activeStep === JourneyStep.Completed) {
        return [];
      }

      const completedSet = new Set(resolvedCompleted);
      const activeIndex = stepOrder.indexOf(activeStep);
      return stepOrder.filter((step, index) => index > activeIndex && !completedSet.has(step));
    },

    resolveProgress(currentStep: JourneyStep, completedSteps: readonly JourneyStep[]): JourneyProgress {
      const resolvedCompleted = this.resolveCompletedSteps(currentStep, completedSteps);
      const remainingSteps = this.resolveRemainingSteps(currentStep, resolvedCompleted);
      const totalSteps = stepOrder.length;
      const completionPercentage = totalSteps === 0
        ? 0
        : Math.min(100, Math.round((resolvedCompleted.length / totalSteps) * 100));

      return {
        completionPercentage,
        completedSteps: resolvedCompleted,
        remainingSteps,
        isComplete: remainingSteps.length === 0,
      };
    },
  };
}