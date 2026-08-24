/**
 * Central catalogue of intelligence engines available in ATLAS.
 * Future engines should be registered in this file as the platform expands.
 * The Decision Orchestrator will reference this registry to discover active engines.
 */

export interface IntelligenceEngine {
	id: string;
	name: string;
	description: string;
	category: string;
	enabled: boolean;
	version: string;
}

export const IntelligenceRegistry: readonly IntelligenceEngine[] = [
	{
		id: 'document-intelligence',
		name: 'Document Intelligence',
		description: 'Analyzes and validates deal documents for completeness and quality.',
		category: 'core',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'legal-intelligence',
		name: 'Legal Intelligence',
		description: 'Evaluates legal structures, agreements, and compliance obligations.',
		category: 'risk',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'credit-intelligence',
		name: 'Credit Intelligence',
		description: 'Assesses borrower credit profile and repayment capability.',
		category: 'risk',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'collateral-intelligence',
		name: 'Collateral Intelligence',
		description: 'Reviews collateral strength, valuation signals, and enforceability.',
		category: 'risk',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'promoter-intelligence',
		name: 'Promoter Intelligence',
		description: 'Profiles promoter quality, reputation, and governance indicators.',
		category: 'risk',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'fraud-intelligence',
		name: 'Fraud Intelligence',
		description: 'Detects fraud patterns, anomalies, and manipulation risks.',
		category: 'security',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'counterparty-intelligence',
		name: 'Counterparty Intelligence',
		description: 'Assesses counterparty strength, concentration, and exposure.',
		category: 'risk',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'funding-intelligence',
		name: 'Funding Intelligence',
		description: 'Evaluates funding readiness, disbursement pathways, and timing constraints.',
		category: 'operations',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'pricing-intelligence',
		name: 'Pricing Intelligence',
		description: 'Supports pricing decisions based on structure, risk, and market signals.',
		category: 'commercial',
		enabled: true,
		version: '1.0.0',
	},
	{
		id: 'portfolio-intelligence',
		name: 'Portfolio Intelligence',
		description: 'Tracks portfolio-level behavior, concentration, and performance trends.',
		category: 'portfolio',
		enabled: true,
		version: '1.0.0',
	},
];
