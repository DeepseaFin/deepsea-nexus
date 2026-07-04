/**
 * Deal Confidence Index qualitative bands.
 */
export enum DCIBand {
	Exceptional = "Exceptional",
	Strong = "Strong",
	Good = "Good",
	Moderate = "Moderate",
	Weak = "Weak",
	HighRisk = "High Risk",
}

/**
 * Data model for a Deal Confidence Index (DCI) snapshot.
 *
 * Future versions will calculate DCI using signals from multiple intelligence engines.
 * Future versions will also apply jurisdiction-aware weighting before finalizing the score and verdict.
 */
export interface DealConfidenceIndex {
	score: number;
	confidence: number;
	verdict: DCIBand;
	summary: string;
	contributingEngines: string[];
	blockers: string[];
	strengths: string[];
	observations: string[];
	calculatedAt: string;
}
