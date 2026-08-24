import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import type { ProjectionDefinition } from "@/lib/business-passport/projections/ProjectionDefinition";
import {
  createInProcessProjectionRuntime as createPlatformInProcessProjectionRuntime,
  type InProcessProjectionRuntime as PlatformInProcessProjectionRuntime,
  type RuntimeProjectionDefinition,
} from "@/lib/platform/projections/InProcessProjectionRuntime";

export interface ProjectionExecutionContext<TType extends string = string, TPayload = unknown> {
  readonly triggeringEvent: EventEnvelope<TType, TPayload>;
}

export type InProcessProjectionHandler<TContext extends ProjectionExecutionContext = ProjectionExecutionContext> = (
  context: TContext,
) => Promise<void> | void;

export interface InProcessProjectionRuntime<TContext extends ProjectionExecutionContext = ProjectionExecutionContext> {
  registerProjection(definition: ProjectionDefinition, handler: InProcessProjectionHandler<TContext>): () => void;
  project(context: TContext): Promise<void>;
  clearProjections(projectionName?: string): void;
  projectionCount(projectionName?: string): number;
}

export interface InProcessProjectionRuntimeExecutor<
  TContext extends ProjectionExecutionContext = ProjectionExecutionContext,
> {
  project(context: TContext): Promise<void>;
}

export class DefaultInProcessProjectionRuntime<TContext extends ProjectionExecutionContext = ProjectionExecutionContext>
  implements InProcessProjectionRuntime<TContext>, InProcessProjectionRuntimeExecutor<TContext> {
  private readonly runtime: PlatformInProcessProjectionRuntime<TContext>;

  constructor(runtime?: PlatformInProcessProjectionRuntime<TContext>) {
    this.runtime = runtime ?? createPlatformInProcessProjectionRuntime<TContext>();
  }

  private static toRuntimeDefinition(definition: ProjectionDefinition): RuntimeProjectionDefinition {
    return {
      projectionName: definition.projectionName,
      supportedEvents: definition.supportedEvents,
    };
  }

  registerProjection(definition: ProjectionDefinition, handler: InProcessProjectionHandler<TContext>): () => void {
    return this.runtime.registerProjection(
      DefaultInProcessProjectionRuntime.toRuntimeDefinition(definition),
      (context) => handler(context),
    );
  }

  async project(context: TContext): Promise<void> {
    await this.runtime.project(context);
  }

  clearProjections(projectionName?: string): void {
    this.runtime.clearProjections(projectionName);
  }

  projectionCount(projectionName?: string): number {
    return this.runtime.projectionCount(projectionName);
  }
}

export function createInProcessProjectionRuntime<
  TContext extends ProjectionExecutionContext = ProjectionExecutionContext,
>(): InProcessProjectionRuntime<TContext> {
  const runtime = createPlatformInProcessProjectionRuntime<TContext>();
  return new DefaultInProcessProjectionRuntime<TContext>(runtime);
}

export function createInProcessProjectionRuntimeExecutor<
  TContext extends ProjectionExecutionContext = ProjectionExecutionContext,
>(runtime: InProcessProjectionRuntime<TContext>): InProcessProjectionRuntimeExecutor<TContext> {
  return {
    project(context: TContext): Promise<void> {
      return runtime.project(context);
    },
  };
}
