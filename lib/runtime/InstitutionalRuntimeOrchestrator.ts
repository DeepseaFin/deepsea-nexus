import { randomUUID } from 'crypto';
import type { Evidence } from '@/lib/evidence/domain/Evidence';
import { evidenceFactory } from '@/lib/evidence/services/EvidenceFactory';
import type { EvidenceValidationResult } from '@/lib/evidence/types/EvidenceValidationResult';
import type { InstitutionEventPublisher } from '@/lib/institution/events/services/InstitutionEventPublisher';
import { InstitutionEventCategory } from '@/lib/institution/events/constants/InstitutionEventCategory';
import { InstitutionEventType } from '@/lib/institution/events/constants/InstitutionEventType';
import { institutionEventFactory } from '@/lib/institution/events/services/InstitutionEventFactory';
import type { BusinessPassport } from '@/lib/business-passport/domain/BusinessPassport';
import { knowledgeIdentityProjector } from '@/lib/business-passport/projections/KnowledgeIdentityProjector';
import type { KnowledgeProjectionResult } from '@/lib/business-passport/projections/KnowledgeProjectionResult';
import type { Institution } from '@/lib/institution/domain/Institution';
import type { InstitutionHealth } from '@/lib/institution/health/domain/InstitutionHealth';
import type { InstitutionIntelligence } from '@/lib/institution/intelligence/domain/InstitutionIntelligence';
import type { Journey } from '@/lib/journey/domain/Journey';
import type { KnowledgeCollection } from '@/lib/knowledge/domain/KnowledgeCollection';
import { evidenceKnowledgeMapper } from '@/lib/knowledge/services/EvidenceKnowledgeMapper';
import { createInstitutionalDigitalTwin, type InstitutionalDigitalTwin } from '@/lib/runtime/InstitutionalDigitalTwin';
import {
  createBusinessContext,
  type BusinessContext,
  type BusinessWorkspace,
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
import { WorkflowRunState } from '@/lib/workflows/WorkflowExecutionState';
import { WorkflowStep } from '@/lib/workflows/WorkflowStep';
import { CUSTOMER_ONBOARDING_WORKFLOW_STEPS } from '@/lib/workflows/WorkflowStep';
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
  readonly digitalTwin?: InstitutionalDigitalTwin;
}

export interface ExecuteOracleKnowledgePipelineResult {
  readonly pipeline: InstitutionalRuntimePipeline;
  readonly evidence: Evidence;
  readonly evidenceValidation: EvidenceValidationResult;
  readonly knowledge: KnowledgeCollection;
  readonly businessPassport: BusinessPassport;
  readonly passportProjection: KnowledgeProjectionResult;
  readonly institutionContext: InstitutionContext;
  readonly digitalTwin: InstitutionalDigitalTwin;
  readonly persistedWorkflowContext: BusinessContext;
  readonly notificationPublished: boolean;
}

export interface InstitutionalRuntimeOrchestrator {
  initializeRuntime(input: InstitutionalRuntimePipelineInput): Promise<InstitutionalRuntimePipeline>;
  createPipeline(input: InstitutionalRuntimePipelineInput): Promise<InstitutionalRuntimePipeline>;
  executeCustomerOnboarding(input: ExecuteInstitutionalRuntimeInput): Promise<ExecuteInstitutionalRuntimeResult>;
  executeOracleKnowledgePipeline(input: InstitutionalRuntimePipelineInput): Promise<ExecuteOracleKnowledgePipelineResult>;
  provideInstitutionContext(input: BuildInstitutionContextInput): InstitutionContext;
}

export interface InstitutionalRuntimeOrchestratorOptions {
  readonly repositoryProvider?: WorkflowRepositoryProvider;
  readonly institutionContextProvider?: InstitutionContextProvider;
  readonly eventPublisher?: InstitutionEventPublisher;
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

function createDigitalTwin(input: {
  readonly pipeline: InstitutionalRuntimePipeline;
  readonly institutionContext: InstitutionContext;
}): InstitutionalDigitalTwin {
  return createInstitutionalDigitalTwin({
    authentication: input.pipeline.authentication,
    workflow: input.pipeline.workflow.context,
    institutionContext: input.institutionContext,
  });
}

function resolveWorkspaceForStep(step: WorkflowStep): BusinessWorkspace {
  void step;
  return 'institution';
}

function createWorkflowExecutionStateSnapshot(input: {
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly executionId: string;
  readonly currentStep: WorkflowStep;
}): {
  readonly workflowId: string;
  readonly executionId: string;
  readonly runState: WorkflowRunState;
  readonly currentStep: WorkflowStep;
  readonly completedSteps: readonly WorkflowStep[];
  readonly pendingSteps: readonly WorkflowStep[];
  readonly startedAt: string;
  readonly completedAt: string | null;
  readonly lastEventAt: string | null;
} {
  const currentStepIndex = CUSTOMER_ONBOARDING_WORKFLOW_STEPS.indexOf(input.currentStep);
  const safeIndex = currentStepIndex >= 0 ? currentStepIndex : 0;

  return Object.freeze({
    workflowId: input.workflowInput.workflowId,
    executionId: input.executionId,
    runState: WorkflowRunState.Completed,
    currentStep: input.currentStep,
    completedSteps: CUSTOMER_ONBOARDING_WORKFLOW_STEPS.slice(0, safeIndex + 1),
    pendingSteps: CUSTOMER_ONBOARDING_WORKFLOW_STEPS.slice(safeIndex + 1),
    startedAt: input.workflowInput.initiatedAt,
    completedAt: new Date().toISOString(),
    lastEventAt: new Date().toISOString(),
  });
}

async function resolveInstitutionEntity(input: {
  readonly services: WorkflowContextServices;
  readonly workflowInput: CustomerOnboardingWorkflowInput;
}): Promise<Institution> {
  const institutionId = input.workflowInput.institution.identity.institutionId;
  const existing = await input.services.institutionService.get(institutionId);
  if (existing) {
    return existing;
  }

  return input.services.institutionService.create(input.workflowInput.institution);
}

async function resolveJourneyEntity(input: {
  readonly services: WorkflowContextServices;
  readonly workflowInput: CustomerOnboardingWorkflowInput;
}): Promise<Journey> {
  const existing = await input.services.journeyService.getJourney(input.workflowInput.journey.journeyId);
  if (existing) {
    return existing;
  }

  return input.services.journeyService.startJourney(input.workflowInput.journey);
}

async function resolveBusinessPassportEntity(input: {
  readonly services: WorkflowContextServices;
  readonly workflowInput: CustomerOnboardingWorkflowInput;
}) {
  const existing = await input.services.businessPassportService.get(input.workflowInput.businessPassport.passportId);
  if (existing) {
    return existing;
  }

  return input.services.businessPassportService.create(input.workflowInput.businessPassport);
}

function refreshBusinessPassportFromKnowledge(input: {
  readonly knowledge: KnowledgeCollection;
  readonly businessPassport: BusinessPassport;
}): KnowledgeProjectionResult {
  return knowledgeIdentityProjector.project(input.knowledge, input.businessPassport);
}

async function publishRuntimeNotification(input: {
  readonly eventPublisher: InstitutionEventPublisher | undefined;
  readonly institutionId: string;
  readonly workflowInput: CustomerOnboardingWorkflowInput;
  readonly evidenceId: string;
}): Promise<boolean> {
  if (!input.eventPublisher) {
    return false;
  }

  await input.eventPublisher.publish(
    institutionEventFactory.create(
      {
        eventId: randomUUID(),
        institutionId: input.institutionId,
        timestamp: new Date().toISOString(),
        source: 'institutional-runtime-orchestrator',
        correlationId: input.workflowInput.workflowId,
        version: '1.0',
        actor: input.workflowInput.initiatedBy,
      },
      InstitutionEventType.KnowledgeLinked,
      InstitutionEventCategory.Intelligence,
      {
        institutionId: input.institutionId,
        changedFields: ['evidence', 'knowledge', 'business_passport', 'institution_context'],
        reason: `oracle_pipeline:${input.evidenceId}`,
      },
    ),
  );

  return true;
}

export function createInstitutionalRuntimeOrchestrator(
  options: InstitutionalRuntimeOrchestratorOptions = {},
): InstitutionalRuntimeOrchestrator {
  const repositoryProvider = options.repositoryProvider ?? createWorkflowRepositoryProvider();
  const institutionContextProvider = options.institutionContextProvider ?? createInstitutionContextProvider();
  const eventPublisher = options.eventPublisher;

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
      const digitalTwin = institutionContext
        ? createDigitalTwin({
          pipeline,
          institutionContext,
        })
        : undefined;

      return Object.freeze({
        pipeline,
        execution,
        persistedWorkflowContext,
        institutionContext,
        digitalTwin,
      });
    },

    async executeOracleKnowledgePipeline(
      input: InstitutionalRuntimePipelineInput,
    ): Promise<ExecuteOracleKnowledgePipelineResult> {
      const pipeline = await this.initializeRuntime(input);
      const services = pipeline.workflow.services;

      await services.oracleWorkflow.processDocument(pipeline.workflow.input.oracleDocument);

      const evidence = evidenceFactory.createFromOracleDocument(
        pipeline.workflow.input.oracleDocument,
      );
      const evidenceValidation = services.evidenceService.validateEvidence(
        evidence,
        pipeline.workflow.input.initiatedAt,
      );

      const knowledgeTransformation = evidenceKnowledgeMapper.mapEvidence(evidence);
      const knowledge = services.knowledgeService.createCollection(
        knowledgeTransformation.knowledgeCollection.facts,
      );
      services.knowledgeService.validateCollection(
        knowledge,
        pipeline.workflow.input.initiatedAt,
      );

      const businessPassport = await resolveBusinessPassportEntity({
        services,
        workflowInput: pipeline.workflow.input,
      });
      const passportProjection = refreshBusinessPassportFromKnowledge({
        knowledge,
        businessPassport,
      });
      const refreshedBusinessPassport = passportProjection.updatedPassport;
      const institution = await resolveInstitutionEntity({
        services,
        workflowInput: pipeline.workflow.input,
      });
      const journey = await resolveJourneyEntity({
        services,
        workflowInput: pipeline.workflow.input,
      });

      const health: InstitutionHealth = services.institutionHealthService.calculate(
        institution.identity.institutionId,
        pipeline.workflow.input.healthDimensions,
        pipeline.workflow.input.initiatedAt,
      );

      const intelligence: InstitutionIntelligence = services.institutionIntelligenceService.build({
        ...pipeline.workflow.input.intelligenceInput,
        institutionId: institution.identity.institutionId,
        health,
        businessPassport: refreshedBusinessPassport,
        journey,
        knowledge,
        events: [],
      });

      const executionState = createWorkflowExecutionStateSnapshot({
        workflowInput: pipeline.workflow.input,
        executionId: pipeline.workflow.context.executionId,
        currentStep: WorkflowStep.InstitutionIntelligence,
      });

      const institutionContext = this.provideInstitutionContext({
        institution,
        passport: refreshedBusinessPassport,
        journey,
        health,
        intelligence,
        workflowExecutionState: executionState,
        totalWorkflowSteps: CUSTOMER_ONBOARDING_WORKFLOW_STEPS.length,
      });
      const digitalTwin = createDigitalTwin({
        pipeline,
        institutionContext,
      });

      const persistedWorkflowContext = createBusinessContext({
        institutionId: institution.identity.institutionId,
        opportunityId: String(pipeline.workflow.input.businessPassport.passportId),
        workflowId: pipeline.workflow.input.workflowId,
        opportunityLifecycle: OpportunityLifecycle.DRAFT,
        currentOwner: pipeline.workflow.input.initiatedBy,
        currentWorkspace: resolveWorkspaceForStep(WorkflowStep.InstitutionIntelligence),
      });
      pipeline.repositories.workflowContextRepository.save(persistedWorkflowContext);

      const notificationPublished = await publishRuntimeNotification({
        eventPublisher,
        institutionId: institution.identity.institutionId,
        workflowInput: pipeline.workflow.input,
        evidenceId: evidence.evidenceId.toString(),
      });

      return Object.freeze({
        pipeline,
        evidence,
        evidenceValidation,
        knowledge,
        businessPassport: refreshedBusinessPassport,
        passportProjection,
        institutionContext,
        digitalTwin,
        persistedWorkflowContext,
        notificationPublished,
      });
    },

    provideInstitutionContext(
      input: BuildInstitutionContextInput,
    ): InstitutionContext {
      return institutionContextProvider.provide(input);
    },
  };
}
