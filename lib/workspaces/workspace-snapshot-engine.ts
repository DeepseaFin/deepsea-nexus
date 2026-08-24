import type { WorkspaceAttributes } from "@/lib/workspaces/types";
import type { WorkspaceCommandMiddleware } from "@/lib/workspaces/workspace-command-pipeline";

export type WorkspaceSnapshotMetadata = WorkspaceAttributes;

export interface WorkspaceSnapshot<
  TWorkspaceState = unknown,
  TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata,
> {
  readonly snapshotId: string;
  readonly workspaceId: string;
  readonly timestamp: string;
  readonly commandId: string;
  readonly workspaceState: TWorkspaceState;
  readonly metadata: TMetadata;
}

export interface WorkspaceSnapshotCaptureInput<
  TCommand = unknown,
  TContext = unknown,
  TResult = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly command: TCommand;
  readonly context: TContext;
  readonly outcome: TResult;
  readonly state: TState;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
}

export interface WorkspaceSnapshotProvider<
  TCommand = unknown,
  TContext = unknown,
  TResult = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TWorkspaceState = unknown,
  TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata,
> {
  readonly id: string;
  canCapture?: (input: WorkspaceSnapshotCaptureInput<TCommand, TContext, TResult, TState>) => boolean;
  captureWorkspaceState: (
    input: WorkspaceSnapshotCaptureInput<TCommand, TContext, TResult, TState>,
  ) => TWorkspaceState;
  buildMetadata?: (input: WorkspaceSnapshotCaptureInput<TCommand, TContext, TResult, TState>) => TMetadata;
}

export interface WorkspaceSnapshotStore {
  saveSnapshot: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    snapshot: WorkspaceSnapshot<TWorkspaceState, TMetadata>,
  ) => WorkspaceSnapshot<TWorkspaceState, TMetadata>;
  getLatestSnapshot: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    workspaceId: string,
  ) => WorkspaceSnapshot<TWorkspaceState, TMetadata> | null;
  listSnapshots: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    workspaceId?: string,
  ) => readonly WorkspaceSnapshot<TWorkspaceState, TMetadata>[];
  clearSnapshots: (workspaceId?: string) => void;
}

export interface WorkspaceSnapshotEngine<
  TCommand = unknown,
  TContext = unknown,
  TResult = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  captureSnapshot: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    input: WorkspaceSnapshotCaptureInput<TCommand, TContext, TResult, TState>,
  ) => WorkspaceSnapshot<TWorkspaceState, TMetadata> | null;
  getLatestSnapshot: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    workspaceId: string,
  ) => WorkspaceSnapshot<TWorkspaceState, TMetadata> | null;
  listSnapshots: <TWorkspaceState = unknown, TMetadata extends WorkspaceSnapshotMetadata = WorkspaceSnapshotMetadata>(
    workspaceId?: string,
  ) => readonly WorkspaceSnapshot<TWorkspaceState, TMetadata>[];
  clearSnapshots: (workspaceId?: string) => void;
  registerProvider: (
    provider: WorkspaceSnapshotProvider<TCommand, TContext, TResult, TState>,
  ) => () => void;
  unregisterProvider: (providerOrId: WorkspaceSnapshotProvider<TCommand, TContext, TResult, TState> | string) => void;
}

export interface CreateWorkspaceSnapshotEngineOptions<
  TCommand = unknown,
  TContext = unknown,
  TResult = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly store?: WorkspaceSnapshotStore;
  readonly providers?: readonly WorkspaceSnapshotProvider<TCommand, TContext, TResult, TState>[];
}

export interface CreateWorkspaceSnapshotMiddlewareOptions<
  TCommand,
  TContext extends {
    readonly workspaceId: string;
    readonly commandId: string;
    readonly occurredAt: string;
  },
  TResult extends { readonly success: boolean },
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly snapshotEngine?: WorkspaceSnapshotEngine<TCommand, TContext, TResult, TState>;
  readonly id?: string;
}

function cloneSnapshotValue<TValue>(value: TValue): TValue {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (typeof globalThis.structuredClone === "function") {
    return globalThis.structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value)) as TValue;
}

function cloneSnapshot<
  TWorkspaceState,
  TMetadata extends WorkspaceSnapshotMetadata,
>(snapshot: WorkspaceSnapshot<TWorkspaceState, TMetadata>): WorkspaceSnapshot<TWorkspaceState, TMetadata> {
  return {
    snapshotId: snapshot.snapshotId,
    workspaceId: snapshot.workspaceId,
    timestamp: snapshot.timestamp,
    commandId: snapshot.commandId,
    workspaceState: cloneSnapshotValue(snapshot.workspaceState),
    metadata: cloneSnapshotValue(snapshot.metadata),
  };
}

function createSnapshotId(workspaceId: string, commandId: string, providerId: string, timestamp: string): string {
  return `${workspaceId}:${commandId}:${providerId}:${timestamp}`;
}

function resolveCommandType(command: unknown): string {
  if (typeof command !== "object" || command === null) {
    return "workspace.command";
  }

  const commandType = (command as { readonly type?: unknown }).type;
  return typeof commandType === "string" && commandType.trim().length > 0 ? commandType : "workspace.command";
}

function hasProperty<TKey extends string>(value: unknown, property: TKey): value is Record<TKey, unknown> {
  return typeof value === "object" && value !== null && property in value;
}

function resolveFallbackWorkspaceState(input: WorkspaceSnapshotCaptureInput): {
  readonly source: "result" | "payload";
  readonly value: unknown;
} | null {
  if (hasProperty(input.outcome, "result") && typeof input.outcome.result !== "undefined") {
    return {
      source: "result",
      value: input.outcome.result,
    };
  }

  if (hasProperty(input.command, "payload") && typeof input.command.payload !== "undefined") {
    return {
      source: "payload",
      value: input.command.payload,
    };
  }

  return null;
}

function matchesWorkspace(snapshot: WorkspaceSnapshot, workspaceId?: string): boolean {
  return typeof workspaceId !== "string" || snapshot.workspaceId === workspaceId;
}

export function createInMemoryWorkspaceSnapshotStore(): WorkspaceSnapshotStore {
  const snapshots: WorkspaceSnapshot[] = [];

  return {
    saveSnapshot: (snapshot) => {
      const storedSnapshot = cloneSnapshot(snapshot);
      snapshots.push(storedSnapshot);
      return cloneSnapshot(storedSnapshot);
    },
    getLatestSnapshot: (workspaceId) => {
      const latestSnapshot = [...snapshots].reverse().find((snapshot) => snapshot.workspaceId === workspaceId) ?? null;
      return latestSnapshot ? cloneSnapshot(latestSnapshot) : null;
    },
    listSnapshots: (workspaceId) => {
      const orderedSnapshots = snapshots.filter((snapshot) => matchesWorkspace(snapshot, workspaceId));

      return orderedSnapshots.map((snapshot) => cloneSnapshot(snapshot));
    },
    clearSnapshots: (workspaceId) => {
      if (typeof workspaceId !== "string") {
        snapshots.length = 0;
        return;
      }

      for (let index = snapshots.length - 1; index >= 0; index -= 1) {
        if (snapshots[index]?.workspaceId === workspaceId) {
          snapshots.splice(index, 1);
        }
      }
    },
  };
}

export function createWorkspaceSnapshotEngine<
  TCommand = unknown,
  TContext = unknown,
  TResult = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
>(
  options?: CreateWorkspaceSnapshotEngineOptions<TCommand, TContext, TResult, TState>,
): WorkspaceSnapshotEngine<TCommand, TContext, TResult, TState> {
  const fallbackProvider: WorkspaceSnapshotProvider<TCommand, TContext, TResult, TState> = {
    id: "workspace.snapshot.provider.default",
    canCapture: (input) => resolveFallbackWorkspaceState(input) !== null,
    captureWorkspaceState: (input) => {
      const resolvedState = resolveFallbackWorkspaceState(input);
      if (!resolvedState) {
        throw new Error("Workspace snapshot fallback provider could not resolve workspace state.");
      }

      return resolvedState.value;
    },
    buildMetadata: (input) => {
      const resolvedState = resolveFallbackWorkspaceState(input);
      return {
        captureSource: resolvedState?.source ?? "payload",
      };
    },
  };

  const providers: WorkspaceSnapshotProvider<TCommand, TContext, TResult, TState>[] = [
    ...(options?.providers ?? []),
    fallbackProvider,
  ];
  const store = options?.store ?? createInMemoryWorkspaceSnapshotStore();

  const registerProvider: WorkspaceSnapshotEngine<TCommand, TContext, TResult, TState>["registerProvider"] = (
    provider,
  ) => {
    const existingIndex = providers.findIndex((registeredProvider) => registeredProvider.id === provider.id);
    if (existingIndex >= 0) {
      providers[existingIndex] = provider;
    } else {
      providers.splice(providers.length - 1, 0, provider);
    }

    return () => {
      unregisterProvider(provider.id);
    };
  };

  const unregisterProvider: WorkspaceSnapshotEngine<TCommand, TContext, TResult, TState>["unregisterProvider"] = (
    providerOrId,
  ) => {
    const providerId = typeof providerOrId === "string" ? providerOrId : providerOrId.id;
    const providerIndex = providers.findIndex((provider) => provider.id === providerId);
    if (providerIndex < 0) {
      return;
    }

    providers.splice(providerIndex, 1);
  };

  const captureSnapshot: WorkspaceSnapshotEngine<TCommand, TContext, TResult, TState>["captureSnapshot"] = (input) => {
    const provider = providers.find((candidate) => candidate.canCapture?.(input) ?? true);
    if (!provider) {
      return null;
    }

    const metadata = {
      providerId: provider.id,
      commandType: resolveCommandType(input.command),
      ...(provider.buildMetadata?.(input) ?? {}),
    } as WorkspaceSnapshotMetadata;

    const snapshot: WorkspaceSnapshot = {
      snapshotId: createSnapshotId(input.workspaceId, input.commandId, provider.id, input.timestamp),
      workspaceId: input.workspaceId,
      timestamp: input.timestamp,
      commandId: input.commandId,
      workspaceState: cloneSnapshotValue(provider.captureWorkspaceState(input)),
      metadata,
    };

    return store.saveSnapshot(snapshot);
  };

  return {
    captureSnapshot,
    getLatestSnapshot: (workspaceId) => store.getLatestSnapshot(workspaceId),
    listSnapshots: (workspaceId) => store.listSnapshots(workspaceId),
    clearSnapshots: (workspaceId) => store.clearSnapshots(workspaceId),
    registerProvider,
    unregisterProvider,
  };
}

const defaultWorkspaceSnapshotEngine = createWorkspaceSnapshotEngine();

export function getWorkspaceSnapshotEngine(): WorkspaceSnapshotEngine {
  return defaultWorkspaceSnapshotEngine;
}

export function createWorkspaceSnapshotMiddleware<
  TCommand,
  TContext extends {
    readonly workspaceId: string;
    readonly commandId: string;
    readonly occurredAt: string;
  },
  TResult extends { readonly success: boolean },
  TState extends Record<string, unknown> = Record<string, unknown>,
>(
  options?: CreateWorkspaceSnapshotMiddlewareOptions<TCommand, TContext, TResult, TState>,
): WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState> {
  const middlewareId = options?.id ?? "workspace.command.middleware.snapshot-capture";
  const snapshotEngine = options?.snapshotEngine ?? getWorkspaceSnapshotEngine<TCommand, TContext, TResult, TState>();

  return {
    id: middlewareId,
    phase: "post-handler",
    afterExecute: (execution, outcome) => {
      if (!outcome.success) {
        return;
      }

      snapshotEngine.captureSnapshot({
        command: execution.command,
        context: execution.context,
        outcome,
        state: execution.state,
        timestamp: execution.context.occurredAt,
        workspaceId: execution.context.workspaceId,
        commandId: execution.context.commandId,
      });
    },
  };
}