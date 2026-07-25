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

export interface MockPackingListExtraction {
  readonly packingListNumber: string;
  readonly relatedInvoiceNumber: string;
  readonly shipper: string;
  readonly consignee: string;
  readonly numberOfPackages: string;
  readonly packageTypes: string;
  readonly grossWeight: string;
  readonly netWeight: string;
  readonly dimensions: string;
  readonly goodsDescription: string;
  readonly marksAndNumbers: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isPackingListDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    fingerprint.includes("packing list")
    || (fingerprint.includes("packing") && fingerprint.includes("list"))
  );
}

function buildMockPackingListExtraction(document: DocumentRecord): MockPackingListExtraction {
  const metadata = document.metadata ?? {};

  return {
    packingListNumber: readMetadataString(metadata, "packingListNumber") ?? `PL-${document.document_code}`,
    relatedInvoiceNumber: readMetadataString(metadata, "relatedInvoiceNumber")
      ?? readMetadataString(metadata, "invoiceNumber")
      ?? `INV-${document.document_code}`,
    shipper: readMetadataString(metadata, "shipper")
      ?? readMetadataString(metadata, "seller")
      ?? `Shipper ${document.document_code}`,
    consignee: readMetadataString(metadata, "consignee")
      ?? readMetadataString(metadata, "buyer")
      ?? `Consignee ${document.document_code}`,
    numberOfPackages: readMetadataString(metadata, "numberOfPackages") ?? "84",
    packageTypes: readMetadataString(metadata, "packageTypes") ?? "Corrugated cartons",
    grossWeight: readMetadataString(metadata, "grossWeight") ?? "12640 KG",
    netWeight: readMetadataString(metadata, "netWeight") ?? "11985 KG",
    dimensions: readMetadataString(metadata, "dimensions") ?? "120x80x160 cm",
    goodsDescription: readMetadataString(metadata, "goodsDescription") ?? "Industrial equipment components",
    marksAndNumbers: readMetadataString(metadata, "marksAndNumbers") ?? "PKG-001 to PKG-084",
  };
}

function toPackingListReferences(extraction: MockPackingListExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "packingListNumber",
      fragment: extraction.packingListNumber,
    },
    {
      page: 1,
      section: "relatedInvoiceNumber",
      fragment: extraction.relatedInvoiceNumber,
    },
    {
      page: 1,
      section: "shipper",
      fragment: extraction.shipper,
    },
    {
      page: 1,
      section: "consignee",
      fragment: extraction.consignee,
    },
    {
      page: 1,
      section: "numberOfPackages",
      fragment: extraction.numberOfPackages,
    },
    {
      page: 1,
      section: "packageTypes",
      fragment: extraction.packageTypes,
    },
    {
      page: 1,
      section: "grossWeight",
      fragment: extraction.grossWeight,
    },
    {
      page: 1,
      section: "netWeight",
      fragment: extraction.netWeight,
    },
    {
      page: 1,
      section: "dimensions",
      fragment: extraction.dimensions,
    },
    {
      page: 1,
      section: "goodsDescription",
      fragment: extraction.goodsDescription,
    },
    {
      page: 1,
      section: "marksAndNumbers",
      fragment: extraction.marksAndNumbers,
    },
    {
      page: 1,
      section: "shipmentContents",
      fragment: `${extraction.numberOfPackages} ${extraction.packageTypes} containing ${extraction.goodsDescription}`,
    },
    // Compatibility mappings for existing knowledge and passport enrichment flow.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.shipper,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.packingListNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.consignee,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Packing List",
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.relatedInvoiceNumber,
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

export function createPackingListProcessingStage(): EvidenceExtractionStage {
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
          if (isPackingListDocument(document)) {
            const extraction = buildMockPackingListExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toPackingListReferences(extraction),
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
