"use client";

import { useState } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import FinancialSummary from "@/components/atlas/deal/FinancialSummary";
import PricingEditor from "@/components/atlas/deal/PricingEditor";
import WorkspaceTabs from "@/components/atlas/workspace/WorkspaceTabs";
import { evaluateCommercial } from "@/atlas-core/commercial/CommercialEngine";

type PricingTab = "Overview" | "Funding" | "Profitability" | "Sensitivity" | "Returns" | "Approvals";

const PRICING_TABS: PricingTab[] = ["Overview", "Funding", "Profitability", "Sensitivity", "Returns", "Approvals"];

export default function PricingWorkspace() {
  const [activeTab, setActiveTab] = useState<PricingTab>("Overview");
  const { deal } = useDeal();
  const commercial = evaluateCommercial({
    invoiceAmount: deal.commercialStructure.invoiceAmount,
    requestedFunding: deal.commercialStructure.requestedFunding,
    advanceRatePercent: deal.commercialStructure.advanceRate,
    tenorDays: deal.commercialStructure.tenorDays,
    discountRatePercent: deal.commercialStructure.discountRatePercent,
    fees: {
      processingFee: deal.commercialStructure.processingFee,
      legalFee: deal.commercialStructure.legalFee,
      otherCharges: deal.commercialStructure.otherCharges,
    },
    currency: deal.commercialStructure.currency,
    recourseType: deal.commercialStructure.recourseType,
  });
  const { calculatedValues, evaluationFindings } = commercial;

  return (
    <div className="space-y-6">
      <WorkspaceTabs tabs={PRICING_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      {activeTab === "Overview" ? (
        <>
          <FinancialSummary />
          <SectionCard title="Pricing Workspace">
            <PricingEditor />
          </SectionCard>
        </>
      ) : null}

      {activeTab === "Funding" ? (
        <SectionCard title="Funding">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Funding %" value={`${calculatedValues.fundingPercent.toFixed(2)}%`} />
            <Metric label="Invoice Amount" value={formatMoney(deal.commercialStructure.invoiceAmount)} />
            <Metric label="Requested Funding" value={formatMoney(deal.commercialStructure.requestedFunding)} />
            <Metric label="Approved Funding" value={formatMoney(deal.commercialStructure.approvedFunding)} />
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "Profitability" ? (
        <SectionCard title="Profitability">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <Metric label="Expected Profit" value={formatMoney(calculatedValues.expectedProfit)} />
              <Metric label="Expected Yield" value={`${calculatedValues.expectedYieldPercent.toFixed(2)}%`} />
              <Metric label="Recommendation" value={evaluationFindings.recommendation} />
              <Metric label="Commercial Readiness" value={`${evaluationFindings.readiness.score}%`} />
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Commercial Summary</p>
              <p className="mt-2 text-sm font-semibold text-white">{evaluationFindings.summary.headline}</p>
              <p className="mt-1 text-sm text-slate-300">{evaluationFindings.summary.narrative}</p>
            </div>
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "Sensitivity" ? (
        <SectionCard title="Sensitivity">
          <div className="space-y-3">
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Commercial Warnings</p>
              {evaluationFindings.warnings.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-amber-200">
                  {evaluationFindings.warnings.map((warning) => (
                    <li key={warning.code}>• {warning.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-300">No commercial warnings.</p>
              )}
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Commercial Blockers</p>
              {evaluationFindings.blockers.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-rose-200">
                  {evaluationFindings.blockers.map((blocker) => (
                    <li key={blocker.code}>• {blocker.message}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-300">No commercial blockers.</p>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "Returns" ? (
        <SectionCard title="Returns">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Metric label="Expected Yield" value={`${calculatedValues.expectedYieldPercent.toFixed(2)}%`} />
            <Metric label="Status" value={evaluationFindings.readiness.status} />
            <Metric label="Recommendation" value={evaluationFindings.recommendation} />
          </div>
        </SectionCard>
      ) : null}

      {activeTab === "Approvals" ? (
        <SectionCard title="Commercial Decision">
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              <Metric label="Status" value={evaluationFindings.readiness.status} />
              <Metric label="Recommendation" value={evaluationFindings.recommendation} />
              <Metric label="Commercial Readiness" value={`${evaluationFindings.readiness.score}%`} />
              <Metric label="Expected Profit" value={formatMoney(calculatedValues.expectedProfit)} />
              <Metric label="Expected Yield" value={`${calculatedValues.expectedYieldPercent.toFixed(2)}%`} />
              <Metric label="Commercial Blockers" value={`${evaluationFindings.blockers.length}`} />
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-400">Required Actions</p>
              {evaluationFindings.recommendedActions.length > 0 ? (
                <ul className="mt-2 space-y-1 text-sm text-cyan-200">
                  {evaluationFindings.recommendedActions.map((action) => (
                    <li key={action.id}>• {action.action}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-emerald-300">No required actions.</p>
              )}
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function formatMoney(value: number): string {
  return `AED ${new Intl.NumberFormat("en-AE").format(Math.round(value))}`;
}
