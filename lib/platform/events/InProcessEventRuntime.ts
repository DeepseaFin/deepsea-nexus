export interface RuntimeEventEnvelope<TType extends string = string, TPayload = unknown> {
  readonly type: TType;
  readonly payload: TPayload;
}

export type InProcessEventHandler<TType extends string = string> = (
  event: RuntimeEventEnvelope<TType, unknown>,
) => Promise<void> | void;

export interface InProcessEventRuntime<TType extends string = string> {
  registerHandler(eventType: TType, handler: InProcessEventHandler<TType>): () => void;
  publish(event: RuntimeEventEnvelope<TType, unknown>): Promise<void>;
  clearHandlers(eventType?: TType): void;
  handlerCount(eventType?: TType): number;
}

export interface InProcessEventRuntimePublisher<TType extends string = string> {
  publish(event: RuntimeEventEnvelope<TType, unknown>): Promise<void>;
}

export class DefaultInProcessEventRuntime<TType extends string = string>
  implements InProcessEventRuntime<TType>, InProcessEventRuntimePublisher<TType> {
  private readonly handlersByType = new Map<TType, Set<InProcessEventHandler<TType>>>();

  registerHandler(eventType: TType, handler: InProcessEventHandler<TType>): () => void {
    const handlers = this.handlersByType.get(eventType) ?? new Set<InProcessEventHandler<TType>>();
    handlers.add(handler);
    this.handlersByType.set(eventType, handlers);

    return () => {
      const registered = this.handlersByType.get(eventType);
      if (!registered) {
        return;
      }

      registered.delete(handler);
      if (registered.size === 0) {
        this.handlersByType.delete(eventType);
      }
    };
  }

  async publish(event: RuntimeEventEnvelope<TType, unknown>): Promise<void> {
    const handlers = Array.from(this.handlersByType.get(event.type) ?? []);

    if (handlers.length === 0) {
      return;
    }

    // Reusable platform capability: fan out one event to all matching handlers,
    // preserve async behavior, and aggregate failures for a single throw path.
    const results = await Promise.allSettled(handlers.map((handler) => handler(event)));
    const failures = results
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => result.reason);

    if (failures.length === 0) {
      return;
    }

    const reasons = failures
      .map((reason, index) => `#${index + 1}: ${reason instanceof Error ? reason.message : String(reason)}`)
      .join("; ");

    throw new Error(`In-process event dispatch failed for ${event.type}. ${reasons}`);
  }

  clearHandlers(eventType?: TType): void {
    if (eventType) {
      this.handlersByType.delete(eventType);
      return;
    }

    this.handlersByType.clear();
  }

  handlerCount(eventType?: TType): number {
    if (eventType) {
      return this.handlersByType.get(eventType)?.size ?? 0;
    }

    let total = 0;
    for (const handlers of this.handlersByType.values()) {
      total += handlers.size;
    }

    return total;
  }
}

export function createInProcessEventRuntime<TType extends string = string>(): InProcessEventRuntime<TType> {
  return new DefaultInProcessEventRuntime<TType>();
}

export function createInProcessEventRuntimePublisher<TType extends string = string>(
  runtime: InProcessEventRuntime<TType>,
): InProcessEventRuntimePublisher<TType> {
  return {
    publish(event: RuntimeEventEnvelope<TType, unknown>): Promise<void> {
      return runtime.publish(event);
    },
  };
}
