import type { DealModel } from '@/atlas-core/deals/DealModel';
import { createEmptyDeal } from '@/atlas-core/deals/DealModel';
import { CreditMemoEngine } from '@/atlas-core/evaluation/CreditMemoEngine';
import {
  FinalTermSheetGenerationEngine,
  type ExecutionStatus,
  type FinalExecutableTermSheetDocument,
} from '@/atlas-core/evaluation/FinalTermSheetGenerationEngine';
import { evaluatePricing } from '@/atlas-core/evaluation/PricingEngine';
import { TermSheetGenerationEngine } from '@/atlas-core/evaluation/TermSheetGenerationEngine';
import { ParticipantEngine } from '@/atlas-core/participants/ParticipantEngine';
import type { LegalAssemblyResult } from '@/atlas-core/legal/LegalAssemblyEngine';
import { ClauseMergeEngine, type ClauseCategory } from '@/atlas-core/legal/ClauseMergeEngine';
import {
  DocumentTemplateEngine,
  type LegalDocumentTemplate,
  type LegalSectionName,
} from '@/atlas-core/legal/DocumentTemplateEngine';

export type LegalPackageDocumentStatus =
  | 'Generated'
  | 'Pending Review'
  | 'Pending Signatures'
  | 'Ready For Execution'
  | 'Executed';

export type { ClauseCategory };

export interface ClauseMetadata {
  source: string;
  owner: string;
  editable: boolean;
  lastUpdated: string;
  version: string;
  sourceEngine:
    | 'PricingEngine'
    | 'ParticipantEngine'
    | 'CreditMemoEngine'
    | 'TermSheetGenerationEngine'
    | 'FinalTermSheetGenerationEngine'
    | 'LegalAssemblyEngine'
    | 'DocumentTemplateEngine';
}

export interface LegalClause {
  clauseId: string;
  title: string;
  content: string;
  category: ClauseCategory;
  metadata: ClauseMetadata;
}

export interface ReusableLegalClause {
  clauseId: string;
  clauseName: string;
  category: ClauseCategory;
  version: string;
  owner: string;
  editable: boolean;
  lastUpdated: string;
  sourceEngine: ClauseMetadata['sourceEngine'];
  usedInDocuments: string[];
  clauseText: string;
}

export interface LegalPreviewSection {
  sectionName: LegalSectionName;
  clauses: LegalClause[];
}

export interface LegalDocumentHeader {
  documentTitle: string;
  version: string;
  documentNumber: string;
  executionDate: string;
  governingLaw: string;
  jurisdiction: string;
  preparedBy: string;
  generatedTimestamp: string;
}

export interface LegalDocumentParties {
  seller: string;
  purchaser: string;
  financier: string;
  collectionBank: string;
  obligor: string;
  guarantor: string;
  securityProvider: string;
}

export interface GeneratedLegalDocument {
  documentId: string;
  documentName: string;
  header: LegalDocumentHeader;
  parties: LegalDocumentParties;
  version: string;
  documentStatus: LegalPackageDocumentStatus;
  executionStatus: ExecutionStatus;
  governingLaw: string;
  jurisdiction: string;
  requiredSignatories: string[];
  executionSequence: number;
  populatedFields: Record<string, string>;
  editableClauses: string[];
  exportOptions: Array<'PDF' | 'DOCX' | 'PRINT'>;
  readinessScore: number;
  missingInputs: string[];
  previewSections: LegalPreviewSection[];
}

export interface LegalPackage {
  packageId: string;
  packageVersion: string;
  generatedDate: string;
  governingLaw: string;
  jurisdiction: string;
  overallReadiness: number;
  documents: GeneratedLegalDocument[];
  clauseRepository: ReusableLegalClause[];
}

interface GenerationContext {
  deal: DealModel;
  pricing: ReturnType<typeof evaluatePricing>;
  risk: ReturnType<typeof ParticipantEngine.evaluateParticipants>;
  creditMemo: ReturnType<typeof CreditMemoEngine.buildCreditMemo>;
  indicativeTermSheet: ReturnType<typeof TermSheetGenerationEngine.generateTermSheet>;
  finalTermSheet: FinalExecutableTermSheetDocument;
  assembly?: LegalAssemblyResult;
  packageVersion: string;
  generatedTimestamp: string;
}

const EXECUTION_STATUS_WEIGHT: Record<ExecutionStatus, number> = {
  Draft: 35,
  'Ready for Execution': 72,
  'Signed by Deepsea': 84,
  'Signed by Client': 92,
  'Fully Executed': 100,
};

function shortHash(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }
  return Math.abs(hash).toString(16).toUpperCase().slice(0, 8).padStart(8, '0');
}

function buildPackageVersion(finalTermSheet: FinalExecutableTermSheetDocument): string {
  const issueDate = finalTermSheet.executiveSummary.items.find((item) => item.label === 'Issue Date')?.value ?? new Date().toISOString().slice(0, 10);
  return `LGL-${issueDate.replace(/-/g, '.')}`;
}

function buildFallbackDeal(finalTermSheet: FinalExecutableTermSheetDocument): DealModel {
  const deal = createEmptyDeal();
  const executiveSummary = Object.fromEntries(finalTermSheet.executiveSummary.items.map((item) => [item.label, item.value]));
  const parties = Object.fromEntries(finalTermSheet.parties.items.map((item) => [item.label, item.value]));
  const facility = Object.fromEntries(finalTermSheet.facilityDetails.items.map((item) => [item.label, item.value]));
  const commercialTerms = Object.fromEntries(finalTermSheet.commercialTerms.items.map((item) => [item.label, item.value]));

  return {
    ...deal,
    deal: {
      ...deal.deal,
      dealId: executiveSummary['Facility Reference'] ?? deal.deal.dealId,
      dealName: executiveSummary['Facility Name'] ?? deal.deal.dealName,
      status: finalTermSheet.executionStatus.current,
      currency: facility.Currency ?? deal.deal.currency,
    },
    client: {
      ...deal.client,
      legalName: parties.Client ?? deal.client.legalName,
      tradingName: parties.Seller ?? parties.Client ?? deal.client.tradingName,
      relationshipManager: parties['Relationship Manager'] ?? deal.client.relationshipManager,
    },
    counterparty: {
      ...deal.counterparty,
      name: parties.Buyer ?? parties.Obligor ?? deal.counterparty.name,
    },
    commercialStructure: {
      ...deal.commercialStructure,
      advanceRate: Number.parseFloat((commercialTerms['Advance %'] ?? `${deal.commercialStructure.advanceRate}`).replace('%', '')) || deal.commercialStructure.advanceRate,
      tenorDays: Number.parseInt(facility.Tenor ?? `${deal.commercialStructure.tenorDays}`, 10) || deal.commercialStructure.tenorDays,
      discountRatePercent: Number.parseFloat((commercialTerms['Discount Rate'] ?? `${deal.commercialStructure.discountRatePercent}`).replace('%', '')) || deal.commercialStructure.discountRatePercent,
      recourseType: facility['Recourse Type'] ?? deal.commercialStructure.recourseType,
      currency: facility.Currency ?? deal.commercialStructure.currency,
      settlementMethod: commercialTerms['Repayment Method'] ?? deal.commercialStructure.settlementMethod,
    },
    commercialTerms: {
      ...deal.commercialTerms,
      advancePercent: Number.parseFloat((commercialTerms['Advance %'] ?? `${deal.commercialTerms.advancePercent}`).replace('%', '')) || deal.commercialTerms.advancePercent,
      discountRatePercent: Number.parseFloat((commercialTerms['Discount Rate'] ?? `${deal.commercialTerms.discountRatePercent}`).replace('%', '')) || deal.commercialTerms.discountRatePercent,
      recourse: facility['Recourse Type'] ?? deal.commercialTerms.recourse,
      security: finalTermSheet.securityPackage.items[0]?.value ?? deal.commercialTerms.security,
    },
    documents: {
      ...deal.documents,
      uploadedDocuments: finalTermSheet.documentActions.map((item) => item),
      missingDocuments: finalTermSheet.conditionsPrecedent.filter((row) => row.status !== 'Satisfied').map((row) => row.condition),
    },
    approval: {
      ...deal.approval,
      status: finalTermSheet.executionStatus.current,
      conditions: finalTermSheet.conditionsPrecedent.filter((row) => row.status !== 'Satisfied').map((row) => row.condition),
      comments: 'Derived from final executable term sheet package.',
    },
    funding: {
      ...deal.funding,
      fundingStatus: finalTermSheet.executionStatus.current,
      scheduledFundingDate: executiveSummary['Execution Date'] ?? deal.funding.scheduledFundingDate,
      disbursementAccount: commercialTerms['Settlement Account'] ?? finalTermSheet.collectionAccount.items[0]?.value ?? deal.funding.disbursementAccount,
    },
  };
}

function isDealModel(input: DealModel | FinalExecutableTermSheetDocument): input is DealModel {
  return 'deal' in input && 'client' in input;
}

function buildContext(input: DealModel | FinalExecutableTermSheetDocument, assembly?: LegalAssemblyResult): GenerationContext {
  if (isDealModel(input)) {
    const finalTermSheet = FinalTermSheetGenerationEngine.generateFinalTermSheet(input);
    return {
      deal: input,
      pricing: evaluatePricing(input),
      risk: ParticipantEngine.evaluateParticipants(input),
      creditMemo: CreditMemoEngine.buildCreditMemo(input),
      indicativeTermSheet: TermSheetGenerationEngine.generateTermSheet(input),
      finalTermSheet,
      assembly,
      packageVersion: buildPackageVersion(finalTermSheet),
      generatedTimestamp: new Date().toISOString(),
    };
  }

  const deal = buildFallbackDeal(input);
  return {
    deal,
    pricing: evaluatePricing(deal),
    risk: ParticipantEngine.evaluateParticipants(deal),
    creditMemo: CreditMemoEngine.buildCreditMemo(deal),
    indicativeTermSheet: TermSheetGenerationEngine.generateTermSheet(deal),
    finalTermSheet: input,
    assembly,
    packageVersion: buildPackageVersion(input),
    generatedTimestamp: new Date().toISOString(),
  };
}

function buildParties(ctx: GenerationContext): LegalDocumentParties {
  const parties = Object.fromEntries(ctx.finalTermSheet.parties.items.map((item) => [item.label, item.value]));
  const guarantor = ctx.assembly?.documents.find((item) => item.documentName === 'Personal Guarantee' && item.status === 'Required')
    ? `Personal guarantor supporting ${ctx.deal.client.legalName}`
    : ctx.finalTermSheet.securityPackage.items.find((item) => item.label === 'Guarantees')?.value ?? `${ctx.deal.client.legalName} guarantor support if triggered by execution structure`;

  return {
    seller: parties.Seller ?? ctx.deal.client.tradingName ?? ctx.deal.client.legalName,
    purchaser: parties.Buyer ?? ctx.deal.counterparty.name,
    financier: parties.Financier ?? 'Deepsea Nexus FZCO',
    collectionBank: ctx.deal.funding.disbursementAccount,
    obligor: parties.Obligor ?? ctx.deal.counterparty.name,
    guarantor,
    securityProvider: ctx.deal.client.legalName,
  };
}

function buildPopulatedFields(ctx: GenerationContext, parties: LegalDocumentParties): Record<string, string> {
  const executionDate = ctx.finalTermSheet.executiveSummary.items.find((item) => item.label === 'Execution Date')?.value ?? ctx.generatedTimestamp.slice(0, 10);
  const effectiveDate = ctx.finalTermSheet.executiveSummary.items.find((item) => item.label === 'Effective Date')?.value ?? ctx.generatedTimestamp.slice(0, 10);
  const paymentWaterfall = ctx.finalTermSheet.paymentWaterfall.items.map((item) => `${item.label}: ${item.value}`).join(' | ');

  return {
    Seller: parties.seller,
    Purchaser: parties.purchaser,
    Financier: parties.financier,
    'Collection Bank': parties.collectionBank,
    Obligor: parties.obligor,
    Guarantor: parties.guarantor,
    'Security Provider': parties.securityProvider,
    'Facility Amount': `${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.facilityLimit).toLocaleString('en-US')}`,
    'Advance %': `${ctx.pricing.advancePercent.toFixed(2)}%`,
    'Discount Rate': `${ctx.pricing.discountRatePercent.toFixed(2)}%`,
    Fees: `${ctx.deal.deal.currency} ${Math.round(ctx.deal.commercialStructure.processingFee + ctx.deal.commercialStructure.legalFee + ctx.deal.commercialStructure.otherCharges).toLocaleString('en-US')}`,
    Tenor: `${ctx.pricing.tenorDays} days`,
    Recourse: ctx.deal.commercialStructure.recourseType,
    'Collection Waterfall': paymentWaterfall,
    'Virtual IBAN': `${ctx.deal.deal.dealId}-COLLECTION-TRACK`,
    'Controlled Collection Account': ctx.deal.funding.disbursementAccount,
    'Conditions Precedent': ctx.finalTermSheet.conditionsPrecedent.map((row) => row.condition).join(' | '),
    'Execution Date': executionDate,
    'Effective Date': effectiveDate,
    'Governing Law': ctx.finalTermSheet.governingLaw.items[0]?.value ?? 'Approved governing law structure',
    Jurisdiction: ctx.finalTermSheet.jurisdiction.items[0]?.value ?? ctx.deal.client.country,
  };
}

function buildHeader(ctx: GenerationContext, template: LegalDocumentTemplate, documentId: string): LegalDocumentHeader {
  return {
    documentTitle: template.name,
    version: ctx.packageVersion,
    documentNumber: documentId,
    executionDate: ctx.finalTermSheet.executiveSummary.items.find((item) => item.label === 'Execution Date')?.value ?? ctx.generatedTimestamp.slice(0, 10),
    governingLaw: ctx.finalTermSheet.governingLaw.items[0]?.value ?? 'Approved governing law structure',
    jurisdiction: ctx.finalTermSheet.jurisdiction.items[0]?.value ?? ctx.deal.client.country,
    preparedBy: template.preparedBy,
    generatedTimestamp: ctx.generatedTimestamp,
  };
}

function missingInputs(ctx: GenerationContext, template: LegalDocumentTemplate): string[] {
  const baseMissing = [...(ctx.deal.documents.missingDocuments ?? [])];
  const pendingConditions = ctx.finalTermSheet.conditionsPrecedent.filter((row) => row.status !== 'Satisfied').map((row) => row.condition);
  const assemblyPending = ctx.assembly?.documents.find((item) => item.documentName === template.name && item.status === 'Pending Commercial Decision');

  return Array.from(new Set([
    ...baseMissing,
    ...pendingConditions,
    ...(assemblyPending ? [assemblyPending.reasonRequired] : []),
  ])).slice(0, 8);
}

function toDocumentStatus(ctx: GenerationContext, missing: string[]): LegalPackageDocumentStatus {
  const executionStatus = ctx.finalTermSheet.executionStatus.current;
  if (executionStatus === 'Fully Executed') return 'Executed';
  if (executionStatus === 'Signed by Deepsea' || executionStatus === 'Signed by Client') return 'Pending Signatures';
  if (executionStatus === 'Ready for Execution' && missing.length === 0) return 'Ready For Execution';
  if (missing.length > 0) return 'Pending Review';
  return 'Generated';
}

function calculateReadinessScore(ctx: GenerationContext, missing: string[]): number {
  const baseScore = EXECUTION_STATUS_WEIGHT[ctx.finalTermSheet.executionStatus.current] ?? 35;
  return Math.max(40, baseScore - Math.min(missing.length * 5, 30));
}

function buildSignatories(parties: LegalDocumentParties): string[] {
  return [
    `${parties.seller} - Seller`,
    `${parties.financier} - Financier`,
    `${parties.obligor} - Obligor`,
    `${parties.guarantor} - Guarantor`,
  ];
}

function buildDocument(ctx: GenerationContext, template: LegalDocumentTemplate, packageId: string): GeneratedLegalDocument {
  const documentId = `DOC-${template.sequence.toString().padStart(2, '0')}-${shortHash(`${packageId}|${template.name}`)}`;
  const parties = buildParties(ctx);
  const header = buildHeader(ctx, template, documentId);
  const populatedFields = buildPopulatedFields(ctx, parties);
  const previewSections = ClauseMergeEngine.buildMergedSections(
    {
      deal: ctx.deal,
      pricing: ctx.pricing,
      risk: ctx.risk,
      creditMemo: ctx.creditMemo,
      indicativeTermSheet: ctx.indicativeTermSheet,
      finalTermSheet: ctx.finalTermSheet,
      assembly: ctx.assembly,
      version: ctx.packageVersion,
      generatedTimestamp: ctx.generatedTimestamp,
      documentId,
    },
    template,
  ).map((section) => ({
    sectionName: section.sectionName,
    clauses: section.clauses.map((clause) => ({
      clauseId: clause.clauseId,
      title: clause.title,
      content: clause.content,
      category: clause.category,
      metadata: clause.metadata,
    })),
  }));
  const missing = missingInputs(ctx, template);

  return {
    documentId,
    documentName: template.name,
    header,
    parties,
    version: ctx.packageVersion,
    documentStatus: toDocumentStatus(ctx, missing),
    executionStatus: ctx.finalTermSheet.executionStatus.current,
    governingLaw: header.governingLaw,
    jurisdiction: header.jurisdiction,
    requiredSignatories: buildSignatories(parties),
    executionSequence: template.sequence,
    populatedFields,
    editableClauses: template.editableSections,
    exportOptions: ['PDF', 'DOCX', 'PRINT'],
    readinessScore: calculateReadinessScore(ctx, missing),
    missingInputs: missing,
    previewSections,
  };
}

function buildClauseRepository(documents: GeneratedLegalDocument[]): ReusableLegalClause[] {
  const repository = new Map<string, ReusableLegalClause>();

  documents.forEach((document) => {
    document.previewSections.forEach((section) => {
      section.clauses.forEach((clause) => {
        const key = `${clause.category}|${clause.title}|${clause.content}`;
        const existing = repository.get(key);

        if (existing) {
          if (!existing.usedInDocuments.includes(document.documentName)) {
            existing.usedInDocuments.push(document.documentName);
          }
          return;
        }

        repository.set(key, {
          clauseId: clause.clauseId,
          clauseName: clause.title,
          category: clause.category,
          version: clause.metadata.version,
          owner: clause.metadata.owner,
          editable: clause.metadata.editable,
          lastUpdated: clause.metadata.lastUpdated,
          sourceEngine: clause.metadata.sourceEngine,
          usedInDocuments: [document.documentName],
          clauseText: clause.content,
        });
      });
    });
  });

  return Array.from(repository.values()).sort((left, right) => {
    if (left.category === right.category) {
      return left.clauseName.localeCompare(right.clauseName);
    }
    return left.category.localeCompare(right.category);
  });
}

export function generateLegalPackage(input: DealModel | FinalExecutableTermSheetDocument, assembly?: LegalAssemblyResult): LegalPackage {
  const ctx = buildContext(input, assembly);
  const packageId = `LGP-${shortHash(`${ctx.deal.deal.dealId}|${ctx.packageVersion}|${ctx.generatedTimestamp}`)}`;
  const templates = DocumentTemplateEngine.getTemplates();
  const documents = templates.map((template) => buildDocument(ctx, template, packageId));
  const overallReadiness = documents.length > 0
    ? Math.round(documents.reduce((sum, document) => sum + document.readinessScore, 0) / documents.length)
    : 0;

  return {
    packageId,
    packageVersion: ctx.packageVersion,
    generatedDate: ctx.generatedTimestamp,
    governingLaw: documents[0]?.governingLaw ?? ctx.finalTermSheet.governingLaw.items[0]?.value ?? 'Approved governing law structure',
    jurisdiction: documents[0]?.jurisdiction ?? ctx.finalTermSheet.jurisdiction.items[0]?.value ?? ctx.deal.client.country,
    overallReadiness,
    documents,
    clauseRepository: buildClauseRepository(documents),
  };
}

export const LegalDocumentGenerator = {
  generateLegalPackage,
};
