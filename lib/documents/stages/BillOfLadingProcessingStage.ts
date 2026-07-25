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

export interface MockBillOfLadingExtraction {
  readonly billOfLadingNumber: string;
  readonly carrier: string;
  readonly vesselName: string;
  readonly voyageNumber: string;
  readonly portOfLoading: string;
  readonly portOfDischarge: string;
  readonly shipper: string;
  readonly consignee: string;
  readonly notifyParty: string;
  readonly goodsDescription: string;
  readonly numberOfPackages: string;
  readonly grossWeight: string;
  readonly containerNumber: string;
  readonly sealNumber: string;
  readonly shipmentDate: string;
}

function readMetadataString(metadata: Record<string, unknown>, key: string): string | undefined {
  const value = metadata[key];
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function isBillOfLadingDocument(document: DocumentRecord): boolean {
  const fingerprint = [document.document_type, document.file_name, document.original_file_name]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    fingerprint.includes("bill of lading")
    || fingerprint.includes("bol")
    || (fingerprint.includes("bill") && fingerprint.includes("lading"))
  );
}

function buildMockBillOfLadingExtraction(document: DocumentRecord): MockBillOfLadingExtraction {
  const metadata = document.metadata ?? {};

  return {
    billOfLadingNumber: readMetadataString(metadata, "billOfLadingNumber") ?? `BL-${document.document_code}`,
    carrier: readMetadataString(metadata, "carrier") ?? "Mock Ocean Carrier Ltd",
    vesselName: readMetadataString(metadata, "vesselName") ?? "MV Deepsea Horizon",
    voyageNumber: readMetadataString(metadata, "voyageNumber") ?? "VY-2048",
    portOfLoading: readMetadataString(metadata, "portOfLoading") ?? "Jebel Ali, UAE",
    portOfDischarge: readMetadataString(metadata, "portOfDischarge") ?? "Rotterdam, NL",
    shipper: readMetadataString(metadata, "shipper")
      ?? readMetadataString(metadata, "seller")
      ?? `Shipper ${document.document_code}`,
    consignee: readMetadataString(metadata, "consignee")
      ?? readMetadataString(metadata, "buyer")
      ?? `Consignee ${document.document_code}`,
    notifyParty: readMetadataString(metadata, "notifyParty") ?? "Notify Desk",
    goodsDescription: readMetadataString(metadata, "goodsDescription") ?? "Commercial goods in sealed containers",
    numberOfPackages: readMetadataString(metadata, "numberOfPackages") ?? "120",
    grossWeight: readMetadataString(metadata, "grossWeight") ?? "18250 KG",
    containerNumber: readMetadataString(metadata, "containerNumber") ?? "MSCU1234567",
    sealNumber: readMetadataString(metadata, "sealNumber") ?? "SL987654",
    shipmentDate: readMetadataString(metadata, "shipmentDate") ?? document.uploaded_at,
  };
}

function toBillOfLadingReferences(extraction: MockBillOfLadingExtraction): readonly EvidenceReference[] {
  return [
    {
      page: 1,
      section: "billOfLadingNumber",
      fragment: extraction.billOfLadingNumber,
    },
    {
      page: 1,
      section: "carrier",
      fragment: extraction.carrier,
    },
    {
      page: 1,
      section: "vesselName",
      fragment: extraction.vesselName,
    },
    {
      page: 1,
      section: "voyageNumber",
      fragment: extraction.voyageNumber,
    },
    {
      page: 1,
      section: "portOfLoading",
      fragment: extraction.portOfLoading,
    },
    {
      page: 1,
      section: "portOfDischarge",
      fragment: extraction.portOfDischarge,
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
      section: "notifyParty",
      fragment: extraction.notifyParty,
    },
    {
      page: 1,
      section: "goodsDescription",
      fragment: extraction.goodsDescription,
    },
    {
      page: 1,
      section: "numberOfPackages",
      fragment: extraction.numberOfPackages,
    },
    {
      page: 1,
      section: "grossWeight",
      fragment: extraction.grossWeight,
    },
    {
      page: 1,
      section: "containerNumber",
      fragment: extraction.containerNumber,
    },
    {
      page: 1,
      section: "sealNumber",
      fragment: extraction.sealNumber,
    },
    {
      page: 1,
      section: "shipmentDate",
      fragment: extraction.shipmentDate,
    },
    {
      page: 1,
      section: "shipmentCompletion",
      fragment: `B/L ${extraction.billOfLadingNumber} loaded at ${extraction.portOfLoading} and routed to ${extraction.portOfDischarge}`,
    },
    // Compatibility mappings for current knowledge and passport enrichment contracts.
    {
      page: 1,
      section: "legalName",
      fragment: extraction.shipper,
    },
    {
      page: 1,
      section: "registrationNumber",
      fragment: extraction.billOfLadingNumber,
    },
    {
      page: 1,
      section: "jurisdiction",
      fragment: extraction.portOfLoading,
    },
    {
      page: 1,
      section: "entityType",
      fragment: "Shipping Document",
    },
    {
      page: 1,
      section: "expiryDate",
      fragment: extraction.shipmentDate,
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

export function createBillOfLadingProcessingStage(): EvidenceExtractionStage {
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
          if (isBillOfLadingDocument(document)) {
            const extraction = buildMockBillOfLadingExtraction(document);
            return processDocumentToEvidenceAndKnowledge({
              document,
              references: toBillOfLadingReferences(extraction),
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
