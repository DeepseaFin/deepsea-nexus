import type { BusinessProfilePreview } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";
import type { ReviewedField } from "@/src/capabilities/institution-wizard/state/InstitutionWizardState";
import type { InstitutionConfidence, InstitutionConfidenceLevel } from "@/src/capabilities/institution-wizard/types/InstitutionConfidence";
import type { InstitutionRisk } from "@/src/capabilities/institution-wizard/types/InstitutionRisk";
import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";

export interface BuildInstitutionUnderstandingInput {
  readonly reviewedFields: readonly ReviewedField[];
  readonly profile: BusinessProfilePreview;
  readonly uploadedFiles: readonly string[];
  readonly confidenceByLabel: Readonly<Record<string, number>>;
}

function average(values: readonly number[]): number {
  if (values.length === 0) {
    return 72;
  }

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round(total / values.length);
}

function confidenceLevel(score: number): InstitutionConfidenceLevel {
  if (score >= 90) return "high";
  if (score >= 80) return "medium";
  return "low";
}

function buildConfidence(score: number): InstitutionConfidence {
  const level = confidenceLevel(score);

  return {
    score,
    level,
    rationale: [
      "Based on placeholder ORACLE extraction quality.",
      "Confidence reflects completeness of reviewed institutional fields.",
    ],
  };
}

function buildRisks(score: number, missingEvidence: readonly string[]): readonly InstitutionRisk[] {
  const risks: InstitutionRisk[] = [];

  if (score < 85) {
    risks.push({
      title: "Extraction Reliability",
      severity: "medium",
      description: "One or more critical fields carry lower extraction confidence.",
    });
  }

  if (missingEvidence.length > 0) {
    risks.push({
      title: "Evidence Completeness",
      severity: "high",
      description: "Required supporting evidence is incomplete for full institutional readiness.",
    });
  }

  if (risks.length === 0) {
    risks.push({
      title: "Baseline Coverage",
      severity: "low",
      description: "No material placeholder risks identified in the current institution summary.",
    });
  }

  return risks;
}

export class InstitutionUnderstandingService {
  static build(input: BuildInstitutionUnderstandingInput): InstitutionUnderstanding {
    const confidenceValues = Object.values(input.confidenceByLabel);
    const score = average(confidenceValues);

    const fieldLabels = new Set(input.reviewedFields.map((field) => field.label.toLowerCase()));
    const missingEvidence = [
      "Board resolution copy",
      "Address verification document",
    ].filter((item) => {
      if (item.toLowerCase().includes("board") && fieldLabels.has("board resolution")) {
        return false;
      }

      return true;
    });

    return {
      institutionName: input.profile.legalName,
      jurisdiction: input.profile.jurisdiction,
      legalForm: "Limited Liability Company",
      businessActivity: input.profile.businessType,
      confidence: buildConfidence(score),
      supportingDocuments: input.uploadedFiles,
      missingEvidence,
      potentialRisks: buildRisks(score, missingEvidence),
    };
  }
}