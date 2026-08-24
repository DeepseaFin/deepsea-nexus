import type { EvidenceCorrelationEngine } from "@/lib/intelligence/EvidenceCorrelationEngine";
import type { RelationshipConfidenceEngine } from "@/lib/intelligence/RelationshipConfidenceEngine";
import type { RelationshipIntelligenceEngine } from "@/lib/intelligence/RelationshipIntelligenceEngine";
import type { RelationshipInsightsInput, RelationshipInsightsReport, RelationshipInsightItem } from "@/lib/intelligence/RelationshipInsightsTypes";

function buildExecutiveSummary(params: {
  readonly confidenceScore: number;
  readonly confidenceBand: string;
  readonly validEvidence: number;
  readonly totalEvidence: number;
  readonly conflictingFacts: number;
  readonly missingDocuments: number;
}): RelationshipInsightsReport["executiveSummary"] {
  const headline = params.confidenceScore >= 75
    ? "Relationship quality is strong with broad supporting evidence."
    : params.confidenceScore >= 50
      ? "Relationship quality is moderate and can be improved with targeted remediation."
      : "Relationship quality is weak and requires immediate information remediation.";

  return {
    headline,
    confidenceSnapshot: `Overall confidence ${params.confidenceScore} (${params.confidenceBand}).`,
    evidenceSnapshot: `Validated evidence ${params.validEvidence}/${params.totalEvidence}.`,
    riskSnapshot:
      `${params.conflictingFacts} conflicting fact(s), ${params.missingDocuments} missing required document category(ies).`,
  };
}

function buildStrengths(params: {
  readonly confidenceScore: number;
  readonly verifiedFacts: number;
  readonly totalFacts: number;
  readonly counterparties: readonly string[];
  readonly validEvidence: number;
  readonly totalEvidence: number;
}): readonly RelationshipInsightItem[] {
  const strengths: RelationshipInsightItem[] = [];

  if (params.confidenceScore >= 75) {
    strengths.push({
      code: "confidence.high",
      message: `Overall confidence is high at ${params.confidenceScore}.`,
    });
  }

  if (params.totalFacts > 0 && params.verifiedFacts / params.totalFacts >= 0.6) {
    strengths.push({
      code: "knowledge.verified",
      message: `${params.verifiedFacts} of ${params.totalFacts} knowledge facts are verified.`,
    });
  }

  if (params.totalEvidence > 0 && params.validEvidence / params.totalEvidence >= 0.6) {
    strengths.push({
      code: "evidence.validated",
      message: `${params.validEvidence} of ${params.totalEvidence} evidence items are valid.`,
    });
  }

  if (params.counterparties.length >= 2) {
    strengths.push({
      code: "trade.counterparties",
      message: `Trade activity includes ${params.counterparties.length} identified counterparties.`,
    });
  }

  return strengths;
}

function buildGaps(params: {
  readonly missingDocuments: readonly string[];
  readonly pendingEvidence: number;
  readonly invalidEvidence: number;
  readonly missingComplianceSignals: boolean;
  readonly missingIdentityFields: readonly string[];
}): readonly RelationshipInsightItem[] {
  const gaps: RelationshipInsightItem[] = [];

  for (const missing of params.missingDocuments) {
    gaps.push({
      code: "documents.missing",
      message: `Missing required document category: ${missing}.`,
    });
  }

  if (params.pendingEvidence > 0) {
    gaps.push({
      code: "evidence.pending",
      message: `${params.pendingEvidence} evidence item(s) remain pending validation.`,
    });
  }

  if (params.invalidEvidence > 0) {
    gaps.push({
      code: "evidence.invalid",
      message: `${params.invalidEvidence} evidence item(s) are invalid.`,
    });
  }

  if (params.missingComplianceSignals) {
    gaps.push({
      code: "compliance.signals_missing",
      message: "Compliance profile has no active compliance signals.",
    });
  }

  if (params.missingIdentityFields.length > 0) {
    gaps.push({
      code: "identity.incomplete",
      message: `Missing identity attributes: ${params.missingIdentityFields.join(", ")}.`,
    });
  }

  return gaps;
}

function buildInconsistencies(params: {
  readonly conflictingFacts: readonly { fact: string; variants: number }[];
  readonly confidenceDrivers: readonly { kind: "positive" | "negative"; message: string }[];
}): readonly RelationshipInsightItem[] {
  const inconsistencies: RelationshipInsightItem[] = [];

  for (const conflict of params.conflictingFacts) {
    inconsistencies.push({
      code: "evidence.conflict",
      message: `Fact ${conflict.fact} has ${conflict.variants} conflicting value variants.`,
    });
  }

  for (const driver of params.confidenceDrivers) {
    if (driver.kind !== "negative") {
      continue;
    }

    inconsistencies.push({
      code: "confidence.negative_driver",
      message: driver.message,
    });
  }

  return inconsistencies;
}

function buildNextSteps(params: {
  readonly missingDocuments: readonly string[];
  readonly conflictingFacts: readonly string[];
  readonly pendingEvidence: number;
  readonly invalidEvidence: number;
  readonly confidenceScore: number;
}): readonly string[] {
  const steps: string[] = [];

  if (params.missingDocuments.length > 0) {
    steps.push(`Collect required documents: ${params.missingDocuments.join(", ")}.`);
  }

  if (params.conflictingFacts.length > 0) {
    steps.push(`Resolve conflicting evidence for: ${params.conflictingFacts.join(", ")}.`);
  }

  if (params.pendingEvidence > 0) {
    steps.push(`Complete validation workflow for ${params.pendingEvidence} pending evidence item(s).`);
  }

  if (params.invalidEvidence > 0) {
    steps.push(`Replace or remediate ${params.invalidEvidence} invalid evidence item(s).`);
  }

  if (params.confidenceScore < 60) {
    steps.push("Prioritize identity and financial profile completion to improve relationship confidence.");
  }

  if (steps.length === 0) {
    steps.push("Maintain current evidence quality and monitor for new inconsistencies.");
  }

  return steps;
}

export interface RelationshipInsightsEngineDependencies {
  readonly relationshipIntelligenceEngine: RelationshipIntelligenceEngine;
  readonly evidenceCorrelationEngine: EvidenceCorrelationEngine;
  readonly relationshipConfidenceEngine: RelationshipConfidenceEngine;
}

export interface RelationshipInsightsEngine {
  generateInsights(input: RelationshipInsightsInput): Promise<RelationshipInsightsReport>;
}

export function createRelationshipInsightsEngine(
  dependencies: RelationshipInsightsEngineDependencies,
): RelationshipInsightsEngine {
  return {
    async generateInsights(input: RelationshipInsightsInput): Promise<RelationshipInsightsReport> {
      const generatedAt = new Date().toISOString();

      const [relationshipReport, correlationReport, confidenceReport] = await Promise.all([
        dependencies.relationshipIntelligenceEngine.generateReport({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
        dependencies.evidenceCorrelationEngine.correlateEvidence({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
        }),
        dependencies.relationshipConfidenceEngine.generateConfidenceReport({
          passportId: input.passportId,
          customerId: input.customerId,
          documentIds: input.documentIds,
          requiredDocuments: input.requiredDocuments,
        }),
      ]);

      const missingIdentityFields = [
        ["legalName", relationshipReport.corporateIdentitySummary.legalName],
        ["registrationNumber", relationshipReport.corporateIdentitySummary.registrationNumber],
        ["jurisdiction", relationshipReport.corporateIdentitySummary.jurisdiction],
        ["entityType", relationshipReport.corporateIdentitySummary.entityType],
      ]
        .filter((entry) => !entry[1])
        .map((entry) => entry[0]);

      const conflictingFacts = correlationReport.facts
        .filter((fact) => fact.conflicts.length > 0)
        .map((fact) => ({
          fact: fact.fact,
          variants: fact.conflicts.length,
        }));

      const keyStrengths = buildStrengths({
        confidenceScore: confidenceReport.overallConfidenceScore,
        verifiedFacts: relationshipReport.knowledgeSummary.verifiedFacts,
        totalFacts: relationshipReport.knowledgeSummary.totalFacts,
        counterparties: relationshipReport.tradeActivitySummary.counterparties,
        validEvidence: relationshipReport.evidenceSummary.validEvidence,
        totalEvidence: relationshipReport.evidenceSummary.totalEvidence,
      });

      const openInformationGaps = buildGaps({
        missingDocuments: relationshipReport.missingDocuments,
        pendingEvidence: relationshipReport.evidenceSummary.pendingValidationEvidence,
        invalidEvidence: relationshipReport.evidenceSummary.invalidEvidence,
        missingComplianceSignals: relationshipReport.complianceSummary.complianceSignals.length === 0,
        missingIdentityFields,
      });

      const potentialInconsistencies = buildInconsistencies({
        conflictingFacts,
        confidenceDrivers: confidenceReport.confidenceDrivers,
      });

      return {
        generatedAt,
        executiveSummary: buildExecutiveSummary({
          confidenceScore: confidenceReport.overallConfidenceScore,
          confidenceBand: confidenceReport.overallConfidenceBand,
          validEvidence: relationshipReport.evidenceSummary.validEvidence,
          totalEvidence: relationshipReport.evidenceSummary.totalEvidence,
          conflictingFacts: correlationReport.conflictingFacts,
          missingDocuments: relationshipReport.missingDocuments.length,
        }),
        keyStrengths,
        openInformationGaps,
        potentialInconsistencies,
        requiredDocuments: relationshipReport.missingDocuments,
        recommendedNextSteps: buildNextSteps({
          missingDocuments: relationshipReport.missingDocuments,
          conflictingFacts: conflictingFacts.map((entry) => entry.fact),
          pendingEvidence: relationshipReport.evidenceSummary.pendingValidationEvidence,
          invalidEvidence: relationshipReport.evidenceSummary.invalidEvidence,
          confidenceScore: confidenceReport.overallConfidenceScore,
        }),
      };
    },
  };
}
