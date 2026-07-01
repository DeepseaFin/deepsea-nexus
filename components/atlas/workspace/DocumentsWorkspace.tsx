'use client';

import React from 'react';
import { FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import IntelligenceLayout from '@/components/atlas/intelligence/IntelligenceLayout';
import ExecutiveSummary from '@/components/atlas/intelligence/ExecutiveSummary';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import EvidencePanel from '@/components/atlas/intelligence/EvidencePanel';
import FindingsPanel from '@/components/atlas/intelligence/FindingsPanel';
import RecommendationPanel from '@/components/atlas/intelligence/RecommendationPanel';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import sampleDocumentIntelligence from '@/components/atlas/intelligence/sampleDocumentIntelligence';

export default function DocumentsWorkspace() {
  const intelligence = sampleDocumentIntelligence;

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
