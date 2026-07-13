import { JourneyStatus } from "@/lib/journey/constants/JourneyStatus";
import { JourneyStep } from "@/lib/journey/constants/JourneyStep";
import type { JourneyState } from "@/lib/journey/domain/JourneyState";
import type { JourneyTransition } from "@/lib/journey/domain/JourneyTransition";
import type { JourneyTransitionValidation } from "@/lib/journey/domain/JourneyTransition";
import type { JourneyExecutionContext } from "@/lib/journey/types/JourneyExecutionContext";
import type { JourneyResumePoint } from "@/lib/journey/types/JourneyResumePoint";

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

export interface JourneyStateMachine {
  validateTransition(state: JourneyState, toStep: JourneyStep): JourneyTransitionValidation;
  getNextStep(currentStep: JourneyStep): JourneyStep | null;
  getPreviousStep(currentStep: JourneyStep): JourneyStep | null;
  pause(state: JourneyState, context: JourneyExecutionContext, reason?: string): JourneyState;
  resume(state: JourneyState, context: JourneyExecutionContext, resumePoint?: JourneyResumePoint): JourneyState;
}

export interface JourneyStateMachineDependencies {
  readonly stepOrder?: readonly JourneyStep[];
  readonly transitions?: readonly JourneyTransition[];
}

export function createJourneyStateMachine(
  dependencies: JourneyStateMachineDependencies = {},
): JourneyStateMachine {
  const stepOrder = dependencies.stepOrder ?? DEFAULT_STEP_ORDER;
  const transitionMap = new Map<string, JourneyTransition>();

  for (const transition of dependencies.transitions ?? []) {
    transitionMap.set(`${transition.fromStep}->${transition.toStep}`, transition);
  }

  return {
    validateTransition(state: JourneyState, toStep: JourneyStep): JourneyTransitionValidation {
      if (state.status === JourneyStatus.Cancelled) {
        return { isValid: false, reason: "Journey is cancelled." };
      }

      if (state.status === JourneyStatus.Paused) {
        return { isValid: false, reason: "Journey is paused." };
      }

      if (state.status === JourneyStatus.Completed) {
        return { isValid: false, reason: "Journey is already completed." };
      }

      if (state.currentStep === toStep) {
        return { isValid: true };
      }

      const transition = transitionMap.get(`${state.currentStep}->${toStep}`);
      if (transition) {
        if (!transition.allowedStatuses.includes(state.status)) {
          return { isValid: false, reason: "Transition is not allowed for current status." };
        }

        return { isValid: true };
      }

      const currentIndex = stepOrder.indexOf(state.currentStep);
      const targetIndex = stepOrder.indexOf(toStep);

      if (currentIndex < 0 || targetIndex < 0) {
        return { isValid: false, reason: "Unknown journey step." };
      }

      if (targetIndex - currentIndex > 1) {
        return { isValid: false, reason: "Cannot skip ahead multiple steps." };
      }

      return { isValid: true };
    },

    getNextStep(currentStep: JourneyStep): JourneyStep | null {
      const currentIndex = stepOrder.indexOf(currentStep);
      if (currentIndex < 0 || currentIndex >= stepOrder.length - 1) {
        return null;
      }

      return stepOrder[currentIndex + 1] ?? null;
    },

    getPreviousStep(currentStep: JourneyStep): JourneyStep | null {
      const currentIndex = stepOrder.indexOf(currentStep);
      if (currentIndex <= 0) {
        return null;
      }

      return stepOrder[currentIndex - 1] ?? null;
    },

    pause(state: JourneyState, context: JourneyExecutionContext, reason?: string): JourneyState {
      return {
        ...state,
        status: JourneyStatus.Paused,
        pausedAt: context.occurredAt,
        lastUpdated: context.occurredAt,
        resumePoint: {
          step: state.currentStep,
          status: JourneyStatus.InProgress,
          pausedAt: context.occurredAt,
          pausedBy: context.actor,
          reason,
        },
      };
    },

    resume(state: JourneyState, context: JourneyExecutionContext, resumePoint?: JourneyResumePoint): JourneyState {
      const point = resumePoint ?? state.resumePoint;
      if (!point) {
        return {
          ...state,
          status: JourneyStatus.InProgress,
          resumedAt: context.occurredAt,
          lastUpdated: context.occurredAt,
        };
      }

      return {
        ...state,
        status: JourneyStatus.InProgress,
        currentStep: point.step,
        resumedAt: context.occurredAt,
        lastUpdated: context.occurredAt,
      };
    },
  };
}