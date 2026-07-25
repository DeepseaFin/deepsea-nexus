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

export interface MockFinancialStatementExtraction {
  readonly reportingPeriod: string;
  readonly revenue: string;
  readonly netProfit: string;
  readonly totalAssets: string;
  readonly totalLiabilities: string;
  readonly equity: string;
  readonly auditorName: string;
  readonly currency: string;
  readonly companyName: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isFinancialStatementDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return fingerprint.includes("financial") && fingerprint.includes("statement");
}

function buildMockFinancialStatementExtraction(document: DocumentRecord): MockFinancialStatementExtraction {
  const metadata = document.metadata ?? {};

  return {
    reportingPeriod: readMetadataString(metadata, "reportingPeriod") ?? "FY2025",
    revenue: readMetadataString(metadata, "revenue") ?? "24500000.00",
    netProfit: readMetadataString(metadata, "netProfit") ?? "3180000.00",
    totalAssets: readMetadataString(metadata, "totalAssets") ?? "56100000.00",
    totalLiabilities: readMetadataString(metadata, "totalLiabilities") ?? "22450000.00",
    equity: readMetadataString(metadata, "equity") ?? "33650000.00",
    auditorName: readMetadataString(metadata, "auditorName") ?? "Mock Audit Partners LLC",
    currency: readMetadataString(metadata, "currency") ?? "AED",
    companyName: readMetadataString(metadata, "companyName")
      ?? readMetadataString(metadata, "legalName")
      ?? `Mock Company ${document.document_code}`,
  };
}

function toFinancialStatementReferences(extraction: MockFinancialStatementExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "reportingPeriod",
      fragment: extraction.reportingPeriod,
    },
    {
      page: 1,
      section: "revenue",
      fragment: `${extraction.revenue} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "netProfit",
      fragment: `${extraction.netProfit} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "totalAssets",
      fragment: `${extraction.totalAssets} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "totalLiabilities",
      fragment: `${extraction.totalLiabilities} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "equity",
      fragment: `${extraction.equity} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "auditorName",
      fragment: extraction.auditorName,
    },
    {
      page: 1,
      section: "currency",
      fragment: extraction.currency,
    },
    // Compatibility mappings for current knowledge-to-passport enrichment.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.companyName,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: `FIN-${extraction.reportingPeriod}`,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.auditorName,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Financial Statement",
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.reportingPeriod,
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

export function createFinancialStatementProcessingStage(): EvidenceExtractionStage {
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
          if (isFinancialStatementDocument(document)) {
            const extraction = buildMockFinancialStatementExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toFinancialStatementReferences(extraction),
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
