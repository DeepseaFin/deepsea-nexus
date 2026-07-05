import { ReceivablesFinancingPolicy } from '../canon/policies';
import { documentRequirementEngine, type DocumentRequirementResult } from '../engines/DocumentRequirementEngine';
import { classifyDocument, type DocumentClassificationResult, DocumentType } from '../engines/DocumentClassifier';

export interface ClassifiedDocument {
	filename: string;
	documentType: DocumentType;
	confidence: number;
}

export interface OrchestratedDecision {
	classifiedDocuments: ClassifiedDocument[];
	documentRequirements: DocumentRequirementResult;
	overallCompletion: number;
	readyForReview: boolean;
	executiveRecommendation: string;
}

export class DecisionOrchestrator {
	run(uploadedFilenames: string[]): OrchestratedDecision {
		const classifiedDocuments = this.classifyUploadedFiles(uploadedFilenames);
		const documentTypes = classifiedDocuments.map((document) => document.documentType);
		const documentRequirements = documentRequirementEngine.analyse(
			documentTypes,
			ReceivablesFinancingPolicy,
		);

		const overallCompletion = documentRequirements.completionPercentage;
		const readyForReview = documentRequirements.readyForReview;
		const executiveRecommendation = readyForReview
			? 'Proceed to Legal Review'
			: 'Await Required Documents';

		return {
			classifiedDocuments,
			documentRequirements,
			overallCompletion,
			readyForReview,
			executiveRecommendation,
		};
	}

	private classifyUploadedFiles(uploadedFilenames: string[]): ClassifiedDocument[] {
		return uploadedFilenames.map((filename) => {
			const classification: DocumentClassificationResult = classifyDocument(filename);

			return {
				filename,
				documentType: classification.documentType,
				confidence: classification.confidence,
			};
		});
	}
}

export const decisionOrchestrator = new DecisionOrchestrator();
