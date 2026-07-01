// Types and Interfaces
export type RecommendationType = 'approve' | 'conditional' | 'review' | 'reject';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'conditional';
export type ActionPriority = 'low' | 'medium' | 'high' | 'critical';
export type ActionStatus = 'pending' | 'in-progress' | 'completed';
export type FindingSeverity = 'low' | 'medium' | 'high';
export type DocumentStatus = 'complete' | 'incomplete' | 'missing' | 'review-required';

export interface EvidenceItem {
  id: string;
  title: string;
  description: string;
  source: string;
  confidence: number;
  status?: DocumentStatus;
}

export interface Finding {
  id: string;
  text: string;
  severity?: FindingSeverity;
  impact?: string;
}

export interface FindingsByCategory {
  strengths?: Finding[];
  observations?: Finding[];
  risks?: Finding[];
}

export interface Recommendation {
  id: string;
  recommendation: RecommendationType;
  label: string;
  reasons: string[];
  confidence: number;
  riskFactors?: string[];
}

export interface Action {
  id: string;
  title: string;
  description?: string;
  owner?: string;
  dueDate?: string;
  priority: ActionPriority;
  status?: ActionStatus;
  assignee?: string;
  estimatedHours?: number;
}

export interface ExecutiveSummaryData {
  recommendation: RecommendationType;
  approvalStatus: ApprovalStatus;
  score: number;
  timestamp: string;
  summary: string;
}

export interface ConfidenceMetrics {
  documentAnalysis: number;
  fraudDetection: number;
  legalCompliance: number;
  financialReview: number;
  overall: number;
}

export interface AnalysisMetadata {
  documentId: string;
  analysisId: string;
  dealId: string;
  analysisDuration: number; // milliseconds
  analyzedAt: string;
  analyzedBy: string;
  version: string;
  documentCount: number;
  totalPages: number;
  ocrQuality: number;
}

export interface DocumentIntelligence {
  metadata: AnalysisMetadata;
  executiveSummary: ExecutiveSummaryData;
  confidence: ConfidenceMetrics;
  trustScore: number;
  evidence: EvidenceItem[];
  findings: FindingsByCategory;
  recommendations: Recommendation[];
  actions: Action[];
}

// Sample Data Object
const sampleDocumentIntelligence: DocumentIntelligence = {
  metadata: {
    documentId: 'doc-2026-07-001',
    analysisId: 'analysis-2026-07-001',
    dealId: 'deal-nexus-0847',
    analysisDuration: 2847,
    analyzedAt: '2026-07-01T10:32:15.000Z',
    analyzedBy: 'ATLAS Document Engine v2.1.4',
    version: '1.0',
    documentCount: 4,
    totalPages: 23,
    ocrQuality: 96,
  },

  executiveSummary: {
    recommendation: 'approve',
    approvalStatus: 'pending',
    score: 94,
    timestamp: new Date().toISOString(),
    summary:
      'Atlas analysed four uploaded documents. Three documents satisfy constitutional requirements. One mandatory Board Resolution is missing. No document tampering detected. Funding readiness remains high pending document completion.',
  },

  confidence: {
    documentAnalysis: 96,
    fraudDetection: 98,
    legalCompliance: 92,
    financialReview: 94,
    overall: 94,
  },

  trustScore: 94,

  evidence: [
    {
      id: 'ev-001',
      title: 'Invoice',
      description: 'Corporate invoice with supplier verification and payment terms',
      source: 'Uploaded 2026-06-28T14:22:00Z',
      confidence: 98,
      status: 'complete',
    },
    {
      id: 'ev-002',
      title: 'Purchase Order',
      description: 'Authorized purchase order with procurement approval signatures',
      source: 'Uploaded 2026-06-28T14:25:30Z',
      confidence: 95,
      status: 'complete',
    },
    {
      id: 'ev-003',
      title: 'Credit Summary',
      description: 'Credit analysis and scoring summary with counterparty ratings',
      source: 'Uploaded 2026-06-29T09:15:00Z',
      confidence: 92,
      status: 'complete',
    },
    {
      id: 'ev-004',
      title: 'Board Resolution',
      description: 'Required board approval documentation for constitutional compliance',
      source: 'Pending',
      confidence: 0,
      status: 'missing',
    },
  ],

  findings: {
    strengths: [
      {
        id: 'find-s-001',
        text: 'Complete Invoice with all required fields and authorized signatures',
        severity: 'low',
        impact: 'Fully verifiable documentation reduces legal risk',
      },
      {
        id: 'find-s-002',
        text: 'Good OCR confidence scores across all documents (92-98%)',
        severity: 'low',
        impact: 'High accuracy in automated data extraction enables automated workflows',
      },
      {
        id: 'find-s-003',
        text: 'No duplicate invoices detected in document vault',
        severity: 'low',
        impact: 'Prevents accidental double-payment fraud',
      },
    ],
    observations: [
      {
        id: 'find-o-001',
        text: 'Board Resolution outstanding and required for legal review approval',
        severity: 'medium',
        impact: 'Blocks progression to next intelligence stage',
      },
      {
        id: 'find-o-002',
        text: 'Insurance certificate not yet uploaded to document vault',
        severity: 'medium',
        impact: 'Limits insurance verification assessment',
      },
    ],
    risks: [
      {
        id: 'find-r-001',
        text: 'Legal review cannot be completed until Board Resolution is received',
        severity: 'high',
        impact: 'Critical blocker for deal progression and funding approval',
      },
    ],
  },

  recommendations: [
    {
      id: 'rec-001',
      recommendation: 'approve',
      label: 'Proceed to Legal Review',
      reasons: [
        'Three of four required documents received and verified',
        'Document OCR verification passed with 96% quality score',
        'No tampering, forgery, or fraud indicators detected',
        'Credit scoring within acceptable range for deal structure',
        'Counterparty verified against sanctions databases',
      ],
      confidence: 94,
      riskFactors: [
        'Board Resolution must be received before legal analysis completion',
        'Insurance documentation required for full compliance review',
      ],
    },
  ],

  actions: [
    {
      id: 'act-001',
      title: 'Upload Board Resolution',
      description: 'Critical document required for legal compliance and constitutional review',
      owner: 'Deal Manager',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'critical',
      status: 'pending',
      assignee: 'Sarah Chen',
      estimatedHours: 0.5,
    },
    {
      id: 'act-002',
      title: 'Verify Insurance Certificate',
      description: 'Obtain and verify current insurance documentation and coverage limits',
      owner: 'Compliance',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      status: 'pending',
      assignee: 'Marcus Williams',
      estimatedHours: 1.5,
    },
    {
      id: 'act-003',
      title: 'Begin Legal Intelligence Review',
      description: 'Initiate legal clause analysis and contract review upon Board Resolution receipt',
      owner: 'Legal Team',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'high',
      status: 'pending',
      assignee: 'Jessica Martinez',
      estimatedHours: 4,
    },
    {
      id: 'act-004',
      title: 'Regulatory Screening',
      description: 'Run comprehensive sanctions and regulatory database screening',
      owner: 'Compliance',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      status: 'in-progress',
      assignee: 'Alex Kumar',
      estimatedHours: 2,
    },
  ],
};

export default sampleDocumentIntelligence;
