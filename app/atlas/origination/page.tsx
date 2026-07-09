import AiInsightsPanel from '@/src/capabilities/origination/components/AiInsightsPanel';
import OpportunityList, { type OpportunityItem } from '@/src/capabilities/origination/components/OpportunityList';
import OpportunitySummaryPanel from '@/src/capabilities/origination/components/OpportunitySummaryPanel';
import TodayIntakeSessions, { type IntakeSession } from '@/src/capabilities/origination/components/TodayIntakeSessions';
import TopKpiCards from '@/src/capabilities/origination/components/TopKpiCards';

const KPI_CARDS = [
  { label: 'New Opportunities', value: '27', tone: 'text-cyan-200' },
  { label: 'Awaiting Documents', value: '14', tone: 'text-amber-200' },
  { label: 'Ready for Structuring', value: '10', tone: 'text-indigo-200' },
  { label: 'Ready for Approval', value: '8', tone: 'text-emerald-200' },
  { label: 'Approval Queue', value: '11', tone: 'text-violet-200' },
  { label: 'Completed Today', value: '19', tone: 'text-emerald-200' },
];

const OPPORTUNITIES: OpportunityItem[] = [
  {
    id: 'OPP-2201',
    client: 'Al Noor Trading LLC',
    counterparty: 'Blue Dunes Holdings',
    dealType: 'Receivables Finance',
    requestedAmount: 'AED 22,000,000',
    relationshipManager: 'Rana K.',
    currentStage: 'Document Collection',
    sla: '6h',
    riskRating: 'Medium',
  },
  {
    id: 'OPP-2202',
    client: 'Horizon Manufacturing FZCO',
    counterparty: 'Falcon Industrial Supplies',
    dealType: 'Inventory Finance',
    requestedAmount: 'AED 14,500,000',
    relationshipManager: 'Tariq M.',
    currentStage: 'Initial Structuring',
    sla: '12h',
    riskRating: 'Low',
  },
  {
    id: 'OPP-2203',
    client: 'Pearl Logistics Group',
    counterparty: 'Summit Agro Commodities',
    dealType: 'Trade Loan',
    requestedAmount: 'AED 31,200,000',
    relationshipManager: 'Lina S.',
    currentStage: 'Credit Review',
    sla: '4h',
    riskRating: 'High',
  },
];

const INTAKE_SESSIONS: IntakeSession[] = [
  {
    id: 'INT-3011',
    client: 'Al Noor Trading LLC',
    deal: 'DEAL-3304',
    numberOfDocuments: 14,
    progress: 72,
    assignedUser: 'Rana K.',
    dueDate: '2026-07-09',
  },
  {
    id: 'INT-3012',
    client: 'Horizon Manufacturing FZCO',
    deal: 'DEAL-4408',
    numberOfDocuments: 9,
    progress: 48,
    assignedUser: 'Tariq M.',
    dueDate: '2026-07-10',
  },
  {
    id: 'INT-3013',
    client: 'Pearl Logistics Group',
    deal: 'DEAL-5510',
    numberOfDocuments: 7,
    progress: 84,
    assignedUser: 'Lina S.',
    dueDate: '2026-07-09',
  },
];

const SUMMARY = {
  opportunitySummary: 'Primary opportunity in focus is Al Noor Trading LLC with active receivables demand and medium risk profile.',
  requiredDocuments: [
    'Trade License',
    'Board Resolution',
    'Facility Agreement Draft',
    'Latest Audited Financials',
  ],
  missingDocuments: [
    'Insurance Endorsement',
    'Counterparty Aging Report',
  ],
  suggestedNextAction: 'Route to structuring desk after missing insurance endorsement is received.',
};

const INSIGHTS = {
  highRisk: [
    'One opportunity exceeds sector concentration threshold.',
    'Counterparty legal mismatch detected in OPP-2203.',
  ],
  lowConfidence: [
    'OCR confidence below 85% in two uploaded packs.',
    'Entity extraction confidence at 79% for one intake.',
  ],
  missingDocuments: [
    'Board Resolution missing for one active intake.',
    'No insurance endorsement on two in-flight opportunities.',
  ],
  suggestedActions: [
    'Escalate missing insurance endorsements to RM.',
    'Prioritize manual validation for low-confidence OCR files.',
    'Prepare structuring memo for ready opportunities.',
  ],
};

export default function OriginationPage() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-3 pb-8">
        <header className="rounded-lg border border-slate-800 bg-slate-900/40 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-400">ATLAS / ORIGINATION</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-100 sm:text-2xl">Origination Workbench</h1>
        </header>

        <TopKpiCards items={KPI_CARDS} />

        <div className="grid gap-2 xl:grid-cols-[300px_minmax(0,1fr)_360px]">
          <div className="space-y-2">
            <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <h2 className="text-lg font-semibold text-slate-100">My Work</h2>
              <div className="mt-3 space-y-2">
                {[
                  'Review OPP-2201 documents and confirm RM notes.',
                  'Escalate missing Board Resolution for OPP-2203.',
                  'Complete readiness check for structuring queue.',
                  'Follow up on counterparty compliance exception.',
                ].map((item) => (
                  <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm text-slate-200">{item}</p>
                ))}
              </div>
            </section>

            <OpportunitySummaryPanel summary={SUMMARY} />
          </div>

          <div className="space-y-2">
            <OpportunityList opportunities={OPPORTUNITIES} />
            <TodayIntakeSessions sessions={INTAKE_SESSIONS} />
          </div>

          <AiInsightsPanel insights={INSIGHTS} />
        </div>
      </div>
    </div>
  );
}
