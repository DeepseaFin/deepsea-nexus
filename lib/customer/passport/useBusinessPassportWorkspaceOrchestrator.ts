"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  getEnabledSections,
  getNextSection,
  getPreviousSection,
} from "@/lib/customer/passport/business-passport-section-registry";
import {
  loadBusinessPassportWorkspacePersistence,
  saveBusinessPassportWorkspacePersistence,
} from "@/lib/customer/passport/business-passport-workspace-persistence";
import type {
  BusinessPassportCompletionState,
  BusinessPassportDirtyState,
  BusinessPassportValidationStatus,
  BusinessPassportWorkspaceFilters,
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

interface SectionStateSource {
  readonly completionPercentage: number;
  readonly completionStatus: BusinessPassportSectionCompletionStatus;
  readonly validationStatus: BusinessPassportValidationStatus;
  readonly missingRequiredFields: readonly string[];
  readonly disabled?: boolean;
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
  const enabledSectionIds = getEnabledSections().map((section) => section.id);

  if (input.initialActiveSection) {
    const candidate = input.sectionStates.find((section) => section.id === input.initialActiveSection);
    if (candidate && enabledSectionIds.includes(candidate.id) && !candidate.disabled) {
      return input.initialActiveSection;
    }
  }

  return enabledSectionIds[0] ?? input.sectionStates[0]?.id ?? "identity";
}

export function useBusinessPassportWorkspaceOrchestrator(
  input: UseBusinessPassportWorkspaceOrchestratorInput,
): BusinessPassportWorkspaceOrchestrator {
  const enabledSections = useMemo(() => getEnabledSections(), []);
  const sectionIds = useMemo(() => enabledSections.map((section) => section.id), [enabledSections]);

  const sectionStateSourceById = useMemo<Readonly<Record<BusinessPassportSectionId, SectionStateSource>>>(() => {
    return input.sectionStates.reduce((accumulator, section) => {
      return {
        ...accumulator,
        [section.id]: {
          completionPercentage: section.completionPercentage,
          completionStatus: section.completionStatus,
          validationStatus: section.validationStatus,
          missingRequiredFields: section.missingRequiredFields,
          disabled: section.disabled,
        },
      };
    }, {} as Record<BusinessPassportSectionId, SectionStateSource>);
  }, [input.sectionStates]);

  const persistedWorkspaceState = useMemo(
    () =>
      loadBusinessPassportWorkspacePersistence({
        storageKey: input.persistenceKey,
        sectionIds,
      }),
    [input.persistenceKey, sectionIds],
  );

  const resolvedInitialActiveSection = useMemo(
    () =>
      resolveInitialActiveSection({
        ...input,
        initialActiveSection: persistedWorkspaceState.activeSection ?? input.initialActiveSection,
      }),
    [input, persistedWorkspaceState.activeSection],
  );

  const [activeSection, setActiveSectionState] = useState<BusinessPassportSectionId>(() => resolvedInitialActiveSection);
  const [sectionStateById, setSectionStateById] = useState<Readonly<Record<BusinessPassportSectionId, MutableSectionState>>>(() =>
    createInitialSectionState(input),
  );
  const [expandedSections, setExpandedSections] = useState<Readonly<Record<BusinessPassportSectionId, boolean>>>(
    () => persistedWorkspaceState.expandedSections,
  );
  const [selectedTab, setSelectedTabState] = useState<string>(() => persistedWorkspaceState.selectedTab);
  const [filters, setFiltersState] = useState<BusinessPassportWorkspaceFilters>(() => persistedWorkspaceState.filters);

  const sections = useMemo<readonly BusinessPassportWorkspaceSectionState[]>(() => {
    return enabledSections.map((definition) => {
      const source = sectionStateSourceById[definition.id];
      const state = sectionStateById[definition.id];

      const completionPercentage = state?.completionPercentage ?? source?.completionPercentage ?? 0;
      const completionStatus = state?.completionStatus ?? source?.completionStatus ?? "not_started";
      const validationStatus = state?.validationStatus ?? source?.validationStatus ?? "success";
      const missingRequiredFields = state?.missingRequiredFields ?? source?.missingRequiredFields ?? [];

      return {
        id: definition.id,
        label: definition.title,
        anchorId: definition.anchorId,
        disabled: Boolean(source?.disabled) || !definition.enabled,
        completionPercentage,
        completionStatus,
        dirty: state?.dirty ?? false,
        validationStatus,
        missingRequiredFields,
        active: activeSection === definition.id,
      };
    });
  }, [activeSection, enabledSections, sectionStateById, sectionStateSourceById]);

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
    const previousSection = getPreviousSection(activeSection)?.id;
    if (previousSection) {
      setActiveSectionState(previousSection);
    }
  }, [activeSection]);

  const goToNextSection = useCallback(() => {
    const nextSection = getNextSection(activeSection)?.id;
    if (nextSection) {
      setActiveSectionState(nextSection);
    }
  }, [activeSection]);

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

  const setSectionExpanded = useCallback((sectionId: BusinessPassportSectionId, expanded: boolean) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: expanded,
    }));
  }, []);

  const toggleSectionExpanded = useCallback((sectionId: BusinessPassportSectionId) => {
    setExpandedSections((current) => ({
      ...current,
      [sectionId]: !current[sectionId],
    }));
  }, []);

  const setSelectedTab = useCallback((tabId: string) => {
    setSelectedTabState(tabId);
  }, []);

  const setFilters = useCallback((nextFilters: BusinessPassportWorkspaceFilters) => {
    setFiltersState(nextFilters);
  }, []);

  const mergeFilters = useCallback((nextFilters: Partial<BusinessPassportWorkspaceFilters>) => {
    setFiltersState((current) => ({
      ...current,
      ...nextFilters,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFiltersState({});
  }, []);

  useEffect(() => {
    const lastVisitedAt = new Date().toISOString();

    saveBusinessPassportWorkspacePersistence({
      storageKey: input.persistenceKey,
      sectionIds,
      activeSection,
      expandedSections,
      selectedTab,
      filters,
      lastVisitedAt,
    });
  }, [activeSection, expandedSections, filters, input.persistenceKey, sectionIds, selectedTab]);

  const workspaceActions = useMemo<readonly BusinessPassportWorkspaceAction[]>(() => {
    const previousSectionId = getPreviousSection(activeSection)?.id;
    const nextSectionId = getNextSection(activeSection)?.id;

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
  }, [activeSection, goToNextSection, goToPreviousSection, input.actions, markSectionCompleted, setSectionDirty, setSectionValidation]);

  return {
    loadingState: {
      isLoading: Boolean(input.isLoading),
    },
    activeSection,
    sections,
    completion,
    validation,
    dirtyState,
    viewState: {
      expandedSections,
      selectedTab,
      filters,
      lastVisitedAt: persistedWorkspaceState.lastVisitedAt,
    },
    workspaceActions,
    setActiveSection,
    jumpToSection,
    goToPreviousSection,
    goToNextSection,
    setSectionExpanded,
    toggleSectionExpanded,
    setSelectedTab,
    setFilters,
    mergeFilters,
    clearFilters,
    markSectionCompleted,
    setSectionValidation,
    setSectionDirty,
  };
}
