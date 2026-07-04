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
import { decisionOrchestrator } from '@/atlas-core/orchestrator/DecisionOrchestrator';
import { FindingCategory, FindingSeverity } from '@/atlas-core/intelligence/types';
import { VerdictBand } from '@/atlas-core/intelligence/verdict';

export default function DocumentsWorkspace() {
  const documentIntelligenceInput = {
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

  const documentEngineResult = documentEngine.run(documentIntelligenceInput);
  const orchestratedDecision = decisionOrchestrator.run([documentEngineResult]);

  const recommendationByVerdict: Record<VerdictBand, 'approve' | 'conditional' | 'review' | 'reject'> = {
    [VerdictBand.Proceed]: 'approve',
    [VerdictBand.ProceedWithConditions]: 'conditional',
    [VerdictBand.Hold]: 'review',
    [VerdictBand.DoNotProceed]: 'reject',
  };

  const recommendationForSummary = recommendationByVerdict[orchestratedDecision.verdict.band];

  const evidence = documentEngineResult.evidence.map((item) => ({
    id: item.id,
    title: item.title,
    description: 'Sourced from Document Engine output.',
    source: item.source,
    confidence: item.confidence,
    status: item.source.toLowerCase() === 'pending' ? 'missing' as const : 'complete' as const,
  }));

  const findings = {
    strengths: orchestratedDecision.findings
      .filter((item) => item.category === FindingCategory.Document)
      .map((item) => ({
        id: item.id,
        text: item.description,
        severity: item.severity === FindingSeverity.Critical ? 'high' as const : item.severity,
      })),
    observations: orchestratedDecision.findings
      .filter((item) => item.category !== FindingCategory.Document && item.category !== FindingCategory.Fraud)
      .map((item) => ({
        id: item.id,
        text: item.description,
        severity: item.severity === FindingSeverity.Critical ? 'high' as const : item.severity,
      })),
    risks: orchestratedDecision.findings
      .filter((item) => item.category === FindingCategory.Fraud)
      .map((item) => ({
        id: item.id,
        text: item.description,
        severity: item.severity === FindingSeverity.Critical ? 'high' as const : item.severity,
      })),
  };

  const recommendation = {
    recommendation:
      recommendationForSummary === 'review' ? 'conditional' : recommendationForSummary,
    reasons:
      orchestratedDecision.recommendations.length > 0
        ? orchestratedDecision.recommendations.map((item) => item.title)
        : ['No recommendation factors available yet from orchestrated engines.'],
    confidence: orchestratedDecision.dealConfidence.confidence,
  };

  const criticalBlockers =
    orchestratedDecision.dealConfidence.blockers.length > 0
      ? orchestratedDecision.dealConfidence.blockers
      : ['No critical blockers flagged by placeholder orchestration.'];

  const actions = documentIntelligenceInput.actions;

  const summary = {
    summary: orchestratedDecision.summary,
    recommendation: recommendationForSummary,
    status: 'completed' as const,
    timestamp: orchestratedDecision.verdict.issuedAt,
    score: orchestratedDecision.dealConfidence.score,
  };

  return (
    <IntelligenceLayout
      title="Document Intelligence"
      subtitle="Executive Due Diligence Report"
      rightSidebar={
        <div className="space-y-6">
          <TrustScore score={orchestratedDecision.trustScore} label="Document Readiness" />
          {[recommendation].map((rec) => (
  <RecommendationPanel
    key="orchestrated-recommendation"
    recommendation={rec.recommendation}
    reasons={rec.reasons}
    confidence={rec.confidence}
  />
))}
          <ActionPanel actions={actions} title="Next Actions" />
        </div>
      }
    >
      <ExecutiveVerdict
        title="ATLAS Executive Verdict"
        recommendation={orchestratedDecision.verdict.title}
        overallReadiness={orchestratedDecision.dealConfidence.score}
        riskLevel={orchestratedDecision.verdict.band}
        criticalBlockers={criticalBlockers}
        estimatedFundingTime="2 Business Days"
      />

      <ExecutiveSummary
  summary={summary.summary}
  recommendation={summary.recommendation}
  status={summary.status}
  timestamp={summary.timestamp}
  score={summary.score}
/>

      <div className="space-y-6">
        <SectionCard title="Document Vault" icon={FileCheck}>
          <div className="space-y-2">
            {evidence.map((doc) => (
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

        <EvidencePanel evidence={evidence} />

        <FindingsPanel findings={findings} />
      </div>
    </IntelligenceLayout>
  );
}
