import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";

export interface KnowledgeCollection {
  readonly facts: readonly KnowledgeFact[];
}
