export interface FundingAssessment {
  recommendedFacility: string;
  confidence: number;
  advanceRate: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH";
  turnaround: string;
  recommendation: string;
}

export type FundingAssessmentInput = {
  documentType: string;
  jurisdiction?: string;
  fundingGoal?: string;
  readinessProgress?: number;
};

function normalizeFundingGoal(value?: string): number {
  if (!value) {
    return 1_000_000;
  }

  const normalized = value.trim().toUpperCase();

  if (normalized.includes("500K")) {
    return 500_000;
  }

  if (normalized.includes("10M")) {
    return 10_000_000;
  }

  if (normalized.includes("5M")) {
    return 5_000_000;
  }

  if (normalized.includes("1M")) {
    return 1_000_000;
  }

  return 1_000_000;
}

function inferFacility(documentType: string): string {
  const normalized = documentType.trim().toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Invoice Financing";
  }

  if (normalized.includes("TRADE") || normalized.includes("LICENSE")) {
    return "Working Capital Line";
  }

  if (normalized.includes("BANK")) {
    return "Receivables Finance";
  }

  return "Business Expansion Facility";
}

function baseAdvanceRate(documentType: string): number {
  const normalized = documentType.trim().toUpperCase();

  if (normalized.includes("INVOICE")) {
    return 85;
  }

  if (normalized.includes("TRADE") || normalized.includes("LICENSE")) {
    return 75;
  }

  if (normalized.includes("BANK")) {
    return 70;
  }

  return 65;
}

function jurisdictionAdjustment(jurisdiction?: string): number {
  if (!jurisdiction) {
    return -5;
  }

  const normalized = jurisdiction.trim().toUpperCase();

  if (normalized.includes("DUBAI") || normalized.includes("UAE")) {
    return 5;
  }

  if (normalized.includes("KSA") || normalized.includes("SAUDI")) {
    return 2;
  }

  return 0;
}

function readinessAdjustment(progress?: number): number {
  if (typeof progress !== "number") {
    return 0;
  }

  if (progress >= 80) {
    return 8;
  }

  if (progress >= 60) {
    return 4;
  }

  if (progress >= 40) {
    return 0;
  }

  return -6;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function inferRiskLevel(advanceRate: number, fundingGoalAmount: number): "LOW" | "MEDIUM" | "HIGH" {
  if (advanceRate >= 80 && fundingGoalAmount <= 1_000_000) {
    return "LOW";
  }

  if (advanceRate >= 70 && fundingGoalAmount <= 5_000_000) {
    return "MEDIUM";
  }

  return "HIGH";
}

function inferTurnaround(riskLevel: "LOW" | "MEDIUM" | "HIGH"): string {
  if (riskLevel === "LOW") {
    return "24-48 hours";
  }

  if (riskLevel === "MEDIUM") {
    return "3-5 business days";
  }

  return "5-10 business days";
}

function buildRecommendation(
  facility: string,
  riskLevel: "LOW" | "MEDIUM" | "HIGH",
  advanceRate: number,
  fundingGoalAmount: number,
): string {
  const goalText = `AED ${Math.round(fundingGoalAmount / 1000)}K`;

  if (riskLevel === "LOW") {
    return `Proceed with ${facility} at an indicative ${advanceRate}% advance rate for ${goalText}, subject to standard compliance review.`;
  }

  if (riskLevel === "MEDIUM") {
    return `Proceed with ${facility} for ${goalText} with phased utilization and invoice verification to maintain an indicative ${advanceRate}% advance rate.`;
  }

  return `Recommend structured approval for ${facility} at ${goalText} with tighter covenants and enhanced monitoring given the indicative ${advanceRate}% advance rate.`;
}

export class FundingAssessmentService {
  assess(input: FundingAssessmentInput): FundingAssessment {
    const facility = inferFacility(input.documentType);
    const fundingGoalAmount = normalizeFundingGoal(input.fundingGoal);

    const rate = clamp(
      baseAdvanceRate(input.documentType) +
        jurisdictionAdjustment(input.jurisdiction) +
        readinessAdjustment(input.readinessProgress),
      50,
      90,
    );

    const riskLevel = inferRiskLevel(rate, fundingGoalAmount);
    const turnaround = inferTurnaround(riskLevel);

    const confidence = clamp(
      60 +
        (input.documentType ? 10 : 0) +
        (input.jurisdiction ? 10 : 0) +
        (typeof input.readinessProgress === "number" ? Math.round(input.readinessProgress / 5) : 0),
      55,
      98,
    );

    return {
      recommendedFacility: facility,
      confidence,
      advanceRate: `${rate}%`,
      riskLevel,
      turnaround,
      recommendation: buildRecommendation(facility, riskLevel, rate, fundingGoalAmount),
    };
  }
}

export const fundingAssessmentService = new FundingAssessmentService();
