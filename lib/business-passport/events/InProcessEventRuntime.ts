import type { EventEnvelope } from "@/lib/business-passport/events/EventEnvelope";
import {
  createInProcessEventRuntime as createPlatformInProcessEventRuntime,
  type InProcessEventRuntime as PlatformInProcessEventRuntime,
} from "@/lib/platform/events/InProcessEventRuntime";

export type InProcessEventHandler<TType extends string = string> = (
  event: EventEnvelope<TType, unknown>,
) => Promise<void> | void;

export interface InProcessEventRuntime<TType extends string = string> {
  registerHandler(eventType: TType, handler: InProcessEventHandler<TType>): () => void;
  publish(event: EventEnvelope<TType, unknown>): Promise<void>;
  clearHandlers(eventType?: TType): void;
  handlerCount(eventType?: TType): number;
}

export interface InProcessEventRuntimePublisher<TType extends string = string> {
  publish(event: EventEnvelope<TType, unknown>): Promise<void>;
}

export class DefaultInProcessEventRuntime<TType extends string = string>
  implements InProcessEventRuntime<TType>, InProcessEventRuntimePublisher<TType> {
  private readonly runtime: PlatformInProcessEventRuntime<TType>;

  constructor(runtime?: PlatformInProcessEventRuntime<TType>) {
    this.runtime = runtime ?? createPlatformInProcessEventRuntime<TType>();
  }

  registerHandler(eventType: TType, handler: InProcessEventHandler<TType>): () => void {
    return this.runtime.registerHandler(eventType, (event) => handler(event as EventEnvelope<TType, unknown>));
  }

  async publish(event: EventEnvelope<TType, unknown>): Promise<void> {
    await this.runtime.publish(event);
  }

  clearHandlers(eventType?: TType): void {
    this.runtime.clearHandlers(eventType);
  }

  handlerCount(eventType?: TType): number {
    return this.runtime.handlerCount(eventType);
  }
}

export function createInProcessEventRuntime<TType extends string = string>(): InProcessEventRuntime<TType> {
  const runtime = createPlatformInProcessEventRuntime<TType>();
  return new DefaultInProcessEventRuntime<TType>(runtime);
}

export function createInProcessEventRuntimePublisher<TType extends string = string>(
  runtime: InProcessEventRuntime<TType>,
): InProcessEventRuntimePublisher<TType> {
  return {
    publish(event: EventEnvelope<TType, unknown>): Promise<void> {
      return runtime.publish(event);
    },
  };
}
