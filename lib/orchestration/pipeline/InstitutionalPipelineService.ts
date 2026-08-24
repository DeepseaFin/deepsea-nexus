import {
  decisionAuditBuilder,
  type DecisionAuditBuilder,
} from "@/lib/orchestration/audit/DecisionAuditBuilder";
import {
  decisionPackageBuilder,
  type DecisionPackageBuilder,
} from "@/lib/orchestration/decision-package/DecisionPackageBuilder";
import {
  explainabilityEngine,
  type ExplainabilityEngine,
} from "@/lib/orchestration/explainability/ExplainabilityEngine";
import type { JourneyOrchestrator } from "@/lib/orchestration/JourneyOrchestrator";
import type { InstitutionalPipeline } from "@/lib/orchestration/pipeline/InstitutionalPipeline";
import type { InstitutionalPipelineContext } from "@/lib/orchestration/pipeline/InstitutionalPipelineContext";
import {
  InstitutionalPipelineStatus,
  type InstitutionalPipelineResult,
} from "@/lib/orchestration/pipeline/InstitutionalPipelineResult";

export interface InstitutionalPipelineServiceDependencies {
  readonly journeyOrchestrator: JourneyOrchestrator;
  readonly explainabilityEngine?: ExplainabilityEngine;
  readonly decisionPackageBuilder?: DecisionPackageBuilder;
  readonly decisionAuditBuilder?: DecisionAuditBuilder;
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  const properties = Object.getOwnPropertyNames(value);

  for (const property of properties) {
    const propertyValue = (value as Record<string, unknown>)[property];

    if (propertyValue !== null && (typeof propertyValue === "object" || typeof propertyValue === "function")) {
      deepFreeze(propertyValue);
    }
  }

  return Object.freeze(value);
}

export class DefaultInstitutionalPipelineService implements InstitutionalPipeline {
  private readonly journeyOrchestrator: JourneyOrchestrator;

  private readonly explainabilityEngine: ExplainabilityEngine;

  private readonly decisionPackageBuilder: DecisionPackageBuilder;

  private readonly decisionAuditBuilder: DecisionAuditBuilder;

  constructor(dependencies: InstitutionalPipelineServiceDependencies) {
    this.journeyOrchestrator = dependencies.journeyOrchestrator;
    this.explainabilityEngine = dependencies.explainabilityEngine ?? explainabilityEngine;
    this.decisionPackageBuilder = dependencies.decisionPackageBuilder ?? decisionPackageBuilder;
    this.decisionAuditBuilder = dependencies.decisionAuditBuilder ?? decisionAuditBuilder;
  }

  async execute(context: InstitutionalPipelineContext): Promise<InstitutionalPipelineResult> {
    const startedAt = Date.now();

    const journeyResult = await this.journeyOrchestrator.orchestrate(context.journeyContext);
    const explainabilityResult = this.explainabilityEngine.explain(journeyResult, context.recommendationId);
    const decisionPackage = this.decisionPackageBuilder.build({
      journeyResult,
      explainabilityResult,
    });
    const decisionAuditRecord = this.decisionAuditBuilder.build(decisionPackage);

    const executedAt = new Date().toISOString();
    const duration = Date.now() - startedAt;

    return deepFreeze({
      journeyResult,
      explainabilityResult,
      decisionPackage,
      decisionAuditRecord,
      pipelineMetadata: {
        pipelineId: context.pipelineId,
        pipelineVersion: context.pipelineVersion,
        executedAt,
        duration,
        status: InstitutionalPipelineStatus.Completed,
      },
    });
  }
}

export function createInstitutionalPipelineService(
  dependencies: InstitutionalPipelineServiceDependencies,
): InstitutionalPipeline {
  return new DefaultInstitutionalPipelineService(dependencies);
}
