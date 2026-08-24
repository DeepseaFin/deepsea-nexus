import type { KnowledgeSource } from "@/lib/knowledge/constants/KnowledgeSource";
import type { KnowledgeStatus } from "@/lib/knowledge/constants/KnowledgeStatus";
import type { KnowledgeType } from "@/lib/knowledge/constants/KnowledgeType";
import type { KnowledgeMetadata } from "@/lib/knowledge/domain/KnowledgeMetadata";
import type { KnowledgeValue } from "@/lib/knowledge/types/KnowledgeValue";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { KnowledgeId } from "@/lib/knowledge/value-objects/KnowledgeId";

export interface KnowledgeFact {
  readonly knowledgeId: KnowledgeId;
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
