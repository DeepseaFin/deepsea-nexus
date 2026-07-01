/**
 * Shared contract for all ATLAS Intelligence Engines and UI consumers.
 * Every future engine should emit results conforming to these definitions.
 */

export enum FindingSeverity {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
	Critical = 'critical',
}

export enum FindingCategory {
	Document = 'document',
	Legal = 'legal',
	Credit = 'credit',
	Collateral = 'collateral',
	Promoter = 'promoter',
	Fraud = 'fraud',
	Counterparty = 'counterparty',
	Funding = 'funding',
	Pricing = 'pricing',
	Portfolio = 'portfolio',
	Operations = 'operations',
	Compliance = 'compliance',
	General = 'general',
}

export enum RecommendationPriority {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
	Critical = 'critical',
}

export enum RiskProbability {
	Low = 'low',
	Medium = 'medium',
	High = 'high',
}

export enum RiskImpact {
	Minor = 'minor',
	Moderate = 'moderate',
	Major = 'major',
	Severe = 'severe',
}

export interface Finding {
	id: string;
	title: string;
	description: string;
	severity: FindingSeverity;
	category: FindingCategory;
}

export interface Recommendation {
	id: string;
	title: string;
	description: string;
	priority: RecommendationPriority;
}

export interface Risk {
	id: string;
	title: string;
	description: string;
	probability: RiskProbability;
	impact: RiskImpact;
}

export interface Evidence {
	id: string;
	source: string;
	title: string;
	confidence: number;
}

export interface TrustScore {
	overall: number;
	document: number;
	legal: number;
	fraud: number;
	collateral: number;
	promoter: number;
	counterparty: number;
}

export interface IntelligenceResult {
	engineId: string;
	engineName: string;
	version: string;
	completedAt: string;
	executionTime: number;
	confidence: number;
	trustScore: TrustScore;
	summary: string;
	findings: Finding[];
	recommendations: Recommendation[];
	evidence: Evidence[];
	risks: Risk[];
	metadata: Record<string, unknown>;
}
