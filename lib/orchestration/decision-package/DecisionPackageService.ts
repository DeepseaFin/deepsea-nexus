import {
  decisionPackageBuilder,
  type DecisionPackageBuilder,
  type DecisionPackageBuilderInput,
} from "@/lib/orchestration/decision-package/DecisionPackageBuilder";
import type { InstitutionalDecisionPackage } from "@/lib/orchestration/decision-package/InstitutionalDecisionPackage";

export interface DecisionPackageService {
  create(input: DecisionPackageBuilderInput): InstitutionalDecisionPackage;
}

export interface DecisionPackageServiceDependencies {
  readonly builder?: DecisionPackageBuilder;
}

export class DefaultDecisionPackageService implements DecisionPackageService {
  private readonly builder: DecisionPackageBuilder;

  constructor(dependencies: DecisionPackageServiceDependencies = {}) {
    this.builder = dependencies.builder ?? decisionPackageBuilder;
  }

  create(input: DecisionPackageBuilderInput): InstitutionalDecisionPackage {
    return this.builder.build(input);
  }
}

export function createDecisionPackageService(
  dependencies: DecisionPackageServiceDependencies = {},
): DecisionPackageService {
  return new DefaultDecisionPackageService(dependencies);
}
