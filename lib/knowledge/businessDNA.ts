import type { KnowledgeAttribute } from "@/lib/knowledge/knowledgeAttribute";

export interface BusinessDNA {
  identity: {
    legalName: KnowledgeAttribute<string>;
    tradingName?: KnowledgeAttribute<string>;
    entityType: KnowledgeAttribute<string>;
    registrationNumber?: KnowledgeAttribute<string>;
    incorporationDate?: KnowledgeAttribute<string>;
    jurisdiction: KnowledgeAttribute<string>;
    website?: KnowledgeAttribute<string>;
    headquartersLocation?: KnowledgeAttribute<string>;
  };
  business: {
    industry: KnowledgeAttribute<string>;
    businessModel: KnowledgeAttribute<string>;
    productsServices?: KnowledgeAttribute<string[]>;
    customerSegments?: KnowledgeAttribute<string[]>;
    operatingMarkets?: KnowledgeAttribute<string[]>;
    employeeCount?: KnowledgeAttribute<number>;
    operatingRegions?: KnowledgeAttribute<string[]>;
  };
  financial: {
    revenueRange?: KnowledgeAttribute<string>;
    monthlyTurnover?: KnowledgeAttribute<string>;
    profitability?: KnowledgeAttribute<string>;
    fundingNeed?: KnowledgeAttribute<string>;
    preferredFacility?: KnowledgeAttribute<string>;
    bankAccountCountry?: KnowledgeAttribute<string>;
    cashFlowProfile?: KnowledgeAttribute<string>;
  };
  behaviour: {
    paymentBehaviour?: KnowledgeAttribute<string>;
    invoicingBehaviour?: KnowledgeAttribute<string>;
    seasonality?: KnowledgeAttribute<string>;
    growthTrend?: KnowledgeAttribute<string>;
    riskSignals?: KnowledgeAttribute<string[]>;
    operationalDiscipline?: KnowledgeAttribute<string>;
  };
  relationship: {
    relationshipOwner?: KnowledgeAttribute<string>;
    relationshipStage?: KnowledgeAttribute<string>;
    referralSource?: KnowledgeAttribute<string>;
    engagementLevel?: KnowledgeAttribute<string>;
    responsiveness?: KnowledgeAttribute<string>;
    trustLevel?: KnowledgeAttribute<string>;
  };
  intelligence: {
    profileCompleteness?: KnowledgeAttribute<number>;
    documentCoverage?: KnowledgeAttribute<number>;
    dataFreshness?: KnowledgeAttribute<string>;
    overallConfidence?: KnowledgeAttribute<number>;
    nextBestAction?: KnowledgeAttribute<string>;
    insightSummary?: KnowledgeAttribute<string>;
  };
}
