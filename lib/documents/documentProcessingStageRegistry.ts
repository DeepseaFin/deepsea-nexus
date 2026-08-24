import type {
  DocumentIntelligencePipelineStages,
  DocumentIntelligenceStageName,
  ProcessingStage,
} from "@/lib/documents/documentIntelligenceOrchestrator";

export interface StageRegistrationOptions {
  readonly enabled?: boolean;
  readonly dependsOn?: readonly DocumentIntelligenceStageName[];
}

export interface OrderedStageExecutionPlan {
  readonly stageNames: readonly DocumentIntelligenceStageName[];
  readonly stages: readonly ProcessingStage[];
}

export interface DocumentProcessingStageRegistry {
  register(stage: ProcessingStage, options?: StageRegistrationOptions): void;
  enable(stageName: DocumentIntelligenceStageName): void;
  disable(stageName: DocumentIntelligenceStageName): void;
  setExecutionOrder(order: readonly DocumentIntelligenceStageName[]): void;
  getOrderedExecutionPlan(): OrderedStageExecutionPlan;
}

const DEFAULT_EXECUTION_ORDER: readonly DocumentIntelligenceStageName[] = [
  "validation",
  "classification",
  "evidence-extraction",
  "knowledge-transformation",
  "passport-enrichment",
];

interface StageRegistration {
  readonly stage: ProcessingStage;
  readonly enabled: boolean;
  readonly dependsOn: readonly DocumentIntelligenceStageName[];
}

class InMemoryDocumentProcessingStageRegistry implements DocumentProcessingStageRegistry {
  private readonly registrations = new Map<DocumentIntelligenceStageName, StageRegistration>();

  private executionOrder: readonly DocumentIntelligenceStageName[];

  constructor(order: readonly DocumentIntelligenceStageName[] = DEFAULT_EXECUTION_ORDER) {
    this.executionOrder = [...order];
  }

  register(stage: ProcessingStage, options: StageRegistrationOptions = {}): void {
    this.registrations.set(stage.name, {
      stage,
      enabled: options.enabled ?? true,
      dependsOn: [...(options.dependsOn ?? [])],
    });
  }

  enable(stageName: DocumentIntelligenceStageName): void {
    const registration = this.registrations.get(stageName);
    if (!registration) {
      throw new Error(`Cannot enable unregistered stage: ${stageName}`);
    }

    this.registrations.set(stageName, {
      ...registration,
      enabled: true,
    });
  }

  disable(stageName: DocumentIntelligenceStageName): void {
    const registration = this.registrations.get(stageName);
    if (!registration) {
      throw new Error(`Cannot disable unregistered stage: ${stageName}`);
    }

    this.registrations.set(stageName, {
      ...registration,
      enabled: false,
    });
  }

  setExecutionOrder(order: readonly DocumentIntelligenceStageName[]): void {
    this.executionOrder = [...order];
  }

  getOrderedExecutionPlan(): OrderedStageExecutionPlan {
    const orderedStageNames: DocumentIntelligenceStageName[] = [];
    const orderedStages: ProcessingStage[] = [];

    this.validateExecutionOrderCoverage();

    for (const stageName of this.executionOrder) {
      const registration = this.registrations.get(stageName);
      if (!registration || !registration.enabled) {
        continue;
      }

      orderedStageNames.push(stageName);
      orderedStages.push(registration.stage);
    }

    this.validateDependencies(orderedStageNames);

    return {
      stageNames: orderedStageNames,
      stages: orderedStages,
    };
  }

  private validateExecutionOrderCoverage(): void {
    const enabledStageNames = [...this.registrations.values()]
      .filter((registration) => registration.enabled)
      .map((registration) => registration.stage.name);

    for (const stageName of enabledStageNames) {
      if (!this.executionOrder.includes(stageName)) {
        throw new Error(`Enabled stage is missing from execution order: ${stageName}`);
      }
    }
  }

  private validateDependencies(orderedStageNames: readonly DocumentIntelligenceStageName[]): void {
    const enabledStageSet = new Set(orderedStageNames);

    for (const stageName of orderedStageNames) {
      const registration = this.registrations.get(stageName);
      if (!registration) {
        continue;
      }

      for (const dependency of registration.dependsOn) {
        if (!enabledStageSet.has(dependency)) {
          throw new Error(`Stage ${stageName} depends on disabled or missing stage ${dependency}`);
        }

        if (orderedStageNames.indexOf(dependency) > orderedStageNames.indexOf(stageName)) {
          throw new Error(`Stage ${stageName} must run after dependency ${dependency}`);
        }
      }
    }
  }

}

export function createDocumentProcessingStageRegistry(order?: readonly DocumentIntelligenceStageName[]): DocumentProcessingStageRegistry {
  return new InMemoryDocumentProcessingStageRegistry(order);
}

export function registerDocumentIntelligencePipelineStages(
  registry: DocumentProcessingStageRegistry,
  stages: DocumentIntelligencePipelineStages,
): void {
  registry.register(stages.validation);
  registry.register(stages.classification, {
    dependsOn: ["validation"],
  });
  registry.register(stages.evidenceExtraction, {
    dependsOn: ["classification"],
  });
  registry.register(stages.knowledgeTransformation, {
    dependsOn: ["evidence-extraction"],
  });
  registry.register(stages.passportEnrichment, {
    dependsOn: ["knowledge-transformation"],
  });
}
