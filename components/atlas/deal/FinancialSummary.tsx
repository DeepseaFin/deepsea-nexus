"use client";

import { useDeal } from "@/components/atlas/common/DealContext";
import { calculatePricing } from "@/components/lib/engines/pricing";

export default function FinancialSummary() {
  const { deal } = useDeal();
  const pricing = calculatePricing({
    invoiceValue: deal.pricing.invoiceValue,
    advanceRate: deal.pricing.advanceRate,
    tenure: deal.pricing.tenureDays,
    discountRate: deal.pricing.discountRate,
    brokerCommission: deal.pricing.brokerCommission,
  });

  const formatMoney = (value: number) =>
    `AED ${new Intl.NumberFormat("en-AE").format(value)}`;

  return (
    <div className="mt-8 bg-slate-900 rounded-2xl p-6">

      <h2 className="text-2xl font-bold text-white mb-6">
        Financial Summary
      </h2>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

        <Metric
          title="Invoice Value"
          value={formatMoney(deal.invoice.invoiceValue)}
        />

        <Metric
          title="Advance"
          value={`${deal.pricing.advanceRate}%`}
        />

        <Metric
          title="Funding Amount"
          value={formatMoney(pricing.fundingAmount)}
        />

        <Metric
          title="Tenure"
          value={`${deal.pricing.tenureDays} Days`}
        />

        <Metric
          title="Discount Fee"
          value={formatMoney(pricing.discountFee)}
        />

        <Metric
          title="Gross Return"
          value={`${deal.financial.grossReturn}%`}
        />

        <Metric
          title="Net Disbursement"
          value={formatMoney(pricing.netDisbursement)}
          highlight
        />

        <Metric
          title="Broker Fee"
          value={formatMoney(pricing.brokerFee)}
        />

      </div>

    </div>
  );
}

function Metric({
  title,
  value,
  highlight = false,
}: {
  title: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-slate-800 rounded-xl p-5">

      <p className="text-slate-400 text-sm">
        {title}
      </p>

      <h3
        className={`mt-2 text-2xl font-bold ${
          highlight ? "text-cyan-400" : "text-white"
        }`}
      >
        {value}
      </h3>

    </div>
  );
}