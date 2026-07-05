"use client";

import { useDeal } from "@/components/atlas/common/DealContext";

const cards = [
  {
    title: "Invoice Value",
    value: "invoiceValue",
  },
  {
    title: "Funding Required",
    value: "fundingAmount",
  },
  {
    title: "Expected Return",
    value: "expectedReturn",
  },
  {
    title: "Risk Rating",
    value: "riskRating",
  },
];

export default function DealKPIs() {
  const { deal } = useDeal();

  const cardValues = {
    invoiceValue: `AED ${new Intl.NumberFormat("en-AE").format(deal.deal.amount)}`,
    fundingAmount: `AED ${new Intl.NumberFormat("en-AE").format(deal.deal.fundingRequired)}`,
    expectedReturn: `${deal.deal.expectedReturnPercent.toFixed(2)}%`,
    riskRating: deal.intelligence.creditRating,
  };

  return (
    <div className="grid grid-cols-4 gap-6">

      {cards.map((card) => (

        <div
          key={card.title}
          className="bg-slate-900 rounded-2xl p-6 border border-slate-800"
        >

          <p className="text-slate-400 text-sm">
            {card.title}
          </p>

          <h2 className="text-3xl font-bold text-white mt-3">
            {cardValues[card.value as keyof typeof cardValues]}
          </h2>

        </div>

      ))}

    </div>
  );
}