import type { BusinessPassportSummary } from "@/src/capabilities/institution-wizard/types/BusinessPassportSummary";
import type { BusinessReadiness, BusinessReadinessStatus } from "@/src/capabilities/institution-wizard/types/BusinessReadiness";

function statusFromScore(score: number): BusinessReadinessStatus {
  if (score >= 85) return "ready";
  if (score >= 70) return "review_required";
  return "not_ready";
}

function clampScore(score: number): number {
  if (score < 0) return 0;
  if (score > 100) return 100;
  return score;
}

export class BusinessReadinessService {
  static build(passport: BusinessPassportSummary): BusinessReadiness {
    const penaltyFromMissingEvidence = passport.missingEvidence.length * 8;
    const penaltyFromRisk = passport.risk.length * 5;
    const rawScore = passport.businessReadiness.score - penaltyFromMissingEvidence - penaltyFromRisk;
    const readinessScore = clampScore(rawScore);

    const manualReviewItems = [
      ...(passport.missingEvidence.length > 0 ? ["Validate missing evidence coverage"] : []),
      ...(passport.risk.length > 0 ? ["Review institution risk posture"] : []),
      ...(passport.confidence < 85 ? ["Confirm extraction confidence with manual check"] : []),
    ];

    return {
      readinessScore,
      status: statusFromScore(readinessScore),
      missingEvidence: passport.missingEvidence,
      confidence: passport.confidence,
      manualReviewItems,
    };
  }
}