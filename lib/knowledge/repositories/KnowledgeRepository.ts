import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeId } from "@/lib/knowledge/value-objects/KnowledgeId";

export interface KnowledgeRepository {
  findById(knowledgeId: KnowledgeId): Promise<KnowledgeFact | null>;
  listByFactName(factName: string): Promise<readonly KnowledgeFact[]>;
  save(fact: KnowledgeFact): Promise<void>;
  saveCollection(collection: KnowledgeCollection): Promise<void>;
}
