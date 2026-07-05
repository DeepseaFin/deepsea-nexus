import {
	DocumentStatus,
	type Deal,
	type UploadedDocument,
} from '../deals/Deal';
import {
	FindingCategory,
	FindingSeverity,
	RecommendationPriority,
	RiskImpact,
	RiskProbability,
	type Evidence,
	type Finding,
	type IntelligenceResult,
	type Recommendation,
	type Risk,
	type TrustScore,
} from '../intelligence/types';

export class DocumentEngine {
	public run(deal: Deal): IntelligenceResult {
		const startedAt = Date.now();
		const uploadedDocuments = deal.documents;

		// TODO: OCR will normalize and validate extracted document text.
		// TODO: AI extraction will derive structured entities and clause intelligence.
		// TODO: Document validation will enforce required fields and quality thresholds.
		// TODO: Fraud detection will add tampering and anomaly checks.
		// TODO: Constitutional compliance will validate governance and policy alignment.

		const findings = this.buildFindings(uploadedDocuments);
		const recommendations = this.buildRecommendations(uploadedDocuments);
		const evidence = this.buildEvidence(uploadedDocuments);
		const risks = this.buildRisks(uploadedDocuments);
		const trustScore = this.buildTrustScore(uploadedDocuments);

 		const completedAt = new Date().toISOString();

 		const executionTime = Date.now() - startedAt;

		const confidence = trustScore.overall;

		return {
			engineId: 'document-intelligence',
			engineName: 'Document Intelligence',
			version: '1.0.0',
			completedAt,
			executionTime,
			confidence,
			trustScore,
			summary: this.buildSummary(uploadedDocuments),
			findings,
			recommendations,
			evidence,
			risks,
			metadata: {
				dealId: deal.dealId,
				dealType: deal.dealType,
				product: deal.product,
			},
		};
	}

	private buildFindings(uploadedDocuments: UploadedDocument[]): Finding[] {
		const availableFindings = uploadedDocuments
			.filter((document) => document.status !== DocumentStatus.Missing)
			.map((document) => ({
				id: `finding-available-${document.documentId}`,
				title: 'Document Available',
				description: `${document.title} is available in the uploaded set.`,
				severity: FindingSeverity.Low,
				category: FindingCategory.Document,
			}));

		const missingFindings = uploadedDocuments
			.filter((document) => document.status === DocumentStatus.Missing)
			.map((document) => ({
				id: `finding-missing-${document.documentId}`,
				title: 'Missing Document',
				description: `${document.title} is marked missing and requires upload.`,
				severity: FindingSeverity.High,
				category: FindingCategory.Fraud,
			}));

		return [...availableFindings, ...missingFindings];
	}

	private buildRecommendations(uploadedDocuments: UploadedDocument[]): Recommendation[] {
		const hasMissingDocuments = uploadedDocuments.some(
			(document) => document.status === DocumentStatus.Missing,
		);

		return [
			{
				id: 'rec-document-completeness',
				title: hasMissingDocuments
					? 'Complete Required Document Uploads'
					: 'Proceed with Document Package Review',
				description: hasMissingDocuments
					? 'One or more documents are missing and should be uploaded before progression.'
					: 'Current document package is available for downstream review.',
				priority: hasMissingDocuments
					? RecommendationPriority.High
					: RecommendationPriority.Low,
			},
		];
	}

	private buildEvidence(uploadedDocuments: UploadedDocument[]): Evidence[] {
		return uploadedDocuments.map((document) => ({
			id: `evidence-${document.documentId}`,
			source: document.source ?? 'Uploaded Document Registry',
			title: document.title,
			confidence: this.toEvidenceConfidence(document.status),
		}));
	}

	private buildRisks(uploadedDocuments: UploadedDocument[]): Risk[] {
		const missingDocumentRisks = uploadedDocuments
			.filter((document) => document.status === DocumentStatus.Missing)
			.map((document) => ({
				id: `risk-missing-${document.documentId}`,
				title: 'Missing Document Risk',
				description: `${document.title} is missing and may delay progression.`,
				probability: RiskProbability.High,
				impact: RiskImpact.Major,
			}));

		if (missingDocumentRisks.length > 0) {
			return missingDocumentRisks;
		}

		return [
			{
				id: 'risk-placeholder-none',
				title: 'No Immediate Document Risk',
				description: 'No missing documents were detected in placeholder analysis.',
				probability: RiskProbability.Low,
				impact: RiskImpact.Minor,
			},
		];
	}

	private buildTrustScore(uploadedDocuments: UploadedDocument[]): TrustScore {
		const totalDocuments = uploadedDocuments.length;
		const availableDocuments = uploadedDocuments.filter(
			(document) => document.status !== DocumentStatus.Missing,
		).length;

		const overall =
			totalDocuments === 0 ? 0 : Math.round((availableDocuments / totalDocuments) * 100);

		return {
			overall,
			document: overall,
			legal: overall,
			fraud: overall,
			collateral: overall,
			promoter: overall,
			counterparty: overall,
		};
	}

	private toEvidenceConfidence(status: DocumentStatus): number {
		switch (status) {
			case DocumentStatus.Verified:
				return 95;
			case DocumentStatus.Uploaded:
				return 85;
			case DocumentStatus.PendingReview:
				return 60;
			case DocumentStatus.Rejected:
				return 20;
			case DocumentStatus.Missing:
			default:
				return 0;
		}
	}

	private buildSummary(uploadedDocuments: UploadedDocument[]): string {
		const missingCount = uploadedDocuments.filter(
			(document) => document.status === DocumentStatus.Missing,
		).length;

		const availableCount = uploadedDocuments.length - missingCount;

		return `Document engine analyzed ${uploadedDocuments.length} document(s): ${availableCount} available and ${missingCount} missing.`;
	}
}

export const documentEngine = new DocumentEngine();
