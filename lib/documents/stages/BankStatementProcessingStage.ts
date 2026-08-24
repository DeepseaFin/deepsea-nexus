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

export interface MockBankStatementExtraction {
  readonly bankName: string;
  readonly accountHolder: string;
  readonly accountNumberMasked: string;
  readonly statementPeriod: string;
  readonly averageBalance: string;
  readonly closingBalance: string;
  readonly currency: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isBankStatementDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return fingerprint.includes("bank") && fingerprint.includes("statement");
}

function buildMockBankStatementExtraction(document: DocumentRecord): MockBankStatementExtraction {
  const metadata = document.metadata ?? {};

  return {
    bankName: readMetadataString(metadata, "bankName") ?? "Mock National Bank",
    accountHolder: readMetadataString(metadata, "accountHolder")
      ?? readMetadataString(metadata, "companyName")
      ?? `Mock Company ${document.document_code}`,
    accountNumberMasked: readMetadataString(metadata, "accountNumberMasked")
      ?? readMetadataString(metadata, "maskedAccountNumber")
      ?? "****-****-9012",
    statementPeriod: readMetadataString(metadata, "statementPeriod") ?? "2026-01-01 to 2026-01-31",
    averageBalance: readMetadataString(metadata, "averageBalance") ?? "125000.00",
    closingBalance: readMetadataString(metadata, "closingBalance") ?? "137450.55",
    currency: readMetadataString(metadata, "currency") ?? "AED",
  };
}

function toBankStatementReferences(extraction: MockBankStatementExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "bankName",
      fragment: extraction.bankName,
    },
    {
      page: 1,
      section: "accountHolder",
      fragment: extraction.accountHolder,
    },
    {
      page: 1,
      section: "accountNumberMasked",
      fragment: extraction.accountNumberMasked,
    },
    {
      page: 1,
      section: "statementPeriod",
      fragment: extraction.statementPeriod,
    },
    {
      page: 1,
      section: "averageBalance",
      fragment: `${extraction.averageBalance} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "closingBalance",
      fragment: `${extraction.closingBalance} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "currency",
      fragment: extraction.currency,
    },
    // Compatibility mappings so the existing knowledge contracts can emit facts immediately.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.accountHolder,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.accountNumberMasked,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.bankName,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Corporate Bank Account",
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.statementPeriod.split(" to ").pop() ?? extraction.statementPeriod,
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

export function createBankStatementProcessingStage(): EvidenceExtractionStage {
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
          if (isBankStatementDocument(document)) {
            const extraction = buildMockBankStatementExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toBankStatementReferences(extraction),
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
