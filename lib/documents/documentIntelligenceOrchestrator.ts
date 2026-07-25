import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import { PassportId as PassportIdValueObject } from "@/lib/business-passport/value-objects/PassportId";
import { knowledgeIdentityProjector, type KnowledgeIdentityProjector } from "@/lib/business-passport/projections/KnowledgeIdentityProjector";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { DocumentRecord, ListDocumentsFilters } from "@/lib/documents/documentRepository";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceCollection } from "@/lib/evidence/domain/EvidenceCollection";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import { createEvidenceService, type EvidenceService } from "@/lib/evidence/services/EvidenceService";
import { evidenceValidator } from "@/lib/evidence/services/EvidenceValidator";
import { evidenceFactory, type EvidenceFactory } from "@/lib/evidence/services/EvidenceFactory";
import type { EvidenceRepository } from "@/lib/evidence/services/EvidenceRepository";
import { createKnowledgeService, type KnowledgeService } from "@/lib/knowledge/services/KnowledgeService";
import { knowledgeValidator } from "@/lib/knowledge/services/KnowledgeValidator";
import {
  createEvidenceKnowledgeMapper,
  type EvidenceKnowledgeMapper,
} from "@/lib/knowledge/services/EvidenceKnowledgeMapper";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeRepository } from "@/lib/knowledge/repositories/KnowledgeRepository";
import type { KnowledgeTransformationResult } from "@/lib/knowledge/services/KnowledgeTransformationResult";

export interface DocumentOcrExtractionReference {
  readonly page: number;
  readonly section: string;
  readonly fragment: string;
  readonly boundingBox?: {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

export interface DocumentOcrExtractionResult {
  readonly text: string;
  readonly references: readonly DocumentOcrExtractionReference[];
  readonly confidence: number;
}

export interface DocumentStructuredExtractionResult {
  readonly references: readonly DocumentOcrExtractionReference[];
}

// Extension point for future OCR providers. No OCR implementation is included here.
export interface DocumentOcrExtractor {
  extract(document: DocumentRecord): Promise<DocumentOcrExtractionResult>;
}

// Extension point for future AI extraction providers. No AI implementation is included here.
export interface DocumentAiExtractor {
  extract(input: {
    readonly document: DocumentRecord;
    readonly ocr: DocumentOcrExtractionResult | null;
  }): Promise<DocumentStructuredExtractionResult>;
}

export interface DocumentIntelligenceOrchestrationInput {
  readonly documentId: string;
  readonly customerId?: string;
  readonly passportId?: PassportId | string;
}

export interface CustomerDocumentIntelligenceOrchestrationInput {
  readonly customerId?: string;
  readonly documentFilters?: ListDocumentsFilters;
  readonly passportId?: PassportId | string;
}

export interface DocumentIntelligenceDocumentResult {
  readonly document: DocumentRecord;
  readonly evidence: Evidence;
  readonly evidenceValidation: ReturnType<EvidenceService["validateEvidence"]>;
  readonly knowledge: KnowledgeTransformationResult;
  readonly knowledgeValidation: ReturnType<KnowledgeService["validateCollection"]>;
}

export interface ProcessingWarning {
  readonly code: string;
  readonly message: string;
  readonly stage: DocumentIntelligenceStageName;
  readonly documentId?: string;
}

export interface ProcessingError {
  readonly code: string;
  readonly message: string;
  readonly stage: DocumentIntelligenceStageName;
  readonly documentId?: string;
}

export interface DocumentIntelligenceProcessingResult {
  readonly processedAt: string;
  readonly extractedEvidence: readonly Evidence[];
  readonly generatedKnowledge: KnowledgeCollection;
  readonly processingWarnings: readonly ProcessingWarning[];
  readonly processingErrors: readonly ProcessingError[];
  readonly documents: readonly DocumentIntelligenceDocumentResult[];
  readonly updatedPassport?: BusinessPassport;
}

export type DocumentIntelligencePipelineResult = DocumentIntelligenceProcessingResult;

export type DocumentIntelligenceStageName =
  | "document-ingestion"
  | "evidence-extraction"
  | "knowledge-transformation"
  | "passport-enrichment";

export interface DocumentIntelligenceProcessingContext {
  readonly input: {
    readonly customerId?: string;
    readonly documentId?: string;
    readonly documentFilters?: ListDocumentsFilters;
    readonly passportId?: PassportId | string;
  };
  readonly processedAt: string;
  readonly documents: readonly DocumentRecord[];
  readonly documentResults: readonly DocumentIntelligenceDocumentResult[];
  readonly evidenceCollection: EvidenceCollection;
  readonly knowledgeCollection: KnowledgeCollection;
  readonly processingWarnings: readonly ProcessingWarning[];
  readonly processingErrors: readonly ProcessingError[];
  readonly currentPassport: BusinessPassport | null;
  readonly updatedPassport?: BusinessPassport;
}

export interface DocumentIngestionStage {
  execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext>;
}

export interface EvidenceExtractionStage {
  execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext>;
}

export interface KnowledgeTransformationStage {
  execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext>;
}

export interface PassportEnrichmentStage {
  execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext>;
}

export interface DocumentIntelligencePipelineStages {
  readonly documentIngestion: DocumentIngestionStage;
  readonly evidenceExtraction: EvidenceExtractionStage;
  readonly knowledgeTransformation: KnowledgeTransformationStage;
  readonly passportEnrichment: PassportEnrichmentStage;
}

export interface DocumentIntelligenceOrchestratorDependencies {
  readonly documentsRepository: DocumentsRepository;
  readonly evidenceRepository?: EvidenceRepository;
  readonly knowledgeRepository?: KnowledgeRepository;
  readonly businessPassportRepository?: BusinessPassportRepository;
  readonly evidenceFactory?: EvidenceFactory;
  readonly evidenceService?: EvidenceService;
  readonly knowledgeMapper?: EvidenceKnowledgeMapper;
  readonly knowledgeService?: KnowledgeService;
  readonly knowledgeProjector?: KnowledgeIdentityProjector;
  readonly ocrExtractor?: DocumentOcrExtractor;
  readonly aiExtractor?: DocumentAiExtractor;
  readonly stages?: Partial<DocumentIntelligencePipelineStages>;
}

export interface DocumentIntelligenceOrchestrator {
  processDocument(input: DocumentIntelligenceOrchestrationInput): Promise<DocumentIntelligencePipelineResult>;
  processCustomerDocuments(input: CustomerDocumentIntelligenceOrchestrationInput): Promise<DocumentIntelligencePipelineResult>;
}

function toEvidenceReferences(
  document: DocumentRecord,
  ocrResult: DocumentOcrExtractionResult | null,
  aiResult: DocumentStructuredExtractionResult | null,
): readonly EvidenceReference[] {
  const preferredReferences = aiResult?.references?.length
    ? aiResult.references
    : ocrResult?.references ?? [];

  if (preferredReferences.length > 0) {
    return preferredReferences.map((reference) => ({
      page: reference.page,
      section: reference.section,
      fragment: reference.fragment,
      boundingBox: reference.boundingBox,
    }));
  }

  // Fallback keeps evidence valid without requiring OCR/AI integration.
  return [
    {
      page: 1,
      section: document.document_type || "document",
      fragment: document.original_file_name || document.file_name || document.document_code,
    },
  ];
}

function toKnowledgeCollection(items: readonly DocumentIntelligenceDocumentResult[]): KnowledgeCollection {
  return {
    facts: items.flatMap((item) => item.knowledge.knowledgeCollection.facts),
  };
}

function toPassportId(
  value: PassportId | string | undefined,
): PassportId | null {
  if (!value) {
    return null;
  }

  if (value instanceof PassportIdValueObject) {
    return value;
  }

  try {
    return PassportIdValueObject.fromString(value);
  } catch {
    return null;
  }
}

async function resolvePassport(params: {
  readonly businessPassportRepository: BusinessPassportRepository | undefined;
  readonly passportId: PassportId | string | undefined;
}): Promise<BusinessPassport | null> {
  const resolvedPassportId = toPassportId(params.passportId);

  if (!params.businessPassportRepository || !resolvedPassportId) {
    return null;
  }

  return params.businessPassportRepository.findById(resolvedPassportId);
}

async function processSingleDocument(params: {
  readonly document: DocumentRecord;
  readonly evidenceFactory: EvidenceFactory;
  readonly evidenceService: EvidenceService;
  readonly knowledgeMapper: EvidenceKnowledgeMapper;
  readonly knowledgeService: KnowledgeService;
  readonly ocrExtractor: DocumentOcrExtractor | undefined;
  readonly aiExtractor: DocumentAiExtractor | undefined;
}): Promise<DocumentIntelligenceDocumentResult> {
  const ocrResult = params.ocrExtractor
    ? await params.ocrExtractor.extract(params.document)
    : null;

  const aiResult = params.aiExtractor
    ? await params.aiExtractor.extract({
        document: params.document,
        ocr: ocrResult,
      })
    : null;

  const evidence = params.evidenceFactory.createFromOracleDocument(
    {
      documentId: params.document.id,
      documentCode: params.document.document_code,
      mimeType: params.document.mime_type,
      checksum: params.document.checksum ?? `checksum:${params.document.id}`,
      uploadedAt: params.document.uploaded_at,
      uploadedBy: params.document.uploaded_by ?? "document-intelligence",
    },
    toEvidenceReferences(params.document, ocrResult, aiResult),
  );

  const evidenceValidation = params.evidenceService.validateEvidence(evidence, new Date().toISOString());
  const knowledge = params.knowledgeMapper.mapEvidence(evidence);
  const knowledgeValidation = params.knowledgeService.validateCollection(
    knowledge.knowledgeCollection,
    new Date().toISOString(),
  );

  return {
    document: params.document,
    evidence,
    evidenceValidation,
    knowledge,
    knowledgeValidation,
  };
}

function appendProcessingValidationIssues(
  context: DocumentIntelligenceProcessingContext,
  stage: DocumentIntelligenceStageName,
): DocumentIntelligenceProcessingContext {
  const warnings: ProcessingWarning[] = [...context.processingWarnings];
  const errors: ProcessingError[] = [...context.processingErrors];

  for (const result of context.documentResults) {
    for (const issue of result.evidenceValidation.issues) {
      if (issue.severity === "warning") {
        warnings.push({
          code: issue.code,
          message: issue.message,
          stage,
          documentId: result.document.id,
        });
      } else {
        errors.push({
          code: issue.code,
          message: issue.message,
          stage,
          documentId: result.document.id,
        });
      }
    }

    for (const issue of result.knowledgeValidation.issues) {
      if (issue.severity === "warning") {
        warnings.push({
          code: issue.code,
          message: issue.message,
          stage,
          documentId: result.document.id,
        });
      } else {
        errors.push({
          code: issue.code,
          message: issue.message,
          stage,
          documentId: result.document.id,
        });
      }
    }

    for (const warning of result.knowledge.warnings) {
      warnings.push({
        code: "knowledge.transformation.warning",
        message: warning.message,
        stage,
        documentId: result.document.id,
      });
    }
  }

  return {
    ...context,
    processingWarnings: warnings,
    processingErrors: errors,
  };
}

export interface DocumentIntelligenceOrchestratorRuntimeDependencies {
  readonly documentsRepository: DocumentsRepository;
  readonly evidenceRepository?: EvidenceRepository;
  readonly knowledgeRepository?: KnowledgeRepository;
  readonly businessPassportRepository?: BusinessPassportRepository;
  readonly evidenceFactory: EvidenceFactory;
  readonly evidenceService: EvidenceService;
  readonly knowledgeMapper: EvidenceKnowledgeMapper;
  readonly knowledgeService: KnowledgeService;
  readonly knowledgeProjector: KnowledgeIdentityProjector;
  readonly ocrExtractor?: DocumentOcrExtractor;
  readonly aiExtractor?: DocumentAiExtractor;
}

export const defaultDocumentIngestionStage: DocumentIngestionStage = {
  async execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext> {
    if (context.input.documentId) {
      const document = await dependencies.documentsRepository.findById(context.input.documentId);
      if (!document) {
        return {
          ...context,
          processingErrors: [
            ...context.processingErrors,
            {
              code: "document.not-found",
              message: `Document ${context.input.documentId} was not found.`,
              stage: "document-ingestion",
              documentId: context.input.documentId,
            },
          ],
        };
      }

      return {
        ...context,
        documents: [document],
      };
    }

    const filters: ListDocumentsFilters = {
      ...(context.input.documentFilters ?? {}),
    };

    if (context.input.customerId && !filters.client_id) {
      filters.client_id = context.input.customerId;
    }

    const documents = await dependencies.documentsRepository.list(filters);
    return {
      ...context,
      documents,
    };
  },
};

export const defaultEvidenceExtractionStage: EvidenceExtractionStage = {
  async execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext> {
    const documentResults = await Promise.all(
      context.documents.map((document) =>
        processSingleDocument({
          document,
          evidenceFactory: dependencies.evidenceFactory,
          evidenceService: dependencies.evidenceService,
          knowledgeMapper: dependencies.knowledgeMapper,
          knowledgeService: dependencies.knowledgeService,
          ocrExtractor: dependencies.ocrExtractor,
          aiExtractor: dependencies.aiExtractor,
        }),
      ),
    );

    return appendProcessingValidationIssues(
      {
        ...context,
        documentResults,
        evidenceCollection: {
          items: documentResults.map((item) => item.evidence),
        },
      },
      "evidence-extraction",
    );
  },
};

export const defaultKnowledgeTransformationStage: KnowledgeTransformationStage = {
  async execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext> {
    const knowledgeCollection = toKnowledgeCollection(context.documentResults);

    if (dependencies.evidenceRepository) {
      await dependencies.evidenceRepository.saveCollection(context.evidenceCollection);
    }

    if (dependencies.knowledgeRepository) {
      await dependencies.knowledgeRepository.saveCollection(knowledgeCollection);
    }

    return {
      ...context,
      knowledgeCollection,
    };
  },
};

export const defaultPassportEnrichmentStage: PassportEnrichmentStage = {
  async execute(
    context: DocumentIntelligenceProcessingContext,
    dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
  ): Promise<DocumentIntelligenceProcessingContext> {
    const currentPassport = await resolvePassport({
      businessPassportRepository: dependencies.businessPassportRepository,
      passportId: context.input.passportId,
    });

    if (!currentPassport) {
      return {
        ...context,
        currentPassport,
      };
    }

    const projection = dependencies.knowledgeProjector.project(context.knowledgeCollection, currentPassport);
    const updatedPassport = projection.updatedPassport;
    await dependencies.businessPassportRepository?.save(updatedPassport);

    return {
      ...context,
      currentPassport,
      updatedPassport,
    };
  },
};

function createInitialProcessingContext(input: {
  readonly customerId?: string;
  readonly documentId?: string;
  readonly documentFilters?: ListDocumentsFilters;
  readonly passportId?: PassportId | string;
}): DocumentIntelligenceProcessingContext {
  return {
    input,
    processedAt: new Date().toISOString(),
    documents: [],
    documentResults: [],
    evidenceCollection: {
      items: [],
    },
    knowledgeCollection: {
      facts: [],
    },
    processingWarnings: [],
    processingErrors: [],
    currentPassport: null,
  };
}

async function runProcessingPipeline(params: {
  readonly initialContext: DocumentIntelligenceProcessingContext;
  readonly stages: DocumentIntelligencePipelineStages;
  readonly runtimeDependencies: DocumentIntelligenceOrchestratorRuntimeDependencies;
}): Promise<DocumentIntelligenceProcessingContext> {
  let context = params.initialContext;

  context = await params.stages.documentIngestion.execute(context, params.runtimeDependencies);
  context = await params.stages.evidenceExtraction.execute(context, params.runtimeDependencies);
  context = await params.stages.knowledgeTransformation.execute(context, params.runtimeDependencies);
  context = await params.stages.passportEnrichment.execute(context, params.runtimeDependencies);

  return context;
}

function toProcessingResult(context: DocumentIntelligenceProcessingContext): DocumentIntelligenceProcessingResult {
  return {
    processedAt: context.processedAt,
    extractedEvidence: context.evidenceCollection.items,
    generatedKnowledge: context.knowledgeCollection,
    processingWarnings: context.processingWarnings,
    processingErrors: context.processingErrors,
    documents: context.documentResults,
    updatedPassport: context.updatedPassport,
  };
}

export function createDocumentIntelligenceOrchestrator(
  dependencies: DocumentIntelligenceOrchestratorDependencies,
): DocumentIntelligenceOrchestrator {
  const runtimeDependencies: DocumentIntelligenceOrchestratorRuntimeDependencies = {
    documentsRepository: dependencies.documentsRepository,
    evidenceRepository: dependencies.evidenceRepository,
    knowledgeRepository: dependencies.knowledgeRepository,
    businessPassportRepository: dependencies.businessPassportRepository,
    evidenceFactory: dependencies.evidenceFactory ?? evidenceFactory,
    evidenceService: dependencies.evidenceService ?? createEvidenceService({
      validator: evidenceValidator,
    }),
    knowledgeMapper: dependencies.knowledgeMapper ?? createEvidenceKnowledgeMapper(),
    knowledgeService: dependencies.knowledgeService ?? createKnowledgeService({
      validator: knowledgeValidator,
    }),
    knowledgeProjector: dependencies.knowledgeProjector ?? knowledgeIdentityProjector,
    ocrExtractor: dependencies.ocrExtractor,
    aiExtractor: dependencies.aiExtractor,
  };

  const stages: DocumentIntelligencePipelineStages = {
    documentIngestion: dependencies.stages?.documentIngestion ?? defaultDocumentIngestionStage,
    evidenceExtraction: dependencies.stages?.evidenceExtraction ?? defaultEvidenceExtractionStage,
    knowledgeTransformation: dependencies.stages?.knowledgeTransformation ?? defaultKnowledgeTransformationStage,
    passportEnrichment: dependencies.stages?.passportEnrichment ?? defaultPassportEnrichmentStage,
  };

  return {
    async processDocument(input: DocumentIntelligenceOrchestrationInput): Promise<DocumentIntelligencePipelineResult> {
      const context = await runProcessingPipeline({
        initialContext: createInitialProcessingContext({
          customerId: input.customerId,
          documentId: input.documentId,
          passportId: input.passportId,
        }),
        stages,
        runtimeDependencies,
      });

      return toProcessingResult(context);
    },

    async processCustomerDocuments(
      input: CustomerDocumentIntelligenceOrchestrationInput,
    ): Promise<DocumentIntelligencePipelineResult> {
      const context = await runProcessingPipeline({
        initialContext: createInitialProcessingContext({
          customerId: input.customerId,
          documentFilters: input.documentFilters,
          passportId: input.passportId,
        }),
        stages,
        runtimeDependencies,
      });

      return toProcessingResult(context);
    },
  };
}
