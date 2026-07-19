// Platform contract: application services orchestrate use-case execution.
export interface ApplicationService<TInput, TResult> {
  execute(input: TInput): Promise<TResult>;
}
