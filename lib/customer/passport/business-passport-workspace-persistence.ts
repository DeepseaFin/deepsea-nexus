import type {
  BusinessPassportSectionId,
  BusinessPassportWorkspaceFilters,
} from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";

const DEFAULT_PERSISTENCE_KEY = "atlas.business-passport.workspace.v1";

interface PersistedBusinessPassportWorkspaceState {
  readonly activeSection: string | null;
  readonly expandedSections: Record<string, boolean>;
  readonly selectedTab: string;
  readonly filters: BusinessPassportWorkspaceFilters;
  readonly lastVisitedAt: string | null;
}

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

function resolveStorageKey(storageKey?: string): string {
  const key = storageKey?.trim();
  return key && key.length > 0 ? key : DEFAULT_PERSISTENCE_KEY;
}

function createDefaultExpandedSections(
  sectionIds: readonly BusinessPassportSectionId[],
): Readonly<Record<BusinessPassportSectionId, boolean>> {
  return sectionIds.reduce(
    (accumulator, sectionId) => ({
      ...accumulator,
      [sectionId]: true,
    }),
    {} as Record<BusinessPassportSectionId, boolean>,
  );
}

function sanitizeFilters(filters: unknown): BusinessPassportWorkspaceFilters {
  if (!filters || typeof filters !== "object" || Array.isArray(filters)) {
    return {};
  }

  const entries = Object.entries(filters as Record<string, unknown>).filter(([, value]) => {
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      return true;
    }

    return Array.isArray(value) && value.every((item) => typeof item === "string");
  });

  return entries.reduce((accumulator, [key, value]) => {
    accumulator[key] = value as string | number | boolean | readonly string[];
    return accumulator;
  }, {} as Record<string, string | number | boolean | readonly string[]>);
}

function sanitizeExpandedSections(
  expandedSections: Record<string, boolean> | undefined,
  sectionIds: readonly BusinessPassportSectionId[],
): Readonly<Record<BusinessPassportSectionId, boolean>> {
  const defaults = createDefaultExpandedSections(sectionIds);

  if (!expandedSections) {
    return defaults;
  }

  return sectionIds.reduce(
    (accumulator, sectionId) => ({
      ...accumulator,
      [sectionId]: typeof expandedSections[sectionId] === "boolean" ? expandedSections[sectionId] : defaults[sectionId],
    }),
    {} as Record<BusinessPassportSectionId, boolean>,
  );
}

function safeRead(storageKey: string): PersistedBusinessPassportWorkspaceState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PersistedBusinessPassportWorkspaceState;
  } catch {
    return null;
  }
}

export function loadBusinessPassportWorkspacePersistence(input: {
  readonly storageKey?: string;
  readonly sectionIds: readonly BusinessPassportSectionId[];
}): BusinessPassportWorkspacePersistenceSnapshot {
  const storageKey = resolveStorageKey(input.storageKey);
  const savedState = safeRead(storageKey);

  const defaultExpandedSections = createDefaultExpandedSections(input.sectionIds);

  if (!savedState) {
    return {
      activeSection: null,
      expandedSections: defaultExpandedSections,
      selectedTab: "overview",
      filters: {},
      lastVisitedAt: null,
    };
  }

  const activeSection = input.sectionIds.find((sectionId) => sectionId === savedState.activeSection) ?? null;

  return {
    activeSection,
    expandedSections: sanitizeExpandedSections(savedState.expandedSections, input.sectionIds),
    selectedTab: typeof savedState.selectedTab === "string" && savedState.selectedTab.length > 0
      ? savedState.selectedTab
      : "overview",
    filters: sanitizeFilters(savedState.filters),
    lastVisitedAt: typeof savedState.lastVisitedAt === "string" ? savedState.lastVisitedAt : null,
  };
}

export function saveBusinessPassportWorkspacePersistence(input: SaveBusinessPassportWorkspacePersistenceInput): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = resolveStorageKey(input.storageKey);

  const serialized: PersistedBusinessPassportWorkspaceState = {
    activeSection: input.activeSection,
    expandedSections: input.sectionIds.reduce(
      (accumulator, sectionId) => ({
        ...accumulator,
        [sectionId]: Boolean(input.expandedSections[sectionId]),
      }),
      {} as Record<string, boolean>,
    ),
    selectedTab: input.selectedTab,
    filters: sanitizeFilters(input.filters),
    lastVisitedAt: input.lastVisitedAt,
  };

  window.localStorage.setItem(storageKey, JSON.stringify(serialized));
}
