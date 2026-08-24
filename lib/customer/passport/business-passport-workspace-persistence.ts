import type {
  BusinessPassportSectionId,
  BusinessPassportWorkspaceFilters,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";
import {
  loadWorkspacePersistence,
  sanitizeWorkspaceFilters,
  saveWorkspacePersistence,
} from "@/lib/workspaces/workspace-persistence";

const DEFAULT_PERSISTENCE_KEY = "atlas.business-passport.workspace.v1";

export interface BusinessPassportWorkspacePersistenceSnapshot {
  readonly activeSection: BusinessPassportSectionId | null;
  readonly expandedSections: Readonly<Record<BusinessPassportSectionId, boolean>>;
  readonly selectedTab: string;
  readonly filters: BusinessPassportWorkspaceFilters;
  readonly lastVisitedAt: string | null;
}

export interface SaveBusinessPassportWorkspacePersistenceInput {
  readonly storageKey?: string;
  readonly sectionIds: readonly BusinessPassportSectionId[];
  readonly activeSection: BusinessPassportSectionId;
  readonly expandedSections: Readonly<Record<BusinessPassportSectionId, boolean>>;
  readonly selectedTab: string;
  readonly filters: BusinessPassportWorkspaceFilters;
  readonly lastVisitedAt: string;
}

export function loadBusinessPassportWorkspacePersistence(input: {
  readonly storageKey?: string;
  readonly sectionIds: readonly BusinessPassportSectionId[];
}): BusinessPassportWorkspacePersistenceSnapshot {
  return loadWorkspacePersistence<BusinessPassportSectionId, BusinessPassportWorkspaceFilters>({
    storageKey: input.storageKey,
    defaultStorageKey: DEFAULT_PERSISTENCE_KEY,
    sectionIds: input.sectionIds,
    defaultSelectedTab: "overview",
    defaultFilters: {},
    sanitizeFilters: (filters) => sanitizeWorkspaceFilters(filters),
  });
}

export function saveBusinessPassportWorkspacePersistence(input: SaveBusinessPassportWorkspacePersistenceInput): void {
  saveWorkspacePersistence<BusinessPassportSectionId, BusinessPassportWorkspaceFilters>({
    storageKey: input.storageKey,
    defaultStorageKey: DEFAULT_PERSISTENCE_KEY,
    sectionIds: input.sectionIds,
    activeSection: input.activeSection,
    expandedSections: input.expandedSections,
    selectedTab: input.selectedTab,
    filters: input.filters,
    lastVisitedAt: input.lastVisitedAt,
    sanitizeFilters: (filters) => sanitizeWorkspaceFilters(filters),
  });
}
