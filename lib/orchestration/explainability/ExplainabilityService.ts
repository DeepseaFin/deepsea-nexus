import {
  explainabilityEngine,
  type ExplainabilityEngine,
} from "@/lib/orchestration/explainability/ExplainabilityEngine";
import type { ExplainabilityResult } from "@/lib/orchestration/explainability/ExplainabilityResult";
import type { JourneyResult } from "@/lib/orchestration/JourneyResult";

export interface ExplainabilityRequest {
  readonly journeyResult: JourneyResult;
  readonly recommendationId: string;
}

export interface ExplainabilityService {
  explain(request: ExplainabilityRequest): ExplainabilityResult;
}

export interface ExplainabilityServiceDependencies {
  readonly engine?: ExplainabilityEngine;
}

export class DefaultExplainabilityService implements ExplainabilityService {
  private readonly engine: ExplainabilityEngine;

  constructor(dependencies: ExplainabilityServiceDependencies = {}) {
    this.engine = dependencies.engine ?? explainabilityEngine;
  }

  explain(request: ExplainabilityRequest): ExplainabilityResult {
    return this.engine.explain(request.journeyResult, request.recommendationId);
  }
}

export function createExplainabilityService(
  dependencies: ExplainabilityServiceDependencies = {},
): ExplainabilityService {
  return new DefaultExplainabilityService(dependencies);
}
