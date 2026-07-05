/**
 * First-stage document classifier for the Document Intelligence pipeline.
 *
 * This module is intentionally lightweight and uses filename keywords only.
 * No OCR, no AI, and no backend integration.
 */

export enum DocumentType {
	Invoice = 'Invoice',
	PurchaseOrder = 'Purchase Order',
	TradeLicence = 'Trade Licence',
	BoardResolution = 'Board Resolution',
	InsuranceCertificate = 'Insurance Certificate',
	BankStatement = 'Bank Statement',
	Passport = 'Passport',
	EmiratesId = 'Emirates ID',
	FinancialStatements = 'Financial Statements',
	Unknown = 'Unknown',
}

export interface DocumentClassificationResult {
	documentType: DocumentType;
	confidence: number;
}

const CLASSIFIER_RULES: Array<{ keywords: string[]; documentType: DocumentType; confidence: number }> = [
	{ keywords: ['invoice'], documentType: DocumentType.Invoice, confidence: 98 },
	{ keywords: ['purchase order', 'po'], documentType: DocumentType.PurchaseOrder, confidence: 96 },
	{ keywords: ['trade licence', 'trade license', 'licence', 'license'], documentType: DocumentType.TradeLicence, confidence: 95 },
	{ keywords: ['board resolution', 'resolution'], documentType: DocumentType.BoardResolution, confidence: 94 },
	{ keywords: ['insurance certificate', 'insurance', 'policy'], documentType: DocumentType.InsuranceCertificate, confidence: 92 },
	{ keywords: ['bank statement', 'statement'], documentType: DocumentType.BankStatement, confidence: 90 },
	{ keywords: ['passport'], documentType: DocumentType.Passport, confidence: 99 },
	{ keywords: ['emirates id', 'eid'], documentType: DocumentType.EmiratesId, confidence: 99 },
	{ keywords: ['financial statements', 'financial statement', 'fs', 'accounts'], documentType: DocumentType.FinancialStatements, confidence: 93 },
];

function normalizeFilename(filename: string): string {
	return filename.trim().toLowerCase().replace(/[._-]+/g, ' ');
}

/**
 * Classify a document based on filename keywords only.
 */
export function classifyDocument(filename: string): DocumentClassificationResult {
	const normalizedFilename = normalizeFilename(filename);

	for (const rule of CLASSIFIER_RULES) {
		if (rule.keywords.some((keyword) => normalizedFilename.includes(keyword))) {
			return {
				documentType: rule.documentType,
				confidence: rule.confidence,
			};
		}
	}

	return {
		documentType: DocumentType.Unknown,
		confidence: 0,
	};
}

export const documentClassifier = {
	classifyDocument,
};
