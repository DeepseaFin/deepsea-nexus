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

export interface MockInsuranceCertificateExtraction {
  readonly certificateNumber: string;
  readonly insurer: string;
  readonly policyNumber: string;
  readonly insuredParty: string;
  readonly beneficiary: string;
  readonly coverageType: string;
  readonly coverageAmount: string;
  readonly currency: string;
  readonly effectiveDate: string;
  readonly expiryDate: string;
  readonly coveredShipmentReference: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isInsuranceCertificateDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    fingerprint.includes("insurance certificate")
    || (fingerprint.includes("insurance") && fingerprint.includes("certificate"))
  );
}

function buildMockInsuranceCertificateExtraction(document: DocumentRecord): MockInsuranceCertificateExtraction {
  const metadata = document.metadata ?? {};

  return {
    certificateNumber: readMetadataString(metadata, "certificateNumber") ?? `IC-${document.document_code}`,
    insurer: readMetadataString(metadata, "insurer") ?? "Mock Marine Insurers Ltd",
    policyNumber: readMetadataString(metadata, "policyNumber") ?? `POL-${document.document_code}`,
    insuredParty: readMetadataString(metadata, "insuredParty")
      ?? readMetadataString(metadata, "shipper")
      ?? `Insured Party ${document.document_code}`,
    beneficiary: readMetadataString(metadata, "beneficiary")
      ?? readMetadataString(metadata, "consignee")
      ?? `Beneficiary ${document.document_code}`,
    coverageType: readMetadataString(metadata, "coverageType") ?? "All-risk marine cargo",
    coverageAmount: readMetadataString(metadata, "coverageAmount") ?? "500000.00",
    currency: readMetadataString(metadata, "currency") ?? "AED",
    effectiveDate: readMetadataString(metadata, "effectiveDate") ?? document.uploaded_at,
    expiryDate: readMetadataString(metadata, "expiryDate") ?? "2027-12-31T00:00:00.000Z",
    coveredShipmentReference: readMetadataString(metadata, "coveredShipmentReference")
      ?? readMetadataString(metadata, "billOfLadingNumber")
      ?? `BL-${document.document_code}`,
  };
}

function toInsuranceCertificateReferences(
  extraction: MockInsuranceCertificateExtraction,
): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "certificateNumber",
      fragment: extraction.certificateNumber,
    },
    {
      page: 1,
      section: "insurer",
      fragment: extraction.insurer,
    },
    {
      page: 1,
      section: "policyNumber",
      fragment: extraction.policyNumber,
    },
    {
      page: 1,
      section: "insuredParty",
      fragment: extraction.insuredParty,
    },
    {
      page: 1,
      section: "beneficiary",
      fragment: extraction.beneficiary,
    },
    {
      page: 1,
      section: "coverageType",
      fragment: extraction.coverageType,
    },
    {
      page: 1,
      section: "coverageAmount",
      fragment: `${extraction.coverageAmount} ${extraction.currency}`,
    },
    {
      page: 1,
      section: "currency",
      fragment: extraction.currency,
    },
    {
      page: 1,
      section: "effectiveDate",
      fragment: extraction.effectiveDate,
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.expiryDate,
    },
    {
      page: 1,
      section: "coveredShipmentReference",
      fragment: extraction.coveredShipmentReference,
    },
    {
      page: 1,
      section: "shipmentRiskCoverage",
      fragment:
        `${extraction.coverageType} coverage ${extraction.coverageAmount} ${extraction.currency} for shipment ${extraction.coveredShipmentReference}`,
    },
    // Compatibility mappings for current knowledge and passport enrichment contracts.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.insuredParty,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.policyNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.insurer,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Insurance Certificate",
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

export function createInsuranceCertificateProcessingStage(): EvidenceExtractionStage {
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
          if (isInsuranceCertificateDocument(document)) {
            const extraction = buildMockInsuranceCertificateExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toInsuranceCertificateReferences(extraction),
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
