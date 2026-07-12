import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { KnowledgeAttribute } from "@/lib/knowledge/knowledgeAttribute";
import type { BusinessUnderstandingResult } from "@/lib/business/businessUnderstandingService";

function nowIso(): string {
  return new Date().toISOString();
}

function attribute<T>(value: T, source: string): KnowledgeAttribute<T> {
  return {
    value,
    confidence: 100,
    source,
    updatedAt: nowIso(),
  };
}

function optionalAttribute<T>(value: T | undefined, source: string): KnowledgeAttribute<T> | undefined {
  if (typeof value === "undefined") {
    return undefined;
  }

  return attribute(value, source);
}

function normalizeText(value: string): string {
  return value.trim();
}

function inferEntityType(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("LICENSE")) {
    return "Licensed Entity";
  }

  if (normalized.includes("INVOICE")) {
    return "Trading Entity";
  }

  if (normalized.includes("CERTIFICATE")) {
    return "Registered Entity";
  }

  return "Operating Entity";
}

function inferIndustry(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("TRADE")) {
    return "Trading";
  }

  if (normalized.includes("INVOICE")) {
    return "Receivables";
  }

  if (normalized.includes("LICENSE")) {
    return "Commercial Services";
  }

  return "General Business";
}

function inferBusinessModel(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Invoice-led cash conversion";
  }

  if (normalized.includes("TRADE")) {
    return "B2B trade and distribution";
  }

  if (normalized.includes("LICENSE")) {
    return "Licensed operating business";
  }

  return "Document-supported commercial operation";
}

function inferProductsServices(documentType: string): string[] {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return ["Invoice financing", "Working capital support"];
  }

  if (normalized.includes("TRADE")) {
    return ["Trade fulfillment", "Supply chain distribution"];
  }

  if (normalized.includes("LICENSE")) {
    return ["Licensed operations", "Commercial services"];
  }

  return ["Business operations", "Financial services readiness"];
}

function inferCustomerSegments(documentType: string): string[] {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return ["Corporate buyers", "Recurring B2B counterparties"];
  }

  if (normalized.includes("TRADE")) {
    return ["Import/export clients", "Wholesale customers"];
  }

  return ["Commercial counterparties", "Institutional partners"];
}

function inferOperatingMarkets(jurisdiction: string): string[] {
  const normalized = jurisdiction.toUpperCase();

  if (normalized.includes("UAE") || normalized.includes("DUBAI")) {
    return ["UAE", "GCC"];
  }

  if (normalized.includes("KSA") || normalized.includes("SAUDI")) {
    return ["Saudi Arabia", "GCC"];
  }

  return [jurisdiction || "Local market"];
}

function inferRevenueRange(confidence: number): string {
  if (confidence >= 95) {
    return "AED 10M+";
  }

  if (confidence >= 85) {
    return "AED 5M-10M";
  }

  if (confidence >= 75) {
    return "AED 1M-5M";
  }

  return "Under AED 1M";
}

function inferMonthlyTurnover(confidence: number): string {
  if (confidence >= 95) {
    return "AED 1M+";
  }

  if (confidence >= 85) {
    return "AED 500K-1M";
  }

  if (confidence >= 75) {
    return "AED 100K-500K";
  }

  return "Below AED 100K";
}

function inferProfitability(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Positive working capital conversion";
  }

  if (normalized.includes("LICENSE")) {
    return "Operationally stable";
  }

  return "Not yet quantified";
}

function inferFundingNeed(goal?: string): string {
  if (goal) {
    return goal;
  }

  return "Indicative working capital requirement";
}

function inferPreferredFacility(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Invoice Financing";
  }

  if (normalized.includes("LICENSE")) {
    return "Working Capital Line";
  }

  return "Business Expansion Facility";
}

function inferCashFlowProfile(confidence: number): string {
  if (confidence >= 90) {
    return "Strongly supported by current documentation";
  }

  if (confidence >= 80) {
    return "Adequate visibility with moderate refinement needed";
  }

  return "Requires further documentation";
}

function inferPaymentBehaviour(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Receivables-led";
  }

  return "Commercial payment discipline expected";
}

function inferInvoicingBehaviour(documentType: string): string {
  const normalized = documentType.toUpperCase();

  if (normalized.includes("INVOICE")) {
    return "Regular invoicing cycle";
  }

  return "Standard business invoicing";
}

function inferSeasonality(jurisdiction: string): string {
  return jurisdiction ? `Aligned to ${jurisdiction} market cycles` : "No seasonality inferred";
}

function inferGrowthTrend(confidence: number): string {
  if (confidence >= 90) {
    return "Stable growth trajectory";
  }

  if (confidence >= 80) {
    return "Moderate growth with verified operations";
  }

  return "Growth trend to be confirmed";
}

function inferRiskSignals(confidence: number): string[] {
  if (confidence >= 90) {
    return ["Low friction profile", "Supporting documentation available"];
  }

  if (confidence >= 80) {
    return ["Additional invoice evidence recommended"];
  }

  return ["Limited evidence set", "Needs further verification"];
}

function inferOperationalDiscipline(confidence: number): string {
  if (confidence >= 90) {
    return "High discipline";
  }

  if (confidence >= 80) {
    return "Moderate discipline";
  }

  return "To be established";
}

function inferRelationshipStage(result: BusinessUnderstandingResult): string {
  return result.documentId ? "Understanding established" : "Discovery";
}

function inferEngagementLevel(fundingGoal?: string): string {
  return fundingGoal ? "Active" : "Exploratory";
}

function inferTrustLevel(confidence: number): string {
  if (confidence >= 90) {
    return "High";
  }

  if (confidence >= 80) {
    return "Moderate";
  }

  return "Developing";
}

function inferProfileCompleteness(result: BusinessUnderstandingResult): number {
  const filledFields = [result.companyName, result.documentType, result.jurisdiction].filter(Boolean).length;
  return Math.round((filledFields / 3) * 100);
}

function inferDocumentCoverage(): number {
  return 100;
}

function inferDataFreshness(): string {
  return "Current";
}

function inferNextBestAction(): string {
  return "Review funding amount and request supporting invoice";
}

function inferInsightSummary(result: BusinessUnderstandingResult): string {
  return `Business profile established for ${normalizeText(result.companyName)} in ${normalizeText(result.jurisdiction)}.`;
}

function buildBusinessDNA(result: BusinessUnderstandingResult): BusinessDNA {
  const source = `business-understanding:${result.documentCode}`;
  const confidenceSource = `business-understanding:${result.documentCode}:confidence`;

  return {
    identity: {
      legalName: attribute(normalizeText(result.companyName), source),
      tradingName: optionalAttribute(normalizeText(result.companyName), source),
      entityType: attribute(inferEntityType(result.documentType), source),
      registrationNumber: optionalAttribute(result.documentCode, source),
      incorporationDate: optionalAttribute("Unknown", source),
      jurisdiction: attribute(normalizeText(result.jurisdiction), source),
      website: undefined,
      headquartersLocation: optionalAttribute(normalizeText(result.jurisdiction), source),
    },
    business: {
      industry: attribute(inferIndustry(result.documentType), source),
      businessModel: attribute(inferBusinessModel(result.documentType), source),
      productsServices: attribute(inferProductsServices(result.documentType), source),
      customerSegments: attribute(inferCustomerSegments(result.documentType), source),
      operatingMarkets: attribute(inferOperatingMarkets(result.jurisdiction), source),
      employeeCount: undefined,
      operatingRegions: attribute(inferOperatingMarkets(result.jurisdiction), source),
    },
    financial: {
      revenueRange: attribute(inferRevenueRange(result.confidence), confidenceSource),
      monthlyTurnover: attribute(inferMonthlyTurnover(result.confidence), confidenceSource),
      profitability: attribute(inferProfitability(result.documentType), source),
      fundingNeed: attribute(inferFundingNeed(undefined), source),
      preferredFacility: attribute(inferPreferredFacility(result.documentType), source),
      bankAccountCountry: attribute(normalizeText(result.jurisdiction), source),
      cashFlowProfile: attribute(inferCashFlowProfile(result.confidence), confidenceSource),
    },
    behaviour: {
      paymentBehaviour: attribute(inferPaymentBehaviour(result.documentType), source),
      invoicingBehaviour: attribute(inferInvoicingBehaviour(result.documentType), source),
      seasonality: attribute(inferSeasonality(result.jurisdiction), source),
      growthTrend: attribute(inferGrowthTrend(result.confidence), confidenceSource),
      riskSignals: attribute(inferRiskSignals(result.confidence), confidenceSource),
      operationalDiscipline: attribute(inferOperationalDiscipline(result.confidence), confidenceSource),
    },
    relationship: {
      relationshipOwner: attribute("Business Understanding Engine", source),
      relationshipStage: attribute(inferRelationshipStage(result), source),
      referralSource: attribute("Public Homepage", source),
      engagementLevel: attribute(inferEngagementLevel(undefined), source),
      responsiveness: attribute("Awaiting user confirmation", source),
      trustLevel: attribute(inferTrustLevel(result.confidence), confidenceSource),
    },
    intelligence: {
      profileCompleteness: attribute(inferProfileCompleteness(result), confidenceSource),
      documentCoverage: attribute(inferDocumentCoverage(), confidenceSource),
      dataFreshness: attribute(inferDataFreshness(), confidenceSource),
      overallConfidence: attribute(result.confidence, confidenceSource),
      nextBestAction: attribute(inferNextBestAction(), source),
      insightSummary: attribute(inferInsightSummary(result), source),
    },
  };
}

export class BusinessDNAEngine {
  build(result: BusinessUnderstandingResult): BusinessDNA {
    return buildBusinessDNA(result);
  }

  merge(existingDNA: BusinessDNA, result: BusinessUnderstandingResult): BusinessDNA {
    const nextDNA = buildBusinessDNA(result);

    return {
      identity: {
        ...existingDNA.identity,
        ...nextDNA.identity,
      },
      business: {
        ...existingDNA.business,
        ...nextDNA.business,
      },
      financial: {
        ...existingDNA.financial,
        ...nextDNA.financial,
      },
      behaviour: {
        ...existingDNA.behaviour,
        ...nextDNA.behaviour,
      },
      relationship: {
        ...existingDNA.relationship,
        ...nextDNA.relationship,
      },
      intelligence: {
        ...existingDNA.intelligence,
        ...nextDNA.intelligence,
      },
    };
  }
}

export const businessDNAEngine = new BusinessDNAEngine();
