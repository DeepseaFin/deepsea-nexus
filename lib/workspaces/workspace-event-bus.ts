export const WORKSPACE_EVENT_TYPES = {
  Initialized: "workspace.initialized",
  Hydrated: "workspace.hydrated",
  ActiveSectionChanged: "workspace.active-section-changed",
  CompletionChanged: "workspace.completion-changed",
  WorkflowChanged: "workspace.workflow-changed",
  Persisted: "workspace.persisted",
  CommandValidated: "workspace.command.validated",
  CommandBeforeExecute: "workspace.command.before-execute",
  CommandAfterExecute: "workspace.command.after-execute",
  CommandFailed: "workspace.command.failed",
} as const;

export type WorkspaceEventType = (typeof WORKSPACE_EVENT_TYPES)[keyof typeof WORKSPACE_EVENT_TYPES];

export type WorkspaceEventMap = {
  [WORKSPACE_EVENT_TYPES.Initialized]: {
    readonly sectionIds: readonly string[];
    readonly enabledSectionIds: readonly string[];
  };
  [WORKSPACE_EVENT_TYPES.Hydrated]: {
    readonly storageKey: string;
    readonly sectionIds: readonly string[];
    readonly activeSection: string | null;
    readonly selectedTab: string;
    readonly lastVisitedAt: string | null;
  };
  [WORKSPACE_EVENT_TYPES.ActiveSectionChanged]: {
    readonly previousActiveSection: string | null;
    readonly activeSection: string | null;
    readonly reason: "hydrated" | "persisted";
  };
  [WORKSPACE_EVENT_TYPES.CompletionChanged]: {
    readonly completedCount: number;
    readonly totalCount: number;
    readonly completionPercentage: number;
    readonly completionStatus: "not_started" | "in_progress" | "completed";
    readonly completedSectionIds: readonly string[];
  };
  [WORKSPACE_EVENT_TYPES.WorkflowChanged]: {
    readonly availableSectionIds: readonly string[];
    readonly blockedSectionIds: readonly string[];
    readonly completedSectionIds: readonly string[];
    readonly nextRecommendedSectionId: string | null;
  };
  [WORKSPACE_EVENT_TYPES.Persisted]: {
    readonly storageKey: string;
    readonly sectionIds: readonly string[];
    readonly activeSection: string;
    readonly selectedTab: string;
    readonly lastVisitedAt: string;
  };
  [WORKSPACE_EVENT_TYPES.CommandValidated]: {
    readonly commandType: string;
    readonly valid: boolean;
    readonly issueCodes: readonly string[];
  };
  [WORKSPACE_EVENT_TYPES.CommandBeforeExecute]: {
    readonly commandType: string;
    readonly commandId: string;
  };
  [WORKSPACE_EVENT_TYPES.CommandAfterExecute]: {
    readonly commandType: string;
    readonly commandId: string;
    readonly success: boolean;
  };
  [WORKSPACE_EVENT_TYPES.CommandFailed]: {
    readonly commandType: string;
    readonly commandId: string;
    readonly errorMessage: string;
  };
};

export interface WorkspaceEventEnvelope<TType extends WorkspaceEventType = WorkspaceEventType> {
  readonly type: TType;
  readonly workspaceId: string;
  readonly occurredAt: string;
  readonly payload: WorkspaceEventMap[TType];
}

type WorkspaceEventHandler<TType extends WorkspaceEventType> = (
  event: WorkspaceEventEnvelope<TType>,
) => void;

type AnyWorkspaceEventHandler = (event: WorkspaceEventEnvelope) => void;

export interface WorkspaceEventBus {
  subscribe<TType extends WorkspaceEventType>(
    type: TType,
    handler: WorkspaceEventHandler<TType>,
  ): () => void;
  subscribe(type: "*", handler: AnyWorkspaceEventHandler): () => void;
  unsubscribe<TType extends WorkspaceEventType>(type: TType, handler: WorkspaceEventHandler<TType>): void;
  unsubscribe(type: "*", handler: AnyWorkspaceEventHandler): void;
  publish<TType extends WorkspaceEventType>(event: WorkspaceEventEnvelope<TType>): void;
}

function createEventSet<T>(
  existing: ReadonlySet<T> | undefined,
): Set<T> {
  return existing ? new Set(existing) : new Set<T>();
}

export function createWorkspaceEventBus(): WorkspaceEventBus {
  const handlers = new Map<WorkspaceEventType, Set<AnyWorkspaceEventHandler>>();
  const wildcardHandlers = new Set<AnyWorkspaceEventHandler>();

  const subscribe: WorkspaceEventBus["subscribe"] = (
    type: WorkspaceEventType | "*",
    handler: AnyWorkspaceEventHandler,
  ) => {
    if (type === "*") {
      wildcardHandlers.add(handler);
      return () => {
        wildcardHandlers.delete(handler);
      };
    }

    const typeHandlers = createEventSet(handlers.get(type));
    typeHandlers.add(handler);
    handlers.set(type, typeHandlers);

    return () => {
      typeHandlers.delete(handler);
      if (typeHandlers.size === 0) {
        handlers.delete(type);
      }
    };
  };

  const unsubscribe: WorkspaceEventBus["unsubscribe"] = (
    type: WorkspaceEventType | "*",
    handler: AnyWorkspaceEventHandler,
  ) => {
    if (type === "*") {
      wildcardHandlers.delete(handler);
      return;
    }

    const typeHandlers = handlers.get(type);
    if (!typeHandlers) {
      return;
    }

    typeHandlers.delete(handler);
    if (typeHandlers.size === 0) {
      handlers.delete(type);
    }
  };

  const publish: WorkspaceEventBus["publish"] = (event) => {
    const typeHandlers = handlers.get(event.type);
    if (typeHandlers) {
      for (const handler of typeHandlers) {
        handler(event);
      }
    }

    for (const handler of wildcardHandlers) {
      handler(event);
    }
  };

  return {
    subscribe,
    unsubscribe,
    publish,
  };
}

const defaultWorkspaceEventBus = createWorkspaceEventBus();

export function getWorkspaceEventBus(): WorkspaceEventBus {
  return defaultWorkspaceEventBus;
}

export function resolveWorkspaceId(value: string | undefined, fallback: string): string {
  const candidate = value?.trim();
  return candidate && candidate.length > 0 ? candidate : fallback;
}

export function nowWorkspaceEventTimestamp(): string {
  return new Date().toISOString();
}
