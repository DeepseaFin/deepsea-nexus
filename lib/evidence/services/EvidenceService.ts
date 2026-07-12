import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceCollection } from "@/lib/evidence/domain/EvidenceCollection";
import type { EvidenceValidationResult } from "@/lib/evidence/types/EvidenceValidationResult";
import type { EvidenceValidator } from "@/lib/evidence/services/EvidenceValidator";

export interface EvidenceService {
  validateEvidence(evidence: Evidence, validatedAt: string): EvidenceValidationResult;
  validateCollection(collection: EvidenceCollection, validatedAt: string): EvidenceValidationResult;
  createCollection(items: readonly Evidence[]): EvidenceCollection;
}

export interface EvidenceServiceDependencies {
  readonly validator: EvidenceValidator;
}

export function createEvidenceService(dependencies: EvidenceServiceDependencies): EvidenceService {
  return {
    validateEvidence(evidence: Evidence, validatedAt: string): EvidenceValidationResult {
      return dependencies.validator.validateEvidence(evidence, validatedAt);
    },

    validateCollection(collection: EvidenceCollection, validatedAt: string): EvidenceValidationResult {
      return dependencies.validator.validateCollection(collection, validatedAt);
    },

    createCollection(items: readonly Evidence[]): EvidenceCollection {
      return {
        items,
      };
    },
  };
}
