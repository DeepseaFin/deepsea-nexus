import {
  buildWorkspaceAuditEntry,
  getWorkspaceAuditRecorder,
  type WorkspaceAuditMiddlewareState,
} from "@/lib/workspaces/workspace-audit-engine";
import {
  getWorkspaceChangeRecorder,
  createWorkspaceChangeMiddleware,
  type WorkspaceChangeMiddlewareState,
} from "@/lib/workspaces/workspace-change-engine";
import {
  createWorkspaceSnapshotMiddleware,
  getWorkspaceSnapshotEngine,
} from "@/lib/workspaces/workspace-snapshot-engine";
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
  type WorkspaceCommandPipelineState as BaseWorkspaceCommandPipelineState,
  WorkspacePolicyDeniedError,
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

interface WorkspaceCommandPipelineState extends BaseWorkspaceCommandPipelineState {
  validation?: WorkspaceValidationResult;
  audit?: WorkspaceAuditMiddlewareState;
  change?: WorkspaceChangeMiddlewareState;
}

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

function createEventId(workspaceId: string, commandId: string, label: string, index: number): string {
  return `${workspaceId}:${commandId}:${label}:${index}`;
}

function createAuditOutcomeResult(
  execution: {
    command: WorkspaceCommand;
    context: WorkspaceCommandContext;
    state: WorkspaceCommandPipelineState;
  },
  outcome: WorkspaceCommandResult,
): WorkspaceCommandResult {
  return {
    ...outcome,
    validation: execution.state.validation ?? outcome.validation,
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
  const auditRecorder = getWorkspaceAuditRecorder();
  const changeRecorder = getWorkspaceChangeRecorder();
  const snapshotEngine = getWorkspaceSnapshotEngine();

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

  const validationMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.validation",
    phase: "pre-policy",
    beforeExecute: (execution) => {
      const validation = validateCommand(execution.command, execution.context);
      execution.state.validation = validation;

      if (!validation.valid) {
        auditRecorder.record(
          buildWorkspaceAuditEntry({
            command: execution.command,
            context: execution.context,
            state: execution.state,
            timestamp: execution.context.occurredAt,
            workspaceId: execution.context.workspaceId,
            commandId: execution.context.commandId,
            commandName: execution.command.type,
            executionResult: "invalid",
            policyEvaluation: execution.state.policyEvaluation,
            emittedEventIds: [],
            warnings: [],
            errors: validation.issues.map((issue) => issue.message),
          }),
        );

        execution.shortCircuit(toFailureOutcome(execution.command, execution.context, validation));
      }
    },
  };

  const auditStartMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.audit-start",
    phase: "pre-handler",
    beforeExecute: (execution) => {
      const timestamp = execution.context.occurredAt;
      execution.state.audit = {
        entryId: `${execution.context.workspaceId}:${execution.context.commandId}:${timestamp}`,
        entryTimestamp: timestamp,
        warnings: [...(execution.state.policyEvaluation?.warnings ?? [])],
        errors: [],
        emittedEventIds: [],
        policyOutcome: execution.state.policyEvaluation
          ? {
              allowed: execution.state.policyEvaluation.allowed,
              policyIds: [...execution.state.policyEvaluation.policyIds],
              warnings: [...execution.state.policyEvaluation.warnings],
              advisoryMessages: [...execution.state.policyEvaluation.advisoryMessages],
            }
          : null,
      };

      auditRecorder.record(
        buildWorkspaceAuditEntry({
          command: execution.command,
          context: execution.context,
          state: execution.state,
          timestamp,
          workspaceId: execution.context.workspaceId,
          commandId: execution.context.commandId,
          commandName: execution.command.type,
          executionResult: "started",
          policyEvaluation: execution.state.policyEvaluation,
          emittedEventIds: execution.state.audit.emittedEventIds,
          warnings: execution.state.audit.warnings,
          errors: execution.state.audit.errors,
        }),
      );
    },
  };

  const changeMiddleware = createWorkspaceChangeMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  >({
    recorder: changeRecorder,
    id: "workspace.command.middleware.change-tracking",
  });

  const snapshotMiddleware = createWorkspaceSnapshotMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  >({
    snapshotEngine,
    id: "workspace.command.middleware.snapshot-capture",
  });

  const auditCompletionMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.audit-completion",
    phase: "post-handler",
    afterExecute: (execution, outcome) => {
      if (!execution.state.audit) {
        return;
      }

      const finalOutcome = createAuditOutcomeResult(execution, outcome);
      auditRecorder.record(
        buildWorkspaceAuditEntry({
          command: execution.command,
          context: execution.context,
          state: execution.state,
          timestamp: execution.state.audit.entryTimestamp,
          workspaceId: execution.context.workspaceId,
          commandId: execution.context.commandId,
          commandName: execution.command.type,
          executionResult: finalOutcome.success ? "completed" : "failed",
          policyEvaluation: execution.state.policyEvaluation,
          emittedEventIds: execution.state.audit.emittedEventIds,
          warnings: execution.state.audit.warnings,
          errors: execution.state.audit.errors,
        }),
      );
    },
  };

  const eventPublicationMiddleware: WorkspaceCommandMiddleware<
    WorkspaceCommand,
    WorkspaceCommandContext,
    WorkspaceCommandResult,
    WorkspaceCommandPipelineState
  > = {
    id: "workspace.command.middleware.event-publication",
    phase: "post-handler",
    afterExecute: (execution, outcome) => {
      const emittedEventIds: string[] = [];
      const auditState = execution.state.audit;
      const publishEvent = <TType extends keyof typeof WORKSPACE_EVENT_TYPES>(
        eventType: (typeof WORKSPACE_EVENT_TYPES)[TType],
        payload: unknown,
        index: number,
      ): void => {
        const eventId = createEventId(execution.context.workspaceId, execution.context.commandId, eventType, index);
        emittedEventIds.push(eventId);
        execution.context.eventBus.publish({
          eventId,
          type: eventType as never,
          workspaceId: execution.context.workspaceId,
          occurredAt: execution.context.occurredAt,
          payload: payload as never,
        });
      };

      publishEvent(
        WORKSPACE_EVENT_TYPES.CommandBeforeExecute,
        {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
        },
        1,
      );

      if (!outcome.success) {
        publishEvent(
          WORKSPACE_EVENT_TYPES.CommandFailed,
          {
            commandType: execution.command.type,
            commandId: execution.context.commandId,
            errorMessage: outcome.error?.message ?? "Workspace command execution failed.",
          },
          2,
        );
      }

      publishEvent(
        WORKSPACE_EVENT_TYPES.CommandAfterExecute,
        {
          commandType: execution.command.type,
          commandId: execution.context.commandId,
          success: outcome.success,
        },
        outcome.success ? 2 : 3,
      );

      if (auditState) {
        auditState.emittedEventIds = [...auditState.emittedEventIds, ...emittedEventIds];
        auditRecorder.record(
          buildWorkspaceAuditEntry({
            command: execution.command,
            context: execution.context,
            state: execution.state,
            timestamp: auditState.entryTimestamp,
            workspaceId: execution.context.workspaceId,
            commandId: execution.context.commandId,
            commandName: execution.command.type,
            executionResult: outcome.success ? "completed" : "failed",
            policyEvaluation: execution.state.policyEvaluation,
            emittedEventIds: auditState.emittedEventIds,
            warnings: auditState.warnings,
            errors: auditState.errors,
          }),
        );
      }
    },
  };

  pipeline.registerMiddleware(validationMiddleware);
  pipeline.registerMiddleware(auditStartMiddleware);
  pipeline.registerMiddleware(changeMiddleware);
  pipeline.registerMiddleware(snapshotMiddleware);
  pipeline.registerMiddleware(auditCompletionMiddleware);
  pipeline.registerMiddleware(eventPublicationMiddleware);

  const execute: WorkspaceCommandEngine["execute"] = (command) => {
    const context = createDefaultContext(command, state);

    try {
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
    } catch (error) {
      if (error instanceof WorkspacePolicyDeniedError) {
        auditRecorder.record(
          buildWorkspaceAuditEntry({
            command,
            context,
            state: { policyEvaluation: error.policyEvaluation } as WorkspaceCommandPipelineState,
            timestamp: context.occurredAt,
            workspaceId: context.workspaceId,
            commandId: context.commandId,
            commandName: command.type,
            executionResult: "denied",
            policyEvaluation: error.policyEvaluation,
            emittedEventIds: [],
            warnings: [...error.policyEvaluation.warnings],
            errors: error.policyEvaluation.validation.issues.map((issue) => issue.message),
          }),
        );

        return toFailureOutcome(command, context, error.policyEvaluation.validation, error);
      }

      throw error;
    }
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
      phase: "pre-handler",
      beforeExecute: (execution) => {
        hook(execution.command, execution.context);
      },
    });
  };

  const afterExecute: WorkspaceCommandEngine["afterExecute"] = (hook) => {
    const middlewareId = `workspace.command.middleware.after-hook.${middlewareCounter++}`;
    return pipeline.registerMiddleware({
      id: middlewareId,
      phase: "pre-handler",
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
