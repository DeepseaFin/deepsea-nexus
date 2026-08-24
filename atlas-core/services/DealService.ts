import { calculatePricing } from "../../components/lib/engines/pricing";
import type { DealModel } from "../deals/DealModel";

type PricingInput = {
  invoiceValue: number;
  advanceRate: number;
  discountRate: number;
  brokerCommission: number;
  tenureDays: number;
};

export class DealService {
  static updatePricing(deal: DealModel, pricingInput: PricingInput): DealModel {
    const pricing = calculatePricing({
      invoiceValue: pricingInput.invoiceValue,
      advanceRate: pricingInput.advanceRate,
      discountRate: pricingInput.discountRate,
      brokerCommission: pricingInput.brokerCommission,
      tenure: pricingInput.tenureDays,
    });

    return {
      ...deal,
      deal: {
        ...deal.deal,
        amount: pricingInput.invoiceValue,
        fundingRequired: pricing.fundingAmount,
        tenureDays: pricingInput.tenureDays,
      },
      commercialTerms: {
        ...deal.commercialTerms,
        advancePercent: pricingInput.advanceRate,
        discountRatePercent: pricingInput.discountRate,
        processingFeePercent: pricingInput.brokerCommission,
      },
    };
  }

  static calculateDeal(deal: DealModel): DealModel {
    return this.updatePricing(deal, {
      invoiceValue: deal.deal.amount,
      advanceRate: deal.commercialTerms.advancePercent,
      discountRate: deal.commercialTerms.discountRatePercent,
      brokerCommission: deal.commercialTerms.processingFeePercent,
      tenureDays: deal.deal.tenureDays,
    });
  }
}
