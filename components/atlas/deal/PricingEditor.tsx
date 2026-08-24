"use client";

import { useDeal } from "@/components/atlas/common/DealContext";
import { calculatePricing } from "@/components/lib/engines/pricing";

export default function PricingEditor() {
  const { deal, updateDeal, updateCommercialTerms } = useDeal();

  const handleInputChange = (
    field: "invoiceValue" | "advanceRate" | "discountRate" | "processingFee" | "tenureDays",
    value: number
  ) => {
    if (field === "invoiceValue") {
      updateDeal({ amount: value, fundingRequired: Math.round(value * (deal.commercialTerms.advancePercent / 100)) });
      return;
    }

    if (field === "tenureDays") {
      updateDeal({ tenureDays: value });
      return;
    }

    if (field === "advanceRate") {
      updateCommercialTerms({ advancePercent: value });
      updateDeal({ fundingRequired: Math.round(deal.deal.amount * (value / 100)) });
      return;
    }

    if (field === "discountRate") {
      updateCommercialTerms({ discountRatePercent: value });
      return;
    }

    updateCommercialTerms({ processingFeePercent: value });
  };

  const pricing = calculatePricing({
    invoiceValue: deal.deal.amount,
    advanceRate: deal.commercialTerms.advancePercent,
    tenure: deal.deal.tenureDays,
    discountRate: deal.commercialTerms.discountRatePercent,
    brokerCommission: deal.commercialTerms.processingFeePercent,
  });

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
            value={deal.deal.amount}
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
            value={deal.commercialTerms.advancePercent}
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
            value={deal.commercialTerms.discountRatePercent}
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
            value={deal.commercialTerms.processingFeePercent}
            onChange={(event) => handleInputChange("processingFee", Number(event.target.value))}
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
            value={deal.deal.tenureDays}
            onChange={(event) => handleInputChange("tenureDays", Number(event.target.value))}
            className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-xs text-slate-400">Funding Amount</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">AED {new Intl.NumberFormat("en-AE").format(pricing.fundingAmount)}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-xs text-slate-400">Discount Fee</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">AED {new Intl.NumberFormat("en-AE").format(pricing.discountFee)}</p>
        </div>
        <div className="rounded-xl border border-slate-700 bg-slate-800 p-4">
          <p className="text-xs text-slate-400">Net Disbursement</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">AED {new Intl.NumberFormat("en-AE").format(pricing.netDisbursement)}</p>
        </div>
      </div>
    </div>
  );
}
