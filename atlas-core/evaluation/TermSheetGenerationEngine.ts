import type { DealModel } from '@/atlas-core/deals/DealModel';
import { evaluateCommercial } from '@/atlas-core/commercial/CommercialEngine';
import { evaluatePricing } from '@/atlas-core/evaluation/PricingEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';
import { EvidenceEngine } from '@/atlas-core/evidence/EvidenceEngine';
import { CreditMemoEngine } from '@/atlas-core/evaluation/CreditMemoEngine';
import { calculateRisk } from '@/atlas-core/engines/risk';

export interface TermSheetLineItem {
  label: string;
  value: string;
}

export interface TermSheetSection {
  title: string;
  items: TermSheetLineItem[];
}

export type CommercialStatus = 'Draft' | 'Under Negotiation' | 'Commercially Agreed';

export type ExecutiveDecisionStatus =
  | 'Ready for Negotiation'
  | 'Requires Internal Review'
  | 'Commercially Agreed'
  | 'Rejected';

export interface OpenCommercialItem {
  item: string;
  deepseaPosition: string;
  negotiationStatus: 'Open' | 'Under Discussion' | 'Agreed';
}

export interface NegotiationMatrixRow {
  clause: string;
  deepseaProposal: string;
  counterpartyProposal: string;
  agreedValue: string;
  status: 'Open' | 'Countered' | 'Agreed' | 'Pending Review';
}

export interface NegotiationTimelineItem {
  step: 'Version 1' | 'Client Counter Offer' | 'Internal Review' | 'Revised Proposal' | 'Commercially Agreed';
  status: 'completed' | 'current' | 'upcoming';
  detail: string;
}

export interface RoleComment {
  role: 'Relationship Manager' | 'Credit' | 'Legal' | 'Management';
  comment: string;
}

export interface IndicativeTermSheetDocument {
  title: 'INDICATIVE TERM SHEET';
  prejudiceNotice: 'WITHOUT PREJUDICE';
  discussionNotice: 'FOR DISCUSSION PURPOSES ONLY';
  bindingNotice: 'NON-BINDING';
  bindingException: 'except Confidentiality and Governing Law where applicable.';
  commercialStatus: CommercialStatus;
  facilityReference: string;
  recommendation: 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed';
  executiveSummary: TermSheetSection;
  commercialTerms: TermSheetSection;
  pricingSummary: TermSheetSection;
  securityPackage: TermSheetSection;
  conditionsPrecedent: TermSheetSection;
  commercialAssumptions: TermSheetSection;
  openCommercialItems: OpenCommercialItem[];
  negotiationMatrix: NegotiationMatrixRow[];
  negotiationTimeline: NegotiationTimelineItem[];
  comments: RoleComment[];
  executiveDecision: {
    currentStatus: ExecutiveDecisionStatus;
    availableStatuses: ExecutiveDecisionStatus[];
    rationale: string;
  };
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function formatPercent(value: number): string {
  return `${Number(value).toFixed(2)}%`;
}

function toEvidenceUploads(deal: DealModel): Array<{ name: string; confidence: number }> {
  return deal.documents.uploadedDocuments.map((name) => ({
    name,
    confidence: 100,
  }));
}

function toDecisionStatus(recommendation: 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed'): ExecutiveDecisionStatus {
  if (recommendation === 'Proceed') {
    return 'Ready for Negotiation';
  }

  if (recommendation === 'Proceed with Conditions') {
    return 'Requires Internal Review';
  }

  return 'Rejected';
}

function toCommercialStatus(matrix: NegotiationMatrixRow[]): CommercialStatus {
  if (matrix.length > 0 && matrix.every((row) => row.status === 'Agreed')) {
    return 'Commercially Agreed';
  }

  if (
    matrix.some(
      (row) =>
        row.counterpartyProposal !== 'Pending counterparty response' ||
        row.status === 'Countered' ||
        row.status === 'Pending Review' ||
        row.agreedValue !== 'Pending',
    )
  ) {
    return 'Under Negotiation';
  }

  return 'Draft';
}

export function generateTermSheet(deal: DealModel): IndicativeTermSheetDocument {
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
  const pricing = evaluatePricing(deal);

  const risk = ParticipantEngine.evaluateParticipants(deal);
  const legacyRisk = calculateRisk(deal);
  const policy = evaluateDealPolicy(deal);
  const evidence = EvidenceEngine.evaluateEvidence({
    deal,
    uploads: toEvidenceUploads(deal),
  });
  const creditMemo = CreditMemoEngine.buildCreditMemo(deal);

  const conditionsPrecedentItems = unique([
    ...risk.requiredActions.map((action) => action.action),
    ...policy.evaluation.nextActions.map((action) => action.title),
    ...evidence.requiredActions.map((action) => action.action),
  ]);

  const specialConditionItems = unique([
    ...creditMemo.investmentCommitteeDecision.conditions,
    ...creditMemo.investmentCommitteeDecision.requiredActions,
  ]);

  const pricingSummaryItems = [
    { label: 'Discount', value: formatPercent(pricing.discountRatePercent) },
    {
      label: 'Fees',
      value: formatMoney(
        deal.commercialStructure.processingFee + deal.commercialStructure.legalFee + deal.commercialStructure.otherCharges,
        deal.deal.currency,
      ),
    },
    { label: 'Brokerage', value: formatMoney(deal.commercialStructure.otherCharges, deal.deal.currency) },
    { label: 'Taxes', value: formatMoney(0, deal.deal.currency) },
    { label: 'Net Disbursement', value: formatMoney(commercial.calculatedValues.netDisbursement, deal.deal.currency) },
  ];

  const conditionsRows = (conditionsPrecedentItems.length > 0
    ? conditionsPrecedentItems
    : ['No additional conditions precedent identified from current risk, policy, and evidence checks.'])
    .map((value, index) => ({
      label: `Condition ${index + 1}`,
      value,
    }));

  const commercialAssumptions = unique([
    `Availability assumes documentary closure of ${evidence.criticalDocumentsPending} critical document(s).`,
    `Commercial structure based on ${formatPercent(pricing.advancePercent)} advance and ${deal.commercialStructure.tenorDays} day tenor.`,
    `Pricing assumes discount rate at ${formatPercent(pricing.discountRatePercent)} and processing fee at ${formatPercent(pricing.processingFeePercent)}.`,
    `Policy posture currently ${policy.executiveSummary.recommendationLabel}.`,
    `Risk posture currently ${risk.recommendation} with readiness ${risk.readiness.score}%.`,
  ]);

  const openCommercialItems: OpenCommercialItem[] = [
    { item: 'Pricing', deepseaPosition: formatPercent(pricing.discountRatePercent), negotiationStatus: 'Open' },
    { item: 'Advance %', deepseaPosition: formatPercent(pricing.advancePercent), negotiationStatus: 'Open' },
    {
      item: 'FLDG',
      deepseaPosition: deal.commercialStructure.recourseType.includes('Limited') ? 'Applicable' : 'Not Applicable',
      negotiationStatus: 'Under Discussion',
    },
    { item: 'Tenor', deepseaPosition: `${deal.commercialStructure.tenorDays} days`, negotiationStatus: 'Open' },
    { item: 'Collection Waterfall', deepseaPosition: deal.commercialStructure.settlementMethod, negotiationStatus: 'Under Discussion' },
    { item: 'Guarantees', deepseaPosition: 'Corporate guarantee requested', negotiationStatus: 'Open' },
    { item: 'Security', deepseaPosition: pricing.security, negotiationStatus: 'Open' },
  ];

  const negotiationMatrix: NegotiationMatrixRow[] = [
    {
      clause: 'Facility Amount',
      deepseaProposal: formatMoney(deal.commercialStructure.approvedFunding, deal.deal.currency),
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
    {
      clause: 'Advance %',
      deepseaProposal: formatPercent(pricing.advancePercent),
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
    {
      clause: 'Discount Rate',
      deepseaProposal: formatPercent(pricing.discountRatePercent),
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
    {
      clause: 'FLDG',
      deepseaProposal: deal.commercialStructure.recourseType.includes('Limited') ? 'Required' : 'Not Required',
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Pending Review',
    },
    {
      clause: 'Tenor',
      deepseaProposal: `${deal.commercialStructure.tenorDays} days`,
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
    {
      clause: 'Guarantees',
      deepseaProposal: 'Corporate guarantee from client group',
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Pending Review',
    },
    {
      clause: 'Collection Account',
      deepseaProposal: deal.funding.disbursementAccount,
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
    {
      clause: 'Conditions',
      deepseaProposal: `${conditionsRows.length} condition(s) precedent`,
      counterpartyProposal: 'Pending counterparty response',
      agreedValue: 'Pending',
      status: 'Open',
    },
  ];

  const decisionStatus = toDecisionStatus(creditMemo.executiveDecisionSummary.overallRecommendation);
  const commercialStatus = toCommercialStatus(negotiationMatrix);

  return {
    title: 'INDICATIVE TERM SHEET',
    prejudiceNotice: 'WITHOUT PREJUDICE',
    discussionNotice: 'FOR DISCUSSION PURPOSES ONLY',
    bindingNotice: 'NON-BINDING',
    bindingException: 'except Confidentiality and Governing Law where applicable.',
    commercialStatus,
    facilityReference: deal.deal.dealId,
    recommendation: creditMemo.executiveDecisionSummary.overallRecommendation,
    executiveSummary: {
      title: 'Executive Summary',
      items: [
        { label: 'Facility Name', value: deal.deal.dealName },
        { label: 'Facility Reference', value: deal.deal.dealId },
        { label: 'Client', value: deal.client.legalName },
        { label: 'Counterparty', value: deal.counterparty.name },
        { label: 'Product', value: deal.deal.product },
        { label: 'Currency', value: deal.deal.currency },
        { label: 'Overall Recommendation', value: creditMemo.executiveDecisionSummary.overallRecommendation },
        { label: 'Commercial Readiness', value: `${creditMemo.executiveDecisionSummary.commercialReadiness}%` },
        { label: 'Risk Readiness', value: `${creditMemo.executiveDecisionSummary.riskReadiness}%` },
        { label: 'Policy Readiness', value: `${creditMemo.executiveDecisionSummary.policyReadiness}%` },
        { label: 'Evidence Readiness', value: `${creditMemo.executiveDecisionSummary.evidenceReadiness}%` },
      ],
    },
    commercialTerms: {
      title: 'Commercial Terms',
      items: [
        { label: 'Facility Amount', value: formatMoney(deal.commercialStructure.facilityLimit, deal.deal.currency) },
        { label: 'Advance %', value: formatPercent(pricing.advancePercent) },
        { label: 'Tenor', value: `${deal.commercialStructure.tenorDays} days` },
        { label: 'Discount Rate', value: formatPercent(pricing.discountRatePercent) },
        { label: 'Yield', value: formatPercent(commercial.calculatedValues.expectedYieldPercent) },
        { label: 'Funding Amount', value: formatMoney(pricing.approvedFunding, deal.deal.currency) },
        { label: 'Availability', value: `${Math.max(0, deal.commercialStructure.facilityLimit - pricing.approvedFunding).toLocaleString('en-US')} ${deal.deal.currency} headroom` },
        { label: 'Drawdown', value: formatMoney(deal.funding.trancheAmount || pricing.requestedFunding, deal.deal.currency) },
      ],
    },
    pricingSummary: {
      title: 'Pricing Summary',
      items: pricingSummaryItems,
    },
    securityPackage: {
      title: 'Security Package',
      items: [
        { label: 'Assignment', value: pricing.security || 'Assignment of receivables' },
        { label: 'FLDG', value: deal.commercialStructure.recourseType.includes('Limited') ? 'Required' : 'Not Required' },
        { label: 'Corporate Guarantee', value: 'Required from client entity' },
        { label: 'Personal Guarantee', value: 'Not requested at this stage' },
        { label: 'Collection Account', value: deal.funding.disbursementAccount },
        { label: 'Virtual IBAN', value: 'To be allocated post commercial agreement' },
        { label: 'Security Documents', value: `${Math.max(1, specialConditionItems.length)} document package item(s) to be finalized` },
      ],
    },
    conditionsPrecedent: {
      title: 'Conditions Precedent',
      items: conditionsRows,
    },
    commercialAssumptions: {
      title: 'Commercial Assumptions',
      items: commercialAssumptions.map((value, index) => ({
        label: `Assumption ${index + 1}`,
        value,
      })),
    },
    openCommercialItems,
    negotiationMatrix,
    negotiationTimeline: [
      {
        step: 'Version 1',
        status: 'completed',
        detail: 'Initial indicative term sheet issued by Deepsea Nexus.',
      },
      {
        step: 'Client Counter Offer',
        status: 'current',
        detail: 'Awaiting commercial counter positions from client/counterparty.',
      },
      {
        step: 'Internal Review',
        status: 'upcoming',
        detail: 'Credit, policy, and legal review of negotiated deltas.',
      },
      {
        step: 'Revised Proposal',
        status: 'upcoming',
        detail: 'Deepsea revised proposal to be released after internal alignment.',
      },
      {
        step: 'Commercially Agreed',
        status: 'upcoming',
        detail: 'Finalize negotiated economics for approval and definitive documents.',
      },
    ],
    comments: [
      {
        role: 'Relationship Manager',
        comment: `Client engagement active; current posture is ${creditMemo.executiveDecisionSummary.overallRecommendation}.`,
      },
      {
        role: 'Credit',
        comment: `Risk readiness ${risk.readiness.score}% with legacy risk score ${legacyRisk.score} (${legacyRisk.rating}).`,
      },
      {
        role: 'Legal',
        comment: `${conditionsRows.length} condition(s) precedent to be reflected in legal documentation pack.`,
      },
      {
        role: 'Management',
        comment: `Policy recommendation is ${policy.executiveSummary.recommendationLabel}; escalation based on negotiation outcomes.`,
      },
    ],
    executiveDecision: {
      currentStatus: decisionStatus,
      availableStatuses: [
        'Ready for Negotiation',
        'Requires Internal Review',
        'Commercially Agreed',
        'Rejected',
      ],
      rationale: creditMemo.investmentCommitteeDecision.keyRisks[0] || 'No critical risk escalations identified at this stage.',
    },
  };
}

export const TermSheetGenerationEngine = {
  generateTermSheet,
};
