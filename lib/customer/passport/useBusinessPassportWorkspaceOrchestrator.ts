"use client";

import { useCallback, useMemo, useState } from "react";
import type {
  BusinessPassportCompletionState,
  BusinessPassportDirtyState,
  BusinessPassportSectionId,
  BusinessPassportValidationState,
  BusinessPassportWorkspaceAction,
  BusinessPassportWorkspaceOrchestrator,
  BusinessPassportWorkspaceSectionState,
  UseBusinessPassportWorkspaceOrchestratorInput,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

interface MutableSectionState {
  readonly completed: boolean;
  readonly dirty: boolean;
  readonly validation: BusinessPassportWorkspaceSectionState["validation"];
}

function createInitialSectionState(input: UseBusinessPassportWorkspaceOrchestratorInput): Readonly<Record<BusinessPassportSectionId, MutableSectionState>> {
  return input.sections.reduce((accumulator, section) => {
    return {
      ...accumulator,
      [section.id]: {
        completed: Boolean(section.completed),
        dirty: Boolean(section.dirty),
        validation: section.validation ?? "unknown",
      },
    };
  }, {} as Record<BusinessPassportSectionId, MutableSectionState>);
}

function resolveInitialActiveSection(input: UseBusinessPassportWorkspaceOrchestratorInput): BusinessPassportSectionId {
  if (input.initialActiveSection) {
    const candidate = input.sections.find((section) => section.id === input.initialActiveSection);
    if (candidate && !candidate.disabled) {
      return candidate.id;
    }
  }

  const firstEnabled = input.sections.find((section) => !section.disabled);
  return firstEnabled?.id ?? input.sections[0]?.id ?? "identity";
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
    return input.sections.map((section) => {
      const state = sectionStateById[section.id];
      return {
        ...section,
        disabled: Boolean(section.disabled),
        completed: state?.completed ?? false,
        dirty: state?.dirty ?? false,
        validation: state?.validation ?? "unknown",
        active: activeSection === section.id,
      };
    });
  }, [activeSection, input.sections, sectionStateById]);

  const completion = useMemo<BusinessPassportCompletionState>(() => {
    const totalSections = sections.filter((section) => !section.disabled).length;
    const completedSections = sections.filter((section) => !section.disabled && section.completed).length;
    const percent = totalSections === 0 ? 0 : Math.round((completedSections / totalSections) * 100);

    return {
      completedSections,
      totalSections,
      percent,
    };
  }, [sections]);

  const validation = useMemo<BusinessPassportValidationState>(() => {
    const bySection = sections.reduce((accumulator, section) => {
      return {
        ...accumulator,
        [section.id]: section.validation,
      };
    }, {} as Record<BusinessPassportSectionId, BusinessPassportWorkspaceSectionState["validation"]>);

    return {
      bySection,
      validSections: sections.filter((section) => section.validation === "valid").length,
      warningSections: sections.filter((section) => section.validation === "warning").length,
      errorSections: sections.filter((section) => section.validation === "error").length,
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
        completed,
      },
    }));
  }, []);

  const setSectionValidation = useCallback(
    (sectionId: BusinessPassportSectionId, status: BusinessPassportWorkspaceSectionState["validation"]) => {
      setSectionStateById((currentState) => ({
        ...currentState,
        [sectionId]: {
          ...currentState[sectionId],
          validation: status,
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
        execute: () => markSectionCompleted(activeSection, true),
      },
    ];

    const customActions = (input.actions ?? []).map<BusinessPassportWorkspaceAction>((action) => ({
      ...action,
      variant: action.variant ?? "ghost",
      execute: () => {
        setSectionDirty(activeSection, false);
      },
    }));

    return [...baseActions, ...customActions];
  }, [activeSection, goToNextSection, goToPreviousSection, input.actions, markSectionCompleted, sections, setSectionDirty]);

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
