import type {
  DocumentIntelligenceOrchestratorRuntimeDependencies,
  DocumentIntelligenceStageName,
  ProcessingContext,
  ProcessingError,
  ProcessingOutcome,
  ProcessingStage,
  ProcessingStageContribution,
  ProcessingStageMetrics,
  ProcessingWarning,
} from "@/lib/documents/documentIntelligenceOrchestrator";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";

export interface StageExecutionMetric {
  readonly stage: DocumentIntelligenceStageName;
  readonly status: "skipped" | "executed" | "failed-recovered";
  readonly durationMs: number;
}

export interface ProcessingStageExecutionReport {
  readonly stageMetrics: readonly StageExecutionMetric[];
  readonly aggregatedMetrics: Partial<Record<DocumentIntelligenceStageName, ProcessingStageMetrics>>;
}

export interface ProcessingStageExecutionInput {
  readonly initialContext: ProcessingContext;
  readonly stages: readonly ProcessingStage[];
  readonly runtimeDependencies: DocumentIntelligenceOrchestratorRuntimeDependencies;
}

export interface ProcessingStageExecutionResult {
  readonly outcome: ProcessingOutcome;
  readonly report: ProcessingStageExecutionReport;
}

export interface ProcessingStageExecutor {
  execute(input: ProcessingStageExecutionInput): Promise<ProcessingStageExecutionResult>;
}

function mergeKnowledgeCollection(base: KnowledgeCollection, incoming: KnowledgeCollection): KnowledgeCollection {
  return {
    facts: [...base.facts, ...incoming.facts],
  };
}

function applyStageContribution(
  context: ProcessingContext,
  stage: ProcessingStage,
  contribution: ProcessingStageContribution,
): ProcessingContext {
  const warningsWithStage: readonly ProcessingWarning[] = (contribution.warnings ?? []).map((warning) => ({
    ...warning,
    stage: warning.stage ?? stage.name,
  }));

  const errorsWithStage: readonly ProcessingError[] = (contribution.errors ?? []).map((error) => ({
    ...error,
    stage: error.stage ?? stage.name,
  }));

  return {
    ...context,
    evidenceCollection: contribution.evidence
      ? {
          items: [...context.evidenceCollection.items, ...contribution.evidence],
        }
      : context.evidenceCollection,
    knowledgeCollection: contribution.knowledge
      ? mergeKnowledgeCollection(context.knowledgeCollection, contribution.knowledge)
      : context.knowledgeCollection,
    processingWarnings: [...context.processingWarnings, ...warningsWithStage],
    processingErrors: [...context.processingErrors, ...errorsWithStage],
  };
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unexpected processing stage failure.";
}

function validateStageContract(stage: ProcessingStage): void {
  if (typeof stage.canExecute !== "function") {
    throw new Error(`Stage ${stage.name} is missing canExecute(context).`);
  }

  if (typeof stage.validate !== "function") {
    throw new Error(`Stage ${stage.name} is missing validate(context).`);
  }

  if (typeof stage.execute !== "function") {
    throw new Error(`Stage ${stage.name} is missing execute(context, dependencies).`);
  }
}

export function createProcessingStageExecutor(): ProcessingStageExecutor {
  return {
    async execute(input: ProcessingStageExecutionInput): Promise<ProcessingStageExecutionResult> {
      let context = input.initialContext;
      let halted = false;

      const stageMetrics: StageExecutionMetric[] = [];
      const aggregatedMetrics: Partial<Record<DocumentIntelligenceStageName, ProcessingStageMetrics>> = {};

      for (const stage of input.stages) {
        validateStageContract(stage);

        const startedAt = Date.now();

        try {
          const canExecute = await stage.canExecute(context);
          if (!canExecute) {
            stageMetrics.push({
              stage: stage.name,
              status: "skipped",
              durationMs: Date.now() - startedAt,
            });
            continue;
          }

          const preExecutionContribution = await stage.validate(context);
          context = applyStageContribution(context, stage, preExecutionContribution);

          if (preExecutionContribution.metrics) {
            aggregatedMetrics[stage.name] = {
              ...(aggregatedMetrics[stage.name] ?? {}),
              ...preExecutionContribution.metrics,
            };
          }

          if (preExecutionContribution.halt) {
            halted = true;
            stageMetrics.push({
              stage: stage.name,
              status: "executed",
              durationMs: Date.now() - startedAt,
            });
            break;
          }

          const outcome = await stage.execute(context, input.runtimeDependencies);
          context = outcome.context;

          stageMetrics.push({
            stage: stage.name,
            status: "executed",
            durationMs: Date.now() - startedAt,
          });

          if (outcome.halt) {
            halted = true;
            break;
          }
        } catch (error) {
          context = {
            ...context,
            processingErrors: [
              ...context.processingErrors,
              {
                code: "stage.execution.failed",
                message: toErrorMessage(error),
                stage: stage.name,
              },
            ],
          };

          stageMetrics.push({
            stage: stage.name,
            status: "failed-recovered",
            durationMs: Date.now() - startedAt,
          });

          // Recoverable failure: capture error and continue with remaining stages.
          continue;
        }
      }

      return {
        outcome: {
          context,
          halt: halted,
        },
        report: {
          stageMetrics,
          aggregatedMetrics,
        },
      };
    },
  };
}
