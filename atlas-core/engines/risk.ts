import type { DealModel } from "../deals/DealModel";

export interface RiskResult {
  rating: string;
  score: number;
  dealSizePass: boolean;
  minimumReturnPass: boolean;
  documentationPass: boolean;
}

export function calculateRisk(deal: DealModel): RiskResult {
  return {
    rating: "AA",
    score: 88,
    dealSizePass: deal.deal.amount <= 5000000,
    minimumReturnPass: deal.commercialTerms.discountRatePercent >= 1.5,
    documentationPass: true,
  };
}
