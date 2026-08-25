import type { CreateBusinessPassportInput, BusinessPassportService } from "@/lib/business-passport/services/BusinessPassportService";
import type { EvidenceService } from "@/lib/evidence/services/EvidenceService";
import type { OracleDocumentEvidenceInput } from "@/lib/evidence/services/EvidenceMapper";
import type { CreateInstitutionInput, InstitutionService } from "@/lib/institution/services/InstitutionService";
import type { HealthDimensionInput, InstitutionHealthService } from "@/lib/institution/health/services/InstitutionHealthService";
import type { BuildInstitutionIntelligenceInput, InstitutionIntelligenceService } from "@/lib/institution/intelligence/services/InstitutionIntelligenceService";
import type { StartJourneyInput, JourneyService } from "@/lib/journey/services/JourneyService";
import type { KnowledgeService } from "@/lib/knowledge/services/KnowledgeService";
import type { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import {
  OpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";

export interface OracleWorkflowPort {
  processDocument(input: OracleDocumentEvidenceInput): Promise<void>;
}

export interface WorkflowContextServices {
  readonly institutionService: InstitutionService;
  readonly oracleWorkflow: OracleWorkflowPort;
  readonly evidenceService: EvidenceService;
  readonly knowledgeService: KnowledgeService;
  readonly businessPassportService: BusinessPassportService;
  readonly journeyService: JourneyService;
  readonly institutionHealthService: InstitutionHealthService;
  readonly institutionIntelligenceService: InstitutionIntelligenceService;
}

export interface CustomerOnboardingWorkflowInput {
  readonly workflowId: string;
  readonly initiatedBy: string;
  readonly initiatedAt: string;
  readonly institution: CreateInstitutionInput;
  readonly oracleDocument: OracleDocumentEvidenceInput;
  readonly businessPassport: CreateBusinessPassportInput;
  readonly journey: StartJourneyInput;
  readonly healthDimensions: readonly HealthDimensionInput[];
  readonly intelligenceInput: Omit<BuildInstitutionIntelligenceInput, "health" | "journey">;
}

export interface WorkflowContext {
  readonly workflowId: string;
  readonly executionId: string;
  readonly currentStep: WorkflowStep;
  readonly services: WorkflowContextServices;
  readonly input: CustomerOnboardingWorkflowInput;
}

export type BusinessWorkspace =
  | "institution"
  | "commercial"
  | "executive"
  | "treasury"
  | "forfaitting";

export interface BusinessContext {
  readonly institutionId: string;
  readonly opportunityId: string;
  readonly receivableId?: string;
  readonly workflowId: string;
  readonly opportunityLifecycle: OpportunityLifecycle;
  readonly currentOwner: string;
  readonly currentWorkspace: BusinessWorkspace;
}

type TransitionBusinessContextInput = {
  readonly context: BusinessContext;
  readonly toLifecycle: OpportunityLifecycle;
  readonly toWorkspace: BusinessWorkspace;
  readonly nextOwner: string;
  readonly receivableId?: string;
};

export function createBusinessContext(input: BusinessContext): BusinessContext {
  return Object.freeze({
    ...input,
  });
}

export function transitionBusinessContext(input: TransitionBusinessContextInput): BusinessContext {
  const lifecycle = transitionOpportunityLifecycle(
    input.context.opportunityLifecycle,
    input.toLifecycle,
  );

  return createBusinessContext({
    ...input.context,
    opportunityLifecycle: lifecycle,
    currentWorkspace: input.toWorkspace,
    currentOwner: input.nextOwner,
    receivableId: input.receivableId ?? input.context.receivableId,
  });
}

export function serializeBusinessContext(context: BusinessContext): string {
  return encodeURIComponent(JSON.stringify(context));
}

export function parseBusinessContext(value: string | undefined): BusinessContext | undefined {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<BusinessContext>;
    if (
      typeof parsed.institutionId !== "string"
      || typeof parsed.opportunityId !== "string"
      || typeof parsed.workflowId !== "string"
      || typeof parsed.opportunityLifecycle !== "string"
      || typeof parsed.currentOwner !== "string"
      || typeof parsed.currentWorkspace !== "string"
    ) {
      return undefined;
    }

    if (!Object.values(OpportunityLifecycle).includes(parsed.opportunityLifecycle as OpportunityLifecycle)) {
      return undefined;
    }

    return createBusinessContext({
      institutionId: parsed.institutionId,
      opportunityId: parsed.opportunityId,
      receivableId: parsed.receivableId,
      workflowId: parsed.workflowId,
      opportunityLifecycle: parsed.opportunityLifecycle as OpportunityLifecycle,
      currentOwner: parsed.currentOwner,
      currentWorkspace: parsed.currentWorkspace as BusinessWorkspace,
    });
  } catch {
    return undefined;
  }
}

export interface WorkflowContextRepository {
  save(context: BusinessContext): Promise<void>;
  saveMany(contexts: readonly BusinessContext[]): Promise<void>;
  findByWorkflowId(workflowId: string): BusinessContext | undefined;
  hasWorkflowId(workflowId: string): boolean;
  deleteByWorkflowId(workflowId: string): boolean;
  list(): readonly BusinessContext[];
  count(): number;
  clear(): void;
  hydrate?(): Promise<void>;
}

class InMemoryWorkflowContextRepository implements WorkflowContextRepository {
  private readonly contexts = new Map<string, BusinessContext>();

  private static normalizeWorkflowId(workflowId: string): string {
    return workflowId.trim();
  }

  private static normalizeBusinessContext(context: BusinessContext): BusinessContext {
    return createBusinessContext(context);
  }

  async save(context: BusinessContext): Promise<void> {
    const normalized = InMemoryWorkflowContextRepository.normalizeBusinessContext(context);
    const workflowId = InMemoryWorkflowContextRepository.normalizeWorkflowId(normalized.workflowId);
    this.contexts.set(workflowId, normalized);
  }

  async saveMany(contexts: readonly BusinessContext[]): Promise<void> {
    for (const context of contexts) {
      await this.save(context);
    }
  }

  findByWorkflowId(workflowId: string): BusinessContext | undefined {
    const normalizedWorkflowId = InMemoryWorkflowContextRepository.normalizeWorkflowId(workflowId);
    const context = this.contexts.get(normalizedWorkflowId);
    return context ? InMemoryWorkflowContextRepository.normalizeBusinessContext(context) : undefined;
  }

  hasWorkflowId(workflowId: string): boolean {
    const normalizedWorkflowId = InMemoryWorkflowContextRepository.normalizeWorkflowId(workflowId);
    return this.contexts.has(normalizedWorkflowId);
  }

  deleteByWorkflowId(workflowId: string): boolean {
    const normalizedWorkflowId = InMemoryWorkflowContextRepository.normalizeWorkflowId(workflowId);
    return this.contexts.delete(normalizedWorkflowId);
  }

  list(): readonly BusinessContext[] {
    return Object.freeze(
      Array.from(this.contexts.values(), (context) => InMemoryWorkflowContextRepository.normalizeBusinessContext(context)),
    );
  }

  count(): number {
    return this.contexts.size;
  }

  clear(): void {
    this.contexts.clear();
  }

  async hydrate(): Promise<void> {
    return;
  }
}

export function createInMemoryWorkflowContextRepository(): WorkflowContextRepository {
  return new InMemoryWorkflowContextRepository();
}

export const workflowContextRepository: WorkflowContextRepository = createInMemoryWorkflowContextRepository();
