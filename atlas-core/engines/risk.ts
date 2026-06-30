import type { Pricing } from "../models/Deal";

export interface RiskResult {
  rating: string;
  score: number;
  dealSizePass: boolean;
  minimumReturnPass: boolean;
  documentationPass: boolean;
}

export function calculateRisk(pricing: Pricing): RiskResult {
  return {
    rating: "AA",
    score: 88,
    dealSizePass: pricing.invoiceValue <= 5000000,
    minimumReturnPass: pricing.discountRate >= 1.5,
    documentationPass: true,
  };
}
