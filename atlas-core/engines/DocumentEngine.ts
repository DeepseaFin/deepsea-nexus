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

type InputSeverity = 'low' | 'medium' | 'high' | undefined;

interface DocumentEngineFindingInput {
	id: string;
	text: string;
	severity?: InputSeverity;
	impact?: string;
}

interface DocumentEngineRecommendationInput {
	id: string;
	label: string;
	confidence: number;
	riskFactors?: string[];
}

interface DocumentEngineEvidenceInput {
	id: string;
	source: string;
	title: string;
	confidence: number;
}

interface DocumentEngineInput {
	metadata?: {
		analysisDuration?: number;
		analyzedAt?: string;
		[key: string]: unknown;
	};
	executiveSummary?: {
		summary?: string;
		score?: number;
		timestamp?: string;
	};
	confidence?: {
		overall?: number;
		documentAnalysis?: number;
		legalCompliance?: number;
		fraudDetection?: number;
	};
	trustScore?: number;
	evidence?: DocumentEngineEvidenceInput[];
	findings?: {
		strengths?: DocumentEngineFindingInput[];
		observations?: DocumentEngineFindingInput[];
		risks?: DocumentEngineFindingInput[];
	};
	recommendations?: DocumentEngineRecommendationInput[];
}

export class DocumentEngine {
	public run(documentIntelligence: DocumentEngineInput): IntelligenceResult {
		const startedAt = Date.now();

		// Future: OCR pipeline will normalize and validate extracted document text.
		// Future: AI Extraction will derive structured entities and clause intelligence.
		// Future: Fraud Analysis will add anomaly and tampering detection outputs.
		// Future: Legal Analysis will map legal obligations and enforceability signals.
		// Future: Constitution Compliance will validate governance and policy alignment.
		// Future: Confidence Calculation will combine model quality and evidence strength.

		const findings = this.buildFindings(documentIntelligence);
		const recommendations = this.buildRecommendations(documentIntelligence);
		const evidence = this.buildEvidence(documentIntelligence);
		const risks = this.buildRisks(documentIntelligence);
		const trustScore = this.buildTrustScore(documentIntelligence);

		const completedAt =
			documentIntelligence.metadata?.analyzedAt ??
			documentIntelligence.executiveSummary?.timestamp ??
			new Date().toISOString();

		const executionTime =
			documentIntelligence.metadata?.analysisDuration ?? (Date.now() - startedAt);

		const confidence =
			documentIntelligence.confidence?.overall ??
			documentIntelligence.executiveSummary?.score ??
			documentIntelligence.trustScore ??
			0;

		return {
			engineId: 'document-intelligence',
			engineName: 'Document Intelligence',
			version: '1.0.0',
			completedAt,
			executionTime,
			confidence,
			trustScore,
			summary:
				documentIntelligence.executiveSummary?.summary ??
				'Document intelligence analysis completed.',
			findings,
			recommendations,
			evidence,
			risks,
			metadata: {
				...(documentIntelligence.metadata ?? {}),
			},
		};
	}

	private buildFindings(documentIntelligence: DocumentEngineInput): Finding[] {
		const findings = documentIntelligence.findings;

		const strengths = (findings?.strengths ?? []).map((item) => ({
			id: item.id,
			title: 'Strength',
			description: item.text,
			severity: this.toFindingSeverity(item.severity),
			category: FindingCategory.Document,
		}));

		const observations = (findings?.observations ?? []).map((item) => ({
			id: item.id,
			title: 'Observation',
			description: item.text,
			severity: this.toFindingSeverity(item.severity),
			category: FindingCategory.General,
		}));

		const riskFindings = (findings?.risks ?? []).map((item) => ({
			id: item.id,
			title: 'Risk Finding',
			description: item.text,
			severity: this.toFindingSeverity(item.severity),
			category: FindingCategory.Fraud,
		}));

		return [...strengths, ...observations, ...riskFindings];
	}

	private buildRecommendations(documentIntelligence: DocumentEngineInput): Recommendation[] {
		return (documentIntelligence.recommendations ?? []).map((item) => ({
			id: item.id,
			title: item.label,
			description: item.label,
			priority: this.toRecommendationPriority(item.confidence),
		}));
	}

	private buildEvidence(documentIntelligence: DocumentEngineInput): Evidence[] {
		return (documentIntelligence.evidence ?? []).map((item) => ({
			id: item.id,
			source: item.source,
			title: item.title,
			confidence: item.confidence,
		}));
	}

	private buildRisks(documentIntelligence: DocumentEngineInput): Risk[] {
		const findingRisks = (documentIntelligence.findings?.risks ?? []).map((item) => ({
			id: item.id,
			title: 'Document Risk',
			description: item.impact ?? item.text,
			probability: this.toRiskProbability(item.severity),
			impact: this.toRiskImpact(item.severity),
		}));

		const recommendationRisks = (documentIntelligence.recommendations ?? []).flatMap((rec) =>
			(rec.riskFactors ?? []).map((riskFactor, index) => ({
				id: `${rec.id}-risk-${index + 1}`,
				title: 'Recommendation Risk Factor',
				description: riskFactor,
				probability: RiskProbability.Medium,
				impact: RiskImpact.Moderate,
			}))
		);

		return [...findingRisks, ...recommendationRisks];
	}

	private buildTrustScore(documentIntelligence: DocumentEngineInput): TrustScore {
		const overall =
			documentIntelligence.trustScore ??
			documentIntelligence.confidence?.overall ??
			documentIntelligence.executiveSummary?.score ??
			0;

		return {
			overall,
			document: documentIntelligence.confidence?.documentAnalysis ?? overall,
			legal: documentIntelligence.confidence?.legalCompliance ?? overall,
			fraud: documentIntelligence.confidence?.fraudDetection ?? overall,
			collateral: overall,
			promoter: overall,
			counterparty: overall,
		};
	}

	private toFindingSeverity(severity: InputSeverity): FindingSeverity {
		switch (severity) {
			case 'high':
				return FindingSeverity.High;
			case 'medium':
				return FindingSeverity.Medium;
			case 'low':
			default:
				return FindingSeverity.Low;
		}
	}

	private toRecommendationPriority(confidence: number): RecommendationPriority {
		if (confidence >= 90) {
			return RecommendationPriority.Low;
		}
		if (confidence >= 70) {
			return RecommendationPriority.Medium;
		}
		if (confidence >= 50) {
			return RecommendationPriority.High;
		}
		return RecommendationPriority.Critical;
	}

	private toRiskProbability(severity: InputSeverity): RiskProbability {
		switch (severity) {
			case 'high':
				return RiskProbability.High;
			case 'medium':
				return RiskProbability.Medium;
			case 'low':
			default:
				return RiskProbability.Low;
		}
	}

	private toRiskImpact(severity: InputSeverity): RiskImpact {
		switch (severity) {
			case 'high':
				return RiskImpact.Severe;
			case 'medium':
				return RiskImpact.Major;
			case 'low':
			default:
				return RiskImpact.Moderate;
		}
	}
}

export const documentEngine = new DocumentEngine();
