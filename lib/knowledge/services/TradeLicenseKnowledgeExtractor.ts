import { KnowledgeSource } from "@/lib/knowledge/constants/KnowledgeSource";
import { KnowledgeStatus } from "@/lib/knowledge/constants/KnowledgeStatus";
import { KnowledgeType } from "@/lib/knowledge/constants/KnowledgeType";
import type { KnowledgeFact } from "@/lib/knowledge/domain/KnowledgeFact";
import type { KnowledgeMetadata } from "@/lib/knowledge/domain/KnowledgeMetadata";
import type { EvidenceReference } from "@/lib/evidence/domain/EvidenceReference";
import type { KnowledgeExtractionResult } from "@/lib/knowledge/services/KnowledgeExtractionResult";
import type { KnowledgeExtractionRule } from "@/lib/knowledge/services/KnowledgeExtractionRule";
import { KnowledgeId } from "@/lib/knowledge/value-objects/KnowledgeId";

export interface StructuredTradeLicenseField {
  readonly value?: string;
  readonly confidence: number;
  readonly evidenceReference: EvidenceReference;
}

export interface StructuredTradeLicenseInput {
  readonly documentId: string;
  readonly createdBy: string;
  readonly createdAt: string;
  readonly governanceVersion: string;
  readonly policyVersion: string;
  readonly legalName?: StructuredTradeLicenseField;
  readonly registrationNumber?: StructuredTradeLicenseField;
  readonly jurisdiction?: StructuredTradeLicenseField;
  readonly entityType?: StructuredTradeLicenseField;
  readonly expiryDate?: StructuredTradeLicenseField;
}

const TRADE_LICENSE_RULES: readonly KnowledgeExtractionRule[] = [
  {
    ruleId: "trade-license-legal-name",
    description: "Extract the legal name from structured trade license data.",
    sourceField: "legalName",
    targetKnowledgeFact: "legalName",
    required: true,
  },
  {
    ruleId: "trade-license-registration-number",
    description: "Extract the registration number from structured trade license data.",
    sourceField: "registrationNumber",
    targetKnowledgeFact: "registrationNumber",
    required: true,
  },
  {
    ruleId: "trade-license-jurisdiction",
    description: "Extract the jurisdiction from structured trade license data.",
    sourceField: "jurisdiction",
    targetKnowledgeFact: "jurisdiction",
    required: true,
  },
  {
    ruleId: "trade-license-entity-type",
    description: "Extract the entity type from structured trade license data.",
    sourceField: "entityType",
    targetKnowledgeFact: "entityType",
    required: true,
  },
  {
    ruleId: "trade-license-expiry-date",
    description: "Extract the expiry date from structured trade license data.",
    sourceField: "expiryDate",
    targetKnowledgeFact: "expiryDate",
    required: true,
  },
];

function buildMetadata(input: StructuredTradeLicenseInput): KnowledgeMetadata {
  return {
    createdBy: input.createdBy,
    createdAt: input.createdAt,
    updatedAt: input.createdAt,
    governanceVersion: input.governanceVersion,
    policyVersion: input.policyVersion,
  };
}

function buildFact(
  input: StructuredTradeLicenseInput,
  factName: string,
  field: StructuredTradeLicenseField,
): KnowledgeFact {
  return {
    knowledgeId: KnowledgeId.create(`${input.documentId}:${factName}`),
    knowledgeType: KnowledgeType.Identity,
    status: KnowledgeStatus.Draft,
    source: KnowledgeSource.EvidenceDerived,
    metadata: buildMetadata(input),
    factName,
    value: field.value ?? "",
    confidence: field.confidence,
    verified: false,
    verificationSource: "trade_license_structured_input",
    evidenceReferences: [field.evidenceReference],
    effectiveDate: input.createdAt,
    lastVerified: input.createdAt,
  };
}

function averageConfidence(facts: readonly KnowledgeFact[]): number {
  if (facts.length === 0) {
    return 0;
  }

  const total = facts.reduce((sum, fact) => sum + fact.confidence, 0);
  return Math.round((total / facts.length) * 100) / 100;
}

export interface TradeLicenseKnowledgeExtractor {
  extract(input: StructuredTradeLicenseInput): KnowledgeExtractionResult;
  readonly rules: readonly KnowledgeExtractionRule[];
}

export const tradeLicenseKnowledgeExtractor: TradeLicenseKnowledgeExtractor = {
  rules: TRADE_LICENSE_RULES,

  extract(input: StructuredTradeLicenseInput): KnowledgeExtractionResult {
    const facts: KnowledgeFact[] = [];
    const warnings: Array<{ field: string; message: string }> = [];
    const errors: Array<{ field: string; message: string }> = [];

    const fieldMap = {
      legalName: input.legalName,
      registrationNumber: input.registrationNumber,
      jurisdiction: input.jurisdiction,
      entityType: input.entityType,
      expiryDate: input.expiryDate,
    } as const;

    for (const rule of TRADE_LICENSE_RULES) {
      const sourceField = fieldMap[rule.sourceField as keyof typeof fieldMap];

      if (!sourceField || !sourceField.value || sourceField.value.trim().length === 0) {
        const target = { field: rule.sourceField, message: `${rule.targetKnowledgeFact} could not be extracted from structured trade license input.` };

        if (rule.required) {
          errors.push(target);
        } else {
          warnings.push(target);
        }

        continue;
      }

      facts.push(buildFact(input, rule.targetKnowledgeFact, sourceField));
    }

    return {
      facts,
      warnings,
      errors,
      confidenceSummary: {
        averageConfidence: averageConfidence(facts),
        extractedCount: facts.length,
        missingRequiredCount: errors.length,
      },
    };
  },
};
