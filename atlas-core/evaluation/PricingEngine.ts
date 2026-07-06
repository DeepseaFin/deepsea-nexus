import type { DealModel } from '@/atlas-core/deals/DealModel';

export interface PricingSnapshot {
  discountRatePercent: number;
  processingFeePercent: number;
  advancePercent: number;
  recourse: string;
  security: string;
  approvedFunding: number;
  requestedFunding: number;
  tenorDays: number;
  currency: string;
}

export function evaluatePricing(deal: DealModel): PricingSnapshot {
  return {
    discountRatePercent: deal.commercialTerms.discountRatePercent,
    processingFeePercent: deal.commercialTerms.processingFeePercent,
    advancePercent: deal.commercialTerms.advancePercent,
    recourse: deal.commercialTerms.recourse,
    security: deal.commercialTerms.security,
    approvedFunding: deal.commercialStructure.approvedFunding,
    requestedFunding: deal.commercialStructure.requestedFunding,
    tenorDays: deal.commercialStructure.tenorDays,
    currency: deal.commercialStructure.currency,
  };
}

export const PricingEngine = {
  evaluatePricing,
};
