import type { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import {
  createDocumentIntelligenceOrchestrator,
  type DocumentIntelligencePipelineResult,
} from "@/lib/documents/documentIntelligenceOrchestrator";
import { createDocumentProcessingStageRegistry } from "@/lib/documents/documentProcessingStageRegistry";
import type { DocumentsRepository } from "@/lib/documents/repositories/DocumentsRepository";
import type { EvidenceRepository } from "@/lib/evidence/services/EvidenceRepository";
import type { KnowledgeRepository } from "@/lib/knowledge/repositories/KnowledgeRepository";
import { createBankStatementProcessingStage } from "@/lib/documents/stages/BankStatementProcessingStage";

export interface BankStatementEndToEndDependencies {
  readonly documentsRepository: DocumentsRepository;
  readonly businessPassportRepository?: BusinessPassportRepository;
  readonly evidenceRepository?: EvidenceRepository;
  readonly knowledgeRepository?: KnowledgeRepository;
}

export interface BankStatementEndToEndInput {
  readonly documentId: string;
  readonly customerId?: string;
  readonly passportId?: PassportId | string;
}

export async function processBankStatementDocumentEndToEnd(
  input: BankStatementEndToEndInput,
  dependencies: BankStatementEndToEndDependencies,
): Promise<DocumentIntelligencePipelineResult> {
  const evidenceExtractionStage = createBankStatementProcessingStage();
  const stageRegistry = createDocumentProcessingStageRegistry();

  const orchestrator = createDocumentIntelligenceOrchestrator({
    documentsRepository: dependencies.documentsRepository,
    businessPassportRepository: dependencies.businessPassportRepository,
    evidenceRepository: dependencies.evidenceRepository,
    knowledgeRepository: dependencies.knowledgeRepository,
    stageRegistry,
    stages: {
      evidenceExtraction: evidenceExtractionStage,
    },
  });

  return orchestrator.processDocument({
    documentId: input.documentId,
    customerId: input.customerId,
    passportId: input.passportId,
  });
}
