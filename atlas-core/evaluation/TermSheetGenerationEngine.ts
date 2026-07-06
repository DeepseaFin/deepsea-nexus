import type { DealModel } from '@/atlas-core/deals/DealModel';
import { evaluateCommercial } from '@/atlas-core/commercial/CommercialEngine';
import { evaluatePricing } from '@/atlas-core/evaluation/PricingEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import { evaluateDealPolicy } from '@/atlas-core/policy/PolicyEngine';
import { EvidenceEngine } from '@/atlas-core/evidence/EvidenceEngine';
import { CreditMemoEngine } from '@/atlas-core/evaluation/CreditMemoEngine';

export interface TermSheetLineItem {
  label: string;
  value: string;
}

export interface TermSheetSection {
  title: string;
  items: TermSheetLineItem[];
}

export interface TermSheetSignatureBlock {
  party: string;
  signatoryRole: string;
  status: 'Pending Signature';
}

export interface TermSheetDocument {
  memoReference: string;
  recommendation: 'Proceed' | 'Proceed with Conditions' | 'Do Not Proceed';
  sections: {
    facilityDetails: TermSheetSection;
    parties: TermSheetSection;
    commercialTerms: TermSheetSection;
    pricing: TermSheetSection;
    fundingStructure: TermSheetSection;
    conditionsPrecedent: TermSheetSection;
    covenants: TermSheetSection;
    eventsOfDefault: TermSheetSection;
    representationsAndWarranties: TermSheetSection;
    securityPackage: TermSheetSection;
    collectionsMechanism: TermSheetSection;
    feesAndCharges: TermSheetSection;
    governingLaw: TermSheetSection;
    specialConditions: TermSheetSection;
  };
  signatureBlocks: TermSheetSignatureBlock[];
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)));
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function toEvidenceUploads(deal: DealModel): Array<{ name: string; confidence: number }> {
  return deal.documents.uploadedDocuments.map((name) => ({
    name,
    confidence: 100,
  }));
}

export function generateTermSheet(deal: DealModel): TermSheetDocument {
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

  const covenantItems = unique([
    ...policy.sections.concentration.checks
      .filter((checkResult) => checkResult.status !== 'pass')
      .map((checkResult) => checkResult.recommendedAction),
    ...policy.sections.counterparty.checks
      .filter((checkResult) => checkResult.status !== 'pass')
      .map((checkResult) => checkResult.recommendedAction),
  ]);

  const eventsOfDefaultItems = unique([
    ...commercial.evaluationFindings.blockers.map((blocker) => blocker.message),
    ...risk.blockers.map((blocker) => blocker.message),
    ...policy.evaluation.blockers.map((blocker) => blocker.message),
    ...evidence.criticalBlockers.map((blocker) => blocker.message),
  ]);

  const specialConditionItems = unique([
    ...creditMemo.investmentCommitteeDecision.conditions,
    ...creditMemo.investmentCommitteeDecision.requiredActions,
  ]);

  return {
    memoReference: deal.deal.dealId,
    recommendation: creditMemo.executiveDecisionSummary.overallRecommendation,
    sections: {
      facilityDetails: {
        title: 'Facility Details',
        items: [
          { label: 'Facility Name', value: deal.deal.dealName },
          { label: 'Facility Type', value: deal.deal.product },
          { label: 'Facility Currency', value: deal.deal.currency },
          { label: 'Facility Limit', value: formatMoney(deal.commercialStructure.facilityLimit, deal.deal.currency) },
          { label: 'Tenor', value: `${deal.commercialStructure.tenorDays} days` },
        ],
      },
      parties: {
        title: 'Parties',
        items: [
          { label: 'Financier', value: 'Deepsea Nexus' },
          { label: 'Client', value: deal.client.legalName },
          { label: 'Counterparty', value: deal.counterparty.name },
          { label: 'Relationship Manager', value: deal.client.relationshipManager },
        ],
      },
      commercialTerms: {
        title: 'Commercial Terms',
        items: [
          { label: 'Approved Funding', value: formatMoney(pricing.approvedFunding, deal.deal.currency) },
          { label: 'Advance Rate', value: `${pricing.advancePercent}%` },
          { label: 'Recourse Type', value: pricing.recourse },
          { label: 'Commercial Recommendation', value: commercial.evaluationFindings.recommendation },
          { label: 'Commercial Summary', value: commercial.evaluationFindings.summary.narrative },
        ],
      },
      pricing: {
        title: 'Pricing',
        items: [
          { label: 'Discount Rate', value: `${pricing.discountRatePercent}%` },
          { label: 'Expected Yield', value: `${commercial.calculatedValues.expectedYieldPercent.toFixed(2)}%` },
          { label: 'Expected Profit', value: formatMoney(commercial.calculatedValues.expectedProfit, deal.deal.currency) },
          { label: 'Processing Fee %', value: `${pricing.processingFeePercent}%` },
        ],
      },
      fundingStructure: {
        title: 'Funding Structure',
        items: [
          { label: 'Invoice Value', value: formatMoney(deal.commercialStructure.invoiceAmount, deal.deal.currency) },
          { label: 'Requested Funding', value: formatMoney(pricing.requestedFunding, deal.deal.currency) },
          { label: 'Approved Funding', value: formatMoney(pricing.approvedFunding, deal.deal.currency) },
          { label: 'Net Disbursement', value: formatMoney(commercial.calculatedValues.netDisbursement, deal.deal.currency) },
          { label: 'Funding Source', value: deal.commercialStructure.fundingSource },
        ],
      },
      conditionsPrecedent: {
        title: 'Conditions Precedent',
        items: (conditionsPrecedentItems.length > 0 ? conditionsPrecedentItems : ['No additional conditions precedent identified.']).map((value, index) => ({
          label: `Condition ${index + 1}`,
          value,
        })),
      },
      covenants: {
        title: 'Covenants',
        items: (covenantItems.length > 0 ? covenantItems : ['Maintain compliance with concentration and counterparty policy controls.']).map((value, index) => ({
          label: `Covenant ${index + 1}`,
          value,
        })),
      },
      eventsOfDefault: {
        title: 'Events of Default',
        items: (eventsOfDefaultItems.length > 0 ? eventsOfDefaultItems : ['Material breach of agreed commercial, policy, or documentary obligations.']).map((value, index) => ({
          label: `Default Trigger ${index + 1}`,
          value,
        })),
      },
      representationsAndWarranties: {
        title: 'Representations & Warranties',
        items: [
          { label: 'Corporate Authority', value: 'Client confirms full authority to enter into the financing facility.' },
          { label: 'Information Accuracy', value: 'All submitted information and supporting evidence are complete and accurate in all material respects.' },
          { label: 'No Material Adverse Change', value: 'No undisclosed material adverse change has occurred since submission.' },
        ],
      },
      securityPackage: {
        title: 'Security Package',
        items: [
          { label: 'Primary Security', value: pricing.security },
          { label: 'Recourse Structure', value: pricing.recourse },
          { label: 'Additional Security', value: 'As required by policy and committee conditions.' },
        ],
      },
      collectionsMechanism: {
        title: 'Collections Mechanism',
        items: [
          { label: 'Settlement Method', value: deal.commercialStructure.settlementMethod },
          { label: 'Disbursement Account', value: deal.funding.disbursementAccount },
          { label: 'Monitoring Control', value: 'Collections routed through controlled account with periodic reconciliation.' },
        ],
      },
      feesAndCharges: {
        title: 'Fees & Charges',
        items: [
          { label: 'Processing Fee', value: formatMoney(deal.commercialStructure.processingFee, deal.deal.currency) },
          { label: 'Legal Fee', value: formatMoney(deal.commercialStructure.legalFee, deal.deal.currency) },
          { label: 'Other Charges', value: formatMoney(deal.commercialStructure.otherCharges, deal.deal.currency) },
          { label: 'Total Fees', value: formatMoney(commercial.calculatedValues.totalFees, deal.deal.currency) },
        ],
      },
      governingLaw: {
        title: 'Governing Law',
        items: [
          { label: 'Jurisdiction', value: deal.client.country },
          { label: 'Policy Basis', value: policy.policySummary.headline },
          { label: 'Evidence Basis', value: evidence.summary.headline },
        ],
      },
      specialConditions: {
        title: 'Special Conditions',
        items: (specialConditionItems.length > 0 ? specialConditionItems : ['No additional special conditions identified.']).map((value, index) => ({
          label: `Special Condition ${index + 1}`,
          value,
        })),
      },
    },
    signatureBlocks: [
      {
        party: deal.client.legalName,
        signatoryRole: 'Authorized Signatory (Client)',
        status: 'Pending Signature',
      },
      {
        party: 'Deepsea Nexus',
        signatoryRole: 'Authorized Signatory (Financier)',
        status: 'Pending Signature',
      },
      {
        party: deal.counterparty.name,
        signatoryRole: 'Acknowledgement Signatory (Counterparty)',
        status: 'Pending Signature',
      },
    ],
  };
}

export const TermSheetGenerationEngine = {
  generateTermSheet,
};
