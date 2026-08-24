import type { DealModel } from '@/atlas-core/deals/DealModel';
import { FinalTermSheetGenerationEngine } from '@/atlas-core/evaluation/FinalTermSheetGenerationEngine';

export type LegalDocumentLifecycleStatus =
  | 'Generated'
  | 'Ready for Review'
  | 'Approved'
  | 'Executed'
  | 'Pending Signatures'
  | 'Missing Inputs';

export interface LegalDocumentMetadata {
  documentName: string;
  version: string;
  status: LegalDocumentLifecycleStatus;
  generated: boolean;
  readyForReview: boolean;
  approved: boolean;
  executed: boolean;
  pendingSignatures: number;
  requiredSignatories: string[];
  dependencies: string[];
  missingInputs: string[];
  autoPopulatedFields: string[];
  generatedTimestamp: string;
}

export interface ExecutiveLegalSummary {
  overallLegalReadiness: number;
  documentsGenerated: number;
  documentsPending: number;
  documentsExecuted: number;
  missingMandatoryInputs: number;
  legalRecommendation: string;
}

export interface LegalDocumentationResult {
  executiveSummary: ExecutiveLegalSummary;
  generatedDocuments: LegalDocumentMetadata[];
  documentsReadyForReview: LegalDocumentMetadata[];
  documentsAwaitingSignatures: LegalDocumentMetadata[];
  missingInformation: string[];
  executionChecklist: string[];
  closingChecklist: string[];
  documentDependencyMatrix: Array<{ documentName: string; dependencies: string[] }>;
  executiveLegalNarrative: string;
}

type SectionKey =
  | 'executiveSummary'
  | 'parties'
  | 'facilityDetails'
  | 'commercialTerms'
  | 'pricing'
  | 'securityPackage'
  | 'paymentWaterfall'
  | 'collectionAccount'
  | 'governingLaw'
  | 'jurisdiction'
  | 'confidentiality'
  | 'assignment'
  | 'amendments'
  | 'entireAgreement'
  | 'costsAndExpenses'
  | 'notices'
  | 'forceMajeure'
  | 'disputeResolution'
  | 'executionSection';

type FinalTermSheetDocument = ReturnType<typeof FinalTermSheetGenerationEngine.generateFinalTermSheet>;

interface LegalDocumentTemplate {
  documentName: string;
  sections: SectionKey[];
  prerequisiteDocuments: string[];
  includeWitnesses: boolean;
}

const LEGAL_DOCUMENT_TEMPLATES: LegalDocumentTemplate[] = [
  {
    documentName: 'Receivables Purchase Agreement',
    sections: ['executiveSummary', 'parties', 'facilityDetails', 'commercialTerms', 'assignment', 'notices'],
    prerequisiteDocuments: [],
    includeWitnesses: false,
  },
  {
    documentName: 'Assignment Agreement',
    sections: ['parties', 'facilityDetails', 'assignment', 'jurisdiction'],
    prerequisiteDocuments: ['Receivables Purchase Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Notice of Assignment',
    sections: ['parties', 'assignment', 'notices'],
    prerequisiteDocuments: ['Assignment Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Payment Direction Letter',
    sections: ['parties', 'paymentWaterfall', 'collectionAccount', 'notices'],
    prerequisiteDocuments: ['Notice of Assignment'],
    includeWitnesses: false,
  },
  {
    documentName: 'Collection Account Instruction',
    sections: ['collectionAccount', 'paymentWaterfall', 'notices'],
    prerequisiteDocuments: ['Payment Direction Letter'],
    includeWitnesses: false,
  },
  {
    documentName: 'Corporate Guarantee',
    sections: ['parties', 'securityPackage', 'jurisdiction', 'executionSection'],
    prerequisiteDocuments: ['Receivables Purchase Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Personal Guarantee',
    sections: ['parties', 'securityPackage', 'jurisdiction', 'executionSection'],
    prerequisiteDocuments: ['Corporate Guarantee'],
    includeWitnesses: true,
  },
  {
    documentName: 'Board Resolution',
    sections: ['parties', 'facilityDetails', 'executionSection'],
    prerequisiteDocuments: ['Receivables Purchase Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Promissory Note',
    sections: ['facilityDetails', 'commercialTerms', 'paymentWaterfall', 'executionSection'],
    prerequisiteDocuments: ['Receivables Purchase Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Security Assignment',
    sections: ['securityPackage', 'assignment', 'jurisdiction', 'executionSection'],
    prerequisiteDocuments: ['Assignment Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Power of Attorney',
    sections: ['parties', 'securityPackage', 'jurisdiction', 'executionSection'],
    prerequisiteDocuments: ['Security Assignment'],
    includeWitnesses: true,
  },
  {
    documentName: 'Undertaking Letter',
    sections: ['commercialTerms', 'securityPackage', 'executionSection'],
    prerequisiteDocuments: ['Receivables Purchase Agreement'],
    includeWitnesses: false,
  },
  {
    documentName: 'Legal Opinion Request',
    sections: ['governingLaw', 'jurisdiction', 'securityPackage', 'executionSection'],
    prerequisiteDocuments: ['Corporate Guarantee', 'Security Assignment'],
    includeWitnesses: false,
  },
  {
    documentName: 'Execution Checklist',
    sections: ['executionSection', 'notices', 'collectionAccount'],
    prerequisiteDocuments: ['Legal Opinion Request'],
    includeWitnesses: false,
  },
  {
    documentName: 'Closing Checklist',
    sections: ['paymentWaterfall', 'collectionAccount', 'executionSection'],
    prerequisiteDocuments: ['Execution Checklist'],
    includeWitnesses: false,
  },
];

const EXECUTION_STATE_RANK: Record<string, number> = {
  Draft: 0,
  'Ready for Execution': 1,
  'Signed by Deepsea': 2,
  'Signed by Client': 3,
  'Fully Executed': 4,
};

function isMissingValue(value: string): boolean {
  const normalized = value.trim().toLowerCase();
  return (
    normalized.length === 0 ||
    normalized === 'pending' ||
    normalized.includes('pending commercial agreement') ||
    normalized === 'name' ||
    normalized === 'signature' ||
    normalized === 'designation'
  );
}

function getSectionItems(finalTermSheet: FinalTermSheetDocument, section: SectionKey): Array<{ label: string; value: string }> {
  const candidateSection = finalTermSheet[section] as { items?: Array<{ label: string; value: string }> } | undefined;

  if (!candidateSection || !Array.isArray(candidateSection.items)) {
    return [];
  }

  return candidateSection.items;
}

function buildVersion(finalTermSheet: FinalTermSheetDocument): string {
  const summaryItems = finalTermSheet.executiveSummary?.items ?? [];
  const issueDate = summaryItems.find((item) => item.label === 'Issue Date')?.value ?? new Date().toISOString().slice(0, 10);
  return `V${issueDate.replace(/-/g, '.')}`;
}

function collectMissingInputs(finalTermSheet: FinalTermSheetDocument, sections: SectionKey[]): string[] {
  const safeSections = sections ?? [];

  const fromSections = safeSections.flatMap((section) => {
    const items = getSectionItems(finalTermSheet, section) ?? [];

    return items
      .filter((item) => isMissingValue(item.value))
      .map((item) => `${section}.${item.label}`);
  });

  const conditionsPrecedent = finalTermSheet.conditionsPrecedent ?? [];

  const missingConditions = conditionsPrecedent
    .filter((row) => row.status !== 'Satisfied')
    .map((row) => `conditionsPrecedent.${row.condition}`);

  return Array.from(new Set([...fromSections, ...missingConditions]));
}

function collectAutoPopulatedFields(finalTermSheet: FinalTermSheetDocument, sections: SectionKey[]): string[] {
  const safeSections = sections ?? [];

  return Array.from(
    new Set(
      safeSections.flatMap((section) => {
        const items = getSectionItems(finalTermSheet, section) ?? [];
        return items.map((item) => `${section}.${item.label}`);
      }),
    ),
  );
}

function collectRequiredSignatories(finalTermSheet: FinalTermSheetDocument, includeWitnesses: boolean): string[] {
  const signatures = finalTermSheet.signatures ?? [];

  return signatures
    .filter((signature) => includeWitnesses || signature.role !== 'Witness')
    .map((signature) => `${signature.entity} - ${signature.role}`);
}

function inferSignedCount(executionStatus: string, requiredCount: number): number {
  if (executionStatus === 'Fully Executed') {
    return requiredCount;
  }

  if (executionStatus === 'Signed by Client') {
    return Math.min(2, requiredCount);
  }

  if (executionStatus === 'Signed by Deepsea') {
    return Math.min(1, requiredCount);
  }

  return 0;
}

function computeStatus(args: {
  missingInputs: string[];
  pendingSignatures: number;
  readyForReview: boolean;
  approved: boolean;
  executed: boolean;
}): LegalDocumentLifecycleStatus {
  if (args.missingInputs.length > 0) {
    return 'Missing Inputs';
  }

  if (args.executed) {
    return 'Executed';
  }

  if (args.pendingSignatures > 0 && args.approved) {
    return 'Pending Signatures';
  }

  if (args.approved) {
    return 'Approved';
  }

  if (args.readyForReview) {
    return 'Ready for Review';
  }

  return 'Generated';
}

function buildDependencies(
  finalTermSheet: FinalTermSheetDocument,
  template: LegalDocumentTemplate,
  autoPopulatedFields: string[],
): string[] {
  const executionDependency = `Final Executable Term Sheet (${finalTermSheet.executionStatus.current})`;
  const safeAutoPopulatedFields = autoPopulatedFields ?? [];
  const sectionDependencies = Array.from(new Set(safeAutoPopulatedFields.map((field) => field.split('.')[0])));

  return [
    executionDependency,
    ...template.prerequisiteDocuments,
    ...sectionDependencies,
  ];
}

function buildExecutiveLegalNarrative(executiveSummary: ExecutiveLegalSummary): string {
  return [
    `Overall legal readiness is ${executiveSummary.overallLegalReadiness}%.`,
    `${executiveSummary.documentsGenerated} document packages were generated from the final executable term sheet metadata.`,
    `${executiveSummary.documentsExecuted} documents are fully executed and ${executiveSummary.documentsPending} remain pending completion.`,
    `${executiveSummary.missingMandatoryInputs} mandatory inputs remain unresolved across legal documentation.`,
    `Recommendation: ${executiveSummary.legalRecommendation}.`,
  ].join(' ');
}

function buildExecutionChecklist(generatedDocuments: LegalDocumentMetadata[]): string[] {
  const documents = generatedDocuments ?? [];

  return documents.flatMap((doc) => {
    const checklist = [`Validate ${doc.documentName} metadata lock against Final Executable Term Sheet.`];

    if (doc.missingInputs.length > 0) {
      checklist.push(`Resolve missing inputs for ${doc.documentName}.`);
    }

    if (doc.pendingSignatures > 0) {
      checklist.push(`Collect pending signatures for ${doc.documentName} (${doc.pendingSignatures} outstanding).`);
    }

    return checklist;
  });
}

function buildClosingChecklist(generatedDocuments: LegalDocumentMetadata[]): string[] {
  const documents = generatedDocuments ?? [];

  return documents.map((doc) => {
    if (!doc.executed) {
      return `Hold close for ${doc.documentName} until execution and dependency completion.`;
    }

    return `Archive executed ${doc.documentName} and confirm audit trace linkage.`;
  });
}

export function generateLegalDocumentation(deal: DealModel): LegalDocumentationResult {
  const finalTermSheet = FinalTermSheetGenerationEngine.generateFinalTermSheet(deal);
  const executionRank = EXECUTION_STATE_RANK[finalTermSheet.executionStatus.current] ?? 0;
  const generatedTimestamp = new Date().toISOString();
  const version = buildVersion(finalTermSheet);
  const templates = LEGAL_DOCUMENT_TEMPLATES ?? [];

  const generatedDocuments = templates.map((template) => {
    const autoPopulatedFields = collectAutoPopulatedFields(finalTermSheet, template.sections);
    const missingInputs = collectMissingInputs(finalTermSheet, template.sections);
    const requiredSignatories = collectRequiredSignatories(finalTermSheet, template.includeWitnesses);
    const signedCount = inferSignedCount(finalTermSheet.executionStatus.current, requiredSignatories.length);
    const pendingSignatures = Math.max(requiredSignatories.length - signedCount, 0);

    const generated = true;
    const readyForReview = executionRank >= 1 && missingInputs.length === 0;
    const approved = executionRank >= 2 && missingInputs.length === 0;
    const executed = executionRank >= 4 && missingInputs.length === 0;
    const status = computeStatus({
      missingInputs,
      pendingSignatures,
      readyForReview,
      approved,
      executed,
    });

    return {
      documentName: template.documentName,
      version,
      status,
      generated,
      readyForReview,
      approved,
      executed,
      pendingSignatures,
      requiredSignatories,
      dependencies: buildDependencies(finalTermSheet, template, autoPopulatedFields),
      missingInputs,
      autoPopulatedFields,
      generatedTimestamp,
    } satisfies LegalDocumentMetadata;
  });

  const documentsReadyForReview = generatedDocuments.filter((doc) => doc.readyForReview);
  const documentsAwaitingSignatures = generatedDocuments.filter((doc) => doc.pendingSignatures > 0 && doc.approved);
  const missingInformation = Array.from(new Set((generatedDocuments ?? []).flatMap((doc) => doc.missingInputs ?? [])));

  const documentsGenerated = generatedDocuments.length;
  const documentsExecuted = generatedDocuments.filter((doc) => doc.executed).length;
  const documentsPending = generatedDocuments.filter((doc) => !doc.executed).length;
  const readinessPoints = generatedDocuments.filter((doc) => doc.readyForReview || doc.approved || doc.executed).length;
  const overallLegalReadiness = Math.round((readinessPoints / Math.max(documentsGenerated, 1)) * 100);

  const executiveSummary: ExecutiveLegalSummary = {
    overallLegalReadiness,
    documentsGenerated,
    documentsPending,
    documentsExecuted,
    missingMandatoryInputs: missingInformation.length,
    legalRecommendation:
      missingInformation.length > 0
        ? 'Do not proceed to legal execution until all mandatory inputs are resolved.'
        : documentsPending > 0
          ? 'Proceed with signature collection and close-out sequencing per dependency matrix.'
          : 'Proceed to close; legal documentation package is execution complete.',
  };

  return {
    executiveSummary,
    generatedDocuments,
    documentsReadyForReview,
    documentsAwaitingSignatures,
    missingInformation,
    executionChecklist: buildExecutionChecklist(generatedDocuments ?? []),
    closingChecklist: buildClosingChecklist(generatedDocuments ?? []),
    documentDependencyMatrix: (generatedDocuments ?? []).map((doc) => ({
      documentName: doc.documentName,
      dependencies: doc.dependencies ?? [],
    })),
    executiveLegalNarrative: buildExecutiveLegalNarrative(executiveSummary),
  };
}

export const LegalDocumentationEngine = {
  generateLegalDocumentation,
};
