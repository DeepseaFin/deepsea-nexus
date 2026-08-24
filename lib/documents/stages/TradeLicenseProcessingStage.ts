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

export interface MockTradeLicenseExtraction {
  readonly companyName: string;
  readonly tradeLicenseNumber: string;
  readonly issuingAuthority: string;
  readonly issueDate: string;
  readonly expiryDate: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isTradeLicenseDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return fingerprint.includes("trade") && fingerprint.includes("license");
}

function buildMockTradeLicenseExtraction(document: DocumentRecord): MockTradeLicenseExtraction {
  const metadata = document.metadata ?? {};

  return {
    companyName: readMetadataString(metadata, "companyName")
      ?? readMetadataString(metadata, "legalName")
      ?? `Mock Company ${document.document_code}`,
    tradeLicenseNumber: readMetadataString(metadata, "tradeLicenseNumber")
      ?? readMetadataString(metadata, "licenseNumber")
      ?? readMetadataString(metadata, "registrationNumber")
      ?? `TL-${document.document_code}`,
    issuingAuthority: readMetadataString(metadata, "issuingAuthority")
      ?? readMetadataString(metadata, "jurisdiction")
      ?? "Dubai Department of Economy and Tourism",
    issueDate: readMetadataString(metadata, "issueDate") ?? document.uploaded_at,
    expiryDate: readMetadataString(metadata, "expiryDate") ?? "2030-12-31T00:00:00.000Z",
  };
}

function toTradeLicenseReferences(extraction: MockTradeLicenseExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "legalName",
      fragment: extraction.companyName,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.tradeLicenseNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.issuingAuthority,
    },
    {
      page: 1,
      section: "issueDate",
      fragment: extraction.issueDate,
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.expiryDate,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Limited Liability Company",
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

export function createTradeLicenseProcessingStage(): EvidenceExtractionStage {
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
          if (isTradeLicenseDocument(document)) {
            const extraction = buildMockTradeLicenseExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toTradeLicenseReferences(extraction),
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
