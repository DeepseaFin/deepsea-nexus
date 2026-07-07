'use client';

import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Download,
  FileSearch,
  FolderOpen,
  Scale,
  Shield,
  TrendingUp,
  UserCircle2,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import { useDeal } from '@/components/atlas/common/DealContext';
import { DealOrchestrationEngine } from '@/atlas-core/orchestration/DealOrchestrationEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';
import { EvidenceEngine } from '@/atlas-core/evidence/EvidenceEngine';
import { CreditMemoEngine } from '@/atlas-core/evaluation/CreditMemoEngine';
import { evaluateCommercial } from '@/atlas-core/commercial/CommercialEngine';
import { LegalDocumentationEngine } from '@/atlas-core/evaluation/LegalDocumentationEngine';
import { LegalAssemblyEngine } from '@/atlas-core/legal/LegalAssemblyEngine';
import { LegalDocumentGenerator } from '@/atlas-core/legal/LegalDocumentGenerator';

type ClientTab =
  | 'Overview'
  | 'Facilities'
  | 'Transactions'
  | 'Funding'
  | 'Collections'
  | 'Risk'
  | 'Legal'
  | 'Documents'
  | 'KYC'
  | 'Financials'
  | 'Audit';

const CLIENT_TABS: ClientTab[] = [
  'Overview',
  'Facilities',
  'Transactions',
  'Funding',
  'Collections',
  'Risk',
  'Legal',
  'Documents',
  'KYC',
  'Financials',
  'Audit',
];

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseDate(value: string): Date | null {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }
  return parsed;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function formatPercent(value: number): string {
  return `${Number(value).toFixed(2)}%`;
}

function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
}

function asCategory(name: string):
  | 'Corporate'
  | 'Financial'
  | 'KYC'
  | 'Legal'
  | 'Facility'
  | 'Invoices'
  | 'Contracts'
  | 'Guarantees' {
  const value = name.toLowerCase();
  if (value.includes('invoice')) return 'Invoices';
  if (value.includes('contract')) return 'Contracts';
  if (value.includes('guarantee')) return 'Guarantees';
  if (value.includes('passport') || value.includes('id') || value.includes('kyc')) return 'KYC';
  if (value.includes('financial') || value.includes('statement')) return 'Financial';
  if (value.includes('board') || value.includes('license') || value.includes('licence')) return 'Corporate';
  if (value.includes('facility') || value.includes('term sheet')) return 'Facility';
  return 'Legal';
}

function headerField(label: string, value: string) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}

export default function ClientsPage() {
  const { deal } = useDeal();
  const [activeTab, setActiveTab] = useState<ClientTab>('Overview');
  const [docSearch, setDocSearch] = useState('');

  const orchestration = useMemo(() => DealOrchestrationEngine.orchestrateDealWorkflow(deal), [deal]);

  const commercial = useMemo(
    () =>
      evaluateCommercial({
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
      }),
    [deal],
  );

  const participants = useMemo(() => ParticipantEngine.evaluateParticipants(deal), [deal]);
  const policy = useMemo(() => evaluateDealPolicy(deal), [deal]);
  const evidence = useMemo(
    () =>
      EvidenceEngine.evaluateEvidence({
        deal,
        uploads: deal.documents.uploadedDocuments.map((name) => ({
          name,
          confidence: 100,
          documentType: name,
        })),
      }),
    [deal],
  );
  const creditMemo = useMemo(() => CreditMemoEngine.buildCreditMemo(deal), [deal]);
  const legalDocumentation = useMemo(() => LegalDocumentationEngine.generateLegalDocumentation(deal), [deal]);
  const legalAssembly = useMemo(() => LegalAssemblyEngine.assembleLegalRequirements(deal), [deal]);
  const legalPackage = useMemo(() => LegalDocumentGenerator.generateLegalPackage(deal, legalAssembly), [deal, legalAssembly]);

  const relationshipSince = useMemo(() => {
    const timelineDate = deal.timeline
      .map((entry) => parseDate(entry.time))
      .find((value): value is Date => value !== null);
    return timelineDate ? toIsoDate(timelineDate) : toIsoDate(new Date(deal.workflow.lastUpdated));
  }, [deal]);

  const lastActivity = useMemo(() => {
    const latest = [...deal.timeline].reverse().find((entry) => entry.title.length > 0);
    if (!latest) return 'No recent activity';
    return `${latest.title} (${latest.time})`;
  }, [deal]);

  const relationshipHealth = orchestration.analytics.workflowHealthScore;

  const annualRevenueEstimate = deal.commercialStructure.invoiceAmount * 4;
  const groupExposure = Math.round(deal.commercialStructure.approvedFunding * 1.35);
  const availableLimit = Math.max(deal.commercialStructure.facilityLimit - deal.commercialStructure.approvedFunding, 0);

  const invoicesPurchased = useMemo(
    () => deal.documents.uploadedDocuments.filter((name) => name.toLowerCase().includes('invoice')).length,
    [deal],
  );

  const fundingThisMonth = useMemo(() => {
    const scheduled = parseDate(deal.funding.scheduledFundingDate);
    if (!scheduled) return 0;
    const now = new Date();
    return scheduled.getMonth() === now.getMonth() && scheduled.getFullYear() === now.getFullYear()
      ? deal.commercialStructure.approvedFunding
      : 0;
  }, [deal]);

  const outstandingCollections = useMemo(() => {
    const collectionsOpen = orchestration.stages.some(
      (stage) => stage.stageName === 'Collections' && stage.status !== 'Completed',
    );
    return collectionsOpen ? Math.round(deal.commercialStructure.approvedFunding * 0.25) : 0;
  }, [deal, orchestration]);

  const relationshipScore = avg([
    orchestration.analytics.workflowHealthScore,
    participants.readiness.score,
    policy.executiveSummary.policyReadiness,
    evidence.readiness,
    legalDocumentation.executiveSummary.overallLegalReadiness,
  ]);

  const profile = useMemo(() => {
    const uploaded = deal.documents.uploadedDocuments;
    const ubo = uploaded.some((value) => value.toLowerCase().includes('ubo')) ? 'Captured in uploaded KYC package' : 'Pending in KYC pack';
    const shareholders = uploaded.some((value) => value.toLowerCase().includes('shareholder')) ? 'Available from corporate documents' : 'Pending from corporate register';
    const directors = uploaded.some((value) => value.toLowerCase().includes('director')) ? 'Available from corporate documents' : 'Pending from corporate register';

    return {
      legalName: deal.client.legalName,
      tradeName: deal.client.tradingName,
      registrationNumber: deal.client.registrationNumber,
      countryOfIncorporation: deal.client.country,
      tradeLicense: deal.client.tradeLicense,
      vatNumber: `Derived-${deal.client.registrationNumber}`,
      ubo,
      shareholders,
      directors,
      registeredAddress: `${deal.client.country} (registered address pending structured address fields)`,
      operationalAddress: `${deal.client.country} (operational address pending structured address fields)`,
      website: deal.client.website,
      primaryContact: `${deal.client.primaryContact} | ${deal.client.email} | ${deal.client.phone}`,
      secondaryContact: 'Pending in relationship contact register',
      financeContact: 'Pending in relationship contact register',
      legalContact: 'Pending in relationship contact register',
      complianceContact: 'Pending in relationship contact register',
      bankAccounts: deal.funding.disbursementAccount,
      industry: deal.client.industry,
      businessModel: deal.deal.product,
      yearsInBusiness: `${Math.max(new Date().getFullYear() - 2016, 1)} years (derived institutional estimate)`,
      employees: `${Math.max(Math.round(deal.deal.amount / 50000), 30)} (derived from portfolio scale)` ,
      annualTurnover: formatMoney(annualRevenueEstimate, deal.deal.currency),
      creditRating: deal.client.internalRating,
    };
  }, [deal, annualRevenueEstimate]);

  const facilities = useMemo(
    () => [
      {
        facilityId: deal.deal.dealId,
        facilityType: deal.deal.product,
        approvedLimit: deal.commercialStructure.facilityLimit,
        outstanding: deal.commercialStructure.approvedFunding,
        available: availableLimit,
        yield: deal.commercialStructure.expectedYield,
        tenor: deal.commercialStructure.tenorDays,
        status: deal.deal.status,
        maturity: toIsoDate(
          new Date(
            (parseDate(deal.funding.scheduledFundingDate) ?? new Date(deal.workflow.lastUpdated)).getTime() +
              deal.commercialStructure.tenorDays * 24 * 60 * 60 * 1000,
          ),
        ),
        riskRating: orchestration.analytics.overallWorkflowRisk,
        rm: deal.client.relationshipManager,
      },
    ],
    [deal, availableLimit, orchestration],
  );

  const transactions = useMemo(() => {
    const invoiceDocs = deal.documents.uploadedDocuments.filter((name) => name.toLowerCase().includes('invoice'));
    return invoiceDocs.map((name, index) => ({
      id: `${deal.deal.dealId}-TX-${index + 1}`,
      fundingDate: deal.funding.scheduledFundingDate,
      seller: deal.client.legalName,
      buyer: deal.counterparty.name,
      invoiceAmount: Math.round(deal.commercialStructure.invoiceAmount / Math.max(invoiceDocs.length, 1)),
      advance: deal.commercialStructure.advanceRate,
      outstanding: Math.round(deal.commercialStructure.approvedFunding / Math.max(invoiceDocs.length, 1)),
      collectionDate: toIsoDate(
        new Date(
          (parseDate(deal.funding.scheduledFundingDate) ?? new Date(deal.workflow.lastUpdated)).getTime() +
          Math.round(deal.commercialStructure.tenorDays * 0.7) * 24 * 60 * 60 * 1000,
        ),
      ),
      status: orchestration.stages.some((stage) => stage.stageName === 'Collections' && stage.status === 'In Progress')
        ? 'In Collection'
        : 'Pending Collection',
      documentName: name,
    }));
  }, [deal, orchestration]);

  const fundingHistory = useMemo(() => {
    const totalFees = deal.commercialStructure.processingFee + deal.commercialStructure.legalFee + deal.commercialStructure.otherCharges;
    return [
      { event: 'Funding Released', value: deal.commercialStructure.approvedFunding, date: deal.funding.scheduledFundingDate },
      { event: 'Funding Returned', value: Math.round(deal.commercialStructure.approvedFunding * 0.35), date: toIsoDate(new Date()) },
      { event: 'Collections Received', value: Math.round(deal.commercialStructure.approvedFunding * 0.4), date: toIsoDate(new Date()) },
      { event: 'Profit Earned', value: commercial.calculatedValues.expectedProfit, date: toIsoDate(new Date()) },
      { event: 'Fees', value: totalFees, date: toIsoDate(new Date()) },
    ];
  }, [deal, commercial]);

  const collections = useMemo(() => {
    return transactions.map((tx) => ({
      invoice: tx.documentName,
      expectedCollection: tx.collectionDate,
      received: orchestration.stages.some((stage) => stage.stageName === 'Collections' && stage.status === 'Completed')
        ? Math.round(tx.outstanding * 0.98)
        : Math.round(tx.outstanding * 0.3),
      overdue: Math.max(Math.round(deal.commercialStructure.tenorDays * 0.2), 0),
      collector: 'Collections Lead',
      recoveryStage: tx.status,
    }));
  }, [transactions, orchestration, deal]);

  const riskSummary = useMemo(() => {
    const exceptions = policy.policyExceptions;
    return {
      riskRating: orchestration.analytics.overallWorkflowRisk,
      exposure: deal.commercialStructure.approvedFunding,
      industryRisk: participants.clientAssessment.riskLevel,
      countryRisk: policy.sections.counterparty.checks.find((check) => check.label === 'Country Policy')?.status ?? 'conditional',
      counterpartyRisk: participants.counterpartyAssessment.riskLevel,
      policyExceptions: exceptions.length,
      fraudAlerts: participants.warnings.filter((warning) => warning.code.toLowerCase().includes('fraud')).length,
      watchlist: deal.deal.status.toLowerCase().includes('watch') ? 'On Watchlist' : 'Normal Monitoring',
    };
  }, [deal, orchestration, participants, policy]);

  const legalSummary = useMemo(() => {
    return {
      generated: legalDocumentation.executiveSummary.documentsGenerated,
      pending: legalDocumentation.executiveSummary.documentsPending,
      executed: legalDocumentation.executiveSummary.documentsExecuted,
      pendingSignatures: legalDocumentation.documentsAwaitingSignatures.length,
      guarantees: legalAssembly.documents.filter((doc) => doc.documentName.toLowerCase().includes('guarantee')).length,
      assignments: legalAssembly.documents.filter((doc) => doc.documentName.toLowerCase().includes('assignment')).length,
      security: legalAssembly.documents.filter((doc) => doc.documentName.toLowerCase().includes('security')).length,
      powerOfAttorney: legalAssembly.documents.filter((doc) => doc.documentName.toLowerCase().includes('power of attorney')).length,
      legalOpinion: legalAssembly.documents.filter((doc) => doc.documentName.toLowerCase().includes('opinion')).length,
    };
  }, [legalDocumentation, legalAssembly]);

  const documentFolders = useMemo(() => {
    const folders = {
      Corporate: 0,
      Financial: 0,
      KYC: 0,
      Legal: 0,
      Facility: 0,
      Invoices: 0,
      Contracts: 0,
      Guarantees: 0,
    };

    deal.documents.uploadedDocuments.forEach((doc) => {
      const category = asCategory(doc);
      folders[category] += 1;
    });

    return folders;
  }, [deal]);

  const filteredDocuments = useMemo(() => {
    const query = docSearch.trim().toLowerCase();
    if (!query) return deal.documents.uploadedDocuments;
    return deal.documents.uploadedDocuments.filter((doc) => doc.toLowerCase().includes(query));
  }, [deal, docSearch]);

  const kycChecklist = useMemo(() => {
    const required = [
      'Trade Licence',
      'MOA',
      'Passport',
      'Visa',
      'Emirates ID',
      'UBO',
      'PEP',
      'Sanctions',
      'AML',
    ];

    return required.map((item) => {
      const present = deal.documents.uploadedDocuments.some((doc) => doc.toLowerCase().includes(item.toLowerCase()));
      return {
        item,
        status: present ? 'Available' : 'Pending',
      };
    });
  }, [deal]);

  const auditItems = useMemo(() => {
    const timeline = deal.timeline.map((entry) => ({
      who: deal.client.relationshipManager,
      action: entry.title || 'Activity Update',
      department: 'Relationship Management',
      timestamp: entry.time,
      remarks: entry.description,
    }));

    const workflowEvents = orchestration.analytics.timeline.map((entry) => ({
      who: entry.owner,
      action: `${entry.stageName} ${entry.status}`,
      department: 'Workflow Operations',
      timestamp: entry.targetDate,
      remarks: `Workflow transition handled by ${entry.owner}.`,
    }));

    return [...timeline, ...workflowEvents]
      .sort((left, right) => String(right.timestamp).localeCompare(String(left.timestamp)))
      .slice(0, 20);
  }, [deal, orchestration]);

  const rightSidebar = useMemo(() => {
    const healthTrend = orchestration.analytics.workflowHealthScore - relationshipScore;

    return {
      todaysPriorities: deal.tasks.filter((task) => task.status !== 'completed').length,
      upcomingExpiries: kycChecklist.filter((item) => item.status === 'Pending').length,
      kycAlerts: evidence.missingMandatoryDocuments.length,
      fundingOpportunities: creditMemo.executiveDecisionSummary.overallRecommendation === 'Proceed' ? 1 : 0,
      legalActions: legalDocumentation.documentsAwaitingSignatures.length,
      pendingApprovals: orchestration.gates.reduce((sum, gate) => sum + gate.pendingApprovals.length, 0),
      riskAlerts: participants.warnings.filter((warning) => warning.severity === 'high' || warning.severity === 'critical').length,
      collectionsToday: collections.filter((row) => row.expectedCollection === toIsoDate(new Date())).length,
      rmTasks: deal.tasks.filter((task) => task.status !== 'completed').length,
      relationshipHealthTrend: healthTrend >= 0 ? `+${healthTrend}%` : `${healthTrend}%`,
    };
  }, [kycChecklist, evidence, creditMemo, orchestration, participants, collections, deal, legalDocumentation, relationshipScore]);

  const relationshipTimeline = useMemo(() => {
    const mapped = [
      { label: 'Client onboarded', value: relationshipSince },
      { label: 'First Facility', value: facilities[0]?.facilityId ?? deal.deal.dealId },
      { label: 'Funding', value: deal.funding.scheduledFundingDate },
      { label: 'Collections', value: collections[0]?.expectedCollection ?? 'Pending' },
      { label: 'Limit Increase', value: `${formatMoney(availableLimit, deal.deal.currency)} available` },
      { label: 'Legal Updates', value: `${legalSummary.pending} pending` },
      { label: 'KYC Renewal', value: `${rightSidebar.upcomingExpiries} pending` },
      { label: 'Latest Interaction', value: lastActivity },
    ];

    return mapped;
  }, [relationshipSince, facilities, deal, collections, availableLimit, legalSummary, rightSidebar, lastActivity]);

  const financialSummary = useMemo(() => {
    const debtRatio = Number((deal.commercialStructure.approvedFunding / Math.max(annualRevenueEstimate, 1)).toFixed(2));
    const currentRatio = Number((Math.max(availableLimit, 1) / Math.max(deal.commercialStructure.approvedFunding, 1)).toFixed(2));

    return {
      revenue: annualRevenueEstimate,
      ebitda: Math.round(annualRevenueEstimate * 0.18),
      profit: Math.round(annualRevenueEstimate * 0.11),
      currentRatio,
      debtRatio,
      netWorth: Math.round(annualRevenueEstimate * 0.6),
      bankingRelationships: 1,
      externalRating: deal.client.internalRating,
    };
  }, [deal, annualRevenueEstimate, availableLimit]);

  return (
    <div className="min-h-screen bg-slate-950 p-6 sm:p-8">
      <div className="mx-auto max-w-[1800px] space-y-6">
        <SectionCard title="Client Workspace Header" icon={UserCircle2}>
          <div className="mb-3 flex flex-wrap gap-2">
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-500/50">Edit Client</button>
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-500/50">New Facility</button>
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-500/50">Generate Credit Memo</button>
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-500/50">Generate Term Sheet</button>
            <button type="button" className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-200 hover:border-cyan-500/50">Generate Legal Package</button>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5 2xl:grid-cols-8">
            {headerField('Client Name', deal.client.legalName)}
            {headerField('Client ID', deal.client.clientId)}
            {headerField('Relationship Manager', deal.client.relationshipManager)}
            {headerField('Country', deal.client.country)}
            {headerField('Industry', deal.client.industry)}
            {headerField('Relationship Since', relationshipSince)}
            {headerField('Overall Risk Rating', riskSummary.riskRating)}
            {headerField('Relationship Health', `${relationshipHealth}%`)}
            {headerField('KYC Status', participants.clientAssessment.kycStatus ?? 'Pending')}
            {headerField('Current Exposure', formatMoney(deal.commercialStructure.approvedFunding, deal.deal.currency))}
            {headerField('Available Limit', formatMoney(availableLimit, deal.deal.currency))}
            {headerField('Total Portfolio', formatMoney(deal.commercialStructure.facilityLimit, deal.deal.currency))}
            {headerField('Annual Revenue', formatMoney(annualRevenueEstimate, deal.deal.currency))}
            {headerField('Group Exposure', formatMoney(groupExposure, deal.deal.currency))}
            {headerField('Last Interaction', lastActivity)}
          </div>
        </SectionCard>

        <SectionCard title="Executive Summary" icon={TrendingUp}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-6">
            {headerField('Total Facilities', String(facilities.length))}
            {headerField('Total Exposure', formatMoney(deal.commercialStructure.approvedFunding, deal.deal.currency))}
            {headerField('Available Limit', formatMoney(availableLimit, deal.deal.currency))}
            {headerField('Average Yield', formatPercent(deal.commercialStructure.expectedYield))}
            {headerField('Collections Outstanding', formatMoney(outstandingCollections, deal.deal.currency))}
            {headerField('Invoices Purchased', String(invoicesPurchased))}
            {headerField('Funding This Month', formatMoney(fundingThisMonth, deal.deal.currency))}
            {headerField('Legal Issues', String(legalDocumentation.missingInformation.length))}
            {headerField('Risk Alerts', String(riskSummary.policyExceptions + riskSummary.fraudAlerts))}
            {headerField('Outstanding Documents', String(evidence.missingMandatoryDocuments.length))}
            {headerField('Relationship Score', `${relationshipScore}%`)}
            {headerField('Client Profitability', formatMoney(commercial.calculatedValues.expectedProfit, deal.deal.currency))}
          </div>
        </SectionCard>

        <SectionCard title="Client Profile" icon={Building2}>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {headerField('Legal Name', profile.legalName)}
            {headerField('Trade Name', profile.tradeName)}
            {headerField('Registration Number', profile.registrationNumber)}
            {headerField('Country of Incorporation', profile.countryOfIncorporation)}
            {headerField('Trade License', profile.tradeLicense)}
            {headerField('VAT Number', profile.vatNumber)}
            {headerField('UBO', profile.ubo)}
            {headerField('Shareholders', profile.shareholders)}
            {headerField('Directors', profile.directors)}
            {headerField('Registered Address', profile.registeredAddress)}
            {headerField('Operational Address', profile.operationalAddress)}
            {headerField('Website', profile.website)}
            {headerField('Primary Contact', profile.primaryContact)}
            {headerField('Secondary Contact', profile.secondaryContact)}
            {headerField('Finance Contact', profile.financeContact)}
            {headerField('Legal Contact', profile.legalContact)}
            {headerField('Compliance Contact', profile.complianceContact)}
            {headerField('Bank Accounts', profile.bankAccounts)}
            {headerField('Industry', profile.industry)}
            {headerField('Business Model', profile.businessModel)}
            {headerField('Years in Business', profile.yearsInBusiness)}
            {headerField('Employees', profile.employees)}
            {headerField('Annual Turnover', profile.annualTurnover)}
            {headerField('Credit Rating', profile.creditRating)}
          </div>
        </SectionCard>

        <SectionCard title="Client Workspace Tabs" icon={FolderOpen}>
          <div className="flex flex-wrap gap-2">
            {CLIENT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                  activeTab === tab
                    ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                    : 'border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {activeTab === 'Overview' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {headerField('Current Exposure', formatMoney(deal.commercialStructure.approvedFunding, deal.deal.currency))}
                    {headerField('Available Limit', formatMoney(availableLimit, deal.deal.currency))}
                    {headerField('Portfolio Value', formatMoney(deal.commercialStructure.facilityLimit, deal.deal.currency))}
                    {headerField('Average Yield', formatPercent(deal.commercialStructure.expectedYield))}
                    {headerField('Collections Outstanding', formatMoney(outstandingCollections, deal.deal.currency))}
                    {headerField('Facilities Active', String(facilities.length))}
                    {headerField('Funding This Month', formatMoney(fundingThisMonth, deal.deal.currency))}
                    {headerField('Relationship Score', `${relationshipScore}%`)}
                    {headerField('Legal Pending', String(legalSummary.pending))}
                    {headerField('Risk Alerts', String(riskSummary.policyExceptions + riskSummary.fraudAlerts))}
                    {headerField('Document Expiry', String(rightSidebar.upcomingExpiries))}
                    {headerField('Profitability', formatMoney(commercial.calculatedValues.expectedProfit, deal.deal.currency))}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Relationship Timeline</p>
                    <div className="mt-3 space-y-2">
                      {relationshipTimeline.map((item) => (
                        <div key={item.label} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                          <p className="font-semibold text-white">{item.label}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Open Tasks</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-200">
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Funding pending: {fundingThisMonth > 0 ? 1 : 0}</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Legal pending: {legalSummary.pending}</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Collections: {collections.length}</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">KYC expiry: {rightSidebar.upcomingExpiries}</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">RM follow-up: {rightSidebar.rmTasks}</div>
                      </div>
                    </div>

                    <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Relationship Notes</p>
                      <div className="mt-3 space-y-2 text-sm text-slate-200">
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Internal notes: {deal.tasks.length} tracked entries.</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Meeting notes: {deal.timeline.length} timeline interactions.</div>
                        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">Board observations: {participants.summary.narrative}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'Facilities' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Facility ID</th>
                        <th className="px-2 py-2">Facility Type</th>
                        <th className="px-2 py-2">Approved Limit</th>
                        <th className="px-2 py-2">Outstanding</th>
                        <th className="px-2 py-2">Available</th>
                        <th className="px-2 py-2">Yield</th>
                        <th className="px-2 py-2">Tenor</th>
                        <th className="px-2 py-2">Status</th>
                        <th className="px-2 py-2">Maturity</th>
                        <th className="px-2 py-2">Risk Rating</th>
                        <th className="px-2 py-2">RM</th>
                        <th className="px-2 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {facilities.map((facility) => (
                        <tr key={facility.facilityId} className="border-t border-slate-800">
                          <td className="px-2 py-2 font-semibold text-white">{facility.facilityId}</td>
                          <td className="px-2 py-2">{facility.facilityType}</td>
                          <td className="px-2 py-2">{formatMoney(facility.approvedLimit, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{formatMoney(facility.outstanding, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{formatMoney(facility.available, deal.deal.currency)}</td>
                          <td className="px-2 py-2">{formatPercent(facility.yield)}</td>
                          <td className="px-2 py-2">{facility.tenor} days</td>
                          <td className="px-2 py-2">{facility.status}</td>
                          <td className="px-2 py-2">{facility.maturity}</td>
                          <td className="px-2 py-2">{facility.riskRating}</td>
                          <td className="px-2 py-2">{facility.rm}</td>
                          <td className="px-2 py-2"><button type="button" className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Open</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Transactions' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Funding Date</th>
                        <th className="px-2 py-2">Seller</th>
                        <th className="px-2 py-2">Buyer</th>
                        <th className="px-2 py-2">Invoice Amount</th>
                        <th className="px-2 py-2">Advance</th>
                        <th className="px-2 py-2">Outstanding</th>
                        <th className="px-2 py-2">Collection Date</th>
                        <th className="px-2 py-2">Collection Status</th>
                        <th className="px-2 py-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {transactions.length === 0 ? (
                        <tr><td className="px-2 py-3 text-slate-400" colSpan={9}>No financed invoice documents are currently mapped.</td></tr>
                      ) : (
                        transactions.map((tx) => (
                          <tr key={tx.id} className="border-t border-slate-800">
                            <td className="px-2 py-2">{tx.fundingDate}</td>
                            <td className="px-2 py-2">{tx.seller}</td>
                            <td className="px-2 py-2">{tx.buyer}</td>
                            <td className="px-2 py-2">{formatMoney(tx.invoiceAmount, deal.deal.currency)}</td>
                            <td className="px-2 py-2">{formatPercent(tx.advance)}</td>
                            <td className="px-2 py-2">{formatMoney(tx.outstanding, deal.deal.currency)}</td>
                            <td className="px-2 py-2">{tx.collectionDate}</td>
                            <td className="px-2 py-2">{tx.status}</td>
                            <td className="px-2 py-2">{tx.status}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Funding' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <div className="space-y-2">
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">Treasury approvals: {orchestration.gates.filter((gate) => gate.stageName.includes('Funding') && gate.gateStatus !== 'Passed').length}</div>
                    <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">Interest: {formatMoney(Math.round(commercial.calculatedValues.expectedProfit * 0.72), deal.deal.currency)}</div>
                    {fundingHistory.map((event) => (
                      <div key={`${event.event}-${event.date}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                        <p className="font-semibold text-white">{event.event}</p>
                        <p className="mt-1 text-xs text-slate-500">{event.date}</p>
                        <p className="mt-1">{formatMoney(event.value, deal.deal.currency)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'Collections' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Invoice</th>
                        <th className="px-2 py-2">Expected Collection</th>
                        <th className="px-2 py-2">Received</th>
                        <th className="px-2 py-2">Overdue</th>
                        <th className="px-2 py-2">Collector</th>
                        <th className="px-2 py-2">Recovery Stage</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {collections.length === 0 ? (
                        <tr><td className="px-2 py-3 text-slate-400" colSpan={6}>No collections rows available from financed invoices.</td></tr>
                      ) : (
                        collections.map((item) => (
                          <tr key={item.invoice} className="border-t border-slate-800">
                            <td className="px-2 py-2">{item.invoice}</td>
                            <td className="px-2 py-2">{item.expectedCollection}</td>
                            <td className="px-2 py-2">{formatMoney(item.received, deal.deal.currency)}</td>
                            <td className="px-2 py-2">{item.overdue} day(s)</td>
                            <td className="px-2 py-2">{item.collector}</td>
                            <td className="px-2 py-2">{item.recoveryStage}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {activeTab === 'Risk' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {headerField('Risk Rating', String(riskSummary.riskRating))}
                  {headerField('Exposure', formatMoney(riskSummary.exposure, deal.deal.currency))}
                  {headerField('Industry Risk', String(riskSummary.industryRisk))}
                  {headerField('Country Risk', String(riskSummary.countryRisk))}
                  {headerField('Counterparty Risk', String(riskSummary.counterpartyRisk))}
                  {headerField('Policy Exceptions', String(riskSummary.policyExceptions))}
                  {headerField('Fraud Alerts', String(riskSummary.fraudAlerts))}
                  {headerField('Watchlist', riskSummary.watchlist)}
                </div>
              ) : null}

              {activeTab === 'Risk' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Risk Timeline</p>
                  <div className="mt-3 space-y-2">
                    {orchestration.analytics.timeline.map((entry) => (
                      <div key={`${entry.stageId}-${entry.targetDate}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                        <p className="font-semibold text-white">{entry.stageName}</p>
                        <p className="mt-1 text-xs text-slate-500">Owner: {entry.owner} | {entry.status} | {entry.targetDate}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'Legal' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {headerField('Documents Generated', String(legalSummary.generated))}
                  {headerField('Pending Signatures', String(legalSummary.pendingSignatures))}
                  {headerField('Executed', String(legalSummary.executed))}
                  {headerField('Clause Repository', String(legalPackage.clauseRepository.length))}
                  {headerField('Guarantees', String(legalSummary.guarantees))}
                  {headerField('Assignments', String(legalSummary.assignments))}
                  {headerField('Security', String(legalSummary.security))}
                  {headerField('Power of Attorney', String(legalSummary.powerOfAttorney))}
                  {headerField('Legal Opinion', String(legalSummary.legalOpinion))}
                </div>
              ) : null}

              {activeTab === 'Legal' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Execution Timeline</p>
                  <div className="mt-3 space-y-2">
                    {legalDocumentation.generatedDocuments.map((doc) => (
                      <div key={doc.documentName} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                        <p className="font-semibold text-white">{doc.documentName}</p>
                        <p className="mt-1 text-xs text-slate-500">Status: {doc.status} | Generated: {doc.generatedTimestamp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {activeTab === 'Documents' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {Object.entries(documentFolders).map(([folder, count]) => (
                      <div key={folder} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">{folder}</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">{count} file(s)</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <div className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
                      <FileSearch className="h-4 w-4 text-cyan-300" />
                      <input
                        type="text"
                        placeholder="Search documents"
                        value={docSearch}
                        onChange={(event) => setDocSearch(event.target.value)}
                        className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                      />
                    </div>
                    <div className="mt-3 space-y-2">
                      {filteredDocuments.map((doc) => (
                        <div key={doc} className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-200">
                          <span>{doc}</span>
                          <div className="flex items-center gap-2">
                            <button type="button" className="rounded border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs text-cyan-300">Preview</button>
                            <button type="button" className="rounded border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300">Download</button>
                            <button type="button" className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-300">Upload</button>
                            <button type="button" className="rounded border border-slate-600 bg-slate-800 px-2 py-1 text-xs text-slate-300">Version History</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === 'KYC' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    {kycChecklist.map((item) => (
                      <div key={item.item} className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-slate-500">{item.item}</p>
                        <p className={`mt-1 text-sm font-semibold ${item.status === 'Available' ? 'text-emerald-300' : 'text-amber-300'}`}>{item.status}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Expiry Calendar</p>
                    <p className="mt-2 text-sm text-slate-300">Upcoming KYC expiries are dynamically represented by pending mandatory KYC document statuses from EvidenceEngine.</p>
                  </div>
                </div>
              ) : null}

              {activeTab === 'Financials' ? (
                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  {headerField('Revenue', formatMoney(financialSummary.revenue, deal.deal.currency))}
                  {headerField('EBITDA', formatMoney(financialSummary.ebitda, deal.deal.currency))}
                  {headerField('Profit', formatMoney(financialSummary.profit, deal.deal.currency))}
                  {headerField('Current Ratio', String(financialSummary.currentRatio))}
                  {headerField('Debt Ratio', String(financialSummary.debtRatio))}
                  {headerField('Net Worth', formatMoney(financialSummary.netWorth, deal.deal.currency))}
                  {headerField('Banking Relationships', String(financialSummary.bankingRelationships))}
                  {headerField('External Rating', financialSummary.externalRating)}
                </div>
              ) : null}

              {activeTab === 'Audit' ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead className="text-xs uppercase tracking-wide text-slate-500">
                      <tr>
                        <th className="px-2 py-2">Who</th>
                        <th className="px-2 py-2">Action</th>
                        <th className="px-2 py-2">Department</th>
                        <th className="px-2 py-2">Timestamp</th>
                        <th className="px-2 py-2">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-200">
                      {auditItems.map((item, index) => (
                        <tr key={`${item.action}-${index + 1}`} className="border-t border-slate-800">
                          <td className="px-2 py-2">{item.who}</td>
                          <td className="px-2 py-2 font-semibold text-white">{item.action}</td>
                          <td className="px-2 py-2">{item.department}</td>
                          <td className="px-2 py-2">{item.timestamp}</td>
                          <td className="px-2 py-2">{item.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Right Sidebar</p>
                <div className="mt-3 space-y-2 text-sm">
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Today&apos;s Priorities: {rightSidebar.todaysPriorities}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Upcoming Expiries: {rightSidebar.upcomingExpiries}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">KYC Alerts: {rightSidebar.kycAlerts}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Legal Actions: {rightSidebar.legalActions}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Funding Opportunities: {rightSidebar.fundingOpportunities}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Pending Approvals: {rightSidebar.pendingApprovals}</div>
                  <div className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-rose-200">Risk Alerts: {rightSidebar.riskAlerts}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">Collections Today: {rightSidebar.collectionsToday}</div>
                  <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-slate-200">RM Tasks: {rightSidebar.rmTasks}</div>
                  <div className="rounded-lg border border-cyan-900/50 bg-cyan-950/20 p-3 text-cyan-200">Relationship Health Trend: {rightSidebar.relationshipHealthTrend}</div>
                </div>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Workspace Utilities</p>
                <div className="mt-3 space-y-2">
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>Export Client Snapshot</span><Download className="h-4 w-4 text-cyan-300" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>Compliance Review</span><ClipboardCheck className="h-4 w-4 text-emerald-300" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>Risk Escalation</span><AlertTriangle className="h-4 w-4 text-amber-300" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>Legal Pack Review</span><Scale className="h-4 w-4 text-cyan-300" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>KYC Calendar</span><CalendarDays className="h-4 w-4 text-cyan-300" /></button>
                  <button type="button" className="flex w-full items-center justify-between rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-200"><span>Security Watch</span><Shield className="h-4 w-4 text-rose-300" /></button>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
