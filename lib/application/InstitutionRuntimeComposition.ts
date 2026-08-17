import {
  createInstitutionRuntimeFacade,
  type InstitutionRuntimeFacade,
  type InstitutionRuntimeFacadeOptions,
} from "@/lib/application/InstitutionRuntimeFacade";
import {
  createInstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestratorOptions,
} from "@/lib/runtime/InstitutionalRuntimeOrchestrator";

export interface InstitutionRuntimeCompositionOptions {
  readonly orchestrator?: InstitutionalRuntimeOrchestrator;
  readonly orchestratorOptions?: InstitutionalRuntimeOrchestratorOptions;
  readonly facadeOptions?: InstitutionRuntimeFacadeOptions;
}

export interface InstitutionRuntimeComposition {
  readonly orchestrator: InstitutionalRuntimeOrchestrator;
  readonly facade: InstitutionRuntimeFacade;
}

export function createInstitutionRuntimeComposition(
  options: InstitutionRuntimeCompositionOptions = {},
): InstitutionRuntimeComposition {
  const orchestrator = options.orchestrator
    ?? createInstitutionalRuntimeOrchestrator(options.orchestratorOptions ?? {});
  const facade = options.facadeOptions
    ? createInstitutionRuntimeFacade({
        ...options.facadeOptions,
        orchestrator,
      })
    : createInstitutionRuntimeFacade({
        orchestrator,
      });

  return Object.freeze({
    orchestrator,
    facade,
  });
}
