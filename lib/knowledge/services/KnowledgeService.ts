import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeValidationResult } from "@/lib/knowledge/types/KnowledgeValidationResult";
import type { KnowledgeValidator } from "@/lib/knowledge/services/KnowledgeValidator";

export interface KnowledgeService {
  validateFact(fact: KnowledgeFact, validatedAt: string): KnowledgeValidationResult;
  validateCollection(collection: KnowledgeCollection, validatedAt: string): KnowledgeValidationResult;
  createCollection(facts: readonly KnowledgeFact[]): KnowledgeCollection;
}

export interface KnowledgeServiceDependencies {
  readonly validator: KnowledgeValidator;
}

export function createKnowledgeService(dependencies: KnowledgeServiceDependencies): KnowledgeService {
  return {
    validateFact(fact: KnowledgeFact, validatedAt: string): KnowledgeValidationResult {
      return dependencies.validator.validateFact(fact, validatedAt);
    },

    validateCollection(collection: KnowledgeCollection, validatedAt: string): KnowledgeValidationResult {
      return dependencies.validator.validateCollection(collection, validatedAt);
    },

    createCollection(facts: readonly KnowledgeFact[]): KnowledgeCollection {
      return {
        facts,
      };
    },
  };
}
