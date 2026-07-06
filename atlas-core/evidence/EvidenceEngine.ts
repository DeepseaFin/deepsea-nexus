import type { EvidenceCategoryDefinition, EvidenceCategoryState, EvidenceModel, EvidenceUpload } from '@/atlas-core/evidence/EvidenceModel';
import type { EvidenceBlocker, EvidenceRequiredAction, EvidenceResult, EvidenceWarning } from '@/atlas-core/evidence/EvidenceResult';

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

function calculateReadiness(states: EvidenceCategoryState[]): number {
  const totalRequired = states.reduce((sum, state) => sum + state.required.length, 0);
  const uploadedRequired = states.reduce(
    (sum, state) => sum + state.required.filter((doc) => state.uploaded.includes(doc)).length,
    0,
  );

  if (totalRequired === 0) {
    return 0;
  }

  return Math.round((uploadedRequired / totalRequired) * 100);
}

function buildWarnings(states: EvidenceCategoryState[]): EvidenceWarning[] {
  const warnings: EvidenceWarning[] = [];

  if (states.some((state) => state.verified.length === 0 && state.uploaded.length > 0)) {
    warnings.push({
      code: 'VERIFICATION_PLACEHOLDER',
      severity: 'medium',
      message: 'Verification state is placeholder and will be supplied by future connectors.',
    });
  }

  if (states.some((state) => state.expired.length === 0 && state.uploaded.length > 0)) {
    warnings.push({
      code: 'EXPIRY_PLACEHOLDER',
      severity: 'low',
      message: 'Expiry checks are placeholder and will be supplied by future connectors.',
    });
  }

  return warnings;
}

function buildCriticalBlockers(missingEvidence: string[]): EvidenceBlocker[] {
  return missingEvidence.slice(0, 4).map((missing, index) => ({
    code: `BLOCKER_${index + 1}`,
    message: `${missing} is required for financing evaluation readiness.`,
  }));
}

function buildRequiredActions(
  missingEvidence: string[],
  warnings: EvidenceWarning[],
): EvidenceRequiredAction[] {
  const actions: EvidenceRequiredAction[] = missingEvidence.slice(0, 3).map((missing, index) => ({
    id: `evidence-action-${index + 1}`,
    action: `Upload missing document: ${missing}`,
    owner: 'Relationship Manager',
  }));

  if (warnings.some((warning) => warning.code === 'VERIFICATION_PLACEHOLDER')) {
    actions.push({
      id: 'evidence-action-verification-placeholder',
      action: 'Mark uploaded documents for manual verification until connector integration is enabled.',
      owner: 'Operations Analyst',
    });
  }

  return actions;
}

export function evaluateEvidence(model: EvidenceModel): EvidenceResult {
  const categories = buildCategoryStates(model);
  const missingEvidence = listMissingRequired(categories);
  const readiness = calculateReadiness(categories);
  const warnings = buildWarnings(categories);
  const criticalBlockers = buildCriticalBlockers(missingEvidence);
  const requiredActions = buildRequiredActions(missingEvidence, warnings);

  return {
    readiness,
    categories,
    missingEvidence,
    warnings,
    criticalBlockers,
    requiredActions,
    summary: {
      headline: `Evidence Readiness ${readiness}%`,
      narrative: `Detected ${missingEvidence.length} missing required evidence item(s) across ${categories.length} categories.`,
    },
  };
}

export const EvidenceEngine = {
  evaluateEvidence,
};
