import type { DocumentRecord } from "@/lib/documents/documentRepository";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type {
  DocumentIntelligenceDocumentResult,
  DocumentIntelligenceOrchestratorRuntimeDependencies,
  EvidenceExtractionStage,
  ProcessingContext,
  ProcessingError,
  ProcessingOutcome,
  ProcessingStageContribution,
  ProcessingWarning,
} from "@/lib/documents/documentIntelligenceOrchestrator";

export interface MockInvoiceExtraction {
  readonly invoiceNumber: string;
  readonly invoiceDate: string;
  readonly buyer: string;
  readonly seller: string;
  readonly currency: string;
  readonly invoiceAmount: string;
  readonly paymentTerms: string;
  readonly dueDate: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isInvoiceDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return fingerprint.includes("invoice") || fingerprint.includes("commercial invoice");
}

function buildMockInvoiceExtraction(document: DocumentRecord): MockInvoiceExtraction {
  const metadata = document.metadata ?? {};

  return {
    invoiceNumber: readMetadataString(metadata, "invoiceNumber") ?? `INV-${document.document_code}`,
    invoiceDate: readMetadataString(metadata, "invoiceDate") ?? document.uploaded_at,
    buyer: readMetadataString(metadata, "buyer")
      ?? readMetadataString(metadata, "buyerName")
      ?? `Buyer ${document.document_code}`,
    seller: readMetadataString(metadata, "seller")
      ?? readMetadataString(metadata, "sellerName")
      ?? readMetadataString(metadata, "companyName")
      ?? `Seller ${document.document_code}`,
    currency: readMetadataString(metadata, "currency") ?? "AED",
    invoiceAmount: readMetadataString(metadata, "invoiceAmount") ?? "85000.00",
    paymentTerms: readMetadataString(metadata, "paymentTerms") ?? "Net 30",
    dueDate: readMetadataString(metadata, "dueDate") ?? "2026-12-31T00:00:00.000Z",
  };
}

function toInvoiceReferences(extraction: MockInvoiceExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "invoiceNumber",
      fragment: extraction.invoiceNumber,
    },
    {
      page: 1,
      section: "invoiceDate",
      fragment: extraction.invoiceDate,
    },
    {
      page: 1,
      section: "buyer",
      fragment: extraction.buyer,
    },
    {
      page: 1,
      section: "seller",
      fragment: extraction.seller,
    },
    {
      page: 1,
      section: "currency",
      fragment: extraction.currency,
    },
    {
      page: 1,
      section: "invoiceAmount",
      fragment: `${extraction.invoiceAmount} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "paymentTerms",
      fragment: extraction.paymentTerms,
    },
    {
      page: 1,
      section: "dueDate",
      fragment: extraction.dueDate,
    },
    // Compatibility mappings for current passport enrichment contracts.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.seller,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.invoiceNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.buyer,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Commercial Invoice",
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.dueDate,
    },
  ];
}

function toFallbackReferences(document: DocumentRecord): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: document.document_type || "document",
      fragment: document.original_file_name || document.file_name || document.document_code,
    },
  ];
}

async function processDocumentToEvidenceAndKnowledge(params: {
  readonly document: DocumentRecord;
  readonly references: readonly EvidenceReference[];
  readonly dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies;
}): Promise<DocumentIntelligenceDocumentResult> {
  const evidence = params.dependencies.evidenceFactory.createFromOracleDocument(
    {
      documentId: params.document.id,
      documentCode: params.document.document_code,
      mimeType: params.document.mime_type,
      checksum: params.document.checksum ?? `checksum:${params.document.id}`,
      uploadedAt: params.document.uploaded_at,
      uploadedBy: params.document.uploaded_by ?? "document-intelligence",
    },
    params.references,
  );

  const evidenceValidation = params.dependencies.evidenceService.validateEvidence(evidence, new Date().toISOString());
  const knowledge = params.dependencies.knowledgeMapper.mapEvidence(evidence);
  const knowledgeValidation = params.dependencies.knowledgeService.validateCollection(
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
  context: ProcessingContext,
  documentResults: readonly DocumentIntelligenceDocumentResult[],
): ProcessingContext {
  const warnings: ProcessingWarning[] = [...context.processingWarnings];
  const errors: ProcessingError[] = [...context.processingErrors];

  for (const result of documentResults) {
    for (const issue of result.evidenceValidation.issues) {
      if (issue.severity === "warning") {
        warnings.push({
          code: issue.code,
          message: issue.message,
          stage: "evidence-extraction",
          documentId: result.document.id,
        });
      } else {
        errors.push({
          code: issue.code,
          message: issue.message,
          stage: "evidence-extraction",
          documentId: result.document.id,
        });
      }
    }

    for (const issue of result.knowledgeValidation.issues) {
      if (issue.severity === "warning") {
        warnings.push({
          code: issue.code,
          message: issue.message,
          stage: "evidence-extraction",
          documentId: result.document.id,
        });
      } else {
        errors.push({
          code: issue.code,
          message: issue.message,
          stage: "evidence-extraction",
          documentId: result.document.id,
        });
      }
    }

    for (const warning of result.knowledge.warnings) {
      warnings.push({
        code: "knowledge.transformation.warning",
        message: warning.message,
        stage: "evidence-extraction",
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

export function createInvoiceProcessingStage(): EvidenceExtractionStage {
  return {
    name: "evidence-extraction",
    canExecute(context: ProcessingContext): boolean {
      return context.documents.length > 0;
    },
    validate(): ProcessingStageContribution {
      return {};
    },
    async execute(
      context: ProcessingContext,
      dependencies: DocumentIntelligenceOrchestratorRuntimeDependencies,
    ): Promise<ProcessingOutcome> {
      const documentResults = await Promise.all(
        context.documents.map(async (document) => {
          if (isInvoiceDocument(document)) {
            const extraction = buildMockInvoiceExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toInvoiceReferences(extraction),
              dependencies,
            });
          }

          return processDocumentToEvidenceAndKnowledge({
            document,
            references: toFallbackReferences(document),
            dependencies,
          });
        }),
      );

      const nextContext = appendProcessingValidationIssues(
        {
          ...context,
          documentResults,
          evidenceCollection: {
            items: documentResults.map((item) => item.evidence),
          },
        },
        documentResults,
      );

      return {
        context: nextContext,
      };
    },
  };
}
