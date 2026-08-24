import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { KnowledgeProjectionResult } from "@/lib/business-passport/projections/KnowledgeProjectionResult";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { KnowledgeCollection } from "@/lib/knowledge/domain/KnowledgeCollection";
import type { KnowledgeValidationResult } from "@/lib/knowledge/types/KnowledgeValidationResult";
import type { EvidenceValidationResult } from "@/lib/evidence/types/EvidenceValidationResult";

export interface BusinessOnboardingValidation {
  readonly evidence: EvidenceValidationResult;
  readonly knowledge: KnowledgeValidationResult;
  readonly projection: {
    readonly valid: boolean;
    readonly checks: readonly string[];
  };
}

export interface BusinessOnboardingResult {
  readonly evidence: Evidence;
  readonly knowledge: KnowledgeCollection;
  readonly passport: BusinessPassport;
  readonly projection: KnowledgeProjectionResult;
  readonly validation: BusinessOnboardingValidation;
  readonly warnings: readonly string[];
}