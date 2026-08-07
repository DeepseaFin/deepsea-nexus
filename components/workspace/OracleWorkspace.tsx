'use client';

import {
  ArrowRight,
  Building2,
  CheckSquare,
  FileCheck2,
  Files,
  Landmark,
  Link2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Timer,
} from 'lucide-react';
import WorkspaceShell from '@/components/workspace/WorkspaceShell';

type RiskCard = {
  name: string;
  rating: string;
  trend: string;
  confidence: string;
};

type SummaryMetric = {
  label: string;
  value: string;
};

type RelationshipCard = {
  label: string;
  value: string;
};

type InsightItem = {
  observedPattern: string;
  detectedRisk: string;
  suggestedAction: string;
  confidence: string;
};

type RecommendationCard = {
  title: string;
  reason: string;
  confidence: string;
  supportingEvidence: string;
  tone: 'positive' | 'conditional' | 'attention';
};

type KnowledgeCard = {
  title: string;
  value: string;
};

type AuditItem = {
  title: string;
  detail: string;
  time: string;
};

const headerMetrics = [
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Institutional Intelligence Score', value: '87 / 100' },
  { label: 'Decision Confidence', value: '84%' },
  { label: 'Risk Level', value: 'Moderate' },
  { label: 'Evidence Coverage', value: '78%' },
] as const;

const executiveSummary: readonly SummaryMetric[] = [
  { label: 'Institutional Recommendation', value: 'Approve with Conditions' },
  { label: 'Overall Credit Opinion', value: 'Acceptable risk-adjusted return with manageable execution dependencies.' },
  { label: 'Top Risks', value: 'Insurance gap, board resolution refresh, obligor concentration.' },
  { label: 'Top Opportunities', value: 'Strong receivables turnover, repeat corridor performance, diversified buyer base.' },
  { label: 'AI Confidence %', value: '84%' },
  { label: 'Overall Decision', value: 'Proceed subject to documentary and policy conditions.' },
] as const;

const riskIntelligence: readonly RiskCard[] = [
  { name: 'Credit Risk', rating: 'Moderate', trend: 'Stable', confidence: '88%' },
  { name: 'Operational Risk', rating: 'Low', trend: 'Stable', confidence: '82%' },
  { name: 'Legal Risk', rating: 'Moderate', trend: 'Watch', confidence: '79%' },
  { name: 'Fraud Risk', rating: 'Low', trend: 'Stable', confidence: '86%' },
  { name: 'AML Risk', rating: 'Low', trend: 'Stable', confidence: '83%' },
  { name: 'Country Risk', rating: 'Moderate', trend: 'Stable', confidence: '80%' },
  { name: 'ESG Risk', rating: 'Low', trend: 'Improving', confidence: '76%' },
] as const;

const evidenceIntelligence = [
  { label: 'Evidence Reviewed', value: '124' },
  { label: 'Missing Evidence', value: '4' },
  { label: 'Conflicts Found', value: '2' },
  { label: 'Duplicates', value: '3' },
  { label: 'Expired Documents', value: '1' },
  { label: 'Verified Sources', value: '89' },
] as const;

const relationshipIntelligence: readonly RelationshipCard[] = [
  { label: 'Customer', value: 'Crescent Trade Holdings FZ-LLC' },
  { label: 'Facility', value: 'Invoice Discounting Programme' },
  { label: 'Deal', value: 'Crescent Receivables Growth Facility 2026' },
  { label: 'Collateral', value: 'Assigned receivables and reserve account structure' },
  { label: 'Banks', value: 'Deepsea Nexus, Gulf Merchant Bank' },
  { label: 'Directors', value: '3 Active Directors Reviewed' },
  { label: 'Beneficial Owners', value: '2 UBOs Verified' },
  { label: 'Suppliers', value: '12 Core counterparties mapped' },
] as const;

const institutionalInsights: readonly InsightItem[] = [
  {
    observedPattern: 'Buyer repayment performance remains consistent across the last four reporting cycles.',
    detectedRisk: 'Concentration on top three obligors remains above preferred internal threshold.',
    suggestedAction: 'Apply obligor monitoring covenant and periodic borrowing-base validation.',
    confidence: '86%',
  },
  {
    observedPattern: 'Document completion accelerated after relationship escalation.',
    detectedRisk: 'Insurance support remains incomplete for one material trade lane.',
    suggestedAction: 'Require refreshed endorsement before final release conditions are cleared.',
    confidence: '82%',
  },
  {
    observedPattern: 'Historical decisions in similar corridors show strong recovery and low delinquency.',
    detectedRisk: 'Board resolution wording does not yet reflect final facility authority language.',
    suggestedAction: 'Request corrected execution resolution and legal reconfirmation.',
    confidence: '80%',
  },
] as const;

const recommendations: readonly RecommendationCard[] = [
  {
    title: 'Approve',
    reason: 'Core credit profile is acceptable and performance evidence is supportive.',
    confidence: '71%',
    supportingEvidence: 'Receivables turnover, verified buyer performance, stable cash conversion.',
    tone: 'positive',
  },
  {
    title: 'Approve with Conditions',
    reason: 'Best-fit recommendation given documentary gaps that are clear and remediable.',
    confidence: '84%',
    supportingEvidence: 'Insurance gap, board resolution refresh, legal confirmation outstanding.',
    tone: 'conditional',
  },
  {
    title: 'Need More Evidence',
    reason: 'Additional evidence may be required if concentration worsens or new conflicts appear.',
    confidence: '58%',
    supportingEvidence: 'Updated buyer aging, refreshed bank statements, corridor-level trade proof.',
    tone: 'attention',
  },
  {
    title: 'Reject',
    reason: 'Current evidence does not support rejection under existing internal policy thresholds.',
    confidence: '21%',
    supportingEvidence: 'No severe compliance exception or unmitigated default indicator identified.',
    tone: 'attention',
  },
  {
    title: 'Escalate',
    reason: 'Escalation is appropriate only if documentary conditions remain unresolved near funding.',
    confidence: '43%',
    supportingEvidence: 'Policy override path, risk committee escalation, unresolved legal dependencies.',
    tone: 'conditional',
  },
] as const;

const knowledgeConnections: readonly KnowledgeCard[] = [
  { title: 'Related Customers', value: '3 linked trading groups in adjacent corridors' },
  { title: 'Similar Deals', value: '7 prior receivables facilities with matching structure' },
  { title: 'Previous Decisions', value: '5 approved with conditions, 1 escalated' },
  { title: 'Policy References', value: 'Trade finance policy, corridor risk policy, documentary control standard' },
  { title: 'Risk Models', value: 'Receivables concentration model, obligor stress model, KYC scoring model' },
  { title: 'Institutional Knowledge', value: 'Historical collection behavior and facility performance notes' },
] as const;

const auditTrail: readonly AuditItem[] = [
  {
    title: 'Evidence Reviewed',
    detail: 'Supporting submissions, facility documents, and counterparty references were assessed.',
    time: '08:35',
  },
  {
    title: 'Decision Generated',
    detail: 'Institutional recommendation set drafted using current verified data and policy references.',
    time: '10:10',
  },
  {
    title: 'Analyst Review',
    detail: 'Coverage analyst confirmed the recommendation narrative and risk alignment.',
    time: '11:25',
  },
  {
    title: 'Manager Review',
    detail: 'Credit manager validated conditions list and sensitivity commentary.',
    time: '13:00',
  },
  {
    title: 'Final Recommendation',
    detail: 'Approve with Conditions retained as the preferred institutional outcome.',
    time: '15:10',
  },
] as const;

const recommendationToneMap: Record<RecommendationCard['tone'], string> = {
  positive: 'border-emerald-700/40 bg-emerald-900/20',
  conditional: 'border-cyan-700/40 bg-cyan-900/20',
  attention: 'border-amber-700/40 bg-amber-900/20',
};

export default function OracleWorkspace() {
  return (
    <WorkspaceShell>
      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-cyan-300" />
            <h1 className="text-lg font-semibold tracking-tight text-slate-100">ORACLE Intelligence Header</h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Customer</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">Crescent Trade Holdings FZ-LLC</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {headerMetrics.map((item) => (
                <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Decision Confidence</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">84%</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Files className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Evidence Coverage</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">78%</p>
              </div>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Timer className="h-4 w-4 text-cyan-300" />
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Risk Level</p>
                </div>
                <p className="text-sm font-semibold text-slate-100">Moderate</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
              >
                Run Analysis
              </button>
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center rounded-full border border-slate-700/70 bg-slate-900 px-5 py-2.5 text-sm font-semibold text-slate-100"
              >
                Open Evidence
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Executive Intelligence Summary</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {executiveSummary.map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{item.value}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldAlert className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Risk Intelligence</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {riskIntelligence.map((item) => (
            <article key={item.name} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-sm font-semibold text-slate-100">{item.name}</p>
              <div className="mt-4 grid gap-2 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Rating</span>
                  <span className="font-semibold text-slate-100">{item.rating}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Trend</span>
                  <span className="font-semibold text-slate-100">{item.trend}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.14em] text-slate-500">Confidence</span>
                  <span className="font-semibold text-slate-100">{item.confidence}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <FileCheck2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Evidence Intelligence</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {evidenceIntelligence.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Link2 className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Relationship Intelligence</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {relationshipIntelligence.map((item) => (
            <article key={item.label} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Timer className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Institutional Insights</h3>
        </div>

        <div className="space-y-3">
          {institutionalInsights.map((item, index) => (
            <article key={`${item.observedPattern}-${index + 1}`} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="grid gap-3 lg:grid-cols-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Observed Pattern</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.observedPattern}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Detected Risk</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.detectedRisk}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Suggested Action</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.suggestedAction}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Confidence</p>
                  <p className="mt-2 text-sm font-semibold text-slate-100">{item.confidence}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Sparkles className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">AI Recommendations</h3>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {recommendations.map((item) => (
            <article key={item.title} className={`rounded-xl border p-4 ${recommendationToneMap[item.tone]}`}>
              <p className="text-sm font-semibold text-slate-100">{item.title}</p>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Reason</p>
                  <p className="mt-1 text-slate-100">{item.reason}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Confidence</p>
                  <p className="mt-1 text-slate-100">{item.confidence}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-slate-500">Supporting Evidence</p>
                  <p className="mt-1 text-slate-100">{item.supportingEvidence}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <CheckSquare className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Decision Explanation</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-sm leading-7 text-slate-300">
            ORACLE reached an institutional recommendation of approve with conditions because the underlying customer performance,
            transaction structure, and verified evidence support an acceptable credit outcome, while a narrow set of remaining
            documentary and concentration-related issues still require closure. The receivables program demonstrates stable operating
            behavior, repeat payment patterns, and satisfactory obligor performance, which strengthens the overall decision posture.
            However, the current board resolution language, insurance completion gap, and obligor concentration profile justify a
            conditioned path rather than unconditional approval. On balance, the risk-return profile remains acceptable provided that
            the identified control points are resolved before final execution.
          </p>
        </article>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <Landmark className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Knowledge Connections</h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {knowledgeConnections.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.title}</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ArrowRight className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Audit Trail</h3>
        </div>

        <div className="space-y-3">
          {auditTrail.map((item) => (
            <article key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-slate-100">{item.title}</p>
                <p className="text-xs uppercase tracking-[0.14em] text-slate-500">{item.time}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/40 p-7 sm:p-8">
        <div className="mb-5 flex items-center gap-3 border-b border-slate-800/80 pb-3">
          <ShieldAlert className="h-5 w-5 text-cyan-300" />
          <h3 className="text-lg font-semibold tracking-tight text-slate-100">Next Recommended Action</h3>
        </div>

        <article className="rounded-xl border border-cyan-900/40 bg-slate-950/80 p-5">
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Institutional action</p>
          <p className="mt-3 text-sm text-slate-300">
            Continue institutional analysis by closing documentary conditions, confirming obligor concentration mitigants, and
            validating the final legal authority package before the recommendation is advanced for final execution approval.
          </p>
          <button
            type="button"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-cyan-400/50 bg-cyan-400/15 px-6 py-2.5 text-sm font-semibold text-cyan-50"
          >
            Continue Institutional Analysis
          </button>
        </article>
      </section>
    </WorkspaceShell>
  );
}
