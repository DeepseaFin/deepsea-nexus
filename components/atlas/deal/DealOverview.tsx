"use client";

import { useDeal } from "@/components/atlas/common/DealContext";

export default function DealOverview() {
  const { deal } = useDeal();

  return (
    <div className="mt-8 grid grid-cols-2 xl:grid-cols-3 gap-6">

      {/* Seller */}

      <div className="bg-slate-900 rounded-2xl p-6">
        <p className="text-slate-400 text-sm mb-4">Seller</p>

        <h3 className="text-xl font-bold text-white">
          {deal.seller.name}
        </h3>

        <div className="mt-5 space-y-2 text-slate-300">

          <div className="flex justify-between">
            <span>Relationship</span>
            <span>{deal.seller.relationship}</span>
          </div>

          <div className="flex justify-between">
            <span>Previous Deals</span>
            <span>{deal.seller.previousDeals}</span>
          </div>

          <div className="flex justify-between">
            <span>Outstanding</span>
            <span>{deal.seller.outstanding}</span>
          </div>

          <div className="flex justify-between">
            <span>Defaults</span>
            <span>{deal.seller.defaults}</span>
          </div>

        </div>

      </div>

      {/* Counterparty */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <p className="text-slate-400 text-sm mb-4">
          Counterparty
        </p>

        <h3 className="text-xl font-bold text-white">
          {deal.counterparty.name}
        </h3>

        <div className="mt-5 space-y-2 text-slate-300">

          <div className="flex justify-between">
            <span>Country</span>
            <span>{deal.counterparty.country}</span>
          </div>

          <div className="flex justify-between">
            <span>Industry</span>
            <span>{deal.counterparty.industry}</span>
          </div>

          <div className="flex justify-between">
            <span>Internal Rating</span>
            <span className="text-cyan-400 font-semibold">
              {deal.counterparty.internalRating}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Avg Payment</span>
            <span>{deal.counterparty.averagePaymentDays} Days</span>
          </div>

        </div>

      </div>

      {/* Constitution */}

      <div className="bg-slate-900 rounded-2xl p-6">

        <p className="text-slate-400 text-sm mb-4">
          Constitution Check
        </p>

        <div className="space-y-3">

          <div className="flex justify-between">
            <span>Deal Size</span>
            <span className={deal.risk.dealSizePass ? "text-green-400" : "text-red-400"}>
              {deal.risk.dealSizePass ? "PASS" : "FAIL"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Minimum Return</span>
            <span className={deal.risk.minimumReturnPass ? "text-green-400" : "text-red-400"}>
              {deal.risk.minimumReturnPass ? "PASS" : "FAIL"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Rating</span>
            <span className="text-green-400">{deal.risk.rating}</span>
          </div>

          <div className="flex justify-between">
            <span>Documentation</span>
            <span className={deal.risk.documentationPass ? "text-green-400" : "text-red-400"}>
              {deal.risk.documentationPass ? "PASS" : "FAIL"}
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}