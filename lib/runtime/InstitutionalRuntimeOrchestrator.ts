import { randomUUID } from 'crypto';
import {
  createBusinessContext,
  type BusinessContext,
} from '@/lib/workflows/WorkflowContext';
import type {
  BuildInstitutionContextInput,
} from '@/lib/workspaces/InstitutionContextBuilder';
import type { InstitutionContext } from '@/lib/workspaces/InstitutionContext';
import type { InstitutionContextProvider } from '@/lib/workspaces/InstitutionContextProvider';
import { createInstitutionContextProvider } from '@/lib/workspaces/InstitutionContextProvider';
import type {
  CustomerOnboardingWorkflowInput,
  WorkflowContext,
  WorkflowContextServices,
  WorkflowContextRepository,
} from '@/lib/workflows/WorkflowContext';
import type { WorkflowEngine } from '@/lib/workflows/WorkflowEngine';
import type { WorkflowExecutionResult } from '@/lib/workflows/WorkflowExecutionResult';
import type { WorkflowStep } from '@/lib/workflows/WorkflowStep';
import { OpportunityLifecycle } from '@/lib/workflows/WorkflowTransition';
import {
  createWorkflowRepositoryProvider,
  type WorkflowContextRepositoryFactoryOptions,
  type WorkflowRepositoryProvider,
} from '@/lib/workflows/repositories/WorkflowRepositoryFactory';
import {
  resolveServerRuntimeAuthContext,
  type RuntimeAuthContext,
  type RuntimeAuthCookieAdapter,
} from '@/lib/supabase/runtimeAuth';

export interface InstitutionalRuntimeRequestInput {
  readonly url: string;
  readonly method: string;
  readonly pathname: string;
  readonly headers: Headers;
  readonly searchParams: URLSearchParams;
  readonly cookies: RuntimeAuthCookieAdapter;
}

export interface InstitutionalRuntimePipelineInput {
  readonly request: InstitutionalRuntimeRequestInput;
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly workflowServices: WorkflowContextServices;
  readonly currentStep: WorkflowStep;
  readonly executionId?: string;
  readonly repositoryOptions?: WorkflowContextRepositoryFactoryOptions;
}

export interface InstitutionalRuntimePipeline {
  readonly authentication: RuntimeAuthContext;
  readonly repositories: {
    readonly workflowContextRepository: WorkflowContextRepository;
  };
  readonly workflow: {
    readonly context: WorkflowContext;
    readonly input: CustomerOnboardingWorkflowInput;
    readonly services: WorkflowContextServices;
  };
  readonly institutionContextProvider: InstitutionContextProvider;
}

export interface ExecuteInstitutionalRuntimeInput extends InstitutionalRuntimePipelineInput {
  readonly workflowEngine: WorkflowEngine;
}

export interface ExecuteInstitutionalRuntimeResult {
  readonly pipeline: InstitutionalRuntimePipeline;
  readonly execution: WorkflowExecutionResult;
  readonly persistedWorkflowContext: BusinessContext;
  readonly institutionContext?: InstitutionContext;
}

export interface InstitutionalRuntimeOrchestrator {
  initializeRuntime(input: InstitutionalRuntimePipelineInput): Promise<InstitutionalRuntimePipeline>;
  createPipeline(input: InstitutionalRuntimePipelineInput): Promise<InstitutionalRuntimePipeline>;
  executeCustomerOnboarding(input: ExecuteInstitutionalRuntimeInput): Promise<ExecuteInstitutionalRuntimeResult>;
  provideInstitutionContext(input: BuildInstitutionContextInput): InstitutionContext;
}

export interface InstitutionalRuntimeOrchestratorOptions {
  readonly repositoryProvider?: WorkflowRepositoryProvider;
  readonly institutionContextProvider?: InstitutionContextProvider;
}

function createWorkflowContextForPipeline(input: {
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly workflowServices: WorkflowContextServices;
  readonly currentStep: WorkflowStep;
  readonly executionId?: string;
}): WorkflowContext {
  return Object.freeze({
    workflowId: input.workflowInput.workflowId,
    executionId: input.executionId ?? randomUUID(),
    currentStep: input.currentStep,
    services: input.workflowServices,
    input: input.workflowInput,
  });
}

function resolveOpportunityReference(input: {
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly execution: WorkflowExecutionResult;
}): string {
  const fromJourney = input.execution.stageResults.journey?.journeyId;
  if (typeof fromJourney === 'string' && fromJourney.trim().length > 0) {
    return fromJourney;
  }

  const fromPassport = input.workflowInput.businessPassport.passportId;
  const normalizedPassportReference = String(fromPassport).trim();
  if (normalizedPassportReference.length > 0) {
    return normalizedPassportReference;
  }

  return input.workflowInput.workflowId;
}

function createPersistedWorkflowContext(input: {
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly execution: WorkflowExecutionResult;
}): BusinessContext {
  const institutionId = input.execution.stageResults.institution?.identity.institutionId
    ?? input.workflowInput.institution.identity.institutionId;

  return createBusinessContext({
    institutionId,
    opportunityId: resolveOpportunityReference(input),
    workflowId: input.workflowInput.workflowId,
    opportunityLifecycle: OpportunityLifecycle.DRAFT,
    currentOwner: input.workflowInput.initiatedBy,
    currentWorkspace: 'institution',
  });
}

function toInstitutionContextInput(execution: WorkflowExecutionResult): BuildInstitutionContextInput | undefined {
  const institution = execution.stageResults.institution;
  if (!institution) {
    return undefined;
  }

  return {
    institution,
    passport: execution.stageResults.businessPassport,
    journey: execution.stageResults.journey,
    health: execution.stageResults.institutionHealth,
    intelligence: execution.stageResults.institutionIntelligence,
    workflowExecutionState: execution.state,
    totalWorkflowSteps: execution.stepResults.length,
  };
}

export function createInstitutionalRuntimeOrchestrator(
  options: InstitutionalRuntimeOrchestratorOptions = {},
): InstitutionalRuntimeOrchestrator {
  const repositoryProvider = options.repositoryProvider ?? createWorkflowRepositoryProvider();
  const institutionContextProvider = options.institutionContextProvider ?? createInstitutionContextProvider();

  return {
    async initializeRuntime(
      input: InstitutionalRuntimePipelineInput,
    ): Promise<InstitutionalRuntimePipeline> {
      const authentication = await resolveServerRuntimeAuthContext(input.request);
      const workflowContextRepository = repositoryProvider.createWorkflowContextRepository(
        input.repositoryOptions,
      );
      const workflowContext = createWorkflowContextForPipeline({
        workflowInput: input.workflowInput,
        workflowServices: input.workflowServices,
        currentStep: input.currentStep,
        executionId: input.executionId,
      });

      return Object.freeze({
        authentication,
        repositories: Object.freeze({
          workflowContextRepository,
        }),
        workflow: Object.freeze({
          context: workflowContext,
          input: input.workflowInput,
          services: input.workflowServices,
        }),
        institutionContextProvider,
      });
    },

    async createPipeline(
      input: InstitutionalRuntimePipelineInput,
    ): Promise<InstitutionalRuntimePipeline> {
      return this.initializeRuntime(input);
    },

    async executeCustomerOnboarding(
      input: ExecuteInstitutionalRuntimeInput,
    ): Promise<ExecuteInstitutionalRuntimeResult> {
      const pipeline = await this.initializeRuntime(input);
      const execution = await input.workflowEngine.runCustomerOnboarding(
        pipeline.workflow.input,
        pipeline.workflow.services,
      );

      const persistedWorkflowContext = createPersistedWorkflowContext({
        workflowInput: pipeline.workflow.input,
        execution,
      });
      pipeline.repositories.workflowContextRepository.save(persistedWorkflowContext);

      const institutionContextInput = toInstitutionContextInput(execution);
      const institutionContext = institutionContextInput
        ? this.provideInstitutionContext(institutionContextInput)
        : undefined;

      return Object.freeze({
        pipeline,
        execution,
        persistedWorkflowContext,
        institutionContext,
      });
    },

    provideInstitutionContext(
      input: BuildInstitutionContextInput,
    ): InstitutionContext {
      return institutionContextProvider.provide(input);
    },
  };
}
