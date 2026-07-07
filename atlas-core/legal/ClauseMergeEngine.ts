import type { CreditMemoResult } from '@/atlas-core/evaluation/CreditMemoEngine';
import type { FinalExecutableTermSheetDocument } from '@/atlas-core/evaluation/FinalTermSheetGenerationEngine';
import type { IndicativeTermSheetDocument } from '@/atlas-core/evaluation/TermSheetGenerationEngine';
import type { PricingSnapshot } from '@/atlas-core/evaluation/PricingEngine';
import type { DealModel } from '@/atlas-core/deals/DealModel';
import type { LegalAssemblyResult } from '@/atlas-core/legal/LegalAssemblyEngine';
import type { LegalDocumentTemplate, LegalSectionName } from '@/atlas-core/legal/DocumentTemplateEngine';

export type ClauseCategory =
  | 'Commercial'
  | 'Security'
  | 'Guarantees'
  | 'Representations'
  | 'Warranties'
  | 'Conditions Precedent'
  | 'Events of Default'
  | 'Covenants'
  | 'Confidentiality'
  | 'Governing Law'
  | 'Jurisdiction'
  | 'Notices'
  | 'Dispute Resolution';

export interface ClauseMetadataInput {
  source: string;
  owner: string;
  editable: boolean;
  lastUpdated: string;
  version: string;
  sourceEngine: 'PricingEngine' | 'ParticipantEngine' | 'CreditMemoEngine' | 'TermSheetGenerationEngine' | 'FinalTermSheetGenerationEngine' | 'LegalAssemblyEngine' | 'DocumentTemplateEngine';
}

export interface MergedClause {
  clauseId: string;
  title: string;
  content: string;
  category: ClauseCategory;
  metadata: ClauseMetadataInput;
}

export interface MergedSection {
  sectionName: LegalSectionName;
  clauses: MergedClause[];
}

export interface ClauseMergeContext {
  deal: DealModel;
  pricing: PricingSnapshot;
  risk: ReturnType<typeof import('@/atlas-core/participants/ParticipantEngine').ParticipantEngine.evaluateParticipants>;
  creditMemo: CreditMemoResult;
  indicativeTermSheet: IndicativeTermSheetDocument;
  finalTermSheet: FinalExecutableTermSheetDocument;
  assembly?: LegalAssemblyResult;
  version: string;
  generatedTimestamp: string;
  documentId: string;
}

function categoryForSection(sectionName: LegalSectionName): ClauseCategory {
  switch (sectionName) {
    case 'Commercial Terms':
    case 'Collections':
    case 'Payment Waterfall':
    case 'Schedules':
    case 'Annexures':
      return 'Commercial';
    case 'Security':
      return 'Security';
    case 'Guarantees':
    case 'Signature Blocks':
      return 'Guarantees';
    case 'Representations':
      return 'Representations';
    case 'Undertakings':
      return 'Covenants';
    case 'Conditions Precedent':
      return 'Conditions Precedent';
    case 'Events of Default':
      return 'Events of Default';
    case 'Governing Law':
      return 'Governing Law';
    case 'Dispute Resolution':
      return 'Dispute Resolution';
    case 'Definitions':
    case 'Execution':
    default:
      return 'Commercial';
  }
}

function clause(
  ctx: ClauseMergeContext,
  template: LegalDocumentTemplate,
  sectionName: LegalSectionName,
  index: number,
  title: string,
  content: string,
  source: string,
  sourceEngine: ClauseMetadataInput['sourceEngine'],
): MergedClause {
  return {
    clauseId: `${ctx.documentId}-${sectionName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`,
    title,
    content,
    category: categoryForSection(sectionName),
    metadata: {
      source,
      owner: template.primaryOwner,
      editable: template.editableSections.includes(sectionName),
      lastUpdated: ctx.generatedTimestamp,
      version: ctx.version,
      sourceEngine,
    },
  };
}

function definitionsClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const fields = [
    ['Facility Amount', ctx.finalTermSheet.facilityDetails.items.find((item) => item.label === 'Facility Amount')?.value ?? `${ctx.deal.deal.currency} ${ctx.deal.commercialStructure.facilityLimit.toLocaleString('en-US')}`],
    ['Advance Percentage', `${ctx.pricing.advancePercent.toFixed(2)}%`],
    ['Discount Rate', `${ctx.pricing.discountRatePercent.toFixed(2)}%`],
    ['Tenor', `${ctx.pricing.tenorDays} days`],
    ['Controlled Collection Account', ctx.deal.funding.disbursementAccount],
    ['Obligor', ctx.deal.counterparty.name],
  ];

  return fields.map(([label, value], index) =>
    clause(
      ctx,
      template,
      'Definitions',
      index,
      `${label} Definition`,
      `${label} means ${value} as reflected in the Deal, the indicative term sheet, the final executable term sheet, and the approved commercial structure for ${ctx.deal.deal.dealName}.`,
      'Deal, Indicative Term Sheet, Final Executable Term Sheet, Commercial Structure',
      'FinalTermSheetGenerationEngine',
    ),
  );
}

function commercialTermsClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const totalFees = ctx.deal.commercialStructure.processingFee + ctx.deal.commercialStructure.legalFee + ctx.deal.commercialStructure.otherCharges;
  return [
    clause(ctx, template, 'Commercial Terms', 0, 'Facility Economics', `The facility amount is ${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.facilityLimit).toLocaleString('en-US')} with an approved advance of ${ctx.pricing.advancePercent.toFixed(2)}% and a tenor of ${ctx.pricing.tenorDays} days.`, 'Pricing and Final Executable Term Sheet', 'PricingEngine'),
    clause(ctx, template, 'Commercial Terms', 1, 'Pricing and Fees', `The discount rate is ${ctx.pricing.discountRatePercent.toFixed(2)}%, the processing fee is ${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.processingFee).toLocaleString('en-US')}, and aggregate fees across processing, legal, and brokerage total ${ctx.deal.deal.currency} ${Math.round(totalFees).toLocaleString('en-US')}.`, 'Pricing and Commercial Structure', 'PricingEngine'),
    clause(ctx, template, 'Commercial Terms', 2, 'Recourse and Accounts', `The transaction is structured on a ${ctx.deal.commercialStructure.recourseType} basis with collections routed through ${ctx.deal.funding.disbursementAccount} and settlement mechanics governed by ${ctx.deal.commercialStructure.settlementMethod}.`, 'Deal and Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Commercial Terms', 3, 'Virtual IBAN and Collection Controls', `Collections shall be routed to the controlled account architecture identified in the final executable term sheet, with virtual IBAN level attribution applied through the designated collection control workflow for ${ctx.deal.client.legalName}.`, 'Final Executable Term Sheet and Deal Funding Structure', 'FinalTermSheetGenerationEngine'),
  ];
}

function representationsClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return (ctx.finalTermSheet.representationsAndWarranties ?? []).map((item, index) =>
    clause(ctx, template, 'Representations', index, `Representation ${index + 1}`, item, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  );
}

function undertakingsClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const undertakings = [
    ...ctx.creditMemo.investmentCommitteeDecision.conditions,
    ...ctx.creditMemo.investmentCommitteeDecision.requiredActions,
    ...ctx.finalTermSheet.covenants,
  ];

  return undertakings.map((item, index) =>
    clause(ctx, template, 'Undertakings', index, `Undertaking ${index + 1}`, `${ctx.deal.client.legalName} undertakes that ${item.charAt(0).toLowerCase()}${item.slice(1)}`, 'Credit Memo, Final Executable Term Sheet', index < ctx.creditMemo.investmentCommitteeDecision.conditions.length ? 'CreditMemoEngine' : 'FinalTermSheetGenerationEngine'),
  );
}

function cpClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return (ctx.finalTermSheet.conditionsPrecedent ?? []).map((row, index) =>
    clause(ctx, template, 'Conditions Precedent', index, `Condition Precedent ${index + 1}`, `${row.condition} The responsible party is ${row.responsibleParty}, the required evidence is ${row.evidence}, and the current status is ${row.status}.`, 'Final Executable Term Sheet and Legal Assembly Engine', 'FinalTermSheetGenerationEngine'),
  );
}

function defaultClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return (ctx.finalTermSheet.eventsOfDefault ?? []).map((item, index) =>
    clause(ctx, template, 'Events of Default', index, `Event of Default ${index + 1}`, item, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  );
}

function securityClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const primarySecurity = ctx.finalTermSheet.securityPackage.items.find((item) => item.label === 'Primary Security')?.value ?? ctx.pricing.security;
  const guarantees = ctx.finalTermSheet.securityPackage.items.find((item) => item.label === 'Guarantees')?.value ?? 'Corporate credit support aligned to deal structure.';
  return [
    clause(ctx, template, 'Security', 0, 'Security Package', `The security package consists of ${primarySecurity}, supplemented by ${guarantees}, and remains continuing security for all obligations under ${template.name}.`, 'Pricing, Final Executable Term Sheet, Legal Assembly Engine', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Security', 1, 'Security Provider', `${ctx.deal.client.legalName} acts as security provider and shall maintain all perfection, notice, and control steps necessary to preserve enforceability throughout the tenor.`, 'Deal and Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  ];
}

function guaranteeClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const guarantor = ctx.deal.client.legalName;
  const reasoning = ctx.assembly?.documents.find((item) => item.documentName === template.name)?.reasonRequired ?? 'Guarantee support follows the approved commercial and risk structure.';
  return [
    clause(ctx, template, 'Guarantees', 0, 'Guarantee Support', `The guarantor for this transaction is ${guarantor}. ${reasoning}`, 'Legal Assembly Engine, Deal Structure, Credit Memo', ctx.assembly ? 'LegalAssemblyEngine' : 'CreditMemoEngine'),
    clause(ctx, template, 'Guarantees', 1, 'Guarantee Scope', `Any guarantee obligations support payment, indemnity, and performance obligations arising under the facility, assignment, security, and collections framework approved in the final executable term sheet.`, 'Final Executable Term Sheet and Credit Memo', 'CreditMemoEngine'),
  ];
}

function collectionsClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return [
    clause(ctx, template, 'Collections', 0, 'Collection Route', `All receivables collections shall be paid into ${ctx.deal.funding.disbursementAccount}, being the controlled collection account referenced in the commercial structure and final executable term sheet.`, 'Deal Funding Structure and Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Collections', 1, 'Collection Bank and Control', `Collection control is maintained through the designated collection bank arrangement for ${ctx.deal.client.legalName}, with obligor payments monitored against the approved settlement method of ${ctx.deal.commercialStructure.settlementMethod}.`, 'Deal, Commercial Structure, Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  ];
}

function waterfallClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return (ctx.finalTermSheet.paymentWaterfall.items ?? []).map((item, index) =>
    clause(ctx, template, 'Payment Waterfall', index, item.label, item.value, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  );
}

function governingLawClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const law = ctx.finalTermSheet.governingLaw.items?.[0]?.value ?? 'Laws of the governing jurisdiction referenced in the final executable term sheet';
  const jurisdiction = ctx.finalTermSheet.jurisdiction.items?.[0]?.value ?? ctx.deal.client.country;
  return [
    clause(ctx, template, 'Governing Law', 0, 'Governing Law', `This agreement is governed by ${law}.`, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Governing Law', 1, 'Jurisdiction', `The parties submit to ${jurisdiction} for all proceedings, enforcement steps, and interim remedies contemplated by the transaction documentation.`, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
  ];
}

function disputeClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const disputeText = ctx.finalTermSheet.disputeResolution.items?.map((item) => item.value).join(' ') || `Disputes shall be resolved through staged negotiation, escalation, and formal proceedings in the governing forum for ${ctx.deal.deal.dealName}.`;
  return [clause(ctx, template, 'Dispute Resolution', 0, 'Dispute Resolution', disputeText, 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine')];
}

function executionClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const executionDate = ctx.finalTermSheet.executiveSummary.items.find((item) => item.label === 'Execution Date')?.value ?? ctx.generatedTimestamp.slice(0, 10);
  return [
    clause(ctx, template, 'Execution', 0, 'Execution Mechanics', `This agreement shall be executed on ${executionDate} by authorised signatories of the Seller, Financier, and any additional parties identified in the signature blocks, and becomes effective in accordance with the final executable term sheet.`, 'Final Executable Term Sheet and Deal Parties', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Execution', 1, 'Prepared By', `${template.preparedBy} prepared this agreement on the basis of the approved pricing, risk recommendation, credit memo, indicative term sheet, and final executable term sheet for ${ctx.deal.deal.dealName}.`, 'Document Template and Multi-Engine Context', 'DocumentTemplateEngine'),
  ];
}

function scheduleClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return [
    clause(ctx, template, 'Schedules', 0, 'Schedule 1 - Facility Data', `Schedule 1 records the facility amount of ${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.facilityLimit).toLocaleString('en-US')}, tenor ${ctx.deal.commercialStructure.tenorDays} days, and approved funding of ${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.approvedFunding).toLocaleString('en-US')}.`, 'Deal and Pricing', 'PricingEngine'),
    clause(ctx, template, 'Schedules', 1, 'Schedule 2 - Documentary Package', `Schedule 2 cross-references uploaded evidence including ${ctx.deal.documents.uploadedDocuments.join(', ')} and unresolved documentary items including ${ctx.deal.documents.missingDocuments.join(', ')}.`, 'Deal and Evidence Inventory', 'DocumentTemplateEngine'),
  ];
}

function annexureClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  const assemblyStatus = ctx.assembly?.documents.find((item) => item.documentName === template.name)?.status ?? 'Required';
  return [
    clause(ctx, template, 'Annexures', 0, 'Annexure A - Approval and Risk Pack', `Annexure A incorporates the approved credit memo recommendation of ${ctx.creditMemo.investmentCommitteeDecision.recommendation}, the risk recommendation of ${ctx.risk.recommendation}, and the legal assembly classification of ${assemblyStatus}.`, 'Credit Memo, Risk, Legal Assembly Engine', ctx.assembly ? 'LegalAssemblyEngine' : 'CreditMemoEngine'),
    clause(ctx, template, 'Annexures', 1, 'Annexure B - Term Sheet References', `Annexure B incorporates the indicative term sheet facility reference ${ctx.indicativeTermSheet.facilityReference} and the final executable term sheet execution status of ${ctx.finalTermSheet.executionStatus.current}.`, 'Indicative and Final Executable Term Sheet', 'TermSheetGenerationEngine'),
  ];
}

function signatureClauses(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedClause[] {
  return [
    clause(ctx, template, 'Signature Blocks', 0, 'Seller Signatory', `Executed for and on behalf of ${ctx.deal.client.legalName} by its authorised signatory.`, 'Deal and Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Signature Blocks', 1, 'Financier Signatory', 'Executed for and on behalf of Deepsea Nexus FZCO by its authorised signatory.', 'Final Executable Term Sheet', 'FinalTermSheetGenerationEngine'),
    clause(ctx, template, 'Signature Blocks', 2, 'Additional Signatories', `Additional signatories, including obligor, guarantor, security provider, or collection bank where applicable, shall sign in the execution sequence approved for ${template.name}.`, 'Final Executable Term Sheet and Legal Assembly Engine', ctx.assembly ? 'LegalAssemblyEngine' : 'FinalTermSheetGenerationEngine'),
  ];
}

export function buildMergedSections(ctx: ClauseMergeContext, template: LegalDocumentTemplate): MergedSection[] {
  const builders: Record<LegalSectionName, () => MergedClause[]> = {
    'Definitions': () => definitionsClauses(ctx, template),
    'Commercial Terms': () => commercialTermsClauses(ctx, template),
    'Representations': () => representationsClauses(ctx, template),
    'Undertakings': () => undertakingsClauses(ctx, template),
    'Conditions Precedent': () => cpClauses(ctx, template),
    'Events of Default': () => defaultClauses(ctx, template),
    'Security': () => securityClauses(ctx, template),
    'Guarantees': () => guaranteeClauses(ctx, template),
    'Collections': () => collectionsClauses(ctx, template),
    'Payment Waterfall': () => waterfallClauses(ctx, template),
    'Governing Law': () => governingLawClauses(ctx, template),
    'Dispute Resolution': () => disputeClauses(ctx, template),
    'Execution': () => executionClauses(ctx, template),
    'Schedules': () => scheduleClauses(ctx, template),
    'Annexures': () => annexureClauses(ctx, template),
    'Signature Blocks': () => signatureClauses(ctx, template),
  };

  return template.sectionOrder.map((sectionName) => ({
    sectionName,
    clauses: builders[sectionName](),
  }));
}

export const ClauseMergeEngine = {
  buildMergedSections,
};