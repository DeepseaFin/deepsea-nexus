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

export interface MockCertificateOfIncorporationExtraction {
  readonly companyName: string;
  readonly registrationNumber: string;
  readonly incorporationDate: string;
  readonly jurisdiction: string;
  readonly legalStructure: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isCertificateOfIncorporationDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return fingerprint.includes("certificate") && fingerprint.includes("incorporation");
}

function buildMockCertificateExtraction(document: DocumentRecord): MockCertificateOfIncorporationExtraction {
  const metadata = document.metadata ?? {};

  return {
    companyName: readMetadataString(metadata, "companyName")
      ?? readMetadataString(metadata, "legalName")
      ?? `Mock Company ${document.document_code}`,
    registrationNumber: readMetadataString(metadata, "registrationNumber")
      ?? readMetadataString(metadata, "tradeLicenseNumber")
      ?? `REG-${document.document_code}`,
    incorporationDate: readMetadataString(metadata, "dateOfIncorporation")
      ?? readMetadataString(metadata, "incorporationDate")
      ?? document.uploaded_at,
    jurisdiction: readMetadataString(metadata, "jurisdiction")
      ?? readMetadataString(metadata, "issuingAuthority")
      ?? "United Arab Emirates",
    legalStructure: readMetadataString(metadata, "legalStructure")
      ?? readMetadataString(metadata, "entityType")
      ?? "Limited Liability Company",
  };
}

function toCertificateReferences(
  extraction: MockCertificateOfIncorporationExtraction,
): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "legalName",
      fragment: extraction.companyName,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.registrationNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.jurisdiction,
    },
    {
      page: 1,
      section: "entityType",
      fragment: extraction.legalStructure,
    },
    {
      page: 1,
      section: "incorporationDate",
      fragment: extraction.incorporationDate,
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.incorporationDate,
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

export function createCertificateOfIncorporationProcessingStage(): EvidenceExtractionStage {
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
          if (isCertificateOfIncorporationDocument(document)) {
            const extraction = buildMockCertificateExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toCertificateReferences(extraction),
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
