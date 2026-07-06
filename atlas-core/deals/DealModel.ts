import { createWorkflowState, type AtlasWorkflowState, type AtlasWorkflowStateName } from '@/atlas-core/workflow/ATLASWorkflowEngine';

export type DealWorkflowStep =
  | 'Client'
  | 'Counterparty'
  | 'Commercial Terms'
  | 'Documents'
  | 'Intelligence'
  | 'Recommendation'
  | 'Term Sheet'
  | 'Approval';

export const DEAL_WORKFLOW_STEPS: DealWorkflowStep[] = [
  'Client',
  'Counterparty',
  'Commercial Terms',
  'Documents',
  'Intelligence',
  'Recommendation',
  'Term Sheet',
  'Approval',
];

export interface DealInfo {
  dealId: string;
  dealName: string;
  status: string;
  stage: string;
  product: string;
  currency: string;
  amount: number;
  fundingRequired: number;
  tenureDays: number;
  expectedReturnPercent: number;
}

export interface ClientInfo {
  clientId: string;
  legalName: string;
  tradingName: string;
  country: string;
  industry: string;
  registrationNumber: string;
  tradeLicense: string;
  website: string;
  relationshipManager: string;
  primaryContact: string;
  email: string;
  phone: string;
  relationshipStatus: string;
  internalRating: string;
}

export interface CounterpartyInfo {
  name: string;
  country: string;
  industry: string;
  relationshipType: string;
  paymentTerms: string;
  internalRating: string;
  creditLimit: string;
  existingExposure: string;
  website: string;
  primaryContact: string;
}

export interface CommercialTerms {
  advancePercent: number;
  discountRatePercent: number;
  processingFeePercent: number;
  recourse: string;
  security: string;
}

export interface CommercialStructure {
  invoiceAmount: number;
  requestedFunding: number;
  approvedFunding: number;
  advanceRate: number;
  tenorDays: number;
  discountRatePercent: number;
  processingFee: number;
  legalFee: number;
  otherCharges: number;
  expectedYield: number;
  expectedProfit: number;
  expectedIRR: string;
  fundingSource: string;
  facilityLimit: number;
  recourseType: string;
  currency: string;
  settlementMethod: string;
}

export interface DocumentState {
  uploadedDocuments: string[];
  missingDocuments: string[];
  completionPercent: number;
}

export interface IntelligenceState {
  dealConfidenceIndex: number;
  trustScore: number;
  creditRating: string;
  legalRating: string;
  fraudRating: string;
  recommendation: string;
}

export interface ApprovalState {
  status: string;
  approver: string;
  conditions: string[];
  comments: string;
}

export interface FundingState {
  fundingStatus: string;
  scheduledFundingDate: string;
  disbursementAccount: string;
  trancheAmount: number;
}

export interface TimelineEntry {
  time: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'future';
}

export interface TaskItem {
  title: string;
  description: string;
  owner: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export interface WorkflowState extends AtlasWorkflowState {
  currentStep: DealWorkflowStep;
  completedSteps: DealWorkflowStep[];
  currentState: AtlasWorkflowStateName;
  completedStates: AtlasWorkflowStateName[];
  progress: number;
}

export interface DealModel {
  deal: DealInfo;
  client: ClientInfo;
  counterparty: CounterpartyInfo;
  commercialStructure: CommercialStructure;
  commercialTerms: CommercialTerms;
  documents: DocumentState;
  intelligence: IntelligenceState;
  approval: ApprovalState;
  funding: FundingState;
  timeline: TimelineEntry[];
  tasks: TaskItem[];
  workflow: WorkflowState;
}

export function createEmptyDeal(): DealModel {
  return {
    deal: {
      dealId: 'DNX-2026-000301',
      dealName: 'ABC Ltd Receivables Facility',
      status: 'Draft',
      stage: 'Client',
      product: 'Receivables Financing',
      currency: 'AED',
      amount: 2500000,
      fundingRequired: 2250000,
      tenureDays: 90,
      expectedReturnPercent: 16.4,
    },
    client: {
      clientId: 'CL-000301',
      legalName: 'ABC Limited',
      tradingName: 'ABC Trading',
      country: 'United Arab Emirates',
      industry: 'Industrial Trading',
      registrationNumber: 'REG-2026-00128',
      tradeLicense: 'TL-778231',
      website: 'https://abc.example.com',
      relationshipManager: 'Deepak Menon',
      primaryContact: 'Rashid Al Mansoor',
      email: 'rashid@abc.example.com',
      phone: '+971 50 123 4567',
      relationshipStatus: 'Active',
      internalRating: 'A-',
    },
    counterparty: {
      name: 'Mashreq Bank PJSC',
      country: 'United Arab Emirates',
      industry: 'Banking',
      relationshipType: 'Primary Buyer Bank',
      paymentTerms: 'Net 45',
      internalRating: 'A',
      creditLimit: '4500000',
      existingExposure: '1800000',
      website: 'https://www.mashreq.com',
      primaryContact: 'Fatima Al Nuaimi',
    },
    commercialStructure: {
      invoiceAmount: 2500000,
      requestedFunding: 2250000,
      approvedFunding: 2200000,
      advanceRate: 88,
      tenorDays: 90,
      discountRatePercent: 8.2,
      processingFee: 12000,
      legalFee: 4500,
      otherCharges: 2500,
      expectedYield: 16.4,
      expectedProfit: 158000,
      expectedIRR: 'Placeholder',
      fundingSource: 'Institutional Pool A',
      facilityLimit: 4500000,
      recourseType: 'Limited Recourse',
      currency: 'AED',
      settlementMethod: 'Controlled Account',
    },
    commercialTerms: {
      advancePercent: 90,
      discountRatePercent: 8.2,
      processingFeePercent: 0.75,
      recourse: 'Limited Recourse',
      security: 'Assignment of receivables with controlled account',
    },
    documents: {
      uploadedDocuments: [
        'Invoice Pack - June 2026',
        'Trade License Copy',
      ],
      missingDocuments: [
        'Audited Financial Statements',
        'Board Resolution',
      ],
      completionPercent: 68,
    },
    intelligence: {
      dealConfidenceIndex: 78,
      trustScore: 82,
      creditRating: 'A-',
      legalRating: 'Medium',
      fraudRating: 'Low',
      recommendation: 'Approve with Conditions',
    },
    approval: {
      status: 'Pending Review',
      approver: 'Credit Committee Chair',
      conditions: [
        'Close legal rider confirmation',
        'Submit updated board resolution',
      ],
      comments: 'Ready for conditional committee consideration after documentation closure.',
    },
    funding: {
      fundingStatus: 'Not Scheduled',
      scheduledFundingDate: '2026-07-12',
      disbursementAccount: 'Controlled Collection Account',
      trancheAmount: 2250000,
    },
    timeline: [
      {
        time: '09:00',
        title: 'Case Created',
        description: 'New receivables financing case initialized from origination.',
        status: 'completed',
      },
      {
        time: '09:05',
        title: 'Workflow Started',
        description: 'Case entered the Opportunity stage.',
        status: 'current',
      },
      {
        time: '09:20',
        title: 'Documents Pending',
        description: 'Awaiting supporting evidence and intake checklist closure.',
        status: 'future',
      },
    ],
    tasks: [
      {
        title: 'Confirm company details',
        description: 'Validate legal name and country capture.',
        owner: 'Relationship Manager',
        status: 'in-progress',
      },
      {
        title: 'Review submitted documents',
        description: 'Check initial upload package for completeness.',
        owner: 'Operations',
        status: 'pending',
      },
    ],
    workflow: {
      ...createWorkflowState('Lead'),
      currentStep: 'Client',
      completedSteps: [],
    },
  };
}
