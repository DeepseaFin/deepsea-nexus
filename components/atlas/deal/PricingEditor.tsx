"use client";

import { useDeal } from "@/components/atlas/common/DealContext";
import { calculatePricing } from "@/components/lib/engines/pricing";

export default function PricingEditor() {
  const { deal, setDeal } = useDeal();

  const handleInputChange = (
    field: keyof typeof deal.pricing,
    value: number
  ) => {
    setDeal((prevDeal) => {
      const updatedPricing = {
        ...prevDeal.pricing,
        [field]: value,
      };

      const pricing = calculatePricing({
        invoiceValue: updatedPricing.invoiceValue,
        advanceRate: updatedPricing.advanceRate,
        tenure: updatedPricing.tenureDays,
        discountRate: updatedPricing.discountRate,
        brokerCommission: updatedPricing.brokerCommission,
      });

      return {
        ...prevDeal,
        pricing: {
          ...updatedPricing,
          fundingAmount: pricing.fundingAmount,
          discountFee: pricing.discountFee,
          netDisbursement: pricing.netDisbursement,
        },
        financial: {
          ...prevDeal.financial,
          fundingAmount: pricing.fundingAmount,
          fundingRequired: pricing.fundingAmount,
        },
        invoice: {
          ...prevDeal.invoice,
          invoiceValue: updatedPricing.invoiceValue,
        },
      };
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 text-slate-100 shadow-xl">
      <h3 className="text-xl font-bold text-white mb-6">Pricing Inputs</h3>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="invoiceValue">
            Invoice Value
          </label>
          <input
            id="invoiceValue"
            type="number"
            value={deal.pricing.invoiceValue}
            onChange={(event) => handleInputChange("invoiceValue", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="advanceRate">
            Advance Rate %
          </label>
          <input
            id="advanceRate"
            type="number"
            value={deal.pricing.advanceRate}
            onChange={(event) => handleInputChange("advanceRate", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="discountRate">
            Discount Rate %
          </label>
          <input
            id="discountRate"
            type="number"
            step="0.01"
            value={deal.pricing.discountRate}
            onChange={(event) => handleInputChange("discountRate", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="brokerCommission">
            Broker Commission %
          </label>
          <input
            id="brokerCommission"
            type="number"
            value={deal.pricing.brokerCommission}
            onChange={(event) => handleInputChange("brokerCommission", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <label className="text-sm font-medium text-slate-300" htmlFor="tenureDays">
            Tenure (days)
          </label>
          <input
            id="tenureDays"
            type="number"
            value={deal.pricing.tenureDays}
            onChange={(event) => handleInputChange("tenureDays", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>
      </div>
    </div>
  );
}
