/**
 * Canonical ATLAS deal model shared across all intelligence engines.
 *
 * This file defines the source-of-truth data contracts used by Document,
 * Legal, Credit, Fraud, Structuring, Funding, and orchestration pipelines.
 *
 * Keep this module logic-free and schema-focused.
 */

export enum DealType {
	InvoiceFinance = 'invoice_finance',
	TradeFinance = 'trade_finance',
	TermLoan = 'term_loan',
	WorkingCapital = 'working_capital',
	SupplyChainFinance = 'supply_chain_finance',
}

export enum ProductType {
	InvoiceDiscounting = 'invoice_discounting',
	ReceivablesFactoring = 'receivables_factoring',
	PurchaseOrderFinance = 'purchase_order_finance',
	BillDiscounting = 'bill_discounting',
	VendorFinance = 'vendor_finance',
}

export enum DealStatus {
	Draft = 'draft',
	InReview = 'in_review',
	Approved = 'approved',
	Rejected = 'rejected',
	Funded = 'funded',
	Closed = 'closed',
}

export enum Currency {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	INR = 'INR',
	AED = 'AED',
	SGD = 'SGD',
}

export enum CompanyType {
	PrivateLimited = 'private_limited',
	PublicLimited = 'public_limited',
	LLP = 'llp',
	Partnership = 'partnership',
	SoleProprietorship = 'sole_proprietorship',
}

export enum CompanyRole {
	Applicant = 'applicant',
	Buyer = 'buyer',
	Seller = 'seller',
}

export enum PromoterRole {
	Primary = 'primary',
	CoPromoter = 'co_promoter',
	Guarantor = 'guarantor',
}

export enum CollateralType {
	Receivables = 'receivables',
	Property = 'property',
	Cash = 'cash',
	Guarantee = 'guarantee',
	Inventory = 'inventory',
}

export enum CollateralStatus {
	Proposed = 'proposed',
	Verified = 'verified',
	Rejected = 'rejected',
}

export enum DocumentStatus {
	Uploaded = 'uploaded',
	Missing = 'missing',
	PendingReview = 'pending_review',
	Verified = 'verified',
	Rejected = 'rejected',
}

export enum DocumentType {
	Invoice = 'invoice',
	PurchaseOrder = 'purchase_order',
	BoardResolution = 'board_resolution',
	CreditSummary = 'credit_summary',
	KYC = 'kyc',
	Contract = 'contract',
	Other = 'other',
}

export enum RuleState {
	Required = 'required',
	Optional = 'optional',
	Waived = 'waived',
}

export interface Company {
	companyId: string;
	name: string;
	type: CompanyType;
	role: CompanyRole;
	country: string;
	registrationNumber?: string;
	industry?: string;
}

export interface Counterparty {
	counterpartyId: string;
	name: string;
	country: string;
	industry?: string;
	internalRating?: string;
}

export interface Promoter {
	promoterId: string;
	fullName: string;
	role: PromoterRole;
	citizenshipCountry?: string;
	ownershipPercent?: number;
}

export interface Collateral {
	collateralId: string;
	type: CollateralType;
	description: string;
	estimatedValue?: number;
	currency?: Currency;
	status: CollateralStatus;
}

export interface FundingRequest {
	amount: number;
	currency: Currency;
	tenureDays?: number;
	purpose?: string;
}

export interface Jurisdiction {
	country: string;
	stateOrProvince?: string;
	regulatoryZone?: string;
}

export interface UploadedDocument {
	documentId: string;
	type: DocumentType;
	title: string;
	status: DocumentStatus;
	uploadedAt?: string;
	source?: string;
}

export interface BusinessRules {
	rulesetId: string;
	version: string;
	state: RuleState;
	notes?: string;
}

export interface Deal {
	dealId: string;
	dealType: DealType;
	product: ProductType;
	applicant: Company;
	buyer: Counterparty;
	seller: Counterparty;
	promoters: Promoter[];
	collateral: Collateral[];
	requestedAmount: number;
	currency: Currency;
	jurisdiction: Jurisdiction;
	documents: UploadedDocument[];
	createdAt: string;
	status: DealStatus;
}
