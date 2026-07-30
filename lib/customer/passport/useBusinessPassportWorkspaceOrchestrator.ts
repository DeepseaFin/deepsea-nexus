"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  BusinessPassportCompletionState,
  BusinessPassportDirtyState,
  BusinessPassportSectionId,
  BusinessPassportSectionCompletionStatus,
  BusinessPassportValidationState,
  BusinessPassportWorkspaceAction,
  BusinessPassportWorkspaceOrchestrator,
  BusinessPassportWorkspaceSectionState,
  UseBusinessPassportWorkspaceOrchestratorInput,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

interface MutableSectionState {
  readonly completionPercentage: number;
  readonly completionStatus: BusinessPassportSectionCompletionStatus;
  readonly dirty: boolean;
  readonly validationStatus: BusinessPassportWorkspaceSectionState["validationStatus"];
  readonly missingRequiredFields: readonly string[];
}

function createInitialSectionState(input: UseBusinessPassportWorkspaceOrchestratorInput): Readonly<Record<BusinessPassportSectionId, MutableSectionState>> {
  return input.sectionStates.reduce((accumulator, section) => {
    return {
      ...accumulator,
      [section.id]: {
        completionPercentage: section.completionPercentage,
        completionStatus: section.completionStatus,
        dirty: Boolean(input.initialDirtyBySectionId?.[section.id]),
        validationStatus: section.validationStatus,
        missingRequiredFields: section.missingRequiredFields,
      },
    };
  }, {} as Record<BusinessPassportSectionId, MutableSectionState>);
}

function resolveInitialActiveSection(input: UseBusinessPassportWorkspaceOrchestratorInput): BusinessPassportSectionId {
  if (input.initialActiveSection) {
    const candidate = input.sectionStates.find((section) => section.id === input.initialActiveSection);
    if (candidate && !candidate.disabled) {
      return candidate.id;
    }
  }

  const firstEnabled = input.sectionStates.find((section) => !section.disabled);
  return firstEnabled?.id ?? input.sectionStates[0]?.id ?? "identity";
}

function findPreviousEnabledSection(
  sections: readonly BusinessPassportWorkspaceSectionState[],
  activeSection: BusinessPassportSectionId,
): BusinessPassportSectionId | null {
  const activeIndex = sections.findIndex((section) => section.id === activeSection);
  if (activeIndex <= 0) {
    return null;
  }

  for (let index = activeIndex - 1; index >= 0; index -= 1) {
    if (!sections[index].disabled) {
      return sections[index].id;
    }
  }

  return null;
}

function findNextEnabledSection(
  sections: readonly BusinessPassportWorkspaceSectionState[],
  activeSection: BusinessPassportSectionId,
): BusinessPassportSectionId | null {
  const activeIndex = sections.findIndex((section) => section.id === activeSection);
  if (activeIndex < 0) {
    return null;
  }

  for (let index = activeIndex + 1; index < sections.length; index += 1) {
    if (!sections[index].disabled) {
      return sections[index].id;
    }
  }

  return null;
}

export function useBusinessPassportWorkspaceOrchestrator(
  input: UseBusinessPassportWorkspaceOrchestratorInput,
): BusinessPassportWorkspaceOrchestrator {
  const [activeSection, setActiveSectionState] = useState<BusinessPassportSectionId>(() => resolveInitialActiveSection(input));
  const [sectionStateById, setSectionStateById] = useState<Readonly<Record<BusinessPassportSectionId, MutableSectionState>>>(() =>
    createInitialSectionState(input),
  );

  const sections = useMemo<readonly BusinessPassportWorkspaceSectionState[]>(() => {
    return input.sectionStates.map((section) => {
      const state = sectionStateById[section.id];
      return {
        ...section,
        disabled: Boolean(section.disabled),
        completionPercentage: state?.completionPercentage ?? section.completionPercentage,
        completionStatus: state?.completionStatus ?? section.completionStatus,
        dirty: state?.dirty ?? false,
        validationStatus: state?.validationStatus ?? section.validationStatus,
        missingRequiredFields: state?.missingRequiredFields ?? section.missingRequiredFields,
        active: activeSection === section.id,
      };
    });
  }, [activeSection, input.sectionStates, sectionStateById]);

  const completion = useMemo<BusinessPassportCompletionState>(() => {
    const availableSections = sections.filter((section) => !section.disabled);
    const totalSections = availableSections.length;
    const completedSections = availableSections.filter((section) => section.completionStatus === "completed").length;
    const inProgressSections = availableSections.filter((section) => section.completionStatus === "in_progress").length;
    const notStartedSections = availableSections.filter((section) => section.completionStatus === "not_started").length;
    const overallPercentage = totalSections === 0
      ? 0
      : Math.round(
        availableSections.reduce((sum, section) => sum + section.completionPercentage, 0) / totalSections,
      );

    return {
      overallPercentage,
      completedSections,
      totalSections,
      inProgressSections,
      notStartedSections,
    };
  }, [sections]);

  const validation = useMemo<BusinessPassportValidationState>(() => {
    const bySection = sections.reduce((accumulator, section) => {
      return {
        ...accumulator,
        [section.id]: section.validationStatus,
      };
    }, {} as Record<BusinessPassportSectionId, BusinessPassportWorkspaceSectionState["validationStatus"]>);

    return {
      bySection,
      successSections: sections.filter((section) => section.validationStatus === "success").length,
      warningSections: sections.filter((section) => section.validationStatus === "warning").length,
      errorSections: sections.filter((section) => section.validationStatus === "error").length,
    };
  }, [sections]);

  const dirtyState = useMemo<BusinessPassportDirtyState>(() => {
    const dirtySections = sections.filter((section) => section.dirty).map((section) => section.id);

    return {
      isDirty: dirtySections.length > 0,
      dirtySections,
    };
  }, [sections]);

  const setActiveSection = useCallback(
    (sectionId: BusinessPassportSectionId) => {
      const target = sections.find((section) => section.id === sectionId);
      if (!target || target.disabled) {
        return;
      }

      setActiveSectionState(sectionId);
    },
    [sections],
  );

  const jumpToSection = useCallback(
    (sectionId: BusinessPassportSectionId) => {
      setActiveSection(sectionId);
    },
    [setActiveSection],
  );

  const goToPreviousSection = useCallback(() => {
    const previousSection = findPreviousEnabledSection(sections, activeSection);
    if (previousSection) {
      setActiveSectionState(previousSection);
    }
  }, [activeSection, sections]);

  const goToNextSection = useCallback(() => {
    const nextSection = findNextEnabledSection(sections, activeSection);
    if (nextSection) {
      setActiveSectionState(nextSection);
    }
  }, [activeSection, sections]);

  const markSectionCompleted = useCallback((sectionId: BusinessPassportSectionId, completed: boolean) => {
    setSectionStateById((currentState) => ({
      ...currentState,
      [sectionId]: {
        ...currentState[sectionId],
        completionStatus: completed ? "completed" : "in_progress",
        completionPercentage: completed ? 100 : Math.min(currentState[sectionId]?.completionPercentage ?? 0, 99),
      },
    }));
  }, []);

  const setSectionValidation = useCallback(
    (sectionId: BusinessPassportSectionId, status: BusinessPassportWorkspaceSectionState["validationStatus"]) => {
      setSectionStateById((currentState) => ({
        ...currentState,
        [sectionId]: {
          ...currentState[sectionId],
          validationStatus: status,
        },
      }));
    },
    [],
  );

  const setSectionDirty = useCallback((sectionId: BusinessPassportSectionId, dirty: boolean) => {
    setSectionStateById((currentState) => ({
      ...currentState,
      [sectionId]: {
        ...currentState[sectionId],
        dirty,
      },
    }));
  }, []);

  const workspaceActions = useMemo<readonly BusinessPassportWorkspaceAction[]>(() => {
    const previousSectionId = findPreviousEnabledSection(sections, activeSection);
    const nextSectionId = findNextEnabledSection(sections, activeSection);

    const baseActions: readonly BusinessPassportWorkspaceAction[] = [
      {
        id: "workspace.previous-section",
        label: "Previous Section",
        variant: "ghost",
        disabled: !previousSectionId,
        execute: goToPreviousSection,
      },
      {
        id: "workspace.next-section",
        label: "Next Section",
        variant: "primary",
        disabled: !nextSectionId,
        execute: goToNextSection,
      },
      {
        id: "workspace.mark-reviewed",
        label: "Mark Current Section Complete",
        variant: "secondary",
        execute: () => {
          markSectionCompleted(activeSection, true);
          setSectionValidation(activeSection, "success");
        },
      },
    ];

    const customActions = (input.actions ?? []).map<BusinessPassportWorkspaceAction>((action) => ({
      ...action,
      variant: action.variant ?? "ghost",
      disabled: action.disabled,
      execute: () => {
        setSectionDirty(activeSection, false);
      },
    }));

    return [...baseActions, ...customActions];
  }, [activeSection, goToNextSection, goToPreviousSection, input.actions, markSectionCompleted, sections, setSectionDirty, setSectionValidation]);

  return {
    loadingState: {
      isLoading: Boolean(input.isLoading),
    },
    activeSection,
    sections,
    completion,
    validation,
    dirtyState,
    workspaceActions,
    setActiveSection,
    jumpToSection,
    goToPreviousSection,
    goToNextSection,
    markSectionCompleted,
    setSectionValidation,
    setSectionDirty,
  };
}
