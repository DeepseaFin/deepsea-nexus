/**
 * Canonical policy definition for Receivables Financing.
 *
 * Policies define institutional underwriting rules and are consumed by
 * Intelligence Engines as declarative reference data.
 *
 * This module is strongly typed and contains no business logic or AI logic.
 */

import { ReceivablesFinancing } from '../products/receivables-financing';

export type CanonPolicyProduct = typeof ReceivablesFinancing.name;

export interface CanonPolicyFundingLimits {
  minimumAmount: number;
  maximumAmount: number;
  currency: string;
}

export interface CanonPolicyCollateralRequirements {
  required: boolean;
  acceptedTypes: string[];
  notes?: string;
}

export interface CanonPolicyPromoterRequirements {
  minimumPromoters: number;
  requiresKyc: boolean;
  requiresSanctionsScreening: boolean;
  notes?: string;
}

export interface CanonPolicyLegalRequirements {
  requiresBoardResolution: boolean;
  requiresJurisdictionValidation: boolean;
  notes?: string;
}

export interface CanonPolicyReviewTriggers {
  manualReview: string[];
  escalation: string[];
}

export interface CanonPolicy {
  policyId: string;
  product: CanonPolicyProduct;
  supportedJurisdictions: string[];
  mandatoryDocuments: string[];
  optionalDocuments: string[];
  minimumTrustScore: number;
  collateralRequirements: CanonPolicyCollateralRequirements;
  promoterRequirements: CanonPolicyPromoterRequirements;
  legalRequirements: CanonPolicyLegalRequirements;
  fundingLimits: CanonPolicyFundingLimits;
  reviewTriggers: CanonPolicyReviewTriggers;
  metadata: Record<string, string>;
}

export const ReceivablesFinancingPolicy: CanonPolicy = {
  policyId: 'canon-policy-receivables-financing',
  product: ReceivablesFinancing.name,
  supportedJurisdictions: ['India', 'United Arab Emirates', 'Singapore'],
  mandatoryDocuments: [
    'Trade Licence',
    'Invoice',
    'Purchase Order',
    'Board Resolution',
    'Bank Details',
  ],
  optionalDocuments: ['Insurance', 'Financial Statements', 'Credit Report'],
  minimumTrustScore: 75,
  collateralRequirements: {
    required: false,
    acceptedTypes: ['Receivables', 'Guarantee', 'Cash'],
    notes: 'Collateral may be optional depending on product configuration.',
  },
  promoterRequirements: {
    minimumPromoters: 1,
    requiresKyc: true,
    requiresSanctionsScreening: true,
    notes: 'Promoter identity and governance checks are expected at policy level.',
  },
  legalRequirements: {
    requiresBoardResolution: true,
    requiresJurisdictionValidation: true,
    notes: 'Legal review remains policy-driven and jurisdiction-aware.',
  },
  fundingLimits: {
    minimumAmount: 10000,
    maximumAmount: 5000000,
    currency: 'USD',
  },
  reviewTriggers: {
    manualReview: [
      'Missing mandatory document',
      'Trust score below threshold',
      'Jurisdiction mismatch',
    ],
    escalation: [
      'Legal requirement not satisfied',
      'Promoter screening incomplete',
      'Collateral exception requested',
    ],
  },
  metadata: {
    lifecycle: 'draft',
    owner: 'deepsea-nexus',
    source: 'atlas-core-canon-policies',
  },
};
