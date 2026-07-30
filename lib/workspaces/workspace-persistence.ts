import type {
  WorkspaceFilters,
  WorkspacePersistenceSnapshot,
} from "@/lib/workspaces/workspace.types";

interface WorkspaceStoredState<TFilters> {
  readonly activeSection: string | null;
  readonly expandedSections: Record<string, boolean>;
  readonly selectedTab: string;
  readonly filters: TFilters;
  readonly lastVisitedAt: string | null;
}

export interface LoadWorkspacePersistenceInput<TSectionId extends string, TFilters> {
  readonly storageKey?: string;
  readonly defaultStorageKey: string;
  readonly sectionIds: readonly TSectionId[];
  readonly defaultSelectedTab: string;
  readonly defaultFilters: TFilters;
  readonly sanitizeFilters: (filters: unknown) => TFilters;
}

export interface SaveWorkspacePersistenceInput<TSectionId extends string, TFilters> {
  readonly storageKey?: string;
  readonly defaultStorageKey: string;
  readonly sectionIds: readonly TSectionId[];
  readonly activeSection: TSectionId;
  readonly expandedSections: Readonly<Record<TSectionId, boolean>>;
  readonly selectedTab: string;
  readonly filters: TFilters;
  readonly lastVisitedAt: string;
  readonly sanitizeFilters: (filters: unknown) => TFilters;
}

export function sanitizeWorkspaceFilters(filters: unknown): WorkspaceFilters {
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

function resolveStorageKey(storageKey: string | undefined, defaultStorageKey: string): string {
  const key = storageKey?.trim();
  return key && key.length > 0 ? key : defaultStorageKey;
}

function createDefaultExpandedSections<TSectionId extends string>(
  sectionIds: readonly TSectionId[],
): Readonly<Record<TSectionId, boolean>> {
  return sectionIds.reduce(
    (accumulator, sectionId) => ({
      ...accumulator,
      [sectionId]: true,
    }),
    {} as Record<TSectionId, boolean>,
  );
}

function sanitizeExpandedSections<TSectionId extends string>(
  expandedSections: Record<string, boolean> | undefined,
  sectionIds: readonly TSectionId[],
): Readonly<Record<TSectionId, boolean>> {
  const defaults = createDefaultExpandedSections(sectionIds);

  if (!expandedSections) {
    return defaults;
  }

  return sectionIds.reduce(
    (accumulator, sectionId) => ({
      ...accumulator,
      [sectionId]: typeof expandedSections[sectionId] === "boolean" ? expandedSections[sectionId] : defaults[sectionId],
    }),
    {} as Record<TSectionId, boolean>,
  );
}

function safeRead<TFilters>(storageKey: string): WorkspaceStoredState<TFilters> | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(storageKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as WorkspaceStoredState<TFilters>;
  } catch {
    return null;
  }
}

export function loadWorkspacePersistence<TSectionId extends string, TFilters>(
  input: LoadWorkspacePersistenceInput<TSectionId, TFilters>,
): WorkspacePersistenceSnapshot<TSectionId, TFilters> {
  const storageKey = resolveStorageKey(input.storageKey, input.defaultStorageKey);
  const savedState = safeRead<TFilters>(storageKey);

  const defaultExpandedSections = createDefaultExpandedSections(input.sectionIds);

  if (!savedState) {
    return {
      activeSection: null,
      expandedSections: defaultExpandedSections,
      selectedTab: input.defaultSelectedTab,
      filters: input.defaultFilters,
      lastVisitedAt: null,
    };
  }

  const activeSection = input.sectionIds.find((sectionId) => sectionId === savedState.activeSection) ?? null;

  return {
    activeSection,
    expandedSections: sanitizeExpandedSections(savedState.expandedSections, input.sectionIds),
    selectedTab: typeof savedState.selectedTab === "string" && savedState.selectedTab.length > 0
      ? savedState.selectedTab
      : input.defaultSelectedTab,
    filters: input.sanitizeFilters(savedState.filters),
    lastVisitedAt: typeof savedState.lastVisitedAt === "string" ? savedState.lastVisitedAt : null,
  };
}

export function saveWorkspacePersistence<TSectionId extends string, TFilters>(
  input: SaveWorkspacePersistenceInput<TSectionId, TFilters>,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKey = resolveStorageKey(input.storageKey, input.defaultStorageKey);

  const serialized: WorkspaceStoredState<TFilters> = {
    activeSection: input.activeSection,
    expandedSections: input.sectionIds.reduce(
      (accumulator, sectionId) => ({
        ...accumulator,
        [sectionId]: Boolean(input.expandedSections[sectionId]),
      }),
      {} as Record<string, boolean>,
    ),
    selectedTab: input.selectedTab,
    filters: input.sanitizeFilters(input.filters),
    lastVisitedAt: input.lastVisitedAt,
  };

  window.localStorage.setItem(storageKey, JSON.stringify(serialized));
}
