'use client';

import React, { useMemo, useState } from 'react';
import { FileCheck } from 'lucide-react';
import IntelligenceLayout from '@/components/atlas/intelligence/IntelligenceLayout';
import ExecutiveVerdict from '@/components/atlas/intelligence/ExecutiveVerdict';
import ExecutiveSummary from '@/components/atlas/intelligence/ExecutiveSummary';
import TrustScore from '@/components/atlas/intelligence/TrustScore';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import EvidencePanel from '@/components/atlas/intelligence/EvidencePanel';
import FindingsPanel from '@/components/atlas/intelligence/FindingsPanel';
import RecommendationPanel from '@/components/atlas/intelligence/RecommendationPanel';
import ActionPanel from '@/components/atlas/intelligence/ActionPanel';
import DocumentUploadZone from '@/components/atlas/documents/DocumentUploadZone';
import { decisionOrchestrator } from '@/atlas-core/orchestrator/DecisionOrchestrator';
import type { UploadedFileView } from '@/components/atlas/documents/DocumentUploadZone';

export default function DocumentsWorkspace() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFileView[]>([]);

  const orchestratedDecision = useMemo(() => {
    if (uploadedFiles.length === 0) {
      return null;
    }

    const filenames = uploadedFiles.map((file) => file.name);
    return decisionOrchestrator.run(filenames);
  }, [uploadedFiles]);

  const actions = [
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
  ];

  const recommendationForSummary: 'approve' | 'review' = orchestratedDecision?.readyForReview
    ? 'approve'
    : 'review';
  const recommendationForPanel: 'approve' | 'conditional' | 'reject' = orchestratedDecision?.readyForReview
    ? 'approve'
    : 'conditional';

  const evidence = orchestratedDecision?.classifiedDocuments.map((document, index) => ({
    id: `${document.filename}-${index}`,
    title: document.filename,
    description: 'Uploaded file attached to the deal.',
    source: 'Uploaded file',
    confidence: document.confidence,
    status: 'complete' as const,
  })) ?? [];

  const uploadedDocumentCards = orchestratedDecision?.classifiedDocuments ?? [];
  const missingDocuments = orchestratedDecision?.documentRequirements.missing ?? [];
  const optionalMissing = orchestratedDecision?.documentRequirements.optionalMissing ?? [];
  const completionPercentage = orchestratedDecision?.overallCompletion ?? 0;
  const readyForReview = orchestratedDecision?.readyForReview ?? false;

  const findings = {
    strengths: readyForReview
      ? [
          {
            id: 'find-s-001',
            text: 'All mandatory documents are present.',
            severity: 'low' as const,
          },
        ]
      : [],
    observations: optionalMissing.map((documentType, index) => ({
      id: `find-o-${index + 1}`,
      text: `${documentType} is optional and not uploaded yet.`,
      severity: 'low' as const,
    })),
    risks: missingDocuments.map((documentType, index) => ({
      id: `find-r-${index + 1}`,
      text: `${documentType} is mandatory and missing.`,
      severity: 'high' as const,
    })),
  };

  const recommendation = {
    recommendation: recommendationForSummary,
    reasons:
      missingDocuments.length > 0
        ? missingDocuments.map((documentType) => `${documentType} is required before review can proceed.`)
        : ['All mandatory documents are present.'],
    confidence: completionPercentage,
  };

  const summary = {
    summary: orchestratedDecision
      ? `Uploaded ${orchestratedDecision.classifiedDocuments.length} file(s). Document completion is ${completionPercentage}%.`
      : 'Upload documents to begin the ATLAS document pipeline.',
    recommendation: recommendationForSummary,
    status: 'completed' as const,
    timestamp: new Date().toISOString(),
    score: completionPercentage,
  };

  return (
    <IntelligenceLayout
      title="Document Intelligence"
      subtitle="Executive Due Diligence Report"
      rightSidebar={
        <div className="space-y-6">
          {orchestratedDecision ? (
            <>
              <TrustScore score={completionPercentage} label="Document Completion" />
              <RecommendationPanel
                recommendation={recommendationForPanel}
                reasons={recommendation.reasons}
                confidence={recommendation.confidence}
              />
            </>
          ) : (
            <SectionCard title="Onboarding" icon={FileCheck}>
              <p className="text-sm leading-relaxed text-slate-300">
                Upload documents to start the first-stage ATLAS decision pipeline.
              </p>
            </SectionCard>
          )}
          <ActionPanel actions={actions} title="Next Actions" />
        </div>
      }
    >
      <SectionCard title="Upload Documents" icon={FileCheck}>
        <DocumentUploadZone onFilesChange={setUploadedFiles} />
      </SectionCard>

      {orchestratedDecision ? (
        <>
          <ExecutiveVerdict
            title="ATLAS Executive Verdict"
            recommendation={orchestratedDecision.executiveRecommendation}
            overallReadiness={completionPercentage}
            riskLevel={readyForReview ? 'Low' : 'High'}
            criticalBlockers={missingDocuments.length > 0 ? missingDocuments : ['No critical blockers flagged.']}
            estimatedFundingTime="2 Business Days"
          />

          <ExecutiveSummary
            summary={summary.summary}
            recommendation={recommendationForSummary}
            status={summary.status}
            timestamp={summary.timestamp}
            score={summary.score}
          />

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Uploaded Documents" icon={FileCheck}>
              <div className="space-y-3">
                {uploadedDocumentCards.map((document) => (
                  <div
                    key={document.filename}
                    className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-slate-100">{document.filename}</span>
                      <span className="text-xs text-slate-400">{document.documentType}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500">Confidence: {document.confidence}%</p>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Missing Documents" icon={FileCheck}>
              <div className="space-y-3">
                {missingDocuments.length === 0 ? (
                  <p className="text-sm text-slate-400">No mandatory documents are missing.</p>
                ) : (
                  missingDocuments.map((documentType) => (
                    <div
                      key={documentType}
                      className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-sm text-rose-100"
                    >
                      {documentType}
                    </div>
                  ))
                )}
              </div>
            </SectionCard>

            <SectionCard title="Ready for Review" icon={FileCheck}>
              <div className="space-y-2">
                <p className="text-2xl font-semibold text-slate-100">{readyForReview ? 'Ready' : 'Not Ready'}</p>
                <p className="text-sm text-slate-400">
                  The current document set is {readyForReview ? 'sufficient' : 'incomplete'} for review.
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Document Completion" icon={FileCheck}>
              <div className="space-y-2">
                <p className="text-3xl font-semibold text-emerald-300">{completionPercentage}%</p>
                <p className="text-sm text-slate-400">Completion is calculated from mandatory canon policy documents.</p>
              </div>
            </SectionCard>
          </div>
        </>
      ) : (
        <div className="space-y-6">
          <SectionCard title="Onboarding" icon={FileCheck}>
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-slate-300">
                Upload deal documents to execute the first ATLAS intelligence pipeline and surface the live decision.
              </p>
              <p className="text-sm text-slate-400">
                You will see document completion, executive recommendation, uploaded documents, missing documents, and review readiness here.
              </p>
            </div>
          </SectionCard>
        </div>
      )}

      {orchestratedDecision && (
        <div className="space-y-6">
          <EvidencePanel evidence={evidence} />
          <FindingsPanel findings={findings} />
        </div>
      )}
    </IntelligenceLayout>
  );
}
