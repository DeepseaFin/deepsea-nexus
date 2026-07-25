import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import {
  createDocumentIntelligenceOrchestrator,
  type DocumentIntelligencePipelineResult,
} from "@/lib/documents/documentIntelligenceOrchestrator";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import type { EvidenceRepository } from "@/lib/evidence/services/EvidenceRepository";
import type { KnowledgeRepository } from "@/lib/knowledge/repositories/KnowledgeRepository";
import { createTradeLicenseProcessingStage } from "@/lib/documents/stages/TradeLicenseProcessingStage";

export interface TradeLicenseEndToEndDependencies {
  readonly documentsRepository: DocumentsRepository;
  readonly businessPassportRepository?: BusinessPassportRepository;
  readonly evidenceRepository?: EvidenceRepository;
  readonly knowledgeRepository?: KnowledgeRepository;
}

export interface TradeLicenseEndToEndInput {
  readonly documentId: string;
  readonly customerId?: string;
  readonly passportId?: PassportId | string;
}

export async function processTradeLicenseDocumentEndToEnd(
  input: TradeLicenseEndToEndInput,
  dependencies: TradeLicenseEndToEndDependencies,
): Promise<DocumentIntelligencePipelineResult> {
  const orchestrator = createDocumentIntelligenceOrchestrator({
    documentsRepository: dependencies.documentsRepository,
    businessPassportRepository: dependencies.businessPassportRepository,
    evidenceRepository: dependencies.evidenceRepository,
    knowledgeRepository: dependencies.knowledgeRepository,
    stages: {
      evidenceExtraction: createTradeLicenseProcessingStage(),
    },
  });

  return orchestrator.processDocument({
    documentId: input.documentId,
    customerId: input.customerId,
    passportId: input.passportId,
  });
}
