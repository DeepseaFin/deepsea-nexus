import { EvidenceReferenceType, type EvidenceReference } from "@/lib/business-passport/types/EvidenceReference";
import type { InstitutionUnderstanding } from "@/src/capabilities/institution-wizard/types/InstitutionUnderstanding";
import type { ExplanationItem } from "@/src/capabilities/institution-wizard/types/ExplanationItem";
import type { Recommendation } from "@/src/capabilities/institution-wizard/types/Recommendation";

function buildEvidenceReference(source: string, confidence: number): EvidenceReference {
  return {
    evidenceId: `ev-${Math.random().toString(36).slice(2, 10)}`,
    referenceType: EvidenceReferenceType.Document,
    source,
    capturedAt: new Date().toISOString(),
    confidence,
    locator: source,
  };
}

export class ExplainabilityService {
  static buildExplanations(understanding: InstitutionUnderstanding): readonly ExplanationItem[] {
    return [
      {
        value: understanding.institutionName,
        confidence: understanding.confidence.score,
        source: "Trade License (placeholder)",
        reason: "Institution legal name aligned with extracted registration details.",
        supportingEvidence: [buildEvidenceReference("trade-license-al-noor.pdf", understanding.confidence.score)],
      },
      {
        value: understanding.jurisdiction,
        confidence: understanding.confidence.score - 2,
        source: "Registration metadata (placeholder)",
        reason: "Jurisdiction inferred from extracted license jurisdiction field.",
        supportingEvidence: [buildEvidenceReference("jurisdiction-field", understanding.confidence.score - 2)],
      },
      {
        value: understanding.businessActivity,
        confidence: understanding.confidence.score - 4,
        source: "Business activity section (placeholder)",
        reason: "Business activity mapped from institution profile business type.",
        supportingEvidence: [buildEvidenceReference("business-activity-field", understanding.confidence.score - 4)],
      },
    ];
  }

  static buildRecommendation(
    understanding: InstitutionUnderstanding,
    manualReviewItems: readonly string[],
    nextAction: string,
  ): Recommendation {
    return {
      missingDocuments: understanding.missingEvidence,
      manualReviews: manualReviewItems,
      nextAction,
    };
  }
}