/**
 * Canonical product definition for Receivables Financing.
 *
 * This canon is institutional knowledge for Deepsea Nexus and is intended
 * to be consumed by Intelligence Engines as a typed reference artifact.
 *
 * This module is declarative and contains no business logic.
 */

export type CanonLifecycle = 'draft' | 'active' | 'retired';

export interface CanonDocumentReference {
  code: string;
  label: string;
  required: boolean;
}

export interface CanonCapabilityReference {
  key: string;
  description: string;
}

export interface ReceivablesFinancingCanon {
  id: string;
  name: string;
  version: string;
  lifecycle: CanonLifecycle;
  description: string;
  documentReferences: CanonDocumentReference[];
  capabilityReferences: CanonCapabilityReference[];
  tags: string[];
  metadata: Record<string, string>;
}

export const ReceivablesFinancing: ReceivablesFinancingCanon = {
  id: 'canon-product-receivables-financing',
  name: 'Receivables Financing',
  version: '1.0.0-placeholder',
  lifecycle: 'draft',
  description: 'Placeholder canonical product definition for receivables-based financing.',
  documentReferences: [
    { code: 'trade-licence', label: 'Trade Licence', required: true },
    { code: 'invoice', label: 'Invoice', required: true },
    { code: 'purchase-order', label: 'Purchase Order', required: true },
    { code: 'board-resolution', label: 'Board Resolution', required: true },
    { code: 'bank-details', label: 'Bank Details', required: true },
    { code: 'insurance', label: 'Insurance', required: false },
    { code: 'financial-statements', label: 'Financial Statements', required: false },
    { code: 'credit-report', label: 'Credit Report', required: false },
  ],
  capabilityReferences: [
    {
      key: 'document-intelligence',
      description: 'Consumes canonical document references for product-level analysis.',
    },
    {
      key: 'decision-orchestrator',
      description: 'Uses product canon metadata for coordinated intelligence routing.',
    },
  ],
  tags: ['canon', 'product', 'receivables-financing', 'placeholder'],
  metadata: {
    owner: 'deepsea-nexus',
    scope: 'institutional',
    source: 'atlas-core-canon',
  },
};
