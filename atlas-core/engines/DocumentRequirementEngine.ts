import type { CanonPolicy } from '../canon/policies/receivables-financing';

/**
 * Canonical document requirement comparison engine.
 *
 * This engine compares uploaded document types against the selected canon policy.
 * No OCR, no AI, and no backend integration are used here.
 */

export interface DocumentRequirementMatch {
	documentType: string;
	required: boolean;
	policyMatch: boolean;
}

export interface DocumentRequirementResult {
	uploaded: DocumentRequirementMatch[];
	missing: string[];
	optionalMissing: string[];
	completionPercentage: number;
	readyForReview: boolean;
}

export class DocumentRequirementEngine {
	public analyse(
		uploadedDocumentTypes: string[],
		selectedPolicy: CanonPolicy,
	): DocumentRequirementResult {
		const normalizedUploaded = uploadedDocumentTypes.map((documentType) => ({
			original: documentType,
			normalized: this.normalize(documentType),
		}));

		const mandatoryDocumentTypes = selectedPolicy.mandatoryDocuments.map((documentType) => ({
			original: documentType,
			normalized: this.normalize(documentType),
		}));
		const optionalDocumentTypes = selectedPolicy.optionalDocuments.map((documentType) => ({
			original: documentType,
			normalized: this.normalize(documentType),
		}));

		const uploaded = normalizedUploaded.map((documentType) => ({
			documentType: documentType.original,
			required: mandatoryDocumentTypes.some((mandatory) => mandatory.normalized === documentType.normalized),
			policyMatch:
				mandatoryDocumentTypes.some((mandatory) => mandatory.normalized === documentType.normalized) ||
				optionalDocumentTypes.some((optional) => optional.normalized === documentType.normalized),
		}));

		const missing = mandatoryDocumentTypes
			.filter((documentType) =>
				!normalizedUploaded.some((uploadedDocument) => uploadedDocument.normalized === documentType.normalized),
			)
			.map((documentType) => documentType.original);

		const optionalMissing = optionalDocumentTypes
			.filter((documentType) =>
				!normalizedUploaded.some((uploadedDocument) => uploadedDocument.normalized === documentType.normalized),
			)
			.map((documentType) => documentType.original);

		const completionPercentage = this.calculateCompletionPercentage(
			mandatoryDocumentTypes,
			normalizedUploaded,
		);

		return {
			uploaded,
			missing,
			optionalMissing,
			completionPercentage,
			readyForReview: missing.length === 0,
		};
	}

	private calculateCompletionPercentage(
		mandatoryDocuments: Array<{ normalized: string }>,
		uploadedDocumentTypes: Array<{ normalized: string }>,
	): number {
		if (mandatoryDocuments.length === 0) {
			return 100;
		}

		const matchedMandatory = mandatoryDocuments.filter((documentType) =>
			uploadedDocumentTypes.some((uploadedDocument) => uploadedDocument.normalized === documentType.normalized),
		);

		return Math.round((matchedMandatory.length / mandatoryDocuments.length) * 100);
	}

	private normalize(value: string): string {
		return value.trim().toLowerCase();
	}
}

export const documentRequirementEngine = new DocumentRequirementEngine();