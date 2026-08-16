import {
  createInstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestratorOptions,
} from "@/lib/runtime/InstitutionalRuntimeOrchestrator";

export interface InstitutionRuntimeFacade {
  initializeRuntime: InstitutionalRuntimeOrchestrator["initializeRuntime"];
  executeCustomerOnboarding: InstitutionalRuntimeOrchestrator["executeCustomerOnboarding"];
  executeOracleKnowledgePipeline: InstitutionalRuntimeOrchestrator["executeOracleKnowledgePipeline"];
  provideInstitutionContext: InstitutionalRuntimeOrchestrator["provideInstitutionContext"];
}

export interface InstitutionRuntimeFacadeOptions {
  readonly orchestrator?: InstitutionalRuntimeOrchestrator;
  readonly orchestratorOptions?: InstitutionalRuntimeOrchestratorOptions;
}

export function createInstitutionRuntimeFacade(
  options: InstitutionRuntimeFacadeOptions = {},
): InstitutionRuntimeFacade {
  const orchestrator = options.orchestrator
    ?? createInstitutionalRuntimeOrchestrator(options.orchestratorOptions ?? {});

  return {
    initializeRuntime(input) {
      return orchestrator.initializeRuntime(input);
    },

    executeCustomerOnboarding(input) {
      return orchestrator.executeCustomerOnboarding(input);
    },

    executeOracleKnowledgePipeline(input) {
      return orchestrator.executeOracleKnowledgePipeline(input);
    },

    provideInstitutionContext(input) {
      return orchestrator.provideInstitutionContext(input);
    },
  };
}
