"use client";

import { useEffect, useMemo, useState } from "react";
import {
  JourneyStatus,
  JourneyStep,
  createJourneyRecommendationEngine,
  createJourneyStateMachine,
  createJourneyStepResolver,
  type JourneyRecommendation,
  type JourneyState,
  type JourneyStep as JourneyStepType,
  type JourneyTimelineEvent,
} from "@/lib/journey";
import { resolveRelationshipJourneyCompletion } from "@/lib/relationship-journey/relationship-journey-completion";
import {
  loadRelationshipJourneyWorkspacePersistence,
  saveRelationshipJourneyWorkspacePersistence,
} from "@/lib/relationship-journey/relationship-journey-persistence";
import {
  createRelationshipJourneyWorkspaceRegistry,
  formatRelationshipJourneyStep,
} from "@/lib/relationship-journey/relationship-journey-workspace-registry";
import {
  canNavigateRelationshipJourneyStep,
  evaluateRelationshipJourneyWorkflow,
} from "@/lib/relationship-journey/relationship-journey-workflow";
import type { JourneyWorkspaceState } from "@/src/capabilities/journey/state/JourneyWorkspaceState";

type UseJourneyInput = {
  initialState: JourneyState;
  steps: readonly JourneyStepType[];
  initialRecommendations: readonly JourneyRecommendation[];
  initialTimeline: readonly JourneyTimelineEvent[];
  initialMissingItems: readonly string[];
  initialNextAction: string;
  initialActions: readonly string[];
  actor: string;
};

export interface UseJourneyResult {
  readonly workspace: JourneyWorkspaceState;
  goToNext: () => void;
  goToPrevious: () => void;
  completeCurrentStep: () => void;
  pauseJourney: () => void;
  resumeJourney: () => void;
}

function nowIso(): string {
  return new Date().toISOString();
}

function asTitle(step: JourneyStepType): string {
  return formatRelationshipJourneyStep(step);
}

export function useJourney(input: UseJourneyInput): UseJourneyResult {
  const stateMachine = useMemo(() => createJourneyStateMachine({ stepOrder: input.steps }), [input.steps]);
  const stepResolver = useMemo(() => createJourneyStepResolver({ stepOrder: input.steps }), [input.steps]);
  const recommendationEngine = useMemo(() => createJourneyRecommendationEngine(), []);
  const workspaceRegistry = useMemo(() => createRelationshipJourneyWorkspaceRegistry(input.steps), [input.steps]);
  const workspaceStepIds = useMemo(
    () => workspaceRegistry.getEnabledSections().map((section) => section.id),
    [workspaceRegistry],
  );
  const persistedWorkspaceState = useMemo(
    () =>
      loadRelationshipJourneyWorkspacePersistence({
        stepIds: workspaceStepIds,
      }),
    [workspaceStepIds],
  );

  const [journeyState, setJourneyState] = useState<JourneyState>(input.initialState);
  const [timeline, setTimeline] = useState<readonly JourneyTimelineEvent[]>(input.initialTimeline);
  const [baseRecommendations] = useState<readonly JourneyRecommendation[]>(input.initialRecommendations);
  const [missingItems, setMissingItems] = useState<readonly string[]>(input.initialMissingItems);
  const [nextAction, setNextAction] = useState<string>(input.initialNextAction);
  const [actions, setActions] = useState<readonly string[]>(input.initialActions);

  const progress = useMemo(() => {
    const completedSteps = stepResolver.resolveCompletedSteps(journeyState.currentStep, journeyState.completedSteps);
    const remainingSteps = stepResolver.resolveRemainingSteps(journeyState.currentStep, completedSteps);
    return resolveRelationshipJourneyCompletion(input.steps, completedSteps, remainingSteps);
  }, [input.steps, journeyState.completedSteps, journeyState.currentStep, stepResolver]);

  const workflow = useMemo(
    () =>
      evaluateRelationshipJourneyWorkflow({
        sectionDefinitions: workspaceRegistry.getEnabledSections(),
        steps: input.steps,
        currentStep: journeyState.currentStep,
        completedSteps: journeyState.completedSteps,
      }),
    [input.steps, journeyState.completedSteps, journeyState.currentStep, workspaceRegistry],
  );

  useEffect(() => {
    saveRelationshipJourneyWorkspacePersistence({
      stepIds: workspaceStepIds,
      activeStep: journeyState.currentStep,
      expandedSteps: persistedWorkspaceState.expandedSteps,
      selectedTab: persistedWorkspaceState.selectedTab,
      filters: persistedWorkspaceState.filters,
      lastVisitedAt: nowIso(),
    });
  }, [
    journeyState.currentStep,
    persistedWorkspaceState.expandedSteps,
    persistedWorkspaceState.filters,
    persistedWorkspaceState.selectedTab,
    workspaceStepIds,
  ]);

  const recommendations = useMemo(() => {
    const generated = recommendationEngine.forState(journeyState, nowIso());
    return [...generated, ...baseRecommendations];
  }, [baseRecommendations, journeyState, recommendationEngine]);

  const appendTimeline = (event: string, notes: string): void => {
    setTimeline((previous) => [
      ...previous,
      {
        timestamp: nowIso(),
        event,
        performedBy: input.actor,
        notes,
      },
    ]);
  };

  const goToStep = (targetStep: JourneyStepType, directionLabel: "Next" | "Previous"): void => {
    setJourneyState((previous) => {
      const validation = stateMachine.validateTransition(previous, targetStep);
      if (!validation.isValid) {
        appendTimeline(`${directionLabel} navigation blocked`, validation.reason ?? "Transition validation failed.");
        return previous;
      }

      const updated: JourneyState = {
        ...previous,
        currentStep: targetStep,
        status: previous.status === JourneyStatus.Draft ? JourneyStatus.InProgress : previous.status,
        lastUpdated: nowIso(),
      };

      appendTimeline(`${directionLabel} step`, `${asTitle(targetStep)} is now active.`);
      setNextAction(`Continue working on ${asTitle(targetStep)}.`);
      setActions([
        `Validate ${asTitle(targetStep)}`,
        `Prepare evidence for ${asTitle(targetStep)}`,
        "Escalate blockers if needed",
      ]);

      return updated;
    });
  };

  const goToNext = (): void => {
    const next = workspaceRegistry.getNextSection(journeyState.currentStep)?.id ?? null;
    if (!next) {
      appendTimeline("No next step", "Journey is already at the final step.");
      return;
    }

    if (!canNavigateRelationshipJourneyStep(next, workflow)) {
      appendTimeline("No next step", "Next journey step is currently unavailable.");
      return;
    }

    goToStep(next, "Next");
  };

  const goToPrevious = (): void => {
    const previous = workspaceRegistry.getPreviousSection(journeyState.currentStep)?.id ?? null;
    if (!previous) {
      appendTimeline("No previous step", "Current step is the first step.");
      return;
    }

    if (!canNavigateRelationshipJourneyStep(previous, workflow)) {
      appendTimeline("No previous step", "Previous journey step is currently unavailable.");
      return;
    }

    goToStep(previous, "Previous");
  };

  const completeCurrentStep = (): void => {
    setJourneyState((previous) => {
      const completedSet = new Set(previous.completedSteps);
      completedSet.add(previous.currentStep);
      const normalizedCompleted = input.steps.filter((step) => completedSet.has(step));
      const next = stateMachine.getNextStep(previous.currentStep);
      const isFinal = !next || previous.currentStep === JourneyStep.Completed;

      const updated: JourneyState = {
        ...previous,
        currentStep: isFinal ? JourneyStep.Completed : next,
        completedSteps: normalizedCompleted,
        status: isFinal ? JourneyStatus.Completed : JourneyStatus.InProgress,
        lastUpdated: nowIso(),
      };

      appendTimeline(
        "Step completed",
        isFinal
          ? "Journey completed successfully."
          : `${asTitle(previous.currentStep)} completed and moved to ${asTitle(next)}.`,
      );

      setMissingItems((items) => (items.length > 0 ? items.slice(1) : items));
      setNextAction(
        isFinal
          ? "Journey is complete."
          : `Begin ${asTitle(next)} and review updated requirements.`,
      );
      setActions(
        isFinal
          ? ["Review completed journey", "Prepare executive summary"]
          : [`Execute ${asTitle(next)}`, "Review new recommendations", "Confirm readiness"],
      );

      return updated;
    });
  };

  const pauseJourney = (): void => {
    setJourneyState((previous) => {
      if (previous.status === JourneyStatus.Paused) {
        appendTimeline("Pause ignored", "Journey is already paused.");
        return previous;
      }

      const updated = stateMachine.pause(previous, {
        journeyId: previous.journeyId,
        businessId: previous.businessId,
        actor: input.actor,
        occurredAt: nowIso(),
      });
      appendTimeline("Journey paused", `Paused at ${asTitle(previous.currentStep)}.`);
      setNextAction("Resume journey when blockers are resolved.");
      setActions(["Resume journey", "Review blockers", "Notify stakeholders"]);

      return updated;
    });
  };

  const resumeJourney = (): void => {
    setJourneyState((previous) => {
      if (previous.status !== JourneyStatus.Paused) {
        appendTimeline("Resume ignored", "Journey is not paused.");
        return previous;
      }

      const updated = stateMachine.resume(previous, {
        journeyId: previous.journeyId,
        businessId: previous.businessId,
        actor: input.actor,
        occurredAt: nowIso(),
      });
      appendTimeline("Journey resumed", `Resumed at ${asTitle(updated.currentStep)}.`);
      setNextAction(`Continue ${asTitle(updated.currentStep)}.`);
      setActions([
        `Complete ${asTitle(updated.currentStep)}`,
        "Validate outputs",
        "Prepare handoff",
      ]);

      return updated;
    });
  };

  return {
    workspace: {
      journeyState,
      steps: input.steps,
      progress,
      recommendations,
      timeline,
      missingItems,
      nextAction,
      actions,
    },
    goToNext,
    goToPrevious,
    completeCurrentStep,
    pauseJourney,
    resumeJourney,
  };
}