import type { WorkspacePolicyEvaluationResult } from "@/lib/workspaces/workspace-policy-engine";

export type WorkspaceAuditExecutionResult = "started" | "completed" | "failed" | "invalid" | "denied";

export interface WorkspaceAuditPolicyOutcome {
  readonly allowed: boolean;
  readonly policyIds: readonly string[];
  readonly warnings: readonly string[];
  readonly advisoryMessages: readonly string[];
}

export interface WorkspaceAuditEntry {
  readonly id: string;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
  readonly commandName: string;
  readonly executionResult: WorkspaceAuditExecutionResult;
  readonly policyOutcome: WorkspaceAuditPolicyOutcome | null;
  readonly emittedEventIds: readonly string[];
  readonly warnings: readonly string[];
  readonly errors: readonly string[];
}

export interface WorkspaceAuditContext<
  TCommand = unknown,
  TContext = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  readonly command: TCommand;
  readonly context: TContext;
  readonly state: TState;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
  readonly commandName: string;
  readonly policyEvaluation?: WorkspacePolicyEvaluationResult;
  readonly result?: TResult;
  readonly error?: Error;
  readonly emittedEventIds?: readonly string[];
  readonly warnings?: readonly string[];
  readonly errors?: readonly string[];
}

export interface WorkspaceAuditQuery {
  readonly workspaceId?: string;
  readonly commandId?: string;
  readonly commandName?: string;
  readonly executionResult?: WorkspaceAuditExecutionResult;
}

export interface WorkspaceAuditSink {
  readonly id: string;
  record: (entry: WorkspaceAuditEntry) => void;
  query: (filter?: WorkspaceAuditQuery) => readonly WorkspaceAuditEntry[];
  clear: () => void;
}

export interface WorkspaceAuditRecorder {
  record: (entry: WorkspaceAuditEntry) => WorkspaceAuditEntry;
  query: (filter?: WorkspaceAuditQuery) => readonly WorkspaceAuditEntry[];
  clear: () => void;
  registerSink: (sink: WorkspaceAuditSink) => () => void;
  unregisterSink: (sinkOrId: WorkspaceAuditSink | string) => void;
}

export interface CreateWorkspaceAuditRecorderOptions {
  readonly sinks?: readonly WorkspaceAuditSink[];
}

export interface WorkspaceAuditEntryInput<
  TCommand = unknown,
  TContext = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> {
  readonly command: TCommand;
  readonly context: TContext;
  readonly state: TState;
  readonly timestamp: string;
  readonly workspaceId: string;
  readonly commandId: string;
  readonly commandName: string;
  readonly executionResult: WorkspaceAuditExecutionResult;
  readonly policyEvaluation?: WorkspacePolicyEvaluationResult;
  readonly result?: TResult;
  readonly error?: Error;
  readonly emittedEventIds?: readonly string[];
  readonly warnings?: readonly string[];
  readonly errors?: readonly string[];
}

export interface WorkspaceAuditMiddlewareState {
  readonly entryId: string;
  readonly entryTimestamp: string;
  warnings: string[];
  errors: string[];
  emittedEventIds: string[];
  policyOutcome?: WorkspaceAuditPolicyOutcome | null;
}

export interface WorkspaceAuditMiddlewareContext<
  TCommand = unknown,
  TContext = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
> extends WorkspaceAuditContext<TCommand, TContext, TState, TResult> {
  readonly auditRecorder: WorkspaceAuditRecorder;
}

function matchesQuery(entry: WorkspaceAuditEntry, filter?: WorkspaceAuditQuery): boolean {
  if (!filter) {
    return true;
  }

  if (typeof filter.workspaceId === "string" && filter.workspaceId !== entry.workspaceId) {
    return false;
  }

  if (typeof filter.commandId === "string" && filter.commandId !== entry.commandId) {
    return false;
  }

  if (typeof filter.commandName === "string" && filter.commandName !== entry.commandName) {
    return false;
  }

  if (typeof filter.executionResult === "string" && filter.executionResult !== entry.executionResult) {
    return false;
  }

  return true;
}

function normalizeStrings(values: readonly string[] | undefined): readonly string[] {
  return values ? [...values] : [];
}

function createAuditEntryId(workspaceId: string, commandId: string, timestamp: string): string {
  return `${workspaceId}:${commandId}:${timestamp}`;
}

function toPolicyOutcome(policyEvaluation?: WorkspacePolicyEvaluationResult): WorkspaceAuditPolicyOutcome | null {
  if (!policyEvaluation) {
    return null;
  }

  return {
    allowed: policyEvaluation.allowed,
    policyIds: [...policyEvaluation.policyIds],
    warnings: [...policyEvaluation.warnings],
    advisoryMessages: [...policyEvaluation.advisoryMessages],
  };
}

export function buildWorkspaceAuditEntry<
  TCommand = unknown,
  TContext = unknown,
  TState extends Record<string, unknown> = Record<string, unknown>,
  TResult = unknown,
>(input: WorkspaceAuditEntryInput<TCommand, TContext, TState, TResult>): WorkspaceAuditEntry {
  return {
    id: createAuditEntryId(input.workspaceId, input.commandId, input.timestamp),
    timestamp: input.timestamp,
    workspaceId: input.workspaceId,
    commandId: input.commandId,
    commandName: input.commandName,
    executionResult: input.executionResult,
    policyOutcome: toPolicyOutcome(input.policyEvaluation),
    emittedEventIds: normalizeStrings(input.emittedEventIds),
    warnings: normalizeStrings(input.warnings),
    errors: normalizeStrings(input.errors),
  };
}

export function createInMemoryWorkspaceAuditSink(id = "workspace.audit.sink.memory"): WorkspaceAuditSink {
  const entries = new Map<string, WorkspaceAuditEntry>();
  const order: string[] = [];

  return {
    id,
    record: (entry) => {
      if (!entries.has(entry.id)) {
        order.push(entry.id);
      }

      entries.set(entry.id, entry);
    },
    query: (filter) => {
      return order
        .map((entryId) => entries.get(entryId))
        .filter((entry): entry is WorkspaceAuditEntry => Boolean(entry))
        .filter((entry) => matchesQuery(entry, filter));
    },
    clear: () => {
      entries.clear();
      order.length = 0;
    },
  };
}

export function createWorkspaceAuditRecorder(options?: CreateWorkspaceAuditRecorderOptions): WorkspaceAuditRecorder {
  const sinks: WorkspaceAuditSink[] = [...(options?.sinks ?? [createInMemoryWorkspaceAuditSink()])];

  const registerSink: WorkspaceAuditRecorder["registerSink"] = (sink) => {
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

  const unregisterSink: WorkspaceAuditRecorder["unregisterSink"] = (sinkOrId) => {
    const sinkId = typeof sinkOrId === "string" ? sinkOrId : sinkOrId.id;
    const index = sinks.findIndex((registered) => registered.id === sinkId);
    if (index < 0) {
      return;
    }

    sinks.splice(index, 1);
  };

  const record: WorkspaceAuditRecorder["record"] = (entry) => {
    for (const sink of sinks) {
      sink.record(entry);
    }

    return entry;
  };

  const query: WorkspaceAuditRecorder["query"] = (filter) => {
    const merged = new Map<string, WorkspaceAuditEntry>();

    for (const sink of sinks) {
      for (const entry of sink.query(filter)) {
        merged.set(entry.id, entry);
      }
    }

    return Array.from(merged.values());
  };

  const clear: WorkspaceAuditRecorder["clear"] = () => {
    for (const sink of sinks) {
      sink.clear();
    }
  };

  return {
    record,
    query,
    clear,
    registerSink,
    unregisterSink,
  };
}

const defaultWorkspaceAuditRecorder = createWorkspaceAuditRecorder();

export function getWorkspaceAuditRecorder(): WorkspaceAuditRecorder {
  return defaultWorkspaceAuditRecorder;
}

export function createWorkspaceAuditState(timestamp: string): WorkspaceAuditMiddlewareState {
  return {
    entryId: "",
    entryTimestamp: timestamp,
    warnings: [],
    errors: [],
    emittedEventIds: [],
    policyOutcome: null,
  };
}

export function createWorkspaceAuditMiddleware<
  TCommand extends { readonly type: string },
  TContext,
  TResult,
  TState extends Record<string, unknown> & { audit?: WorkspaceAuditMiddlewareState; policyEvaluation?: WorkspacePolicyEvaluationResult },
>(input: {
  readonly auditRecorder?: WorkspaceAuditRecorder;
  readonly id?: string;
}) {
  const auditRecorder = input.auditRecorder ?? getWorkspaceAuditRecorder();
  const middlewareId = input.id ?? "workspace.audit.middleware";

  return {
    id: middlewareId,
    phase: "pre-handler" as const,
    beforeExecute: (execution: {
      command: TCommand;
      context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
      state: TState;
      readonly isShortCircuited: boolean;
      readonly shortCircuitResult: TResult | undefined;
      shortCircuit: (result: TResult) => void;
    }) => {
      const auditState = createWorkspaceAuditState(execution.context.occurredAt);
      auditState.entryId = createAuditEntryId(
        execution.context.workspaceId,
        execution.context.commandId,
        execution.context.occurredAt,
      );
      auditState.policyOutcome = execution.state.policyEvaluation ? toPolicyOutcome(execution.state.policyEvaluation) : null;
      execution.state.audit = auditState;

      auditRecorder.record(
        buildWorkspaceAuditEntry({
          command: execution.command,
          context: execution.context,
          state: execution.state,
          timestamp: execution.context.occurredAt,
          workspaceId: execution.context.workspaceId,
          commandId: execution.context.commandId,
          commandName: execution.command.type,
          executionResult: "started",
          policyEvaluation: execution.state.policyEvaluation,
          emittedEventIds: auditState.emittedEventIds,
          warnings: auditState.warnings,
          errors: auditState.errors,
        }),
      );
    },
    afterExecute: (execution: {
      command: TCommand;
      context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
      state: TState;
    }, outcome: TResult & { readonly success?: boolean; readonly error?: Error; readonly validation?: WorkspacePolicyEvaluationResult }) => {
      const auditState = execution.state.audit;
      if (!auditState) {
        return;
      }

      auditRecorder.record(
        buildWorkspaceAuditEntry({
          command: execution.command,
          context: execution.context,
          state: execution.state,
          timestamp: auditState.entryTimestamp,
          workspaceId: execution.context.workspaceId,
          commandId: execution.context.commandId,
          commandName: execution.command.type,
          executionResult: (outcome as { readonly success?: boolean }).success ? "completed" : "failed",
          policyEvaluation: execution.state.policyEvaluation,
          emittedEventIds: auditState.emittedEventIds,
          warnings: auditState.warnings,
          errors: auditState.errors,
        }),
      );
    },
    onError: (execution: {
      command: TCommand;
      context: TContext & { readonly workspaceId: string; readonly commandId: string; readonly occurredAt: string };
      state: TState;
    }, error: Error) => {
      const auditState = execution.state.audit;
      if (!auditState) {
        return;
      }

      auditState.errors = [...auditState.errors, error.message];
      auditRecorder.record(
        buildWorkspaceAuditEntry({
          command: execution.command,
          context: execution.context,
          state: execution.state,
          timestamp: auditState.entryTimestamp,
          workspaceId: execution.context.workspaceId,
          commandId: execution.context.commandId,
          commandName: execution.command.type,
          executionResult: "failed",
          policyEvaluation: execution.state.policyEvaluation,
          emittedEventIds: auditState.emittedEventIds,
          warnings: auditState.warnings,
          errors: auditState.errors,
        }),
      );
    },
  };
}
