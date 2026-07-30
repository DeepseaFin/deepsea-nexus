import type { JourneyStep as JourneyStepType } from "@/lib/journey";
import {
  loadWorkspacePersistence,
  sanitizeWorkspaceFilters,
  saveWorkspacePersistence,
} from "@/lib/workspaces/workspace-persistence";
import type { WorkspaceFilters } from "@/lib/workspaces/workspace.types";

const DEFAULT_STORAGE_KEY = "atlas.relationship-journey.workspace.v1";

export interface RelationshipJourneyWorkspacePersistenceSnapshot {
  readonly activeStep: JourneyStepType | null;
  readonly expandedSteps: Readonly<Record<JourneyStepType, boolean>>;
  readonly selectedTab: string;
  readonly filters: WorkspaceFilters;
  readonly lastVisitedAt: string | null;
}

export function loadRelationshipJourneyWorkspacePersistence(input: {
  readonly storageKey?: string;
  readonly stepIds: readonly JourneyStepType[];
}): RelationshipJourneyWorkspacePersistenceSnapshot {
  const snapshot = loadWorkspacePersistence<JourneyStepType, WorkspaceFilters>({
    storageKey: input.storageKey,
    defaultStorageKey: DEFAULT_STORAGE_KEY,
    sectionIds: input.stepIds,
    defaultSelectedTab: "overview",
    defaultFilters: {},
    sanitizeFilters: (filters) => sanitizeWorkspaceFilters(filters),
  });

  return {
    activeStep: snapshot.activeSection,
    expandedSteps: snapshot.expandedSections,
    selectedTab: snapshot.selectedTab,
    filters: snapshot.filters,
    lastVisitedAt: snapshot.lastVisitedAt,
  };
}

export function saveRelationshipJourneyWorkspacePersistence(input: {
  readonly storageKey?: string;
  readonly stepIds: readonly JourneyStepType[];
  readonly activeStep: JourneyStepType;
  readonly expandedSteps: Readonly<Record<JourneyStepType, boolean>>;
  readonly selectedTab: string;
  readonly filters: WorkspaceFilters;
  readonly lastVisitedAt: string;
}): void {
  saveWorkspacePersistence<JourneyStepType, WorkspaceFilters>({
    storageKey: input.storageKey,
    defaultStorageKey: DEFAULT_STORAGE_KEY,
    sectionIds: input.stepIds,
    activeSection: input.activeStep,
    expandedSections: input.expandedSteps,
    selectedTab: input.selectedTab,
    filters: input.filters,
    lastVisitedAt: input.lastVisitedAt,
    sanitizeFilters: (filters) => sanitizeWorkspaceFilters(filters),
  });
}
