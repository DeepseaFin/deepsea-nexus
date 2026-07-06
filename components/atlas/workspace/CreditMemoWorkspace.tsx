"use client";

import { useMemo } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { CreditMemoEngine } from "@/atlas-core/evaluation/CreditMemoEngine";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatters";

const recommendationStyles: Record<string, string> = {
  Proceed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Proceed with Conditions": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Do Not Proceed": "border-red-500/40 bg-red-500/15 text-red-300",
};

const warningSeverityStyles: Record<string, string> = {
  low: "border-slate-700 bg-slate-800/80 text-slate-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const checkStatusStyles: Record<string, string> = {
  pass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  conditional: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  fail: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

export default function CreditMemoWorkspace() {
  const { deal } = useDeal();
  const memo = useMemo(() => CreditMemoEngine.buildCreditMemo(deal), [deal]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Credit Memo Workstation</h2>
      <p className="mt-2 text-slate-400">Investment Committee Memorandum (Read-Only)</p>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 1 | Executive Decision Summary" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 lg:col-span-2">
              <p className="text-[11px] uppercase tracking-wide text-slate-500">Overall Recommendation</p>
              <div className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${recommendationStyles[memo.executiveDecisionSummary.overallRecommendation]}`}>
                {memo.executiveDecisionSummary.overallRecommendation}
              </div>
            </div>
            <Metric label="Commercial Readiness" value={`${memo.executiveDecisionSummary.commercialReadiness}%`} />
            <Metric label="Risk Readiness" value={`${memo.executiveDecisionSummary.riskReadiness}%`} />
            <Metric label="Policy Readiness" value={`${memo.executiveDecisionSummary.policyReadiness}%`} />
            <Metric label="Evidence Readiness" value={`${memo.executiveDecisionSummary.evidenceReadiness}%`} />
            <Metric label="Overall Readiness" value={`${memo.executiveDecisionSummary.overallReadiness}%`} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 2 | Transaction Overview" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Client" value={deal.client.legalName} />
            <Metric label="Counterparty" value={deal.counterparty.name} />
            <Metric label="Product" value={deal.deal.product} />
            <Metric label="Invoice Value" value={formatCurrency(deal.commercialStructure.invoiceAmount, { currency: deal.deal.currency })} />
            <Metric label="Funding Amount" value={formatCurrency(deal.commercialStructure.requestedFunding, { currency: deal.deal.currency })} />
            <Metric label="Tenor" value={`${deal.commercialStructure.tenorDays} days`} />
            <Metric label="Currency" value={deal.deal.currency} />
            <Metric label="Relationship Manager" value={deal.client.relationshipManager} />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 3 | Commercial Evaluation" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Expected Yield" value={formatPercentage(memo.commercial.calculatedValues.expectedYieldPercent, { maximumFractionDigits: 2 })} />
            <Metric label="Expected Profit" value={formatCurrency(memo.commercial.calculatedValues.expectedProfit, { currency: deal.deal.currency })} />
            <Metric label="Funding %" value={formatPercentage(memo.commercial.calculatedValues.fundingPercent, { maximumFractionDigits: 2 })} />
            <Metric label="Commercial Recommendation" value={memo.commercial.evaluationFindings.recommendation} />
            <Metric label="Commercial Readiness" value={`${memo.commercial.evaluationFindings.readiness.score}%`} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Commercial Summary</p>
            <p className="mt-1 text-sm text-slate-300">{memo.commercial.evaluationFindings.summary.narrative}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 4 | Risk Evaluation" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            <Metric label="Participant Assessment" value={`${memo.risk.clientAssessment.riskLevel} / ${memo.risk.counterpartyAssessment.riskLevel}`} />
            <Metric label="Counterparty Assessment" value={memo.risk.counterpartyAssessment.entityName} />
            <Metric label="Exposure Assessment" value={formatPercentage(memo.risk.exposureAssessment.utilizationPercent, { maximumFractionDigits: 1 })} />
            <Metric label="Risk Recommendation" value={memo.risk.recommendation} />
            <Metric label="Risk Readiness" value={`${memo.risk.readiness.score}%`} />
            <Metric label="Risk Status" value={memo.risk.readiness.status} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Executive Risk Summary</p>
            <p className="mt-1 text-sm text-slate-300">{memo.risk.summary.narrative}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 5 | Policy Evaluation" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-2">
            <Metric label="Policy Readiness" value={`${memo.policy.executiveSummary.policyReadiness}%`} />
            <Metric label="Policy Recommendation" value={memo.policy.executiveSummary.recommendationLabel} />
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-2">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Policy Warnings</p>
              <div className="mt-2 space-y-2">
                {memo.policy.evaluation.warnings.length === 0 ? (
                  <p className="text-sm text-slate-400">No policy warnings.</p>
                ) : (
                  memo.policy.evaluation.warnings.map((warning) => (
                    <div key={warning.code} className={`rounded-lg border p-2 text-xs ${warningSeverityStyles[warning.severity]}`}>
                      {warning.message}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Policy Blockers</p>
              <div className="mt-2 space-y-2">
                {memo.policy.evaluation.blockers.length === 0 ? (
                  <p className="text-sm text-slate-400">No policy blockers.</p>
                ) : (
                  memo.policy.evaluation.blockers.map((blocker) => (
                    <div key={blocker.code} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-2 text-xs text-rose-100">
                      {blocker.message}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Executive Policy Narrative</p>
            <p className="mt-1 text-sm text-slate-300">{memo.policy.executiveNarrative.narrative}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 6 | Evidence Evaluation" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <Metric label="Evidence Readiness" value={`${memo.evidence.readiness}%`} />
            <Metric label="Missing Documents" value={`${memo.evidence.missingMandatoryDocuments.length}`} />
            <Metric label="Critical Documents" value={`${memo.evidence.criticalDocumentsPending}`} />
            <Metric label="Evidence Recommendation" value={memo.evidence.recommendation} />
            <Metric label="Verified Documents" value={`${memo.evidence.verifiedDocuments.length}`} />
          </div>
          <div className="mt-3 rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">Executive Evidence Narrative</p>
            <p className="mt-1 text-sm text-slate-300">{memo.evidence.summary.narrative}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 7 | Investment Committee Decision" />
          <div className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${recommendationStyles[memo.investmentCommitteeDecision.recommendation]}`}>
            {memo.investmentCommitteeDecision.recommendation}
          </div>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Conditions</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {memo.investmentCommitteeDecision.conditions.length > 0 ? memo.investmentCommitteeDecision.conditions.map((item, index) => (
                  <li key={`cond-${index + 1}`}>• {item}</li>
                )) : <li>• No conditions.</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Key Risks</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {memo.investmentCommitteeDecision.keyRisks.length > 0 ? memo.investmentCommitteeDecision.keyRisks.map((item, index) => (
                  <li key={`risk-${index + 1}`}>• {item}</li>
                )) : <li>• No key risks.</li>}
              </ul>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Required Actions</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-300">
                {memo.investmentCommitteeDecision.requiredActions.length > 0 ? memo.investmentCommitteeDecision.requiredActions.map((item, index) => (
                  <li key={`action-${index + 1}`}>• {item}</li>
                )) : <li>• No required actions.</li>}
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 8 | Approval Matrix" />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {memo.approvalMatrix.map((item) => (
              <div key={item.role} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.role}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.status}</p>
                <p className="mt-1 text-xs text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Section 9 | Decision History" />
          <div className="mt-3 space-y-2">
            {memo.decisionHistory.map((entry) => (
              <div key={entry.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-sm font-semibold text-slate-100">{entry.event}</p>
                <p className="mt-1 text-sm text-slate-300">{entry.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="Policy Detail Snapshot" />
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {memo.policy.sections.product.checks.map((checkResult) => (
              <div key={checkResult.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-sm font-semibold text-slate-100">{checkResult.label}</p>
                <span className={`mt-2 inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${checkStatusStyles[checkResult.status]}`}>
                  {checkResult.status}
                </span>
                <p className="mt-2 text-xs text-slate-400">{checkResult.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
