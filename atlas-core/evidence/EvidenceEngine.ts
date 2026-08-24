import type { EvidenceCategoryDefinition, EvidenceCategoryState, EvidenceModel, EvidenceUpload } from '@/atlas-core/evidence/EvidenceModel';
import type {
  EvidenceBlocker,
  EvidenceDocumentItem,
  EvidenceRecommendation,
  EvidenceRequiredAction,
  EvidenceResult,
  EvidenceWarning,
} from '@/atlas-core/evidence/EvidenceResult';

const EVIDENCE_CATEGORIES: EvidenceCategoryDefinition[] = [
  {
    category: 'Corporate Documents',
    required: ['Trade Licence', 'Board Resolution'],
    optional: ['Insurance Certificate'],
  },
  {
    category: 'KYC',
    required: ['Passport', 'Emirates ID'],
    optional: [],
  },
  {
    category: 'Financial Statements',
    required: ['Financial Statements'],
    optional: [],
  },
  {
    category: 'Trade Documents',
    required: ['Invoice', 'Purchase Order'],
    optional: [],
  },
  {
    category: 'Receivables',
    required: ['Invoice'],
    optional: [],
  },
  {
    category: 'Bank Details',
    required: ['Bank Statement'],
    optional: [],
  },
  {
    category: 'Legal Documents',
    required: ['Board Resolution'],
    optional: ['Insurance Certificate'],
  },
];

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

function hasEvidence(uploads: EvidenceUpload[], expectedDocument: string): boolean {
  const expected = normalize(expectedDocument);

  return uploads.some((upload) => {
    const byType = normalize(upload.documentType ?? '') === expected;
    const byName = normalize(upload.name).includes(expected);
    return byType || byName;
  });
}

function getMatchingUpload(
  uploads: EvidenceUpload[],
  expectedDocument: string,
): EvidenceUpload | undefined {
  const expected = normalize(expectedDocument);

  return uploads.find((upload) => {
    const byType = normalize(upload.documentType ?? '') === expected;
    const byName = normalize(upload.name).includes(expected);
    return byType || byName;
  });
}

function buildCategoryStates(model: EvidenceModel): EvidenceCategoryState[] {
  return EVIDENCE_CATEGORIES.map((definition) => {
    const uploaded = definition.required
      .concat(definition.optional)
      .filter((document) => hasEvidence(model.uploads, document));

    return {
      category: definition.category,
      required: definition.required,
      optional: definition.optional,
      uploaded,
      verified: [],
      expired: [],
    };
  });
}

function listMissingRequired(states: EvidenceCategoryState[]): string[] {
  return states.flatMap((state) =>
    state.required
      .filter((requiredDoc) => !state.uploaded.includes(requiredDoc))
      .map((requiredDoc) => `${state.category}: ${requiredDoc}`),
  );
}

function buildRequiredDocumentRows(model: EvidenceModel): EvidenceDocumentItem[] {
  return EVIDENCE_CATEGORIES.flatMap((categoryDef) => {
    const rowsFrom = (documents: string[], mandatory: boolean): EvidenceDocumentItem[] =>
      documents.map((documentName, index) => {
        const match = getMatchingUpload(model.uploads, documentName);
        const confidence = match?.confidence ?? 0;
        const status: EvidenceDocumentItem['status'] =
          !match ? 'missing' : confidence >= 80 ? 'verified' : 'pending';

        return {
          id: `${categoryDef.category}-${documentName}-${index}`,
          category: categoryDef.category,
          name: documentName,
          mandatory,
          status,
          verification: status === 'verified' ? 'verified' : 'pending',
          confidence: match?.confidence,
          isCritical: mandatory,
        };
      });

    return [
      ...rowsFrom(categoryDef.required, true),
      ...rowsFrom(categoryDef.optional, false),
    ];
  });
}

function buildReadinessFromDocuments(requiredDocuments: EvidenceDocumentItem[]): number {
  const mandatory = requiredDocuments.filter((document) => document.mandatory);

  if (mandatory.length === 0) {
    return 0;
  }

  const completedMandatory = mandatory.filter((document) => document.status !== 'missing').length;
  const verifiedMandatory = mandatory.filter((document) => document.status === 'verified').length;

  const completionScore = (completedMandatory / mandatory.length) * 70;
  const verificationScore = (verifiedMandatory / mandatory.length) * 30;

  return Math.round(completionScore + verificationScore);
}

function buildWarnings(requiredDocuments: EvidenceDocumentItem[]): EvidenceWarning[] {
  const warnings: EvidenceWarning[] = [];

  const mandatoryPending = requiredDocuments.filter(
    (document) => document.mandatory && document.status === 'pending',
  );
  const optionalMissing = requiredDocuments.filter(
    (document) => !document.mandatory && document.status === 'missing',
  );

  if (mandatoryPending.length > 0) {
    warnings.push({
      code: 'MANDATORY_VERIFICATION_PENDING',
      severity: 'high',
      message:
        'One or more mandatory documents are uploaded but pending verification and require analyst validation.',
    });
  }

  if (optionalMissing.length > 0) {
    warnings.push({
      code: 'OPTIONAL_DOCUMENTS_MISSING',
      severity: 'low',
      message: 'Optional supporting documents are pending upload.',
    });
  }

  if (requiredDocuments.some((document) => document.status !== 'missing')) {
    warnings.push({
      code: 'EXPIRY_PLACEHOLDER',
      severity: 'low',
      message: 'Expiry checks are placeholder and will be supplied by future connectors.',
    });
  }

  return warnings;
}

function buildCriticalBlockers(
  missingMandatoryDocuments: EvidenceDocumentItem[],
): EvidenceBlocker[] {
  return missingMandatoryDocuments.slice(0, 5).map((missing, index) => ({
    code: `BLOCKER_${index + 1}`,
    message: `${missing.category}: ${missing.name} is mandatory and pending before funding decision can proceed.`,
  }));
}

function buildRequiredActions(
  missingMandatoryDocuments: EvidenceDocumentItem[],
  pendingMandatoryDocuments: EvidenceDocumentItem[],
  warnings: EvidenceWarning[],
): EvidenceRequiredAction[] {
  const actions: EvidenceRequiredAction[] = missingMandatoryDocuments.slice(0, 4).map((missing, index) => ({
    id: `evidence-action-${index + 1}`,
    action: `Upload missing mandatory document: ${missing.category} - ${missing.name}`,
    owner: 'Relationship Manager',
  }));

  pendingMandatoryDocuments.slice(0, 2).forEach((document, index) => {
    actions.push({
      id: `evidence-action-verify-${index + 1}`,
      action: `Verify uploaded mandatory document: ${document.category} - ${document.name}`,
      owner: 'Credit Operations',
    });
  });

  if (warnings.some((warning) => warning.code === 'EXPIRY_PLACEHOLDER')) {
    actions.push({
      id: 'evidence-action-expiry-review',
      action: 'Perform manual expiry review of uploaded evidence until connector checks are enabled.',
      owner: 'Operations Analyst',
    });
  }

  return actions;
}

function buildRecommendation(
  missingMandatoryDocuments: EvidenceDocumentItem[],
  pendingMandatoryDocuments: EvidenceDocumentItem[],
): EvidenceRecommendation {
  if (missingMandatoryDocuments.length > 0) {
    return 'Do Not Proceed';
  }

  if (pendingMandatoryDocuments.length > 0) {
    return 'Proceed with Conditions';
  }

  return 'Proceed';
}

function buildExecutiveNarrative(
  recommendation: EvidenceRecommendation,
  missingMandatoryDocuments: EvidenceDocumentItem[],
  verifiedDocuments: EvidenceDocumentItem[],
  pendingMandatoryDocuments: EvidenceDocumentItem[],
): string {
  if (recommendation === 'Proceed') {
    return `Yes. Documentary evidence is currently sufficient to proceed with funding, with ${verifiedDocuments.length} verified document(s) and no missing mandatory requirements.`;
  }

  if (recommendation === 'Proceed with Conditions') {
    return `Conditionally. Mandatory evidence is uploaded, but ${pendingMandatoryDocuments.length} mandatory document(s) remain pending verification before final funding release.`;
  }

  return `No. Documentary evidence is not yet sufficient to proceed; ${missingMandatoryDocuments.length} mandatory document(s) are still missing.`;
}

export function evaluateEvidence(model: EvidenceModel): EvidenceResult {
  const categories = buildCategoryStates(model);
  const requiredDocuments = buildRequiredDocumentRows(model);
  const missingMandatoryDocuments = requiredDocuments.filter(
    (document) => document.mandatory && document.status === 'missing',
  );
  const verifiedDocuments = requiredDocuments.filter(
    (document) => document.status === 'verified',
  );
  const pendingMandatoryDocuments = requiredDocuments.filter(
    (document) => document.mandatory && document.status === 'pending',
  );
  const missingEvidence = listMissingRequired(categories);
  const readiness = buildReadinessFromDocuments(requiredDocuments);
  const warnings = buildWarnings(requiredDocuments);
  const criticalBlockers = buildCriticalBlockers(missingMandatoryDocuments);
  const requiredActions = buildRequiredActions(
    missingMandatoryDocuments,
    pendingMandatoryDocuments,
    warnings,
  );
  const recommendation = buildRecommendation(
    missingMandatoryDocuments,
    pendingMandatoryDocuments,
  );
  const executiveNarrative = buildExecutiveNarrative(
    recommendation,
    missingMandatoryDocuments,
    verifiedDocuments,
    pendingMandatoryDocuments,
  );
  const criticalDocumentsPending = missingMandatoryDocuments.filter(
    (document) => document.isCritical,
  ).length;

  return {
    readiness,
    categories,
    requiredDocuments,
    missingMandatoryDocuments,
    verifiedDocuments,
    recommendation,
    criticalDocumentsPending,
    missingEvidence,
    warnings,
    criticalBlockers,
    requiredActions,
    summary: {
      headline: `${recommendation} | Evidence Readiness ${readiness}%`,
      narrative: executiveNarrative,
    },
  };
}

export const EvidenceEngine = {
  evaluateEvidence,
};
