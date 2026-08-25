import {
  createInstitutionRuntimeFacade,
  type InstitutionRuntimeFacade,
  type InstitutionRuntimeFacadeOptions,
} from "@/lib/application/InstitutionRuntimeFacade";
import type { RelationshipRepository } from "@/lib/relationship/RelationshipRepository";
import type { RelationshipService } from "@/lib/relationship/RelationshipService";
import { createSupabaseRelationshipRepository } from "@/lib/relationship/repositories/SupabaseRelationshipRepository";
import { createRelationshipService } from "@/lib/relationship/services/RelationshipServiceImpl";
import {
  createInstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestrator,
  type InstitutionalRuntimeOrchestratorOptions,
} from "@/lib/runtime/InstitutionalRuntimeOrchestrator";
import type { WorkflowContextRepository } from "@/lib/workflows/WorkflowContext";
import {
  createWorkflowRepositoryProvider,
  type WorkflowRepositoryBackend,
} from "@/lib/workflows/repositories/WorkflowRepositoryFactory";

export interface InstitutionRuntimeCompositionOptions {
  readonly orchestrator?: InstitutionalRuntimeOrchestrator;
  readonly orchestratorOptions?: InstitutionalRuntimeOrchestratorOptions;
  readonly facadeOptions?: InstitutionRuntimeFacadeOptions;
  readonly relationshipRepository?: RelationshipRepository;
  readonly relationshipService?: RelationshipService;
  readonly workflowContextRepository?: WorkflowContextRepository;
  readonly workflowContextBackend?: WorkflowRepositoryBackend;
}

export interface InstitutionRuntimeComposition {
  readonly orchestrator: InstitutionalRuntimeOrchestrator;
  readonly facade: InstitutionRuntimeFacade;
  readonly relationshipService: RelationshipService;
  readonly workflowContextRepository: WorkflowContextRepository;
}

export function createInstitutionRuntimeComposition(
  options: InstitutionRuntimeCompositionOptions = {},
): InstitutionRuntimeComposition {
  const relationshipRepository = options.relationshipRepository
    ?? createSupabaseRelationshipRepository();
  const relationshipService = options.relationshipService
    ?? createRelationshipService({ repository: relationshipRepository });
  const workflowContextRepository = options.workflowContextRepository
    ?? createWorkflowRepositoryProvider().createWorkflowContextRepository({
      backend: options.workflowContextBackend ?? 'in-memory',
    });
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
    relationshipService,
    workflowContextRepository,
  });
}

export function createCanonicalReleaseOneRuntimeComposition(
  options: InstitutionRuntimeCompositionOptions = {},
): InstitutionRuntimeComposition {
  return createInstitutionRuntimeComposition({
    ...options,
    workflowContextBackend: 'supabase',
  });
}
