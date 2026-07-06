"use client";

import { useDeal } from "@/components/atlas/common/DealContext";
import { ParticipantEngine } from "@/atlas-core/participants/ParticipantEngine";
import { formatCurrency, formatPercentage } from "@/lib/utils/formatters";

const riskLevelStyles: Record<string, string> = {
  low: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const warningSeverityStyles: Record<string, string> = {
  low: "border-slate-700 bg-slate-800/80 text-slate-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
  critical: "border-red-500/40 bg-red-500/15 text-red-300",
};

const blockerSeverityStyles: Record<string, string> = {
  high: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  critical: "border-red-500/40 bg-red-500/15 text-red-300",
};

const recommendationStyles: Record<string, string> = {
  Proceed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Proceed with Conditions": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Do Not Proceed": "border-red-500/40 bg-red-500/15 text-red-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

export default function RiskWorkspace() {
  const { deal } = useDeal();
  const evaluation = ParticipantEngine.evaluateParticipants(deal);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Risk Workspace</h2>
      <p className="mt-2 text-slate-400">Credit Decision Workstation</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Executive Risk Summary</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Overall Risk Rating</p>
            <p className="mt-1 text-sm font-semibold text-slate-100 capitalize">
              {evaluation.exposureAssessment.concentrationRisk}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Participant Readiness</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{evaluation.readiness.status}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Recommendation</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{evaluation.recommendation}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Number of Warnings</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{evaluation.warnings.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Number of Blockers</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{evaluation.blockers.length}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="1. Participant Evaluation" />
          <p className="mt-3 text-sm text-slate-300">{evaluation.summary.headline}</p>
          <p className="mt-2 text-sm text-slate-400">{evaluation.summary.narrative}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="2. Client Assessment" />
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-500">Entity:</span> {evaluation.clientAssessment.entityName}</p>
              <p><span className="text-slate-500">Country:</span> {evaluation.clientAssessment.country}</p>
              <p><span className="text-slate-500">Industry:</span> {evaluation.clientAssessment.industry}</p>
              <p><span className="text-slate-500">Relationship:</span> {evaluation.clientAssessment.relationship}</p>
              <p><span className="text-slate-500">Rating:</span> {evaluation.clientAssessment.rating}</p>
              <p><span className="text-slate-500">KYC:</span> {evaluation.clientAssessment.kycStatus ?? "Pending"}</p>
            </div>
            <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${riskLevelStyles[evaluation.clientAssessment.riskLevel]}`}>
              {evaluation.clientAssessment.riskLevel} risk
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="3. Counterparty Assessment" />
            <div className="mt-3 space-y-2 text-sm text-slate-300">
              <p><span className="text-slate-500">Entity:</span> {evaluation.counterpartyAssessment.entityName}</p>
              <p><span className="text-slate-500">Country:</span> {evaluation.counterpartyAssessment.country}</p>
              <p><span className="text-slate-500">Industry:</span> {evaluation.counterpartyAssessment.industry}</p>
              <p><span className="text-slate-500">Relationship:</span> {evaluation.counterpartyAssessment.relationship}</p>
              <p><span className="text-slate-500">Rating:</span> {evaluation.counterpartyAssessment.rating}</p>
              <p><span className="text-slate-500">Payment Terms:</span> {evaluation.counterpartyAssessment.paymentTerms ?? "Pending"}</p>
            </div>
            <div className={`mt-3 inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${riskLevelStyles[evaluation.counterpartyAssessment.riskLevel]}`}>
              {evaluation.counterpartyAssessment.riskLevel} risk
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="4. Exposure Assessment" />
          <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Requested Funding</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatCurrency(evaluation.exposureAssessment.requestedFunding, {
                  currency: evaluation.exposureAssessment.currency,
                })}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Existing Exposure</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatCurrency(evaluation.exposureAssessment.existingExposure, {
                  currency: evaluation.exposureAssessment.currency,
                })}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Credit Limit</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatCurrency(evaluation.exposureAssessment.creditLimit, {
                  currency: evaluation.exposureAssessment.currency,
                })}
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
              <p className="text-xs uppercase tracking-wide text-slate-500">Projected Utilization</p>
              <p className="mt-1 text-sm font-semibold text-slate-100">
                {formatPercentage(evaluation.exposureAssessment.utilizationPercent, {
                  maximumFractionDigits: 1,
                })}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {evaluation.exposureAssessment.notes.map((note, index) => (
              <span key={`exposure-note-${index + 1}`} className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs text-slate-300">
                {note}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="5. Risk Warnings" />
            <div className="mt-3 space-y-2">
              {evaluation.warnings.length === 0 ? (
                <p className="text-sm text-slate-400">No risk warnings.</p>
              ) : (
                evaluation.warnings.map((warning) => (
                  <div key={warning.code} className={`rounded-lg border p-3 text-sm ${warningSeverityStyles[warning.severity]}`}>
                    <p className="font-semibold uppercase tracking-wide">{warning.code}</p>
                    <p className="mt-1">{warning.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <SectionTitle title="6. Risk Blockers" />
            <div className="mt-3 space-y-2">
              {evaluation.blockers.length === 0 ? (
                <p className="text-sm text-slate-400">No risk blockers.</p>
              ) : (
                evaluation.blockers.map((blocker) => (
                  <div key={blocker.code} className={`rounded-lg border p-3 text-sm ${blockerSeverityStyles[blocker.severity]}`}>
                    <p className="font-semibold">{blocker.title}</p>
                    <p className="mt-1">{blocker.message}</p>
                    <p className="mt-2 text-xs">Resolution: {blocker.requiredResolution}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="7. Required Actions" />
          <div className="mt-3 space-y-2">
            {evaluation.requiredActions.length === 0 ? (
              <p className="text-sm text-slate-400">No required actions.</p>
            ) : (
              evaluation.requiredActions.map((action) => (
                <div key={action.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">{action.action}</p>
                  <p className="mt-1 text-xs text-slate-500">Owner: {action.owner}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="8. Risk Recommendation" />
          <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${recommendationStyles[evaluation.recommendation]}`}>
            {evaluation.recommendation}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="9. Executive Risk Summary" />
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{evaluation.summary.narrative}</p>
        </div>
      </div>
    </div>
  );
}
