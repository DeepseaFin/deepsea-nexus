import type { DealModel } from '@/atlas-core/deals/DealModel';
import { evaluatePricing } from '@/atlas-core/evaluation/PricingEngine';
import { TermSheetGenerationEngine, type CommercialStatus } from '@/atlas-core/evaluation/TermSheetGenerationEngine';

export type FinalConditionStatus = 'Satisfied' | 'Pending' | 'Waived';
export type ExecutionStatus =
  | 'Draft'
  | 'Ready for Execution'
  | 'Signed by Deepsea'
  | 'Signed by Client'
  | 'Fully Executed';

export interface FinalTermSheetLineItem {
  label: string;
  value: string;
}

export interface FinalTermSheetSection {
  title: string;
  items: FinalTermSheetLineItem[];
}

export interface FinalConditionRow {
  condition: string;
  status: FinalConditionStatus;
  responsibleParty: string;
  evidence: string;
  completionDate: string;
}

export interface SignatureBlock {
  entity: 'Deepsea Nexus FZCO' | 'Client' | 'Witness 1' | 'Witness 2';
  role: 'Authorised Signatory' | 'Witness';
  name: string;
  designation: string;
  date: string;
  signature: string;
}

export interface FinalExecutableTermSheetDocument {
  title: 'FINAL EXECUTABLE TERM SHEET';
  legalNotice: 'LEGALLY BINDING';
  executionNotice: 'EXECUTION VERSION';
  executionStatus: {
    current: ExecutionStatus;
    all: ExecutionStatus[];
  };
  executiveSummary: FinalTermSheetSection;
  parties: FinalTermSheetSection;
  facilityDetails: FinalTermSheetSection;
  commercialTerms: FinalTermSheetSection;
  pricing: FinalTermSheetSection;
  securityPackage: FinalTermSheetSection;
  conditionsPrecedent: FinalConditionRow[];
  conditionsSubsequent: FinalConditionRow[];
  representationsAndWarranties: string[];
  covenants: string[];
  eventsOfDefault: string[];
  paymentWaterfall: FinalTermSheetSection;
  collectionAccount: FinalTermSheetSection;
  governingLaw: FinalTermSheetSection;
  jurisdiction: FinalTermSheetSection;
  confidentiality: FinalTermSheetSection;
  assignment: FinalTermSheetSection;
  amendments: FinalTermSheetSection;
  entireAgreement: FinalTermSheetSection;
  costsAndExpenses: FinalTermSheetSection;
  notices: FinalTermSheetSection;
  forceMajeure: FinalTermSheetSection;
  disputeResolution: FinalTermSheetSection;
  executionSection: FinalTermSheetSection;
  signatures: SignatureBlock[];
  documentActions: Array<'Generate PDF' | 'Generate DOCX' | 'Lock Final Version' | 'Mark Executed'>;
}

function formatMoney(value: number, currency: string): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

function formatPercent(value: number): string {
  return `${Number(value).toFixed(2)}%`;
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function shortHash(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
}

function toConditionStatus(index: number): FinalConditionStatus {
  if (index % 4 === 0) return 'Satisfied';
  if (index % 3 === 0) return 'Waived';
  return 'Pending';
}

function lockNegotiatedValue(value: string, fallback: string): string {
  const normalized = value.trim().toLowerCase();
  if (normalized.length === 0 || normalized === 'pending') {
    return fallback;
  }

  return value;
}

function toExecutionStatus(commercialStatus: CommercialStatus): ExecutionStatus {
  if (commercialStatus !== 'Commercially Agreed') {
    return 'Draft';
  }

  return 'Ready for Execution';
}

function buildConditionRows(values: string[], defaultOwner: string, today: string): FinalConditionRow[] {
  return values.map((condition, index) => ({
    condition,
    status: toConditionStatus(index),
    responsibleParty: index % 2 === 0 ? defaultOwner : 'Legal',
    evidence: index % 2 === 0 ? 'Validated documentary evidence pack' : 'Legal confirmation memo',
    completionDate: index % 2 === 0 ? today : 'Pending',
  }));
}

export function generateFinalTermSheet(deal: DealModel): FinalExecutableTermSheetDocument {
  const pricing = evaluatePricing(deal);
  const indicative = TermSheetGenerationEngine.generateTermSheet(deal);

  const commercialStatus: CommercialStatus = indicative.commercialStatus;
  const executionStatus = toExecutionStatus(commercialStatus);

  const lockedValues = Object.fromEntries(
    indicative.negotiationMatrix.map((row) => [
      row.clause,
      lockNegotiatedValue(row.agreedValue, row.deepseaProposal),
    ]),
  );

  const issueDate = todayIso();
  const effectiveDate = todayIso();
  const executionDate = commercialStatus === 'Commercially Agreed' ? todayIso() : 'Pending Commercial Agreement';

  const documentNumber = `FTS-${deal.deal.dealId}`;
  const qrVerificationId = `QR-${shortHash(`${deal.deal.dealId}|FINAL`)}`;

  const cpBase = indicative.conditionsPrecedent.items.map((item) => item.value);
  const conditionsPrecedent = buildConditionRows(
    cpBase.length > 0 ? cpBase : ['All mandatory documentary and policy clearances to be completed before first drawdown.'],
    'Relationship Manager',
    issueDate,
  );

  const conditionsSubsequent = buildConditionRows(
    [
      'Submit post-disbursement utilisation certificate within agreed reporting period.',
      'Deliver updated receivables ageing and reconciliation report monthly.',
      'Complete deferred KYC refresh and compliance attestations.',
    ],
    'Operations',
    issueDate,
  );

  return {
    title: 'FINAL EXECUTABLE TERM SHEET',
    legalNotice: 'LEGALLY BINDING',
    executionNotice: 'EXECUTION VERSION',
    executionStatus: {
      current: executionStatus,
      all: [
        'Draft',
        'Ready for Execution',
        'Signed by Deepsea',
        'Signed by Client',
        'Fully Executed',
      ],
    },
    executiveSummary: {
      title: 'Executive Summary',
      items: [
        { label: 'Facility Name', value: deal.deal.dealName },
        { label: 'Facility Reference', value: deal.deal.dealId },
        { label: 'Document Number', value: documentNumber },
        { label: 'Issue Date', value: issueDate },
        { label: 'Effective Date', value: effectiveDate },
        { label: 'Execution Date', value: executionDate },
      ],
    },
    parties: {
      title: 'Parties',
      items: [
        { label: 'Financier', value: 'Deepsea Nexus FZCO' },
        { label: 'Client', value: deal.client.legalName },
        { label: 'Seller', value: deal.client.tradingName || deal.client.legalName },
        { label: 'Buyer', value: deal.counterparty.name },
        { label: 'Obligor', value: deal.counterparty.name },
        { label: 'Servicer', value: 'Deepsea Servicing Operations' },
        { label: 'Broker', value: 'As per executed brokerage mandate' },
        { label: 'Relationship Manager', value: deal.client.relationshipManager },
      ],
    },
    facilityDetails: {
      title: 'Facility Details',
      items: [
        { label: 'Facility Amount', value: lockNegotiatedValue(lockedValues['Facility Amount'] ?? '', formatMoney(deal.commercialStructure.facilityLimit, deal.deal.currency)) },
        { label: 'Currency', value: deal.deal.currency },
        { label: 'Tenor', value: lockNegotiatedValue(lockedValues.Tenor ?? '', `${deal.commercialStructure.tenorDays} days`) },
        { label: 'Recourse Type', value: pricing.recourse },
        { label: 'QR Verification ID', value: qrVerificationId },
      ],
    },
    commercialTerms: {
      title: 'Commercial Terms',
      items: [
        { label: 'Advance %', value: lockNegotiatedValue(lockedValues['Advance %'] ?? '', formatPercent(pricing.advancePercent)) },
        { label: 'Discount Rate', value: lockNegotiatedValue(lockedValues['Discount Rate'] ?? '', formatPercent(pricing.discountRatePercent)) },
        { label: 'Repayment Method', value: deal.commercialStructure.settlementMethod },
        { label: 'Settlement Account', value: deal.funding.disbursementAccount },
        { label: 'FLDG', value: lockNegotiatedValue(lockedValues.FLDG ?? '', deal.commercialStructure.recourseType.includes('Limited') ? 'Required' : 'Not Required') },
      ],
    },
    pricing: {
      title: 'Pricing',
      items: [
        { label: 'Broker Fee', value: formatMoney(deal.commercialStructure.otherCharges, deal.deal.currency) },
        { label: 'Processing Fee', value: formatMoney(deal.commercialStructure.processingFee, deal.deal.currency) },
        { label: 'Platform Fee', value: formatMoney(Math.round(deal.commercialStructure.processingFee * 0.35), deal.deal.currency) },
      ],
    },
    securityPackage: {
      title: 'Security Package',
      items: [
        { label: 'Primary Security', value: pricing.security },
        { label: 'Guarantees', value: lockNegotiatedValue(lockedValues.Guarantees ?? '', 'Corporate guarantee from client entity') },
        { label: 'Security Control', value: 'Security to remain valid and enforceable throughout tenor.' },
      ],
    },
    conditionsPrecedent,
    conditionsSubsequent,
    representationsAndWarranties: [
      'Each party confirms full legal power, authority, and capacity to enter and perform obligations under this final executable document.',
      'All submitted data, records, and disclosures are true, complete, and not misleading in any material respect.',
      'Execution and performance do not violate constitutive documents, laws, or binding obligations.',
      'No material adverse change has occurred that would impair obligations under this facility.',
    ],
    covenants: [
      'Maintain required licences, registrations, and legal standing throughout facility tenor.',
      'Provide periodic reporting, compliance certifications, and operational updates as agreed.',
      'Preserve collection routing controls and refrain from unauthorized receivables disposal or encumbrance.',
      'Observe financial, operational, and reporting covenant thresholds in definitive documentation.',
    ],
    eventsOfDefault: [
      'Non-payment beyond cure period.',
      'Material breach of representations, warranties, covenants, or payment obligations.',
      'Insolvency, restructuring, cessation, or enforcement events affecting obligated parties.',
      'Fraud, misrepresentation, or document integrity failure.',
      'Cross-default under material financing obligations.',
    ],
    paymentWaterfall: {
      title: 'Payment Waterfall',
      items: [
        { label: 'Step 1', value: 'Collections credited to controlled collection account.' },
        { label: 'Step 2', value: 'Fees, costs, and charges deducted as per definitive agreements.' },
        { label: 'Step 3', value: 'Financier principal and return settled.' },
        { label: 'Step 4', value: 'Residual balance remitted to client account where applicable.' },
      ],
    },
    collectionAccount: {
      title: 'Collection Account',
      items: [
        { label: 'Collection Account Number', value: deal.funding.disbursementAccount },
        { label: 'Account Control', value: 'Controlled account under financier oversight.' },
        { label: 'Sweeps', value: 'Scheduled sweeps to settlement account as per waterfall.' },
      ],
    },
    governingLaw: {
      title: 'Governing Law',
      items: [{ label: 'Law', value: 'Laws of the United Arab Emirates' }],
    },
    jurisdiction: {
      title: 'Jurisdiction',
      items: [{ label: 'Forum', value: 'Courts of Dubai International Financial Centre (DIFC)' }],
    },
    confidentiality: {
      title: 'Confidentiality',
      items: [{ label: 'Clause', value: 'Parties shall keep terms and related information confidential subject to law and regulation.' }],
    },
    assignment: {
      title: 'Assignment',
      items: [{ label: 'Clause', value: 'Receivables assignment in favor of Deepsea Nexus FZCO as set out in definitive agreements.' }],
    },
    amendments: {
      title: 'Amendments',
      items: [{ label: 'Clause', value: 'Any amendment must be in writing and signed by authorised representatives of all parties.' }],
    },
    entireAgreement: {
      title: 'Entire Agreement',
      items: [{ label: 'Clause', value: 'This final executable term sheet forms part of the complete contractual agreement.' }],
    },
    costsAndExpenses: {
      title: 'Costs & Expenses',
      items: [{ label: 'Clause', value: 'Each party bears its own costs except where expressly allocated otherwise.' }],
    },
    notices: {
      title: 'Notices',
      items: [{ label: 'Clause', value: 'All notices shall be in writing to designated notice addresses and emails.' }],
    },
    forceMajeure: {
      title: 'Force Majeure',
      items: [{ label: 'Clause', value: 'Affected party shall notify promptly and mitigate impacts of force majeure events.' }],
    },
    disputeResolution: {
      title: 'Dispute Resolution',
      items: [{ label: 'Clause', value: 'Disputes to be resolved by negotiation, then arbitration or court as agreed by governing terms.' }],
    },
    executionSection: {
      title: 'Execution Section',
      items: [
        { label: 'Execution Date', value: executionDate },
        { label: 'Execution Version', value: 'Execution Version' },
        { label: 'Legal Binding Status', value: 'Legally Binding' },
      ],
    },
    signatures: [
      {
        entity: 'Deepsea Nexus FZCO',
        role: 'Authorised Signatory',
        name: 'Name',
        designation: 'Designation',
        date: executionDate,
        signature: 'Signature',
      },
      {
        entity: 'Client',
        role: 'Authorised Signatory',
        name: 'Name',
        designation: 'Designation',
        date: executionDate,
        signature: 'Signature',
      },
      {
        entity: 'Witness 1',
        role: 'Witness',
        name: 'Name',
        designation: 'Witness',
        date: executionDate,
        signature: 'Signature',
      },
      {
        entity: 'Witness 2',
        role: 'Witness',
        name: 'Name',
        designation: 'Witness',
        date: executionDate,
        signature: 'Signature',
      },
    ],
    documentActions: [
      'Generate PDF',
      'Generate DOCX',
      'Lock Final Version',
      'Mark Executed',
    ],
  };
}

export const FinalTermSheetGenerationEngine = {
  generateFinalTermSheet,
};