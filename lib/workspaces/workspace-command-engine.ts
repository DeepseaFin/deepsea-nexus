import {
  getWorkspaceEventBus,
  nowWorkspaceEventTimestamp,
  resolveWorkspaceId,
  WORKSPACE_EVENT_TYPES,
  type WorkspaceEventBus,
} from "@/lib/workspaces/workspace-event-bus";
import type {
  WorkspaceAttributes,
  WorkspaceValidationIssue,
  WorkspaceValidationResult,
} from "@/lib/workspaces/types";

export interface WorkspaceCommand<TPayload = unknown, TMetadata extends WorkspaceAttributes = WorkspaceAttributes> {
  readonly type: string;
  readonly workspaceId?: string;
  readonly commandId?: string;
  readonly payload: TPayload;
  readonly metadata?: TMetadata;
  readonly requestedAt?: string;
}

export interface WorkspaceCommandContext {
  readonly workspaceId: string;
  readonly commandId: string;
  readonly occurredAt: string;
  readonly eventBus: WorkspaceEventBus;
}

export interface WorkspaceCommandResult<TResult = unknown> {
  readonly commandType: string;
  readonly commandId: string;
  readonly workspaceId: string;
  readonly occurredAt: string;
  readonly validation: WorkspaceValidationResult;
  readonly success: boolean;
  readonly result?: TResult;
  readonly error?: Error;
}

export type WorkspaceCommandHandler<
  TCommand extends WorkspaceCommand = WorkspaceCommand,
  TResult = unknown,
> = (command: TCommand, context: WorkspaceCommandContext) => TResult;

export type WorkspaceCommandValidator<TCommand extends WorkspaceCommand = WorkspaceCommand> = (
  command: TCommand,
  context: WorkspaceCommandContext,
) => WorkspaceValidationResult;

export type WorkspaceCommandBeforeExecuteHook = (
  command: WorkspaceCommand,
  context: WorkspaceCommandContext,
) => void;

export type WorkspaceCommandAfterExecuteHook = (
  command: WorkspaceCommand,
  outcome: WorkspaceCommandResult,
  context: WorkspaceCommandContext,
) => void;

interface WorkspaceCommandEngineState {
  readonly eventBus: WorkspaceEventBus;
}

export interface WorkspaceCommandEngine {
  execute<TCommand extends WorkspaceCommand, TResult = unknown>(command: TCommand): WorkspaceCommandResult<TResult>;
  registerHandler<TCommand extends WorkspaceCommand, TResult = unknown>(
    commandType: TCommand["type"],
    handler: WorkspaceCommandHandler<TCommand, TResult>,
  ): () => void;
  validate<TCommand extends WorkspaceCommand>(command: TCommand): WorkspaceValidationResult;
  beforeExecute(hook: WorkspaceCommandBeforeExecuteHook): () => void;
  afterExecute(hook: WorkspaceCommandAfterExecuteHook): () => void;
}

export interface CreateWorkspaceCommandEngineOptions {
  readonly eventBus?: WorkspaceEventBus;
}

function invalidResult(issue: WorkspaceValidationIssue): WorkspaceValidationResult {
  return { valid: false, issues: [issue] };
}

function mergeValidationResults(results: readonly WorkspaceValidationResult[]): WorkspaceValidationResult {
  const issues = results.flatMap((result) => result.issues);
  return {
    valid: issues.length === 0,
    issues,
  };
}

function createDefaultContext(
  command: WorkspaceCommand,
  state: WorkspaceCommandEngineState,
): WorkspaceCommandContext {
  const occurredAt = command.requestedAt ?? nowWorkspaceEventTimestamp();
  const workspaceId = resolveWorkspaceId(command.workspaceId, "workspace");
  const commandId = command.commandId?.trim() || `${command.type}:${occurredAt}`;

  return {
    workspaceId,
    commandId,
    occurredAt,
    eventBus: state.eventBus,
  };
}

export function createWorkspaceCommandEngine(options?: CreateWorkspaceCommandEngineOptions): WorkspaceCommandEngine {
  const handlers = new Map<string, WorkspaceCommandHandler>();
  const validators = new Map<string, Set<WorkspaceCommandValidator>>();
  const beforeHooks = new Set<WorkspaceCommandBeforeExecuteHook>();
  const afterHooks = new Set<WorkspaceCommandAfterExecuteHook>();

  const state: WorkspaceCommandEngineState = {
    eventBus: options?.eventBus ?? getWorkspaceEventBus(),
  };

  const validate: WorkspaceCommandEngine["validate"] = (command) => {
    const context = createDefaultContext(command, state);

    const defaultChecks: WorkspaceValidationResult[] = [];
    if (!command.type || command.type.trim().length === 0) {
      defaultChecks.push(invalidResult({
        code: "workspace_command_type_required",
        message: "Workspace command type is required.",
        target: "type",
      }));
    }

    const handlerExists = handlers.has(command.type);
    if (!handlerExists) {
      defaultChecks.push(invalidResult({
        code: "workspace_command_handler_missing",
        message: `No workspace command handler is registered for ${command.type}.`,
        target: "type",
      }));
    }

    const commandValidators = validators.get(command.type);
    const customChecks = commandValidators
      ? Array.from(commandValidators).map((validator) => validator(command, context))
      : [];

    const validation = mergeValidationResults([...defaultChecks, ...customChecks]);

    state.eventBus.publish({
      type: WORKSPACE_EVENT_TYPES.CommandValidated,
      workspaceId: context.workspaceId,
      occurredAt: context.occurredAt,
      payload: {
        commandType: command.type,
        valid: validation.valid,
        issueCodes: validation.issues.map((issue) => issue.code),
      },
    });

    return validation;
  };

  const execute: WorkspaceCommandEngine["execute"] = (command) => {
    const context = createDefaultContext(command, state);
    const validation = validate(command);

    if (!validation.valid) {
      return {
        commandType: command.type,
        commandId: context.commandId,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        validation,
        success: false,
      };
    }

    const handler = handlers.get(command.type);
    if (!handler) {
      const fallbackValidation = invalidResult({
        code: "workspace_command_handler_missing",
        message: `No workspace command handler is registered for ${command.type}.`,
        target: "type",
      });

      return {
        commandType: command.type,
        commandId: context.commandId,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        validation: fallbackValidation,
        success: false,
      };
    }

    state.eventBus.publish({
      type: WORKSPACE_EVENT_TYPES.CommandBeforeExecute,
      workspaceId: context.workspaceId,
      occurredAt: context.occurredAt,
      payload: {
        commandType: command.type,
        commandId: context.commandId,
      },
    });

    for (const hook of beforeHooks) {
      hook(command, context);
    }

    try {
      const result = handler(command, context) as unknown;

      const outcome: WorkspaceCommandResult = {
        commandType: command.type,
        commandId: context.commandId,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        validation,
        success: true,
        result,
      };

      state.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandAfterExecute,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        payload: {
          commandType: command.type,
          commandId: context.commandId,
          success: true,
        },
      });

      for (const hook of afterHooks) {
        hook(command, outcome, context);
      }

      return outcome;
    } catch (error) {
      const normalizedError = error instanceof Error ? error : new Error("Workspace command execution failed.");
      const outcome: WorkspaceCommandResult = {
        commandType: command.type,
        commandId: context.commandId,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        validation,
        success: false,
        error: normalizedError,
      };

      state.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandFailed,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        payload: {
          commandType: command.type,
          commandId: context.commandId,
          errorMessage: normalizedError.message,
        },
      });

      state.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandAfterExecute,
        workspaceId: context.workspaceId,
        occurredAt: context.occurredAt,
        payload: {
          commandType: command.type,
          commandId: context.commandId,
          success: false,
        },
      });

      for (const hook of afterHooks) {
        hook(command, outcome, context);
      }

      return outcome;
    }
  };

  const registerHandler: WorkspaceCommandEngine["registerHandler"] = (commandType, handler) => {
    handlers.set(commandType, handler as WorkspaceCommandHandler);

    return () => {
      handlers.delete(commandType);
    };
  };

  const beforeExecute: WorkspaceCommandEngine["beforeExecute"] = (hook) => {
    beforeHooks.add(hook);
    return () => {
      beforeHooks.delete(hook);
    };
  };

  const afterExecute: WorkspaceCommandEngine["afterExecute"] = (hook) => {
    afterHooks.add(hook);
    return () => {
      afterHooks.delete(hook);
    };
  };

  return {
    execute,
    registerHandler,
    validate,
    beforeExecute,
    afterExecute,
  };
}
