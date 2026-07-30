import {
  getWorkspaceEventBus,
  nowWorkspaceEventTimestamp,
  resolveWorkspaceId,
  WORKSPACE_EVENT_TYPES,
  type WorkspaceEventBus,
} from "@/lib/workspaces/workspace-event-bus";
import {
  createWorkspaceCommandPipeline,
  type WorkspaceCommandMiddleware,
  type WorkspaceCommandPipeline,
} from "@/lib/workspaces/workspace-command-pipeline";
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
  registerMiddleware(
    middleware: WorkspaceCommandMiddleware<
      WorkspaceCommand,
      WorkspaceCommandContext,
      WorkspaceCommandResult,
      WorkspaceCommandPipelineState
    >,
  ): () => void;
  unregisterMiddleware(
    middlewareOrId:
      | WorkspaceCommandMiddleware<
          WorkspaceCommand,
          WorkspaceCommandContext,
          WorkspaceCommandResult,
          WorkspaceCommandPipelineState
        >
      | string,
  ): void;
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

function validResult(): WorkspaceValidationResult {
  return { valid: true, issues: [] };
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

interface WorkspaceCommandPipelineState extends Record<string, unknown> {
  validation?: WorkspaceValidationResult;
}

function toFailureOutcome(
  command: WorkspaceCommand,
  context: WorkspaceCommandContext,
  validation: WorkspaceValidationResult,
  error?: Error,
): WorkspaceCommandResult {
  return {
    commandType: command.type,
    commandId: context.commandId,
    workspaceId: context.workspaceId,
    occurredAt: context.occurredAt,
    validation,
    success: false,
    error,
  };
}

function toSuccessOutcome<TResult>(
  command: WorkspaceCommand,
  context: WorkspaceCommandContext,
  validation: WorkspaceValidationResult,
  result: TResult,
): WorkspaceCommandResult<TResult> {
  return {
    commandType: command.type,
    commandId: context.commandId,
    workspaceId: context.workspaceId,
    occurredAt: context.occurredAt,
    validation,
    success: true,
    result,
  };
}

export function createWorkspaceCommandEngine(options?: CreateWorkspaceCommandEngineOptions): WorkspaceCommandEngine {
  const handlers = new Map<string, WorkspaceCommandHandler>();
  const validators = new Map<string, Set<WorkspaceCommandValidator>>();
  const pipeline: WorkspaceCommandPipeline<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = createWorkspaceCommandPipeline();
  let middlewareCounter = 0;

  const state: WorkspaceCommandEngineState = {
    eventBus: options?.eventBus ?? getWorkspaceEventBus(),
  };

  const validateCommand = (command: WorkspaceCommand, context: WorkspaceCommandContext): WorkspaceValidationResult => {
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

  const validate: WorkspaceCommandEngine["validate"] = (command) => {
    const context = createDefaultContext(command, state);
    return validateCommand(command, context);
  };

  const validationMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.validation",
    beforeExecute: (execution) => {
      const validation = validateCommand(execution.command, execution.context);
      execution.state.validation = validation;

      if (!validation.valid) {
        execution.shortCircuit(toFailureOutcome(execution.command, execution.context, validation));
      }
    },
  };

  const eventPublicationMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.event-publication",
    beforeExecute: (execution) => {
      execution.context.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandBeforeExecute,
        workspaceId: execution.context.workspaceId,
        occurredAt: execution.context.occurredAt,
        payload: {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
        },
      });
    },
    afterExecute: (execution, outcome) => {
      execution.context.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandAfterExecute,
        workspaceId: execution.context.workspaceId,
        occurredAt: execution.context.occurredAt,
        payload: {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
          success: outcome.success,
        },
      });
    },
    onError: (execution, error) => {
      const validation = execution.state.validation ?? validResult();

      execution.context.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandFailed,
        workspaceId: execution.context.workspaceId,
        occurredAt: execution.context.occurredAt,
        payload: {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
          errorMessage: error.message,
        },
      });

      execution.context.eventBus.publish({
        type: WORKSPACE_EVENT_TYPES.CommandAfterExecute,
        workspaceId: execution.context.workspaceId,
        occurredAt: execution.context.occurredAt,
        payload: {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
          success: false,
        },
      });

      return toFailureOutcome(execution.command, execution.context, validation, error);
    },
  };

  pipeline.registerMiddleware(validationMiddleware);
  pipeline.registerMiddleware(eventPublicationMiddleware);

  const execute: WorkspaceCommandEngine["execute"] = (command) => {
    const context = createDefaultContext(command, state);

    const outcome = pipeline.executePipeline({
      command,
      context,
      initialState: {},
      execute: (execution): WorkspaceCommandResult => {
        const handler = handlers.get(execution.command.type);
        const validation = execution.state.validation ?? validateCommand(execution.command, execution.context);

        if (!handler) {
          return toFailureOutcome(execution.command, execution.context, validation);
        }

        const result = handler(execution.command, execution.context);
        return toSuccessOutcome(execution.command, execution.context, validation, result);
      },
    });

    return outcome as WorkspaceCommandResult<TResult>;
  };

  const registerHandler: WorkspaceCommandEngine["registerHandler"] = (commandType, handler) => {
    handlers.set(commandType, handler as WorkspaceCommandHandler);

    return () => {
      handlers.delete(commandType);
    };
  };

  const registerMiddleware: WorkspaceCommandEngine["registerMiddleware"] = (middleware) => {
    return pipeline.registerMiddleware(middleware);
  };

  const unregisterMiddleware: WorkspaceCommandEngine["unregisterMiddleware"] = (middlewareOrId) => {
    pipeline.unregisterMiddleware(middlewareOrId);
  };

  const beforeExecute: WorkspaceCommandEngine["beforeExecute"] = (hook) => {
    const middlewareId = `workspace.command.middleware.before-hook.${middlewareCounter++}`;
    return pipeline.registerMiddleware({
      id: middlewareId,
      beforeExecute: (execution) => {
        hook(execution.command, execution.context);
      },
    });
  };

  const afterExecute: WorkspaceCommandEngine["afterExecute"] = (hook) => {
    const middlewareId = `workspace.command.middleware.after-hook.${middlewareCounter++}`;
    return pipeline.registerMiddleware({
      id: middlewareId,
      afterExecute: (execution, outcome) => {
        hook(execution.command, outcome, execution.context);
      },
    });
  };

  return {
    execute,
    registerHandler,
    registerMiddleware,
    unregisterMiddleware,
    validate,
    beforeExecute,
    afterExecute,
  };
}
