import { KnowledgeSource } from "@/lib/knowledge/constants/KnowledgeSource";
import { KnowledgeStatus } from "@/lib/knowledge/constants/KnowledgeStatus";
import { KnowledgeType } from "@/lib/knowledge/constants/KnowledgeType";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeMetadata } from "@/lib/knowledge/domain/KnowledgeMetadata";
import type { KnowledgeValue } from "@/lib/knowledge/types/KnowledgeValue";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import { KnowledgeId } from "@/lib/knowledge/value-objects/KnowledgeId";

export interface CreateKnowledgeFactInput {
  readonly knowledgeId: string;
  readonly knowledgeType: KnowledgeType;
  readonly status: KnowledgeStatus;
  readonly source: KnowledgeSource;
  readonly metadata: KnowledgeMetadata;
  readonly factName: string;
  readonly value: KnowledgeValue;
  readonly confidence: number;
  readonly verified: boolean;
  readonly verificationSource: string;
  readonly evidenceReferences: readonly EvidenceReference[];
  readonly effectiveDate: string;
  readonly lastVerified: string;
}

export interface KnowledgeFactFactory {
  create(input: CreateKnowledgeFactInput): KnowledgeFact;
}

export const knowledgeFactFactory: KnowledgeFactFactory = {
  create(input: CreateKnowledgeFactInput): KnowledgeFact {
    return {
      knowledgeId: KnowledgeId.create(input.knowledgeId),
      knowledgeType: input.knowledgeType,
      status: input.status,
      source: input.source,
      metadata: input.metadata,
      factName: input.factName,
      value: input.value,
      confidence: input.confidence,
      verified: input.verified,
      verificationSource: input.verificationSource,
      evidenceReferences: input.evidenceReferences,
      effectiveDate: input.effectiveDate,
      lastVerified: input.lastVerified,
    };
  },
};
