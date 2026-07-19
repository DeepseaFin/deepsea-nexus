export type PlatformEventHandler<TEvent> = (event: TEvent) => Promise<void> | void;

export interface PlatformEventRuntime<TEventType extends string, TEvent> {
  registerHandler(eventType: TEventType, handler: PlatformEventHandler<TEvent>): () => void;
}

export interface PlatformProjectionExecutor<TProjectionContext> {
  project(context: TProjectionContext): Promise<void>;
}

export interface PlatformRepository<TAggregate, TId> {
  findById(id: TId): Promise<TAggregate | null>;
}

export interface PlatformApplicationOperation<TInput, TAggregate, TId> {
  execute(input: TInput): Promise<TAggregate>;
  get(id: TId): Promise<TAggregate | null>;
}

export interface PlatformEventToProjectionBinding<
  TEventType extends string,
  TEvent,
  TProjectionContext,
> {
  readonly supportedEventTypes: readonly TEventType[];
  toProjectionContext(event: TEvent): TProjectionContext | null;
}

export interface InProcessIntegrationPipelineDependencies<
  TInput,
  TAggregate,
  TId,
  TEventType extends string,
  TEvent,
  TProjectionContext,
> {
  readonly operation: PlatformApplicationOperation<TInput, TAggregate, TId>;
  readonly repository: PlatformRepository<TAggregate, TId>;
  readonly eventRuntime: PlatformEventRuntime<TEventType, TEvent>;
  readonly projectionExecutor: PlatformProjectionExecutor<TProjectionContext>;
  readonly eventToProjection: PlatformEventToProjectionBinding<TEventType, TEvent, TProjectionContext>;
}

export interface InProcessIntegrationPipeline<
  TInput,
  TAggregate,
  TId,
  TEventType extends string,
  TEvent,
  TProjectionContext,
> {
  readonly operation: PlatformApplicationOperation<TInput, TAggregate, TId>;
  readonly repository: PlatformRepository<TAggregate, TId>;
  readonly eventRuntime: PlatformEventRuntime<TEventType, TEvent>;
  readonly projectionExecutor: PlatformProjectionExecutor<TProjectionContext>;
  execute(input: TInput): Promise<TAggregate>;
  get(id: TId): Promise<TAggregate | null>;
}

export function createInProcessIntegrationPipeline<
  TInput,
  TAggregate,
  TId,
  TEventType extends string,
  TEvent,
  TProjectionContext,
>(
  dependencies: InProcessIntegrationPipelineDependencies<
    TInput,
    TAggregate,
    TId,
    TEventType,
    TEvent,
    TProjectionContext
  >,
): InProcessIntegrationPipeline<TInput, TAggregate, TId, TEventType, TEvent, TProjectionContext> {
  for (const eventType of dependencies.eventToProjection.supportedEventTypes) {
    dependencies.eventRuntime.registerHandler(eventType, async (event) => {
      const context = dependencies.eventToProjection.toProjectionContext(event);
      if (!context) {
        return;
      }

      // Reusable platform orchestration capability: bridge events to projection
      // execution while keeping domain-specific logic outside runtime wiring.
      await dependencies.projectionExecutor.project(context);
    });
  }

  return {
    operation: dependencies.operation,
    repository: dependencies.repository,
    eventRuntime: dependencies.eventRuntime,
    projectionExecutor: dependencies.projectionExecutor,

    execute(input: TInput): Promise<TAggregate> {
      return dependencies.operation.execute(input);
    },

    get(id: TId): Promise<TAggregate | null> {
      return dependencies.repository.findById(id);
    },
  };
}
