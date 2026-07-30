import type { WorkspaceAttributes } from "@/lib/workspaces/types";

export type WorkspaceChangeType = string;

export interface WorkspaceChange<
  TChangeType extends WorkspaceChangeType = WorkspaceChangeType,
  TEntity extends string = string,
  TProperty extends string = string,
  TMetadata extends WorkspaceAttributes = WorkspaceAttributes,
> {
  readonly id: string;
  readonly timestamp: string;
  readonly entity: TEntity;
  readonly property: TProperty;
  readonly previousValue: unknown;
  readonly newValue: unknown;
  readonly changeType: TChangeType;
  readonly metadata: TMetadata;
}

export interface WorkspaceChangeSet<TChange extends WorkspaceChange = WorkspaceChange> {
  readonly id: string;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
  readonly commandName: string;
  readonly changes: readonly TChange[];
  readonly closedAt: string | null;
}

export interface WorkspaceChangeContext<
  TCommand = unknown,
  TContext = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly command: TCommand;
  readonly context: TContext;
  readonly state: TState;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
  readonly commandName: string;
}

export interface WorkspaceChangeQuery {
  readonly workspaceId?: string;
  readonly commandId?: string;
  readonly commandName?: string;
}

export interface WorkspaceChangeSink<TChange extends WorkspaceChange = WorkspaceChange> {
  readonly id: string;
  record: (changeSet: WorkspaceChangeSet<TChange>) => void;
  query: (filter?: WorkspaceChangeQuery) => readonly WorkspaceChangeSet<TChange>[];
  clear: () => void;
}

export interface WorkspaceChangeRecorder<TChange extends WorkspaceChange = WorkspaceChange> {
  recordChange: (change: Omit<TChange, "id" | "timestamp"> & { readonly timestamp?: string }) => TChange | null;
  beginChangeSet: (context: WorkspaceChangeContext) => WorkspaceChangeSet<TChange>;
  endChangeSet: () => WorkspaceChangeSet<TChange> | null;
  getCurrentChangeSet: () => WorkspaceChangeSet<TChange> | null;
  clear: () => void;
  registerSink: (sink: WorkspaceChangeSink<TChange>) => () => void;
  unregisterSink: (sinkOrId: WorkspaceChangeSink<TChange> | string) => void;
  query: (filter?: WorkspaceChangeQuery) => readonly WorkspaceChangeSet<TChange>[];
}

export interface WorkspaceChangeMiddlewareState<TChange extends WorkspaceChange = WorkspaceChange> {
  readonly recorder: WorkspaceChangeRecorder<TChange>;
  currentChangeSet: WorkspaceChangeSet<TChange> | null;
}

export interface CreateWorkspaceChangeRecorderOptions {
  readonly sinks?: readonly WorkspaceChangeSink[];
}

export interface CreateWorkspaceChangeMiddlewareOptions<TChange extends WorkspaceChange = WorkspaceChange> {
  readonly recorder?: WorkspaceChangeRecorder<TChange>;
  readonly id?: string;
}

export interface WorkspaceChangeMiddleware<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TChange extends WorkspaceChange = WorkspaceChange,
> {
  readonly id: string;
  readonly phase?: "pre-handler";
  beforeExecute?: (execution: {
    command: TCommand;
    context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
    state: TState & { change?: WorkspaceChangeMiddlewareState<TChange> };
    readonly isShortCircuited: boolean;
    readonly shortCircuitResult: TResult | undefined;
    shortCircuit: (result: TResult) => void;
  }) => void;
  afterExecute?: (
    execution: {
      command: TCommand;
      context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
      state: TState & { change?: WorkspaceChangeMiddlewareState<TChange> };
      readonly isShortCircuited: boolean;
      readonly shortCircuitResult: TResult | undefined;
      shortCircuit: (result: TResult) => void;
    },
    outcome: TResult,
  ) => void;
  onError?: (
    execution: {
      command: TCommand;
      context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
      state: TState & { change?: WorkspaceChangeMiddlewareState<TChange> };
      readonly isShortCircuited: boolean;
      readonly shortCircuitResult: TResult | undefined;
      shortCircuit: (result: TResult) => void;
    },
    error: Error,
  ) => TResult | void;
}

function createEntryId(changeSetId: string, index: number): string {
  return `${changeSetId}:${index}`;
}

function createChangeSetId(workspaceId: string, commandId: string, timestamp: string, depth: number): string {
  return `${workspaceId}:${commandId}:${timestamp}:${depth}`;
}

function matchesQuery<TChange extends WorkspaceChange>(changeSet: WorkspaceChangeSet<TChange>, filter?: WorkspaceChangeQuery): boolean {
  if (!filter) {
    return true;
  }

  if (typeof filter.workspaceId === "string" && filter.workspaceId !== changeSet.workspaceId) {
    return false;
  }

  if (typeof filter.commandId === "string" && filter.commandId !== changeSet.commandId) {
    return false;
  }

  if (typeof filter.commandName === "string" && filter.commandName !== changeSet.commandName) {
    return false;
  }

  return true;
}

function snapshotChangeSet<TChange extends WorkspaceChange>(changeSet: MutableChangeSet<TChange>): WorkspaceChangeSet<TChange> {
  return {
    id: changeSet.id,
    timestamp: changeSet.timestamp,
    workspaceId: changeSet.workspaceId,
    commandId: changeSet.commandId,
    commandName: changeSet.commandName,
    changes: [...changeSet.changes],
    closedAt: changeSet.closedAt,
  };
}

interface MutableChangeSet<TChange extends WorkspaceChange> {
  id: string;
  timestamp: string;
  workspaceId: string;
  commandId: string;
  commandName: string;
  changes: TChange[];
  closedAt: string | null;
}

export function createInMemoryWorkspaceChangeSink<TChange extends WorkspaceChange = WorkspaceChange>(
  id = "workspace.change.sink.memory",
): WorkspaceChangeSink<TChange> {
  const changeSets = new Map<string, WorkspaceChangeSet<TChange>>();
  const order: string[] = [];

  return {
    id,
    record: (changeSet) => {
      if (!changeSets.has(changeSet.id)) {
        order.push(changeSet.id);
      }

      changeSets.set(changeSet.id, changeSet);
    },
    query: (filter) => {
      return order
        .map((changeSetId) => changeSets.get(changeSetId))
        .filter((changeSet): changeSet is WorkspaceChangeSet<TChange> => Boolean(changeSet))
        .filter((changeSet) => matchesQuery(changeSet, filter));
    },
    clear: () => {
      changeSets.clear();
      order.length = 0;
    },
  };
}

export function createWorkspaceChangeRecorder<TChange extends WorkspaceChange = WorkspaceChange>(
  options?: CreateWorkspaceChangeRecorderOptions,
): WorkspaceChangeRecorder<TChange> {
  const sinks: WorkspaceChangeSink<TChange>[] = [...(options?.sinks ?? [createInMemoryWorkspaceChangeSink<TChange>()])];
  const changeSetStack: MutableChangeSet<TChange>[] = [];
  const history: MutableChangeSet<TChange>[] = [];

  const registerSink: WorkspaceChangeRecorder<TChange>["registerSink"] = (sink) => {
    const existingIndex = sinks.findIndex((registered) => registered.id === sink.id);
    if (existingIndex >= 0) {
      sinks[existingIndex] = sink;
    } else {
      sinks.push(sink);
    }

    return () => {
      unregisterSink(sink.id);
    };
  };

  const unregisterSink: WorkspaceChangeRecorder<TChange>["unregisterSink"] = (sinkOrId) => {
    const sinkId = typeof sinkOrId === "string" ? sinkOrId : sinkOrId.id;
    const index = sinks.findIndex((registered) => registered.id === sinkId);
    if (index < 0) {
      return;
    }

    sinks.splice(index, 1);
  };

  const recordChange: WorkspaceChangeRecorder<TChange>["recordChange"] = (change) => {
    const currentChangeSet = changeSetStack[changeSetStack.length - 1];
    if (!currentChangeSet) {
      return null;
    }

    const timestamp = change.timestamp ?? currentChangeSet.timestamp;
    const recordedChange = {
      ...change,
      id: createEntryId(currentChangeSet.id, currentChangeSet.changes.length + 1),
      timestamp,
    } as TChange;

    currentChangeSet.changes.push(recordedChange);
    return recordedChange;
  };

  const beginChangeSet: WorkspaceChangeRecorder<TChange>["beginChangeSet"] = (context) => {
    const depth = changeSetStack.length + 1;
    const mutableChangeSet: MutableChangeSet<TChange> = {
      id: createChangeSetId(context.workspaceId, context.commandId, context.timestamp, depth),
      timestamp: context.timestamp,
      workspaceId: context.workspaceId,
      commandId: context.commandId,
      commandName: context.commandName,
      changes: [],
      closedAt: null,
    };

    changeSetStack.push(mutableChangeSet);
    return snapshotChangeSet(mutableChangeSet);
  };

  const endChangeSet: WorkspaceChangeRecorder<TChange>["endChangeSet"] = () => {
    const current = changeSetStack.pop();
    if (!current) {
      return null;
    }

    current.closedAt = current.closedAt ?? current.timestamp;
    history.push(current);
    const snapshot = snapshotChangeSet(current);

    for (const sink of sinks) {
      sink.record(snapshot);
    }

    return snapshot;
  };

  const getCurrentChangeSet: WorkspaceChangeRecorder<TChange>["getCurrentChangeSet"] = () => {
    const current = changeSetStack[changeSetStack.length - 1];
    return current ? snapshotChangeSet(current) : null;
  };

  const clear: WorkspaceChangeRecorder<TChange>["clear"] = () => {
    changeSetStack.length = 0;
    history.length = 0;
    for (const sink of sinks) {
      sink.clear();
    }
  };

  const query: WorkspaceChangeRecorder<TChange>["query"] = (filter) => {
    const merged = new Map<string, WorkspaceChangeSet<TChange>>();

    for (const changeSet of history) {
      const snapshot = snapshotChangeSet(changeSet);
      if (matchesQuery(snapshot, filter)) {
        merged.set(snapshot.id, snapshot);
      }
    }

    for (const sink of sinks) {
      for (const changeSet of sink.query(filter)) {
        merged.set(changeSet.id, changeSet);
      }
    }

    return Array.from(merged.values());
  };

  return {
    recordChange,
    beginChangeSet,
    endChangeSet,
    getCurrentChangeSet,
    clear,
    registerSink,
    unregisterSink,
    query,
  };
}

const defaultWorkspaceChangeRecorder = createWorkspaceChangeRecorder();

export function getWorkspaceChangeRecorder(): WorkspaceChangeRecorder {
  return defaultWorkspaceChangeRecorder;
}

export function createWorkspaceChangeMiddleware<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TChange extends WorkspaceChange = WorkspaceChange,
>(input?: CreateWorkspaceChangeMiddlewareOptions<TChange>): WorkspaceChangeMiddleware<TCommand, TContext, TResult, TState, TChange> {
  const recorder = input?.recorder ?? getWorkspaceChangeRecorder<TChange>();
  const middlewareId = input?.id ?? "workspace.command.middleware.change-tracking";

  return {
    id: middlewareId,
    phase: "pre-handler",
    beforeExecute: (execution) => {
      const commandName = typeof (execution.command as { readonly type?: unknown }).type === "string"
        ? String((execution.command as { readonly type?: unknown }).type)
        : "workspace.command";

      const changeSet = recorder.beginChangeSet({
        command: execution.command,
        context: execution.context,
        state: execution.state,
        timestamp: execution.context.occurredAt,
        workspaceId: execution.context.workspaceId,
        commandId: execution.context.commandId,
        commandName,
      });

      execution.state.change = {
        recorder,
        currentChangeSet: changeSet,
      } as WorkspaceChangeMiddlewareState<TChange>;
    },
    afterExecute: (execution) => {
      const closedChangeSet = recorder.endChangeSet();
      if (execution.state.change) {
        execution.state.change = {
          recorder,
          currentChangeSet: closedChangeSet,
        } as WorkspaceChangeMiddlewareState<TChange>;
      }
    },
    onError: (execution, error) => {
      const closedChangeSet = recorder.endChangeSet();
      if (execution.state.change) {
        execution.state.change = {
          recorder,
          currentChangeSet: closedChangeSet,
        } as WorkspaceChangeMiddlewareState<TChange>;
      }

      void error;
    },
  };
}
