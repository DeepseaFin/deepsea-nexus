import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import { PassportId as PassportIdValueObject } from "@/lib/business-passport/value-objects/PassportId";
import { knowledgeIdentityProjector, type KnowledgeIdentityProjector } from "@/lib/business-passport/projections/KnowledgeIdentityProjector";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { DocumentRecord, ListDocumentsFilters } from "@/lib/documents/documentRepository";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
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

export interface DocumentIntelligenceProcessingResult {
  readonly document: DocumentRecord;
  readonly evidence: Evidence;
  readonly evidenceValidation: ReturnType<EvidenceService["validateEvidence"]>;
  readonly knowledge: KnowledgeTransformationResult;
  readonly knowledgeValidation: ReturnType<KnowledgeService["validateCollection"]>;
}

export interface DocumentIntelligencePipelineResult {
  readonly processedAt: string;
  readonly documents: readonly DocumentIntelligenceProcessingResult[];
  readonly evidenceCollection: {
    readonly items: readonly Evidence[];
  };
  readonly knowledgeCollection: KnowledgeCollection;
  readonly updatedPassport?: BusinessPassport;
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

function toKnowledgeCollection(
  items: readonly DocumentIntelligenceProcessingResult[],
): KnowledgeCollection {
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

async function persistEvidenceAndKnowledge(params: {
  readonly evidenceRepository: EvidenceRepository | undefined;
  readonly knowledgeRepository: KnowledgeRepository | undefined;
  readonly evidenceItems: readonly Evidence[];
  readonly knowledgeCollection: KnowledgeCollection;
}): Promise<void> {
  if (params.evidenceRepository) {
    await params.evidenceRepository.saveCollection({
      items: params.evidenceItems,
    });
  }

  if (params.knowledgeRepository) {
    await params.knowledgeRepository.saveCollection(params.knowledgeCollection);
  }
}

async function processSingleDocument(params: {
  readonly document: DocumentRecord;
  readonly evidenceFactory: EvidenceFactory;
  readonly evidenceService: EvidenceService;
  readonly knowledgeMapper: EvidenceKnowledgeMapper;
  readonly knowledgeService: KnowledgeService;
  readonly ocrExtractor: DocumentOcrExtractor | undefined;
  readonly aiExtractor: DocumentAiExtractor | undefined;
}): Promise<DocumentIntelligenceProcessingResult> {
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

export function createDocumentIntelligenceOrchestrator(
  dependencies: DocumentIntelligenceOrchestratorDependencies,
): DocumentIntelligenceOrchestrator {
  const evidenceService = dependencies.evidenceService ?? createEvidenceService({
    validator: evidenceValidator,
  });
  const knowledgeMapper = dependencies.knowledgeMapper ?? createEvidenceKnowledgeMapper();
  const knowledgeService = dependencies.knowledgeService ?? createKnowledgeService({
    validator: knowledgeValidator,
  });
  const evidenceFactoryDependency = dependencies.evidenceFactory ?? evidenceFactory;
  const knowledgeProjector = dependencies.knowledgeProjector ?? knowledgeIdentityProjector;

  return {
    async processDocument(input: DocumentIntelligenceOrchestrationInput): Promise<DocumentIntelligencePipelineResult> {
      const document = await dependencies.documentsRepository.findById(input.documentId);
      if (!document) {
        throw new Error(`Document ${input.documentId} was not found.`);
      }

      const processedItem = await processSingleDocument({
        document,
        evidenceFactory: evidenceFactoryDependency,
        evidenceService,
        knowledgeMapper,
        knowledgeService,
        ocrExtractor: dependencies.ocrExtractor,
        aiExtractor: dependencies.aiExtractor,
      });

      const evidenceItems = [processedItem.evidence];
      const knowledgeCollection = toKnowledgeCollection([processedItem]);

      await persistEvidenceAndKnowledge({
        evidenceRepository: dependencies.evidenceRepository,
        knowledgeRepository: dependencies.knowledgeRepository,
        evidenceItems,
        knowledgeCollection,
      });

      const currentPassport = await resolvePassport({
        businessPassportRepository: dependencies.businessPassportRepository,
        passportId: input.passportId,
      });

      let updatedPassport: BusinessPassport | undefined;
      if (currentPassport) {
        const projection = knowledgeProjector.project(knowledgeCollection, currentPassport);
        updatedPassport = projection.updatedPassport;
        await dependencies.businessPassportRepository?.save(updatedPassport);
      }

      return {
        processedAt: new Date().toISOString(),
        documents: [processedItem],
        evidenceCollection: {
          items: evidenceItems,
        },
        knowledgeCollection,
        updatedPassport,
      };
    },

    async processCustomerDocuments(
      input: CustomerDocumentIntelligenceOrchestrationInput,
    ): Promise<DocumentIntelligencePipelineResult> {
      const filters: ListDocumentsFilters = {
        ...(input.documentFilters ?? {}),
      };

      if (input.customerId && !filters.client_id) {
        filters.client_id = input.customerId;
      }

      const documents = await dependencies.documentsRepository.list(filters);
      const processedItems = await Promise.all(
        documents.map((document) =>
          processSingleDocument({
            document,
            evidenceFactory: evidenceFactoryDependency,
            evidenceService,
            knowledgeMapper,
            knowledgeService,
            ocrExtractor: dependencies.ocrExtractor,
            aiExtractor: dependencies.aiExtractor,
          }),
        ),
      );

      const evidenceItems = processedItems.map((item) => item.evidence);
      const knowledgeCollection = toKnowledgeCollection(processedItems);

      await persistEvidenceAndKnowledge({
        evidenceRepository: dependencies.evidenceRepository,
        knowledgeRepository: dependencies.knowledgeRepository,
        evidenceItems,
        knowledgeCollection,
      });

      const currentPassport = await resolvePassport({
        businessPassportRepository: dependencies.businessPassportRepository,
        passportId: input.passportId,
      });

      let updatedPassport: BusinessPassport | undefined;
      if (currentPassport) {
        const projection = knowledgeProjector.project(knowledgeCollection, currentPassport);
        updatedPassport = projection.updatedPassport;
        await dependencies.businessPassportRepository?.save(updatedPassport);
      }

      return {
        processedAt: new Date().toISOString(),
        documents: processedItems,
        evidenceCollection: {
          items: evidenceItems,
        },
        knowledgeCollection,
        updatedPassport,
      };
    },
  };
}
