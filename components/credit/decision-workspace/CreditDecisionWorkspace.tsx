
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import ActivityTimeline from "@/components/atlas/design-system/ActivityTimeline";
import QuickActionBar, { type QuickAction } from "@/components/atlas/design-system/QuickActionBar";
import DealCommandCenter, { type DealCommandCenterProps } from "@/components/atlas/dashboard/DealCommandCenter";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import ApprovalPanel from "@/components/customer/approval/ApprovalPanel";
import DocumentsPanel from "@/components/customer/documents/DocumentsPanel";
import RelationshipEvidenceExplorer from "@/components/customer/evidence/RelationshipEvidenceExplorer";
import RelationshipKnowledgeExplorer from "@/components/customer/knowledge/RelationshipKnowledgeExplorer";
import WorkflowStatus from "@/components/customer/workflow/WorkflowStatus";
import OracleSectionCard from "@/app/atlas/oracle/OracleSectionCard";
import { defaultApprovalPanelModel } from "@/lib/customer/approval/approval-panel.config";
import { createRelationshipEvidenceExplorer } from "@/lib/customer/RelationshipEvidenceExplorer";
import { createRelationshipKnowledgeExplorer } from "@/lib/customer/RelationshipKnowledgeExplorer";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import { defaultDocumentsPanelModel } from "@/lib/customer/documents/documents-panel.config";
import { defaultRelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.config";
import { defaultInstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.config";
import { defaultWorkflowPanelModel, workflowPanelConfig } from "@/lib/customer/workflow/workflow.config";
import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { EvidenceCorrelationReport } from "@/lib/intelligence/EvidenceCorrelationTypes";
import { JourneyStatus, type JourneyRecommendation } from "@/lib/journey";
import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle, type OpportunityLifecycle as OpportunityLifecycleType } from "@/lib/workflows/WorkflowTransition";
import {
  dedupeLatestOpportunityContexts,
  formatOpportunityLifecycle,
  getOpportunityValue,
} from "@/lib/workflows/OpportunityWorkspaceHelpers";
import { getJourneyBusinessPassportProjection } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import { getJourneyEvidenceProjectionResults } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";
import { getJourneyKnowledgeInsightsProjection } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";

export interface CreditDecisionWorkspaceProps {
  readonly opportunityId?: string;
  readonly quickActions?: readonly QuickAction[];
}

function formatMoney(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 1,
    notation: value >= 1_000_000 ? "compact" : "standard",
  }).format(value);
}

function toConfidenceBand(score: number): ConfidenceBand {
  if (score >= 90) return ConfidenceBand.VeryHigh;
  if (score >= 75) return ConfidenceBand.High;
  if (score >= 50) return ConfidenceBand.Moderate;
  if (score >= 25) return ConfidenceBand.Low;
  return ConfidenceBand.VeryLow;
}

function buildIntelligenceModel(resultsLength: number): RelationshipWorkspaceIntelligenceViewModel {
  const passport = getJourneyBusinessPassportProjection();

  return {
    generatedAt: new Date().toISOString(),
    executiveSummary: {
      headline: "Credit intelligence is aligned for institutional funding decisions.",
      confidenceSnapshot: "High confidence across identity and document-backed credit facts.",
      evidenceSnapshot: `${resultsLength} evidence projections synchronized from ORACLE-aligned underwriting documents.`,
      riskSnapshot: "Residual compliance refresh and document-quality items remain open.",
    },
    relationshipConfidence: {
      overallScore: 84,
      overallBand: passport.profiles.identityProfile.confidence.band,
      corporateIdentityScore: 90,
      financialScore: 76,
      tradeScore: 81,
      complianceScore: 72,
      keyDrivers: [],
    },
    readinessStatus: {
      status: "needs_attention",
      completedCount: 8,
      totalRequirements: 11,
      blockingIssues: ["Tax compliance certificate not yet uploaded", "Compliance certificate requires refresh"],
    },
    keyInsights: {
      strengths: [
        { code: "identity_verified", message: "Identity facts are corroborated by multiple uploaded documents." },
        { code: "document_lineage", message: "ORACLE processing preserved evidence lineage for credit review." },
      ],
      informationGaps: [
        { code: "tax_certificate_missing", message: "Tax compliance certificate is still missing from this decision cycle." },
      ],
      inconsistencies: [
        { code: "certificate_mismatch", message: "Compliance certificate failed verification due to signature mismatch." },
      ],
    },
    outstandingRequirements: [
      { requirement: "Compliance refresh", details: "Upload a new compliance certificate and complete validation." },
      { requirement: "Tax evidence", details: "Provide current tax compliance documentation for underwriting completeness." },
    ],
    missingDocuments: ["Tax Compliance Certificate", "Ultimate Beneficial Ownership Declaration"],
    recommendedNextActions: [
      { id: "next-compliance-refresh", label: "Refresh compliance certificate and re-run evidence validation." },
      { id: "next-tax-evidence", label: "Upload the pending tax compliance certificate." },
    ],
  };
}

function buildKnowledgeAndEvidence() {
  const results = getJourneyEvidenceProjectionResults();
  const passport = getJourneyBusinessPassportProjection();
  const intelligence = buildIntelligenceModel(results.length);

  const knowledgeExplorer = createRelationshipKnowledgeExplorer().buildViewModel({
    intelligence,
    knowledgeFacts: results.flatMap((result) => result.knowledge.facts),
    evidence: results.map((result) => result.evidence),
    documentLabelsById: Object.fromEntries(
      results.map((result) => [result.evidence.metadata.documentId, result.evidence.metadata.documentVersion]),
    ),
    businessPassportReferencesByFactName: Object.fromEntries(
      results.flatMap((result) =>
        result.knowledge.facts.map((fact) => [fact.factName, [passport.profiles.identityProfile.registrationNumber ?? "Business Passport"]] as const),
      ),
    ),
  });

  const factsByName = new Map<string, {
    fact: string;
    supportingDocuments: Set<string>;
    confidenceScore: number;
    numberOfSources: number;
  }>();

  results.forEach((result) => {
    result.knowledge.facts.forEach((fact) => {
      const existing = factsByName.get(fact.factName);
      if (!existing) {
        factsByName.set(fact.factName, {
          fact: fact.factName,
          supportingDocuments: new Set([result.evidence.metadata.documentId]),
          confidenceScore: fact.confidence,
          numberOfSources: 1,
        });
        return;
      }

      existing.supportingDocuments.add(result.evidence.metadata.documentId);
      existing.numberOfSources += 1;
      existing.confidenceScore = Math.max(existing.confidenceScore, fact.confidence);
    });
  });

  const evidenceCorrelation: EvidenceCorrelationReport = {
    generatedAt: new Date().toISOString(),
    passportId: "BPP-2401",
    facts: Array.from(factsByName.values()).map((item) => ({
      fact: item.fact,
      supportingDocuments: Array.from(item.supportingDocuments.values()),
      numberOfSources: item.numberOfSources,
      conflicts: [],
      confidenceLevel: toConfidenceBand(item.confidenceScore),
      confidenceScore: item.confidenceScore,
    })),
    totalFacts: factsByName.size,
    conflictingFacts: 0,
    relationshipContext: {
      relationshipConfidenceScore: intelligence.relationshipConfidence.overallScore,
      relationshipConfidenceBand: intelligence.relationshipConfidence.overallBand,
      missingDocuments: intelligence.missingDocuments,
    },
  };

  const evidenceExplorer = createRelationshipEvidenceExplorer().buildViewModel({
    intelligence,
    evidenceCorrelation,
    relatedKnowledgeFacts: results.flatMap((result) => result.knowledge.facts),
    supportingDocumentLabelsById: Object.fromEntries(
      results.map((result) => [result.evidence.metadata.documentId, result.evidence.metadata.documentVersion]),
    ),
    evidenceLastUpdatedByFact: Object.fromEntries(
      results.flatMap((result) =>
        result.knowledge.facts.map((fact) => [fact.factName, result.evidence.metadata.uploadedAt] as const),
      ),
    ),
  });

  return { knowledgeExplorer, evidenceExplorer };
}

function buildAiRecommendations(): readonly JourneyRecommendation[] {
  const insights = getJourneyKnowledgeInsightsProjection();

  return [
    ...insights.riskIndicators.slice(0, 3).map((item) => ({
      title: item.label,
      description: item.detail,
      priority: "high" as const,
      generatedAt: new Date().toISOString(),
    })),
    ...defaultRelationshipPanelModel.insights.slice(0, 2).map((item) => ({
      title: item.title,
      description: item.summary,
      priority: "medium" as const,
      generatedAt: new Date().toISOString(),
    })),
  ];
}

function buildActivityEvents(opportunityId: string) {
  return defaultInstitutionalTimelineModel.events.slice(0, 8).map((event) => ({
    time: new Date(event.occurredAt).toLocaleString([], {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: `${event.title} (${opportunityId})`,
    detail: `${event.description} ${event.actor ? `Owner: ${event.actor}.` : ""}`.trim(),
  }));
}

function summarizeDocumentBuckets() {
  const statuses = defaultDocumentsPanelModel.statuses;
  const verified = statuses.filter((item) => item.uiStatus === "Verified").length;
  const pending = statuses.filter((item) => item.uiStatus === "Processing").length;
  const rejected = statuses.filter((item) => item.uiStatus === "Rejected").length;
  const missing = defaultDocumentsPanelModel.missingDocuments.length;

  return {
    verified,
    pending,
    missing,
    rejected,
  };
}

function decisionStatusClass(decisionStatus: string): string {
  const normalized = decisionStatus.toLowerCase();

  if (normalized.includes("reject")) {
    return "text-rose-300";
  }

  if (normalized.includes("approve")) {
    return "text-emerald-300";
  }

  return "text-amber-200";
}

function toProductLabel(stage: OpportunityLifecycleType): string {
  if (stage === OpportunityLifecycle.DRAFT || stage === OpportunityLifecycle.SUBMITTED) {
    return "Origination Facility";
  }

  if (stage === OpportunityLifecycle.UNDER_REVIEW || stage === OpportunityLifecycle.APPROVED) {
    return "Structured Credit Facility";
  }

  if (stage === OpportunityLifecycle.FUNDING_ALLOCATED || stage === OpportunityLifecycle.RELEASED_FOR_PURCHASE) {
    return "Funding Allocation Program";
  }

  return "Forfaiting Purchase Program";
}

function buildDealCommandCenterProps(context: BusinessContext): DealCommandCenterProps {
  const requestedAmount = getOpportunityValue(context.opportunityId);

  return {
    dealTitle: `${context.opportunityId} • ${formatOpportunityLifecycle(context.opportunityLifecycle)}`,
    dealConfidenceIndex: {
      score: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? 78 : 86,
      band: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Moderate" : "High",
      summary: `Credit opportunity owned by ${context.currentOwner} in ${context.currentWorkspace} with current request ${formatMoney(requestedAmount)}.`,
    },
    executiveVerdict: {
      label: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Executive Review Required" : "Operationally Progressing",
      summary: `Lifecycle is ${formatOpportunityLifecycle(context.opportunityLifecycle)} and remains in the institutional operating chain.`,
      issuedAt: new Date().toISOString(),
    },
    fundingReadiness: {
      score: context.opportunityLifecycle === OpportunityLifecycle.APPROVED ? 82 : context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? 94 : 61,
      status: context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? "Ready" : "Review",
      eta: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "2 business days" : "In active progression",
    },
    health: {
      documents: { score: 82, status: "Healthy", tone: "good", note: "Document controls are synchronized with ORACLE checks." },
      promoter: { score: 79, status: "Watch", tone: "watch", note: "Relationship coverage remains desk-led." },
      collateral: { score: 76, status: "Healthy", tone: "good", note: "Collateral profile remains in expected range." },
      legal: { score: 73, status: "Watch", tone: "watch", note: "Legal review remains active for final sign-off." },
      fraud: { score: 88, status: "Healthy", tone: "good", note: "No elevated fraud anomalies in current scope." },
      pricing: { score: 81, status: "Healthy", tone: "good", note: "Pricing posture remains inside tolerance." },
    },
    criticalBlockers: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
      ? [
          {
            id: `${context.opportunityId}-blocker-1`,
            title: "Executive approval pending",
            description: "Under-review opportunities need final executive validation before funding can progress.",
          },
        ]
      : [],
    nextRecommendedAction: {
      title: `Advance ${context.opportunityId}`,
      description: `Open ${context.currentWorkspace} workspace and progress from ${formatOpportunityLifecycle(context.opportunityLifecycle)}.`,
      owner: context.currentOwner,
      dueLabel: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Today" : "This week",
    },
  };
}

function buildCreditAssessment(context: ContextRecord) {
  const requestedAmount = getOpportunityValue(context.opportunityId);
  const evidenceCount = getJourneyEvidenceProjectionResults().length;
  const documentSummary = summarizeDocumentBuckets();

  const identity = 90;
  const compliance = 72;
  const financialStrength = requestedAmount >= 5_000_000 ? 79 : 74;
  const tradeBehaviour = 81;
  const documentQuality = Math.max(60, 100 - documentSummary.missing * 8 - documentSummary.rejected * 6);
  const evidenceConfidence = Math.min(95, 70 + evidenceCount * 6);

  return {
    identity,
    compliance,
    financialStrength,
    tradeBehaviour,
    documentQuality,
    evidenceConfidence,
  };
}

export default function CreditDecisionWorkspace({
  opportunityId,
  quickActions,
}: CreditDecisionWorkspaceProps) {
  const contexts = dedupeLatestOpportunityContexts(getOperationsCenterContexts());
  const selectedContext = opportunityId
    ? contexts.find((context) => context.opportunityId === opportunityId) ?? contexts[0]
    : contexts[0];

  if (!selectedContext) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
          <SectionCard title="Credit Decision" iconKey="briefcase-business" badge={{ label: "Decision", variant: "info" }}>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
              No active opportunity context is currently available for credit decisioning.
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  const passport = getJourneyBusinessPassportProjection();
  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();
  const recommendations = buildAiRecommendations();
  const { knowledgeExplorer, evidenceExplorer } = buildKnowledgeAndEvidence();
  const activityEvents = buildActivityEvents(selectedContext.opportunityId);
  const documentSummary = summarizeDocumentBuckets();
  const creditAssessment = buildCreditAssessment(selectedContext);

  const client = passport.profiles.identityProfile.legalName ?? defaultRelationshipPanelModel.summary.relationship.relationshipName;
  const facility = selectedContext.opportunityId;
  const product = toProductLabel(selectedContext.opportunityLifecycle);
  const requestedAmount = getOpportunityValue(selectedContext.opportunityId);
  const exposure = Math.round(requestedAmount * 0.83);
  const decisionStatus = defaultApprovalPanelModel.summary.approval.currentDecision.replaceAll("_", " ");

  const resolvedQuickActions = quickActions ?? [
    { label: "Approve", href: "/atlas/approval-center" },
    { label: "Reject", href: "/atlas/approval-center?decision=reject" },
    { label: "Request Information", href: "/atlas/clients" },
    { label: "Escalate", href: "/atlas/notification-center" },
    { label: "Back to Opportunity", href: `/atlas/opportunity?opportunityId=${selectedContext.opportunityId}` },
    { label: "Back to Institution", href: `/atlas/institution-home?opportunityId=${selectedContext.opportunityId}` },
    { label: "Back to Executive", href: "/atlas/dashboard" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
        <SectionCard title="Credit Summary" iconKey="briefcase-business" badge={{ label: "Decision", variant: "info" }}>
          <p className="mb-4 text-sm text-slate-400">
            You are in Credit Decision. Credit quality, evidence readiness, and approval status are shown below, and the next step is to issue an approval decision or return to Opportunity 360 for context.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Institution</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{client}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Facility</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{facility}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Exposure</p>
              <p className="mt-2 text-sm font-semibold text-amber-200">{formatMoney(exposure)}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Product</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{product}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Requested Amount</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">{formatMoney(requestedAmount)}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current Stage</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{formatOpportunityLifecycle(selectedContext.opportunityLifecycle)}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Decision Status</p>
              <p className={`mt-2 text-sm font-semibold ${decisionStatusClass(decisionStatus)}`}>{decisionStatus}</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard title="Executive Recommendation" iconKey="arrow-up-right" badge={{ label: "Command", variant: "warning" }}>
          <DealCommandCenter {...buildDealCommandCenterProps(selectedContext)} />
        </SectionCard>

        <BusinessPassportSummary passport={passport} />

        <SectionCard title="Credit Assessment" iconKey="shield-alert" badge={{ label: "Underwriting", variant: "info" }}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Identity</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{creditAssessment.identity}%</p>
            </article>
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Compliance</p>
              <p className="mt-1 text-2xl font-semibold text-amber-200">{creditAssessment.compliance}%</p>
            </article>
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Financial Strength</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-200">{creditAssessment.financialStrength}%</p>
            </article>
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Trade Behaviour</p>
              <p className="mt-1 text-2xl font-semibold text-slate-100">{creditAssessment.tradeBehaviour}%</p>
            </article>
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Document Quality</p>
              <p className="mt-1 text-2xl font-semibold text-emerald-200">{creditAssessment.documentQuality}%</p>
            </article>
            <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
              <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Evidence Confidence</p>
              <p className="mt-1 text-2xl font-semibold text-cyan-200">{creditAssessment.evidenceConfidence}%</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard title="Knowledge and Evidence" iconKey="badge-check" badge={{ label: "Intelligence", variant: "info" }}>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.25fr)_320px]">
            <div className="space-y-4">
              <RelationshipKnowledgeExplorer explorer={knowledgeExplorer} />
              <RelationshipEvidenceExplorer explorer={evidenceExplorer} />
            </div>

            <JourneyAiPanel
              recommendations={recommendations}
              missingItems={knowledgeInsights.missingInformation.map((item) => item.detail).slice(0, 4)}
              nextAction={defaultWorkflowPanelModel.nextBestAction.title}
              status={JourneyStatus.InProgress}
            />
          </div>
        </SectionCard>

        <OracleSectionCard title="Documents" icon="fileText">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-emerald-700/50 bg-emerald-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-300">Verified</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-100">{documentSummary.verified}</p>
              </article>
              <article className="rounded-lg border border-cyan-700/50 bg-cyan-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-300">Pending</p>
                <p className="mt-1 text-2xl font-semibold text-cyan-100">{documentSummary.pending}</p>
              </article>
              <article className="rounded-lg border border-amber-700/50 bg-amber-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-amber-300">Missing</p>
                <p className="mt-1 text-2xl font-semibold text-amber-100">{documentSummary.missing}</p>
              </article>
              <article className="rounded-lg border border-rose-700/50 bg-rose-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-rose-300">Rejected</p>
                <p className="mt-1 text-2xl font-semibold text-rose-100">{documentSummary.rejected}</p>
              </article>
            </div>

            <DocumentsPanel model={defaultDocumentsPanelModel} />
          </div>
        </OracleSectionCard>

        <SectionCard title="Approval Workflow" iconKey="workflow" badge={{ label: "Governance", variant: "warning" }}>
          <div className="space-y-4">
            <WorkflowStatus config={workflowPanelConfig} model={defaultWorkflowPanelModel.workflowStatus} />
            <ApprovalPanel model={defaultApprovalPanelModel} />
          </div>
        </SectionCard>

        <SectionCard title="Decision Panel" iconKey="file-text" badge={{ label: "Action", variant: "info" }}>
          <QuickActionBar actions={[...resolvedQuickActions]} />
        </SectionCard>

        <SectionCard title="Activity Timeline" iconKey="activity" badge={{ label: `${activityEvents.length} events`, variant: "default" }}>
          <ActivityTimeline title="Credit Decision Timeline" events={activityEvents} />
        </SectionCard>
      </div>
    </div>
  );
}
