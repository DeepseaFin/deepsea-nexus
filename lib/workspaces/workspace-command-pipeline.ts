import {
  createWorkspacePolicyRegistry,
  type WorkspacePolicy,
  type WorkspacePolicyEvaluationResult,
  type WorkspacePolicyRegistry,
} from "@/lib/workspaces/workspace-policy-engine";

export interface WorkspaceCommandExecutionContext<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  command: TCommand;
  context: TContext;
  state: TState & WorkspaceCommandPipelineState;
  readonly isShortCircuited: boolean;
  readonly shortCircuitResult: TResult | undefined;
  shortCircuit: (result: TResult) => void;
}

export interface WorkspaceCommandMiddleware<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  readonly id: string;
  readonly phase?: "pre-policy" | "pre-handler" | "post-handler";
  beforeExecute?: (execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState>) => void;
  afterExecute?: (
    execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState>,
    outcome: TResult,
  ) => void;
  onError?: (
    execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState>,
    error: Error,
  ) => TResult | void;
}

export interface WorkspaceCommandPipelineState {
  policyEvaluation?: WorkspacePolicyEvaluationResult;
}

export interface WorkspaceCommandPipeline<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  registerMiddleware: (
    middleware: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>,
  ) => () => void;
  unregisterMiddleware: (
    middlewareOrId: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState> | string,
  ) => void;
  registerPolicy: (
    policy: WorkspacePolicy<TCommand, TState>,
  ) => () => void;
  unregisterPolicy: (
    policyOrId: WorkspacePolicy<TCommand, TState> | string,
  ) => void;
  executePipeline: (input: {
    readonly command: TCommand;
    readonly context: TContext;
    readonly initialState?: TState;
    readonly execute: (execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState>) => TResult;
  }) => TResult;
}

export class WorkspacePolicyDeniedError extends Error {
  readonly policyEvaluation: WorkspacePolicyEvaluationResult;

  constructor(policyEvaluation: WorkspacePolicyEvaluationResult) {
    super("Workspace command execution denied by policy.");
    this.name = "WorkspacePolicyDeniedError";
    this.policyEvaluation = policyEvaluation;
  }
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Workspace command pipeline execution failed.");
}

function createEmptyState<TState extends Record<string, unknown>>(): TState {
  return {} as TState;
}

function isPrePolicyMiddleware<TCommand, TContext, TResult, TState extends Record<string, unknown>>(
  middleware: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>,
): boolean {
  return middleware.phase === "pre-policy" || middleware.id === "workspace.command.middleware.validation";
}

function isPreHandlerMiddleware<TCommand, TContext, TResult, TState extends Record<string, unknown>>(
  middleware: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>,
): boolean {
  return middleware.phase === "pre-handler";
}

function isPostHandlerMiddleware<TCommand, TContext, TResult, TState extends Record<string, unknown>>(
  middleware: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>,
): boolean {
  return middleware.phase === "post-handler";
}

export function createWorkspaceCommandPipeline<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
>(): WorkspaceCommandPipeline<TCommand, TContext, TResult, TState> {
  const middlewares: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>[] = [];
  const policyRegistry: WorkspacePolicyRegistry<TCommand, TState> = createWorkspacePolicyRegistry<TCommand, TState>();

  const registerMiddleware: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["registerMiddleware"] = (
    middleware,
  ) => {
    const existingIndex = middlewares.findIndex((registered) => registered.id === middleware.id);
    if (existingIndex >= 0) {
      middlewares[existingIndex] = middleware;
    } else {
      middlewares.push(middleware);
    }

    return () => {
      unregisterMiddleware(middleware.id);
    };
  };

  const unregisterMiddleware: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["unregisterMiddleware"] = (
    middlewareOrId,
  ) => {
    const middlewareId = typeof middlewareOrId === "string" ? middlewareOrId : middlewareOrId.id;
    const index = middlewares.findIndex((registered) => registered.id === middlewareId);
    if (index < 0) {
      return;
    }

    middlewares.splice(index, 1);
  };

  const registerPolicy: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["registerPolicy"] = (policy) => {
    return policyRegistry.registerPolicy(policy);
  };

  const unregisterPolicy: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["unregisterPolicy"] = (
    policyOrId,
  ) => {
    policyRegistry.unregisterPolicy(policyOrId);
  };

  const executePipeline: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["executePipeline"] = (
    input,
  ) => {
    const state = (input.initialState ?? createEmptyState<TState>()) as TState & WorkspaceCommandPipelineState;
    let isShortCircuited = false;
    let shortCircuitResult: TResult | undefined;

    const execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState> = {
      command: input.command,
      context: input.context,
      state,
      get isShortCircuited() {
        return isShortCircuited;
      },
      get shortCircuitResult() {
        return shortCircuitResult;
      },
      shortCircuit: (result) => {
        isShortCircuited = true;
        shortCircuitResult = result;
      },
    };

    const prePolicyMiddlewares = middlewares.filter(isPrePolicyMiddleware);
    const preHandlerMiddlewares = middlewares.filter(isPreHandlerMiddleware);
    const postHandlerMiddlewares = middlewares.filter(isPostHandlerMiddleware);
    const beforeExecutedMiddlewares: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>[] = [];

    const runOnError = (error: Error): TResult | undefined => {
      for (const middleware of [...beforeExecutedMiddlewares].reverse()) {
        if (!middleware.onError) {
          continue;
        }

        const recovered = middleware.onError(execution, error);
        if (typeof recovered !== "undefined") {
          return recovered;
        }
      }

      return undefined;
    };

    const executedPreHandlerMiddlewares: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>[] = [];
    let reachedHandlerStage = false;

    const runAfterMiddlewares = (outcome: TResult): void => {
      for (const middleware of executedPreHandlerMiddlewares) {
        middleware.afterExecute?.(execution, outcome);
      }

      if (!reachedHandlerStage) {
        return;
      }

      for (const middleware of postHandlerMiddlewares) {
        middleware.afterExecute?.(execution, outcome);
      }
    };

    let outcome: TResult | undefined;

    try {
      for (const middleware of prePolicyMiddlewares) {
        beforeExecutedMiddlewares.push(middleware);
        middleware.beforeExecute?.(execution);
        if (execution.isShortCircuited) {
          break;
        }
      }

      if (execution.isShortCircuited) {
        if (typeof execution.shortCircuitResult === "undefined") {
          throw new Error("Workspace command pipeline short-circuited without a result.");
        }
        outcome = execution.shortCircuitResult;
      } else {
        const policyEvaluation = policyRegistry.evaluate({
          command: input.command,
          context: input.context,
          state,
        });
        state.policyEvaluation = policyEvaluation;

        if (!policyEvaluation.allowed) {
          throw new WorkspacePolicyDeniedError(policyEvaluation);
        }

        for (const middleware of preHandlerMiddlewares) {
          beforeExecutedMiddlewares.push(middleware);
          executedPreHandlerMiddlewares.push(middleware);
          middleware.beforeExecute?.(execution);
          if (execution.isShortCircuited) {
            break;
          }
        }

        if (execution.isShortCircuited) {
          if (typeof execution.shortCircuitResult === "undefined") {
            throw new Error("Workspace command pipeline short-circuited without a result.");
          }
          outcome = execution.shortCircuitResult;
        } else {
          reachedHandlerStage = true;
          outcome = input.execute(execution);
        }
      }
    } catch (error) {
      const normalizedError = error instanceof Error ? error : normalizeError(error);
      if (error instanceof WorkspacePolicyDeniedError) {
        throw normalizedError;
      }

      const recovered = runOnError(normalizedError);
      if (typeof recovered === "undefined") {
        throw normalizedError;
      }

      outcome = recovered;
    }

    try {
      if (typeof outcome === "undefined") {
        throw new Error("Workspace command pipeline produced no outcome.");
      }

      runAfterMiddlewares(outcome);
    } catch (error) {
      const normalizedError = error instanceof Error ? error : normalizeError(error);
      const recovered = runOnError(normalizedError);
      if (typeof recovered === "undefined") {
        throw normalizedError;
      }

      return recovered;
    }

    return outcome;
  };

  return {
    registerMiddleware,
    unregisterMiddleware,
    registerPolicy,
    unregisterPolicy,
    executePipeline,
  };
}
