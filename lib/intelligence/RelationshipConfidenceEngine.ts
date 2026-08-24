import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import { financialProfileCompleteness } from "@/lib/business-passport/services/FinancialProfileCompleteness";
import { identityProfileCompleteness } from "@/lib/business-passport/services/IdentityProfileCompleteness";
import type { EvidenceCorrelationEngine } from "@/lib/intelligence/EvidenceCorrelationEngine";
import type { RelationshipIntelligenceEngine } from "@/lib/intelligence/RelationshipIntelligenceEngine";
import type { ConfidenceDriver, RelationshipConfidenceInput, RelationshipConfidenceReport } from "@/lib/intelligence/RelationshipConfidenceTypes";

const IDENTITY_FACTS = new Set(["legalName", "registrationNumber", "jurisdiction", "entityType", "incorporationDate"]);
const FINANCIAL_FACTS = new Set(["coverageAmount", "invoiceAmount", "revenue", "netProfit", "totalAssets", "totalLiabilities", "equity"]);
const TRADE_FACTS = new Set(["invoiceNumber", "billOfLadingNumber", "packingListNumber", "shipmentDate", "dueDate", "goodsDescription"]);

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function round(value: number): number {
  return Math.round(value);
}

function toBand(score: number): ConfidenceBand {
  if (score >= 90) {
    return ConfidenceBand.VeryHigh;
  }

  if (score >= 75) {
    return ConfidenceBand.High;
  }

  if (score >= 50) {
    return ConfidenceBand.Moderate;
  }

  if (score >= 25) {
    return ConfidenceBand.Low;
  }

  return ConfidenceBand.VeryLow;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scoreFromCorrelationFacts(params: {
  readonly factScores: readonly number[];
  readonly conflicts: number;
  readonly noFactFallback: number;
}): number {
  if (params.factScores.length === 0) {
    return params.noFactFallback;
  }

  const base = average(params.factScores);
  const penalty = params.conflicts * 8;
  return clamp(round(base - penalty), 0, 100);
}

export interface RelationshipConfidenceEngineDependencies {
  readonly businessPassportRepository: BusinessPassportRepository;
  readonly relationshipIntelligenceEngine: RelationshipIntelligenceEngine;
  readonly evidenceCorrelationEngine: EvidenceCorrelationEngine;
}

export interface RelationshipConfidenceEngine {
  generateConfidenceReport(input: RelationshipConfidenceInput): Promise<RelationshipConfidenceReport>;
}

export function createRelationshipConfidenceEngine(
  dependencies: RelationshipConfidenceEngineDependencies,
): RelationshipConfidenceEngine {
  return {
    async generateConfidenceReport(input: RelationshipConfidenceInput): Promise<RelationshipConfidenceReport> {
      const generatedAt = new Date().toISOString();
      const passportId = PassportId.fromString(input.passportId);
      const passport = await dependencies.businessPassportRepository.findById(passportId);

      if (!passport) {
        throw new Error(`Business Passport ${input.passportId} was not found.`);
      }

      const relationshipReport = await dependencies.relationshipIntelligenceEngine.generateReport({
        passportId: input.passportId,
        customerId: input.customerId,
        documentIds: input.documentIds,
        requiredDocuments: input.requiredDocuments,
      });

      const correlationReport = await dependencies.evidenceCorrelationEngine.correlateEvidence({
        passportId: input.passportId,
        customerId: input.customerId,
        documentIds: input.documentIds,
      });

      const identityCompleteness = identityProfileCompleteness.calculate(passport.profiles.identityProfile);
      const financialCompleteness = financialProfileCompleteness.calculate(passport.profiles.financialProfile);

      const identityFactReports = correlationReport.facts.filter((fact) => IDENTITY_FACTS.has(fact.fact));
      const financialFactReports = correlationReport.facts.filter((fact) => FINANCIAL_FACTS.has(fact.fact));
      const tradeFactReports = correlationReport.facts.filter((fact) => TRADE_FACTS.has(fact.fact));

      const corporateIdentityScore = clamp(
        round((identityCompleteness.percentage * 0.6) + (scoreFromCorrelationFacts({
          factScores: identityFactReports.map((fact) => fact.confidenceScore),
          conflicts: identityFactReports.filter((fact) => fact.conflicts.length > 0).length,
          noFactFallback: 40,
        }) * 0.4)),
        0,
        100,
      );

      const financialScore = clamp(
        round((financialCompleteness.percentage * 0.55) + (scoreFromCorrelationFacts({
          factScores: financialFactReports.map((fact) => fact.confidenceScore),
          conflicts: financialFactReports.filter((fact) => fact.conflicts.length > 0).length,
          noFactFallback: 35,
        }) * 0.45)),
        0,
        100,
      );

      const tradeSignalStrength = relationshipReport.tradeActivitySummary.invoiceCount
        + relationshipReport.tradeActivitySummary.shipmentDocumentCount;
      const tradeScore = clamp(
        round((scoreFromCorrelationFacts({
          factScores: tradeFactReports.map((fact) => fact.confidenceScore),
          conflicts: tradeFactReports.filter((fact) => fact.conflicts.length > 0).length,
          noFactFallback: 30,
        }) * 0.7) + (Math.min(tradeSignalStrength, 10) * 3)),
        0,
        100,
      );

      const complianceSignals = relationshipReport.complianceSummary.complianceSignals.length;
      const sanctionsClear = (relationshipReport.complianceSummary.sanctionsScreeningStatus ?? "").toLowerCase() === "clear";
      const jurisdictionOk = Boolean(relationshipReport.complianceSummary.jurisdictionalStatus);
      const complianceScore = clamp(
        round((sanctionsClear ? 55 : 25) + (jurisdictionOk ? 20 : 0) + Math.min(complianceSignals, 5) * 5),
        0,
        100,
      );

      const missingCriticalDocuments = relationshipReport.missingDocuments;
      const missingDocumentPenalty = missingCriticalDocuments.length * 5;

      const weightedOverall = (
        corporateIdentityScore * 0.3
        + financialScore * 0.25
        + tradeScore * 0.25
        + complianceScore * 0.2
      );

      const overallConfidenceScore = clamp(round(weightedOverall - missingDocumentPenalty), 0, 100);

      const confidenceDrivers: ConfidenceDriver[] = [
        {
          kind: "positive",
          category: "passport",
          message: `Identity profile completeness contributes ${identityCompleteness.percentage}.`,
          impact: round(identityCompleteness.percentage * 0.6),
        },
        {
          kind: "positive",
          category: "passport",
          message: `Financial profile completeness contributes ${financialCompleteness.percentage}.`,
          impact: round(financialCompleteness.percentage * 0.55),
        },
        {
          kind: "positive",
          category: "knowledge",
          message: `Correlated trade signals: ${tradeSignalStrength}.`,
          impact: Math.min(tradeSignalStrength, 10) * 3,
        },
      ];

      if (correlationReport.conflictingFacts > 0) {
        confidenceDrivers.push({
          kind: "negative",
          category: "evidence",
          message: `${correlationReport.conflictingFacts} fact(s) have conflicting evidence values.`,
          impact: correlationReport.conflictingFacts * 8,
        });
      }

      if (missingCriticalDocuments.length > 0) {
        confidenceDrivers.push({
          kind: "negative",
          category: "documents",
          message: `Missing critical documents: ${missingCriticalDocuments.join(", ")}.`,
          impact: missingDocumentPenalty,
        });
      }

      if (!sanctionsClear) {
        confidenceDrivers.push({
          kind: "negative",
          category: "compliance",
          message: "Sanctions screening is not clear.",
          impact: 30,
        });
      }

      return {
        generatedAt,
        overallConfidenceScore,
        overallConfidenceBand: toBand(overallConfidenceScore),
        corporateIdentityConfidence: {
          score: corporateIdentityScore,
          band: toBand(corporateIdentityScore),
          rationale: [
            `Identity completeness: ${identityCompleteness.percentage}.`,
            `Identity fact consistency score: ${scoreFromCorrelationFacts({
              factScores: identityFactReports.map((fact) => fact.confidenceScore),
              conflicts: identityFactReports.filter((fact) => fact.conflicts.length > 0).length,
              noFactFallback: 40,
            })}.`,
          ],
        },
        financialConfidence: {
          score: financialScore,
          band: toBand(financialScore),
          rationale: [
            `Financial completeness: ${financialCompleteness.percentage}.`,
            `Financial evidence consistency score: ${scoreFromCorrelationFacts({
              factScores: financialFactReports.map((fact) => fact.confidenceScore),
              conflicts: financialFactReports.filter((fact) => fact.conflicts.length > 0).length,
              noFactFallback: 35,
            })}.`,
          ],
        },
        tradeConfidence: {
          score: tradeScore,
          band: toBand(tradeScore),
          rationale: [
            `Trade signal count: ${tradeSignalStrength}.`,
            `Trade evidence consistency score: ${scoreFromCorrelationFacts({
              factScores: tradeFactReports.map((fact) => fact.confidenceScore),
              conflicts: tradeFactReports.filter((fact) => fact.conflicts.length > 0).length,
              noFactFallback: 30,
            })}.`,
          ],
        },
        complianceConfidence: {
          score: complianceScore,
          band: toBand(complianceScore),
          rationale: [
            `Sanctions screening status: ${relationshipReport.complianceSummary.sanctionsScreeningStatus ?? "unknown"}.`,
            `Compliance signals available: ${complianceSignals}.`,
          ],
        },
        missingCriticalDocuments,
        confidenceDrivers,
      };
    },
  };
}
