"use client";

import { useMemo } from "react";
import { useDeal } from "@/components/atlas/common/DealContext";
import { evaluateDealPolicy } from "@/atlas-core/policy/PolicyEngine";
import type { PolicyCheckDetail } from "@/atlas-core/policy/PolicyEvaluationResult";

const checkStatusStyles: Record<string, string> = {
  pass: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  conditional: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  fail: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const warningSeverityStyles: Record<string, string> = {
  low: "border-slate-700 bg-slate-800/80 text-slate-300",
  medium: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  high: "border-rose-500/30 bg-rose-500/10 text-rose-300",
};

const recommendationStyles: Record<string, string> = {
  Proceed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
  "Proceed with Conditions": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  "Review Required": "border-amber-500/30 bg-amber-500/10 text-amber-300",
  Decline: "border-red-500/40 bg-red-500/15 text-red-300",
};

function SectionTitle({ title }: { title: string }) {
  return <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{title}</h3>;
}

function PolicySectionCard({ title, checks }: { title: string; checks: PolicyCheckDetail[] }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
      <SectionTitle title={title} />
      <div className="mt-3 space-y-2">
        {checks.map((checkResult) => (
          <div key={checkResult.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-slate-100">{checkResult.label}</p>
              <span className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide ${checkStatusStyles[checkResult.status]}`}>
                {checkResult.status}
              </span>
            </div>
            <p className="mt-2 text-slate-300">{checkResult.detail}</p>
            <p className="mt-1 text-xs text-slate-500">Action: {checkResult.recommendedAction}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PolicyWorkspace() {
  const { deal } = useDeal();

  const policy = useMemo(() => evaluateDealPolicy(deal), [deal]);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl sm:p-8">
      <h2 className="text-2xl font-semibold text-white">Policy Workspace</h2>
      <p className="mt-2 text-slate-400">Institutional Credit Policy Workstation</p>

      <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950/80 p-4 sm:p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Executive Policy Summary</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Policy Readiness</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{policy.executiveSummary.policyReadiness}%</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Recommendation</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{policy.executiveSummary.recommendationLabel}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Policies Passed</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{policy.executiveSummary.policiesPassed}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Policies Failed</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{policy.executiveSummary.policiesFailed}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Critical Policy Breaches</p>
            <p className="mt-1 text-sm font-semibold text-slate-100">{policy.executiveSummary.criticalPolicyBreaches}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="1. Policy Warnings" />
          <div className="mt-3 space-y-2">
            {policy.evaluation.warnings.length === 0 ? (
              <p className="text-sm text-slate-400">No policy warnings.</p>
            ) : (
              policy.evaluation.warnings.map((warning) => (
                <div key={warning.code} className={`rounded-lg border p-3 text-sm ${warningSeverityStyles[warning.severity]}`}>
                  <p className="font-semibold uppercase tracking-wide">{warning.title}</p>
                  <p className="mt-1">{warning.message}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="2. Policy Blockers" />
          <div className="mt-3 space-y-2">
            {policy.evaluation.blockers.length === 0 ? (
              <p className="text-sm text-slate-400">No policy blockers.</p>
            ) : (
              policy.evaluation.blockers.map((blocker) => (
                <div key={blocker.code} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-sm text-rose-100">
                  <p className="font-semibold uppercase tracking-wide">{blocker.title}</p>
                  <p className="mt-1">{blocker.message}</p>
                  <p className="mt-1 text-xs text-rose-200">Resolution: {blocker.requiredResolution}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="3. Required Actions" />
          <div className="mt-3 space-y-2">
            {policy.evaluation.nextActions.length === 0 ? (
              <p className="text-sm text-slate-400">No required actions.</p>
            ) : (
              policy.evaluation.nextActions.map((action) => (
                <div key={action.id} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
                  <p className="font-medium text-slate-100">{action.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{action.description ?? "Generated by PolicyEngine."}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <PolicySectionCard
          title="4. Product Policy Evaluation"
          checks={policy.sections.product.checks}
        />

        <PolicySectionCard
          title="5. Counterparty Policy"
          checks={policy.sections.counterparty.checks}
        />

        <PolicySectionCard
          title="6. Concentration Policy"
          checks={policy.sections.concentration.checks}
        />

        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
          <SectionTitle title="7. Executive Policy Narrative" />
          <div className={`mt-3 inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${recommendationStyles[policy.executiveSummary.recommendationLabel]}`}>
            {policy.executiveSummary.recommendationLabel}
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{policy.executiveNarrative.narrative}</p>
          <div className="mt-3 grid gap-2 text-sm text-slate-400">
            <p><span className="text-slate-500">Overall Compliance:</span> {policy.executiveNarrative.overallCompliance}</p>
            <p><span className="text-slate-500">Major Breaches:</span> {policy.executiveNarrative.majorBreaches}</p>
            <p><span className="text-slate-500">Conditions:</span> {policy.executiveNarrative.conditions}</p>
            <p><span className="text-slate-500">Recommendation:</span> {policy.executiveNarrative.recommendation}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
