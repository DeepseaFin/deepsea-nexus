import { EvidenceStatus } from "@/lib/evidence/constants/EvidenceStatus";
import { EvidenceType } from "@/lib/evidence/constants/EvidenceType";
import type { Evidence } from "@/lib/evidence/domain/Evidence";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { KnowledgeTransformationResult } from "@/lib/knowledge/services/KnowledgeTransformationResult";
import type { KnowledgeExtractionValidator } from "@/lib/knowledge/services/KnowledgeExtractionValidator";
import { knowledgeExtractionValidator } from "@/lib/knowledge/services/KnowledgeExtractionValidator";
import type {
  StructuredTradeLicenseField,
  StructuredTradeLicenseInput,
  TradeLicenseKnowledgeExtractor,
} from "@/lib/knowledge/services/TradeLicenseKnowledgeExtractor";
import { tradeLicenseKnowledgeExtractor } from "@/lib/knowledge/services/TradeLicenseKnowledgeExtractor";

type TradeLicenseFieldName =
  | "legalname"
  | "registrationnumber"
  | "jurisdiction"
  | "entitytype"
  | "expirydate";

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
}

function confidenceFromEvidenceStatus(status: EvidenceStatus): number {
  if (status === EvidenceStatus.Valid) {
    return 100;
  }

  if (status === EvidenceStatus.PendingValidation) {
    return 75;
  }

  if (status === EvidenceStatus.Captured) {
    return 60;
  }

  if (status === EvidenceStatus.Superseded) {
    return 40;
  }

  return 20;
}

function findReference(
  references: readonly EvidenceReference[],
  targetField: TradeLicenseFieldName,
): EvidenceReference | undefined {
  return references.find((reference) => normalize(reference.section) === targetField);
}

function fieldFromReference(
  reference: EvidenceReference | undefined,
  confidence: number,
): StructuredTradeLicenseField | undefined {
  if (!reference || reference.fragment.trim().length === 0) {
    return undefined;
  }

  return {
    value: reference.fragment,
    confidence,
    evidenceReference: reference,
  };
}

function supportsTradeLicenseExtraction(evidence: Evidence): boolean {
  return evidence.evidenceType === EvidenceType.CorporateDocument;
}

export interface EvidenceKnowledgeMapper {
  mapEvidence(evidence: Evidence): KnowledgeTransformationResult;
}

export interface EvidenceKnowledgeMapperDependencies {
  readonly extractor: TradeLicenseKnowledgeExtractor;
  readonly validator: KnowledgeExtractionValidator;
}

export function createEvidenceKnowledgeMapper(
  dependencies: EvidenceKnowledgeMapperDependencies = {
    extractor: tradeLicenseKnowledgeExtractor,
    validator: knowledgeExtractionValidator,
  },
): EvidenceKnowledgeMapper {
  return {
    mapEvidence(evidence: Evidence): KnowledgeTransformationResult {
      if (!supportsTradeLicenseExtraction(evidence)) {
        return {
          knowledgeCollection: { facts: [] },
          validationResult: {
            isValid: true,
            issues: [],
            validatedAt: evidence.metadata.uploadedAt,
          },
          warnings: [],
          confidenceSummary: {
            averageConfidence: 0,
            extractedCount: 0,
            missingRequiredCount: 0,
          },
        };
      }

      const confidence = confidenceFromEvidenceStatus(evidence.status);
      const references = evidence.references;

      const structuredInput: StructuredTradeLicenseInput = {
        documentId: evidence.metadata.documentId,
        createdBy: evidence.metadata.uploadedBy,
        createdAt: evidence.metadata.uploadedAt,
        governanceVersion: evidence.metadata.sourceSystem,
        policyVersion: evidence.metadata.retentionPolicy,
        legalName: fieldFromReference(findReference(references, "legalname"), confidence),
        registrationNumber: fieldFromReference(findReference(references, "registrationnumber"), confidence),
        jurisdiction: fieldFromReference(findReference(references, "jurisdiction"), confidence),
        entityType: fieldFromReference(findReference(references, "entitytype"), confidence),
        expiryDate: fieldFromReference(findReference(references, "expirydate"), confidence),
      };

      const result = dependencies.extractor.extract(structuredInput);
      const validationResult = dependencies.validator.validate(
        dependencies.extractor.rules,
        result,
        evidence.metadata.uploadedAt,
      );

      return {
        knowledgeCollection: {
          facts: result.facts,
        },
        validationResult,
        warnings: result.warnings,
        confidenceSummary: result.confidenceSummary,
      };
    },
  };
}

export const evidenceKnowledgeMapper = createEvidenceKnowledgeMapper();
