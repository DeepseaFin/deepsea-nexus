import { calculatePricing } from "../../components/lib/engines/pricing";
import type { Deal } from "../models/Deal";

export class DealService {
  static updatePricing(deal: Deal, pricingInput: Deal["pricing"]): Deal {
    const pricing = calculatePricing({
      invoiceValue: pricingInput.invoiceValue,
      advanceRate: pricingInput.advanceRate,
      discountRate: pricingInput.discountRate,
      brokerCommission: pricingInput.brokerCommission,
      tenure: pricingInput.tenureDays,
    });

    return {
      ...deal,
      pricing: {
        ...pricingInput,
        fundingAmount: pricing.fundingAmount,
        discountFee: pricing.discountFee,
        netDisbursement: pricing.netDisbursement,
      },
      invoice: {
        ...deal.invoice,
        invoiceValue: pricingInput.invoiceValue,
      },
      financial: {
        ...deal.financial,
        fundingAmount: pricing.fundingAmount,
        fundingRequired: pricing.fundingAmount,
      },
    };
  }

  static calculateDeal(deal: Deal): Deal {
    return this.updatePricing(deal, deal.pricing);
  }
}
