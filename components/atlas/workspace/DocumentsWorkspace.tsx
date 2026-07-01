'use client';

import React from 'react';
import { FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import IntelligenceLayout from '@/components/atlas/intelligence/IntelligenceLayout';
import ExecutiveVerdict from '@/components/atlas/intelligence/ExecutiveVerdict';
import ExecutiveSummary from '@/components/atlas/intelligence/ExecutiveSummary';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import EvidencePanel from '@/components/atlas/intelligence/EvidencePanel';
import FindingsPanel from '@/components/atlas/intelligence/FindingsPanel';
import RecommendationPanel from '@/components/atlas/intelligence/RecommendationPanel';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import { documentEngine } from '@/atlas-core/engines/DocumentEngine';

export default function DocumentsWorkspace() {
  const documentIntelligence = {
    metadata: {
      analysisDuration: 2847,
      analyzedAt: new Date().toISOString(),
      analysisId: 'analysis-2026-07-001',
    },
    executiveSummary: {
      recommendation: 'approve' as const,
      score: 94,
      timestamp: new Date().toISOString(),
      summary:
        'Atlas analysed four uploaded documents. Three documents satisfy constitutional requirements. One mandatory Board Resolution is missing. No document tampering detected. Funding readiness remains high pending document completion.',
    },
    confidence: {
      overall: 94,
      documentAnalysis: 96,
      fraudDetection: 98,
      legalCompliance: 92,
    },
    trustScore: 94,
    evidence: [
      {
        id: 'ev-001',
        title: 'Invoice',
        description: 'Corporate invoice with supplier verification and payment terms',
        source: 'Uploaded 2026-06-28T14:22:00Z',
        confidence: 98,
        status: 'complete' as const,
      },
      {
        id: 'ev-002',
        title: 'Purchase Order',
        description: 'Authorized purchase order with procurement approval signatures',
        source: 'Uploaded 2026-06-28T14:25:30Z',
        confidence: 95,
        status: 'complete' as const,
      },
      {
        id: 'ev-003',
        title: 'Credit Summary',
        description: 'Credit analysis and scoring summary with counterparty ratings',
        source: 'Uploaded 2026-06-29T09:15:00Z',
        confidence: 92,
        status: 'complete' as const,
      },
      {
        id: 'ev-004',
        title: 'Board Resolution',
        description: 'Required board approval documentation for constitutional compliance',
        source: 'Pending',
        confidence: 0,
        status: 'missing' as const,
      },
    ],
    findings: {
      strengths: [
        {
          id: 'find-s-001',
          text: 'Complete Invoice with all required fields and authorized signatures',
          severity: 'low' as const,
          impact: 'Fully verifiable documentation reduces legal risk',
        },
      ],
      observations: [
        {
          id: 'find-o-001',
          text: 'Board Resolution outstanding and required for legal review approval',
          severity: 'medium' as const,
          impact: 'Blocks progression to next intelligence stage',
        },
      ],
      risks: [
        {
          id: 'find-r-001',
          text: 'Legal review cannot be completed until Board Resolution is received',
          severity: 'high' as const,
          impact: 'Critical blocker for deal progression and funding approval',
        },
      ],
    },
    recommendations: [
      {
        id: 'rec-001',
        recommendation: 'approve' as const,
        label: 'Proceed to Legal Review',
        reasons: [
          'Three of four required documents received and verified',
          'Document OCR verification passed with 96% quality score',
          'No tampering, forgery, or fraud indicators detected',
        ],
        confidence: 94,
        riskFactors: ['Board Resolution must be received before legal analysis completion'],
      },
    ],
    actions: [
      {
        id: 'act-001',
        title: 'Upload Board Resolution',
        description: 'Critical document required for legal compliance and constitutional review',
        owner: 'Deal Manager',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        priority: 'critical' as const,
        status: 'pending' as const,
        assignee: 'Sarah Chen',
        estimatedHours: 0.5,
      },
    ],
  };

  const intelligenceResult = documentEngine.run(documentIntelligence);

  const intelligence = {
    ...documentIntelligence,
    trustScore: intelligenceResult.trustScore.overall,
    executiveSummary: {
      ...documentIntelligence.executiveSummary,
      summary: intelligenceResult.summary,
      timestamp: intelligenceResult.completedAt,
      score: intelligenceResult.confidence,
    },
  };

  return (
    <IntelligenceLayout
      title="Document Intelligence"
      subtitle="Executive Due Diligence Report"
      rightSidebar={
        <div className="space-y-6">
          <TrustScore score={intelligence.trustScore} label="Document Readiness" />
          {intelligence.recommendations.map((rec) => (
  <RecommendationPanel
    key={rec.id}
    recommendation={rec.recommendation}
    reasons={rec.reasons}
    confidence={rec.confidence}
  />
))}
          <ActionPanel actions={intelligence.actions} title="Next Actions" />
        </div>
      }
    >
      <ExecutiveVerdict
        title="ATLAS Executive Verdict"
        recommendation="Proceed to Legal Review"
        overallReadiness={94}
        riskLevel="Low"
        criticalBlockers={['Board Resolution Missing']}
        estimatedFundingTime="2 Business Days"
      />

      <ExecutiveSummary
  summary={intelligence.executiveSummary.summary}
  recommendation={intelligence.executiveSummary.recommendation}
  status="completed"
  timestamp={intelligence.executiveSummary.timestamp}
  score={intelligence.executiveSummary.score}
/>

      <div className="space-y-6">
        <SectionCard title="Document Vault" icon={FileCheck}>
          <div className="space-y-2">
            {intelligence.evidence.map((doc) => (
              <div
                key={doc.id}
                className={`flex items-center justify-between rounded-lg bg-slate-800/50 p-3 border ${
                  doc.status === 'missing' ? 'border-rose-800' : 'border-emerald-800'
                }`}
              >
                <span className="text-sm font-medium text-slate-200">{doc.title}</span>
                {doc.status === 'missing' ? (
                  <AlertCircle className="h-4 w-4 text-rose-400" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                )}
              </div>
            ))}
          </div>
        </SectionCard>

        <EvidencePanel evidence={intelligence.evidence} />

        <FindingsPanel findings={intelligence.findings} />
      </div>
    </IntelligenceLayout>
  );
}
