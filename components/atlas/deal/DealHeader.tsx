"use client";
import { useDeal } from "@/components/atlas/common/DealContext";

export default function DealHeader() {
  const { deal } = useDeal();

  return (
    <div className="bg-slate-900 rounded-2xl p-8 border border-slate-800">

      <div className="flex justify-between items-start">

        <div>

          <p className="text-cyan-400 text-sm tracking-widest uppercase">
            Deal ID
          </p>

          <h1 className="text-4xl font-bold text-white mt-2">
            {deal.deal.dealId}
          </h1>

          <p className="text-slate-400 mt-4">
            {deal.deal.dealName}
          </p>

        </div>

        <div className="text-right">

          <div className="inline-block bg-amber-500 text-black px-5 py-2 rounded-full font-semibold">
            {deal.deal.status}
          </div>

          <p className="text-slate-400 mt-4">
            Last Updated: {new Date(deal.workflow.lastUpdated).toLocaleDateString("en-AE")}
          </p>

        </div>

      </div>

    </div>
  );
}