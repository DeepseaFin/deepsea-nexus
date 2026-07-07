import type { DealModel } from '@/atlas-core/deals/DealModel';
import { FinalTermSheetGenerationEngine } from '@/atlas-core/evaluation/FinalTermSheetGenerationEngine';
import {
  LegalDocumentGenerator,
  type GeneratedLegalDocument,
} from '@/atlas-core/legal/LegalDocumentGenerator';

export type LegalAssemblyStatus =
  | 'Required'
  | 'Optional'
  | 'Not Applicable'
  | 'Already Available'
  | 'Pending Commercial Decision';

export interface AssembledLegalDocument {
  documentName: string;
  reasonRequired: string;
  dependency: string;
  completionPercent: number;
  status: LegalAssemblyStatus;
  generated: boolean;
  readyForSignature: boolean;
  executed: boolean;
}

export interface LegalAssemblyResult {
  legalReadinessScore: number;
  requiredDocuments: AssembledLegalDocument[];
  optionalDocuments: AssembledLegalDocument[];
  conditionalDocuments: AssembledLegalDocument[];
  notApplicableDocuments: AssembledLegalDocument[];
  documents: AssembledLegalDocument[];
}

interface AssemblySignals {
  productType: string;
  country: string;
  jurisdiction: string;
  isRecourse: boolean;
  isNonRecourse: boolean;
  disclosedAssignment: boolean | null;
  isCorporateSeller: boolean;
  bankParticipation: boolean;
  controlledCollectionAccount: boolean;
  personalGuaranteeRequired: boolean | null;
  corporateGuaranteeRequired: boolean | null;
  fldgRequired: boolean | null;
  securityPackage: string;
  insuranceRequired: boolean | null;
  currency: string;
  isCrossBorder: boolean;
  isSyndicated: boolean | null;
  multipleSellers: boolean | null;
  multipleBuyers: boolean | null;
}

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function includesAny(value: string, options: string[]): boolean {
  const normalized = normalize(value);
  return options.some((option) => normalized.includes(option));
}

function isCorporateName(value: string): boolean {
  return includesAny(value, ['limited', 'ltd', 'llc', 'inc', 'company', 'pjsc', 'plc']);
}

function toNullableBoolean(value: boolean, hasSignal: boolean): boolean | null {
  return hasSignal ? value : null;
}

function deriveSignals(deal: DealModel): AssemblySignals {
  const finalTermSheet = FinalTermSheetGenerationEngine.generateFinalTermSheet(deal);
  const jurisdiction = finalTermSheet.jurisdiction?.items?.[0]?.value ?? deal.client.country;

  const recourseText = `${deal.commercialStructure.recourseType} ${deal.commercialTerms.recourse}`;
  const settlementText = `${deal.commercialStructure.settlementMethod} ${deal.funding.disbursementAccount}`;
  const securityText = `${deal.commercialTerms.security} ${finalTermSheet.securityPackage?.items?.map((item) => item.value).join(' ') ?? ''}`;
  const fundingSource = deal.commercialStructure.fundingSource;
  const relationshipType = deal.counterparty.relationshipType;
  const uploadedDocumentsText = deal.documents.uploadedDocuments.join(' ');
  const missingDocumentsText = deal.documents.missingDocuments.join(' ');
  const approvalConditionsText = deal.approval.conditions.join(' ');

  const isRecourse = includesAny(recourseText, ['recourse']) && !includesAny(recourseText, ['non recourse', 'non-recourse']);
  const isNonRecourse = includesAny(recourseText, ['non recourse', 'non-recourse']);
  const controlledCollectionAccount = includesAny(settlementText, ['controlled account', 'controlled collection account']);
  const disclosedAssignmentKnown = controlledCollectionAccount || includesAny(uploadedDocumentsText, ['notice of assignment', 'payment direction']);
  const disclosedAssignment = disclosedAssignmentKnown ? controlledCollectionAccount : null;
  const isCorporateSeller = isCorporateName(`${deal.client.legalName} ${deal.client.tradingName}`);
  const bankParticipation = includesAny(`${deal.counterparty.industry} ${relationshipType}`, ['bank']);
  const fldgSignalKnown = includesAny(`${securityText} ${approvalConditionsText}`, ['fldg']);
  const fldgRequired = toNullableBoolean(!includesAny(`${securityText} ${approvalConditionsText}`, ['not required']), fldgSignalKnown);
  const corporateGuaranteeKnown = includesAny(`${securityText} ${approvalConditionsText}`, ['corporate guarantee']);
  const corporateGuaranteeRequired = toNullableBoolean(corporateGuaranteeKnown, corporateGuaranteeKnown);
  const personalGuaranteeKnown = includesAny(`${securityText} ${approvalConditionsText} ${missingDocumentsText}`, ['personal guarantee', 'passport']);
  const personalGuaranteeRequired = toNullableBoolean(personalGuaranteeKnown, personalGuaranteeKnown);
  const insuranceKnown = includesAny(`${securityText} ${approvalConditionsText}`, ['insurance']);
  const insuranceRequired = toNullableBoolean(insuranceKnown, insuranceKnown);
  const isCrossBorder = normalize(deal.client.country) !== normalize(deal.counterparty.country);
  const syndicationKnown = includesAny(fundingSource, ['syndicat', 'participant', 'pool']);
  const isSyndicated = toNullableBoolean(includesAny(fundingSource, ['syndicat', 'participant']), syndicationKnown);
  const multipleSellersKnown = includesAny(uploadedDocumentsText, ['seller schedule', 'multiple sellers']);
  const multipleBuyersKnown = includesAny(uploadedDocumentsText, ['buyer schedule', 'multiple buyers']);

  return {
    productType: deal.deal.product,
    country: deal.client.country,
    jurisdiction,
    isRecourse,
    isNonRecourse,
    disclosedAssignment,
    isCorporateSeller,
    bankParticipation,
    controlledCollectionAccount,
    personalGuaranteeRequired,
    corporateGuaranteeRequired,
    fldgRequired,
    securityPackage: securityText,
    insuranceRequired,
    currency: deal.deal.currency,
    isCrossBorder,
    isSyndicated,
    multipleSellers: multipleSellersKnown ? true : null,
    multipleBuyers: multipleBuyersKnown ? true : null,
  };
}

function detectAlreadyAvailable(documentName: string, deal: DealModel): boolean {
  const target = normalize(documentName);
  const uploaded = deal.documents.uploadedDocuments ?? [];

  return uploaded.some((document) => normalize(document).includes(target) || target.includes(normalize(document)));
}

function dependencyFor(documentName: string): string {
  const dependencyMap: Record<string, string> = {
    'Receivables Purchase Agreement': 'Approved Final Executable Term Sheet',
    'Assignment Agreement': 'Receivables Purchase Agreement',
    'Notice of Assignment': 'Assignment Agreement',
    'Payment Direction Letter': 'Notice of Assignment',
    'Collection Account Agreement': 'Controlled Collection Account Approval',
    'Corporate Guarantee': 'Guarantee Approval Decision',
    'Personal Guarantee': 'Personal Guarantee Commercial Decision',
    'Board Resolution': 'Corporate Seller Authorization',
    'Promissory Note': 'Recourse Structure Confirmation',
    'Security Assignment': 'Security Package Confirmation',
    'Power of Attorney': 'Execution Authority Decision',
    'Undertaking Letter': 'Conditions Precedent Package',
    'Legal Opinion Request': 'Jurisdiction and Security Confirmation',
    'Conditions Precedent Checklist': 'Final Conditions Precedent',
    'Closing Checklist': 'Funding Readiness',
  };

  return dependencyMap[documentName] ?? 'Approved Final Executable Term Sheet';
}

function classifyDocument(document: GeneratedLegalDocument, deal: DealModel, signals: AssemblySignals): { status: LegalAssemblyStatus; reason: string } {
  const alreadyAvailable = detectAlreadyAvailable(document.documentName, deal);
  if (alreadyAvailable) {
    return { status: 'Already Available', reason: 'Document has already been uploaded to the deal evidence package.' };
  }

  switch (document.documentName) {
    case 'Receivables Purchase Agreement':
      return { status: 'Required', reason: `Required for ${signals.productType} as the principal receivables financing agreement.` };
    case 'Assignment Agreement':
      return { status: 'Required', reason: 'Required because receivables assignment forms part of the security and transfer structure.' };
    case 'Notice of Assignment':
      if (signals.disclosedAssignment === true) {
        return { status: 'Required', reason: 'Required because the assignment structure is disclosed to the buyer and collections path.' };
      }
      if (signals.disclosedAssignment === null) {
        return { status: 'Pending Commercial Decision', reason: 'Pending commercial determination of disclosed versus undisclosed assignment structure.' };
      }
      return { status: 'Not Applicable', reason: 'Not applicable where the assignment remains undisclosed.' };
    case 'Payment Direction Letter':
      if (signals.controlledCollectionAccount || signals.disclosedAssignment === true) {
        return { status: 'Required', reason: 'Required to redirect collections into the agreed controlled payment flow.' };
      }
      return { status: 'Optional', reason: 'Optional until payment routing and assignment disclosure are commercially confirmed.' };
    case 'Collection Account Agreement':
      return signals.controlledCollectionAccount
        ? { status: 'Required', reason: 'Required because the commercial structure uses a controlled collection account.' }
        : { status: 'Not Applicable', reason: 'Not applicable where there is no controlled collection account structure.' };
    case 'Corporate Guarantee':
      if (signals.corporateGuaranteeRequired === true || (signals.isCorporateSeller && signals.isRecourse)) {
        return { status: 'Required', reason: 'Required to support the recourse-backed corporate obligor structure.' };
      }
      if (signals.corporateGuaranteeRequired === null) {
        return { status: 'Pending Commercial Decision', reason: 'Pending legal and credit confirmation on whether a corporate guarantee is required.' };
      }
      return { status: 'Not Applicable', reason: 'Not applicable where the commercial structure does not require a corporate guarantee.' };
    case 'Personal Guarantee':
      if (signals.personalGuaranteeRequired === true) {
        return { status: 'Required', reason: 'Required because a personal credit support package is indicated by the live deal structure.' };
      }
      if (signals.personalGuaranteeRequired === null) {
        return { status: 'Pending Commercial Decision', reason: 'Pending commercial and risk decision on whether personal guarantee support is required.' };
      }
      return { status: 'Not Applicable', reason: 'Not applicable where no personal guarantor support is required.' };
    case 'Board Resolution':
      return signals.isCorporateSeller
        ? { status: 'Required', reason: 'Required because the seller is a corporate entity and board authority is needed for execution.' }
        : { status: 'Not Applicable', reason: 'Not applicable where the seller is not a corporate entity.' };
    case 'Promissory Note':
      return signals.isRecourse || signals.fldgRequired === true
        ? { status: 'Required', reason: 'Required because recourse or FLDG support creates a repayment support instrument need.' }
        : { status: 'Optional', reason: 'Optional where repayment support is limited to the primary assignment and security package.' };
    case 'Security Assignment':
      return includesAny(signals.securityPackage, ['assignment', 'security'])
        ? { status: 'Required', reason: 'Required because the security package includes assignment-based collateral support.' }
        : { status: 'Not Applicable', reason: 'Not applicable where no assignment-based security package is in the live structure.' };
    case 'Power of Attorney':
      if (signals.isCrossBorder || signals.disclosedAssignment === null) {
        return { status: 'Optional', reason: 'Optional for execution flexibility in cross-border or still-forming assignment structures.' };
      }
      return { status: 'Not Applicable', reason: 'Not applicable for the current domestic, directly executable structure.' };
    case 'Undertaking Letter':
      return deal.approval.conditions.length > 0
        ? { status: 'Required', reason: 'Required because the current approval carries conditions that need legal undertaking support.' }
        : { status: 'Optional', reason: 'Optional where there are no outstanding conditional undertakings in the approval package.' };
    case 'Legal Opinion Request':
      return signals.isCrossBorder || signals.bankParticipation || signals.isSyndicated === true
        ? { status: 'Required', reason: 'Required due to cross-border, bank participation, or syndicated execution complexity.' }
        : { status: 'Optional', reason: 'Optional until legal complexity thresholds require external or structured opinion support.' };
    case 'Conditions Precedent Checklist':
      return { status: 'Required', reason: 'Required to manage and evidence completion of conditions precedent before execution and funding.' };
    case 'Closing Checklist':
      return { status: 'Required', reason: 'Required to coordinate final legal, operational, and funding close mechanics.' };
    default:
      return { status: 'Optional', reason: 'Optional based on current commercial structure.' };
  }
}

function toCompletionPercent(document: GeneratedLegalDocument, status: LegalAssemblyStatus): number {
  if (document.documentStatus === 'Executed') {
    return 100;
  }
  if (status === 'Not Applicable') {
    return 100;
  }
  if (status === 'Already Available') {
    return Math.max(document.readinessScore, 85);
  }
  if (document.documentStatus === 'Ready For Execution' || document.documentStatus === 'Pending Signatures') {
    return Math.max(document.readinessScore, 75);
  }
  return document.readinessScore;
}

function computeLegalReadinessScore(documents: AssembledLegalDocument[]): number {
  const requiredLike = documents.filter((document) => document.status === 'Required' || document.status === 'Already Available');
  const conditional = documents.filter((document) => document.status === 'Pending Commercial Decision');

  if (requiredLike.length === 0) {
    return 0;
  }

  const requiredAverage = requiredLike.reduce((sum, document) => sum + document.completionPercent, 0) / requiredLike.length;
  const conditionalPenalty = conditional.length * 4;

  return Math.max(0, Math.min(100, Math.round(requiredAverage - conditionalPenalty)));
}

export function assembleLegalRequirements(deal: DealModel): LegalAssemblyResult {
  const finalTermSheet = FinalTermSheetGenerationEngine.generateFinalTermSheet(deal);
  const legalPackage = LegalDocumentGenerator.generateLegalPackage(finalTermSheet);
  const signals = deriveSignals(deal);

  const documents = (legalPackage.documents ?? []).map((document) => {
    const classification = classifyDocument(document, deal, signals);
    const completionPercent = toCompletionPercent(document, classification.status);

    return {
      documentName: document.documentName,
      reasonRequired: classification.reason,
      dependency: dependencyFor(document.documentName),
      completionPercent,
      status: classification.status,
      generated: document.documentStatus !== 'Pending Review',
      readyForSignature: document.documentStatus === 'Ready For Execution' || document.documentStatus === 'Pending Signatures' || document.documentStatus === 'Executed',
      executed: document.documentStatus === 'Executed',
    } satisfies AssembledLegalDocument;
  });

  return {
    legalReadinessScore: computeLegalReadinessScore(documents),
    requiredDocuments: documents.filter((document) => document.status === 'Required' || document.status === 'Already Available'),
    optionalDocuments: documents.filter((document) => document.status === 'Optional'),
    conditionalDocuments: documents.filter((document) => document.status === 'Pending Commercial Decision'),
    notApplicableDocuments: documents.filter((document) => document.status === 'Not Applicable'),
    documents,
  };
}

export const LegalAssemblyEngine = {
  assembleLegalRequirements,
};