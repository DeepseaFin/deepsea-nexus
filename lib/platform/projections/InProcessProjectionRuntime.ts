import type { RuntimeEventEnvelope } from "@/lib/platform/events/InProcessEventRuntime";

export interface RuntimeProjectionDefinition {
  readonly projectionName: string;
  readonly supportedEvents: readonly string[];
}

export interface ProjectionExecutionContext<TType extends string = string, TPayload = unknown> {
  readonly triggeringEvent: RuntimeEventEnvelope<TType, TPayload>;
}

export type InProcessProjectionHandler<TContext extends ProjectionExecutionContext = ProjectionExecutionContext> = (
  context: TContext,
) => Promise<void> | void;

export interface InProcessProjectionRuntime<TContext extends ProjectionExecutionContext = ProjectionExecutionContext> {
  registerProjection(definition: RuntimeProjectionDefinition, handler: InProcessProjectionHandler<TContext>): () => void;
  project(context: TContext): Promise<void>;
  clearProjections(projectionName?: string): void;
  projectionCount(projectionName?: string): number;
}

export interface InProcessProjectionRuntimeExecutor<
  TContext extends ProjectionExecutionContext = ProjectionExecutionContext,
> {
  project(context: TContext): Promise<void>;
}

interface RegisteredProjection<TContext extends ProjectionExecutionContext> {
  readonly definition: RuntimeProjectionDefinition;
  readonly handler: InProcessProjectionHandler<TContext>;
}

export class DefaultInProcessProjectionRuntime<TContext extends ProjectionExecutionContext = ProjectionExecutionContext>
  implements InProcessProjectionRuntime<TContext>, InProcessProjectionRuntimeExecutor<TContext> {
  private readonly projectionsByName = new Map<string, RegisteredProjection<TContext>>();

  registerProjection(definition: RuntimeProjectionDefinition, handler: InProcessProjectionHandler<TContext>): () => void {
    this.projectionsByName.set(definition.projectionName, {
      definition,
      handler,
    });

    return () => {
      const registered = this.projectionsByName.get(definition.projectionName);
      if (!registered || registered.handler !== handler) {
        return;
      }

      this.projectionsByName.delete(definition.projectionName);
    };
  }

  async project(context: TContext): Promise<void> {
    const eventType = context.triggeringEvent.type;
    const matchingProjections = Array.from(this.projectionsByName.values()).filter((projection) =>
      projection.definition.supportedEvents.includes(eventType),
    );

    if (matchingProjections.length === 0) {
      return;
    }

    // Reusable platform capability: execute matching projections independently,
    // complete all executions, then aggregate failures into one error.
    const results = await Promise.allSettled(matchingProjections.map((projection) => projection.handler(context)));
    const failures = results.reduce<Array<{ projectionName: string; reason: unknown }>>((accumulator, result, index) => {
      if (result.status !== "rejected") {
        return accumulator;
      }

      const projectionName = matchingProjections[index]?.definition.projectionName ?? "unknown-projection";
      accumulator.push({ projectionName, reason: result.reason });
      return accumulator;
    }, []);

    if (failures.length === 0) {
      return;
    }

    const reasons = failures
      .map(({ projectionName, reason }, index) => {
        const message = reason instanceof Error ? reason.message : String(reason);
        return `#${index + 1} [${projectionName}]: ${message}`;
      })
      .join("; ");

    throw new Error(`In-process projection execution failed for event ${eventType}. ${reasons}`);
  }

  clearProjections(projectionName?: string): void {
    if (projectionName) {
      this.projectionsByName.delete(projectionName);
      return;
    }

    this.projectionsByName.clear();
  }

  projectionCount(projectionName?: string): number {
    if (projectionName) {
      return this.projectionsByName.has(projectionName) ? 1 : 0;
    }

    return this.projectionsByName.size;
  }
}

export function createInProcessProjectionRuntime<
  TContext extends ProjectionExecutionContext = ProjectionExecutionContext,
>(): InProcessProjectionRuntime<TContext> {
  return new DefaultInProcessProjectionRuntime<TContext>();
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
