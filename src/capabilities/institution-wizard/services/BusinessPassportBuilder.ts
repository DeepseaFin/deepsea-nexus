import type { BusinessPassportSummary } from "@/src/capabilities/institution-wizard/types/BusinessPassportSummary";
import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";
import type { PassportReadiness } from "@/src/capabilities/institution-wizard/types/PassportReadiness";

function clamp(value: number): number {
  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

function buildReadiness(understanding: InstitutionUnderstanding): PassportReadiness {
  const confidenceWeight = understanding.confidence.score;
  const missingPenalty = understanding.missingEvidence.length * 8;
  const riskPenalty = understanding.potentialRisks.filter((risk) => risk.severity === "high").length * 10;
  const score = clamp(confidenceWeight - missingPenalty - riskPenalty);

  if (score >= 85) {
    return {
      level: "ready",
      score,
      rationale: [
        "Institution confidence is strong.",
        "Evidence coverage is acceptable for passport activation.",
      ],
    };
  }

  if (score >= 70) {
    return {
      level: "conditional",
      score,
      rationale: [
        "Institution is mostly ready but requires evidence completion.",
        "Proceed with conditional readiness checks.",
      ],
    };
  }

  return {
    level: "not_ready",
    score,
    rationale: [
      "Institution readiness is below threshold.",
      "Address missing evidence and elevated risks first.",
    ],
  };
}

function nextAction(readiness: PassportReadiness): string {
  if (readiness.level === "ready") {
    return "Activate Business Passport and route to Relationship Journey.";
  }

  if (readiness.level === "conditional") {
    return "Resolve missing evidence and re-evaluate readiness before activation.";
  }

  return "Hold activation and escalate risk/evidence remediation tasks.";
}

export class BusinessPassportBuilder {
  static build(understanding: InstitutionUnderstanding): BusinessPassportSummary {
    const readiness = buildReadiness(understanding);

    return {
      institution: understanding.institutionName,
      identity: `${understanding.legalForm} / ${understanding.jurisdiction}`,
      confidence: understanding.confidence.score,
      businessReadiness: readiness,
      supportingDocuments: understanding.supportingDocuments,
      missingEvidence: understanding.missingEvidence,
      risk: understanding.potentialRisks.map((item) => `${item.severity.toUpperCase()}: ${item.title}`),
      nextAction: nextAction(readiness),
    };
  }
}