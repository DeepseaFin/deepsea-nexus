export interface WorkspaceCommandExecutionContext<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
> {
  command: TCommand;
  readonly context: TContext;
  readonly state: TState;
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
  executePipeline: (input: {
    readonly command: TCommand;
    readonly context: TContext;
    readonly initialState?: TState;
    readonly execute: (execution: WorkspaceCommandExecutionContext<TCommand, TContext, TResult, TState>) => TResult;
  }) => TResult;
}

function normalizeError(error: unknown): Error {
  return error instanceof Error ? error : new Error("Workspace command pipeline execution failed.");
}

function createEmptyState<TState extends Record<string, unknown>>(): TState {
  return {} as TState;
}

export function createWorkspaceCommandPipeline<
  TCommand,
  TContext,
  TResult,
  TState extends Record<string, unknown> = Record<string, unknown>,
>(): WorkspaceCommandPipeline<TCommand, TContext, TResult, TState> {
  const middlewares: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>[] = [];

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

  const executePipeline: WorkspaceCommandPipeline<TCommand, TContext, TResult, TState>["executePipeline"] = (
    input,
  ) => {
    const state = input.initialState ?? createEmptyState<TState>();
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

    const beforeExecutedMiddlewares: WorkspaceCommandMiddleware<TCommand, TContext, TResult, TState>[] = [];

    const resolveFromError = (error: unknown): TResult | undefined => {
      const normalized = normalizeError(error);

      for (const middleware of beforeExecutedMiddlewares) {
        if (!middleware.onError) {
          continue;
        }

        const recovered = middleware.onError(execution, normalized);
        if (typeof recovered !== "undefined") {
          return recovered;
        }
      }

      return undefined;
    };

    let outcome: TResult | undefined;

    try {
      for (const middleware of middlewares) {
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
        outcome = input.execute(execution);
      }
    } catch (error) {
      outcome = resolveFromError(error);
      if (typeof outcome === "undefined") {
        throw normalizeError(error);
      }
    }

    try {
      for (const middleware of beforeExecutedMiddlewares) {
        middleware.afterExecute?.(execution, outcome);
      }
    } catch (error) {
      const recovered = resolveFromError(error);
      if (typeof recovered === "undefined") {
        throw normalizeError(error);
      }

      return recovered;
    }

    return outcome;
  };

  return {
    registerMiddleware,
    unregisterMiddleware,
    executePipeline,
  };
}
