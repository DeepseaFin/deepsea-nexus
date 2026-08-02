import {
  Activity,
  AlertTriangle,
  BadgeCheck,
  BriefcaseBusiness,
  Clock3,
  FileText,
  Workflow,
} from "lucide-react";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import ActivityTimeline from "@/components/atlas/design-system/ActivityTimeline";
import QuickActionBar, { type QuickAction } from "@/components/atlas/design-system/QuickActionBar";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import WorkQueue from "@/src/capabilities/operations/workqueue/WorkQueue";
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
import { defaultWorkflowPanelModel, workflowPanelConfig } from "@/lib/customer/workflow/workflow.config";
import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import type { EvidenceCorrelationReport } from "@/lib/intelligence/EvidenceCorrelationTypes";
import { JourneyStatus, type JourneyRecommendation } from "@/lib/journey";
import { getOperationsCenterContexts, getOperationsNotificationEvents } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle, type OpportunityLifecycle as OpportunityLifecycleType } from "@/lib/workflows/WorkflowTransition";
import { getJourneyBusinessPassportProjection } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import { getJourneyEvidenceProjectionResults } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";
import { getJourneyKnowledgeInsightsProjection } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";

const LIFECYCLE_ORDER: readonly OpportunityLifecycleType[] = [
  OpportunityLifecycle.DRAFT,
  OpportunityLifecycle.SUBMITTED,
  OpportunityLifecycle.UNDER_REVIEW,
  OpportunityLifecycle.APPROVED,
  OpportunityLifecycle.FUNDING_ALLOCATED,
  OpportunityLifecycle.RELEASED_FOR_PURCHASE,
  OpportunityLifecycle.PURCHASED,
  OpportunityLifecycle.SETTLING,
  OpportunityLifecycle.SETTLED,
  OpportunityLifecycle.CLOSED,
];

type ContextRecord = ReturnType<typeof getOperationsCenterContexts>[number];

export interface OperationsControlCenterProps {
  readonly quickActions?: readonly QuickAction[];
}

function compareLifecycle(left: OpportunityLifecycleType, right: OpportunityLifecycleType): number {
  return LIFECYCLE_ORDER.indexOf(left) - LIFECYCLE_ORDER.indexOf(right);
}

function dedupeLatestContexts(contexts: readonly ContextRecord[]): readonly ContextRecord[] {
  const byOpportunity = new Map<string, ContextRecord>();

  contexts.forEach((context) => {
    const current = byOpportunity.get(context.opportunityId);
    if (!current || compareLifecycle(current.opportunityLifecycle, context.opportunityLifecycle) < 0) {
      byOpportunity.set(context.opportunityId, context);
    }
  });

  return Array.from(byOpportunity.values()).sort((left, right) => compareLifecycle(right.opportunityLifecycle, left.opportunityLifecycle));
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
      headline: "Operations intelligence is aligned for active execution.",
      confidenceSnapshot: "High confidence across identity, documents, and evidence lineage.",
      evidenceSnapshot: `${resultsLength} evidence projections synchronized from ORACLE-aligned operations documents.`,
      riskSnapshot: "Open compliance and document-refresh issues remain under active review.",
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
        { code: "document_lineage", message: "ORACLE processing preserved clear lineage across evidence references." },
      ],
      informationGaps: [
        { code: "tax_certificate_missing", message: "Tax compliance certificate is still missing from the current review cycle." },
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

function buildActivityEvents() {
  return [...getOperationsNotificationEvents()]
    .sort((left, right) => Date.parse(right.occurredAt) - Date.parse(left.occurredAt))
    .slice(0, 8)
    .map((event) => ({
      time: new Date(event.occurredAt).toLocaleString([], {
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      title: event.metadata.eventLabel ?? event.type,
      detail: event.message ?? `Workflow ${event.workflowId}`,
    }));
}

function summarizeDocumentBuckets() {
  const statuses = defaultDocumentsPanelModel.statuses;
  const waitingUpload = defaultDocumentsPanelModel.missingDocuments.length;
  const waitingReview = statuses.filter((item) => item.uiStatus === "Processing").length;
  const rejected = statuses.filter((item) => item.uiStatus === "Rejected").length;
  const verified = statuses.filter((item) => item.uiStatus === "Verified").length;

  return {
    waitingUpload,
    waitingReview,
    rejected,
    verified,
  };
}

function buildOperationsKpis(contexts: readonly ContextRecord[]) {
  const active = contexts.filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED);
  const pendingApprovals = active.filter((context) =>
    context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
    || context.opportunityLifecycle === OpportunityLifecycle.SUBMITTED,
  ).length;
  const dealsProcessing = active.length;
  const activeClients = new Set(active.map((context) => context.institutionId)).size;
  const documentsAwaitingReview = defaultDocumentsPanelModel.statuses.filter((item) => item.uiStatus === "Processing").length;
  const fundingReady = active.filter((context) =>
    context.opportunityLifecycle === OpportunityLifecycle.APPROVED
    || context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED,
  ).length;
  const slaBreaches = active.filter((context) =>
    context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
    || context.opportunityLifecycle === OpportunityLifecycle.SETTLING,
  ).length;

  return {
    activeClients,
    dealsProcessing,
    pendingApprovals,
    documentsAwaitingReview,
    fundingReady,
    slaBreaches,
  };
}

function buildWorkQueueAssignments(contexts: readonly ContextRecord[]) {
  return contexts
    .filter((context) => context.opportunityLifecycle !== OpportunityLifecycle.CLOSED)
    .map((context) => ({
      assignmentId: `${context.workflowId}-assignment`,
      operationId: context.workflowId,
      assigneeId: context.currentOwner.toLowerCase().replace(/\s+/g, "-"),
      assigneeName: context.currentOwner,
      assignmentType: context.currentWorkspace,
      status: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Pending Approval" : "In Progress",
      assignedAt: new Date().toISOString(),
      completedAt: null,
      summaryMetadata: {
        sourceSystem: "operations_control_center",
        sourceReference: context.opportunityId,
        tags: ["operations", "work-queue", context.currentWorkspace],
        attributeCount: 6,
      },
      taskId: `${context.opportunityId}-task`,
    }));
}

function buildWorkflowBottlenecks(contexts: readonly ContextRecord[]) {
  const blockedDeals = contexts.filter((context) =>
    context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW
    || context.opportunityLifecycle === OpportunityLifecycle.SETTLING,
  );

  const stageDistribution = LIFECYCLE_ORDER.map((stage) => ({
    stage,
    count: contexts.filter((context) => context.opportunityLifecycle === stage).length,
  })).filter((item) => item.count > 0);

  const averageProcessingDays = Math.max(2, Math.round((blockedDeals.length * 2 + contexts.length) / Math.max(contexts.length, 1)));

  return {
    blockedDeals,
    averageProcessingDays,
    stageDistribution,
  };
}

export default function OperationsControlCenter({ quickActions }: OperationsControlCenterProps) {
  const contexts = dedupeLatestContexts(getOperationsCenterContexts());
  const operationsKpis = buildOperationsKpis(contexts);
  const workQueueAssignments = buildWorkQueueAssignments(contexts);
  const documentSummary = summarizeDocumentBuckets();
  const workflowBottlenecks = buildWorkflowBottlenecks(contexts);
  const passport = getJourneyBusinessPassportProjection();
  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();
  const recommendations = buildAiRecommendations();
  const { knowledgeExplorer, evidenceExplorer } = buildKnowledgeAndEvidence();
  const activityEvents = buildActivityEvents();

  const resolvedQuickActions = quickActions ?? [
    { label: "Assign Case", href: "/atlas/work-queue" },
    { label: "Approve", href: "/atlas/approval-center" },
    {
      label: "Open Opportunity 360",
      href: contexts[0] ? `/atlas/opportunity?workflowId=${contexts[0].workflowId}` : "/atlas/opportunity",
    },
    { label: "Upload Documents", href: "/atlas/oracle" },
    { label: "Escalate", href: "/atlas/notification-center" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
        <SectionCard title="Operations KPIs" icon={BriefcaseBusiness} badge={{ label: "Live", variant: "info" }}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Active Clients</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{operationsKpis.activeClients}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Deals Processing</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{operationsKpis.dealsProcessing}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Pending Approvals</p>
              <p className="mt-2 text-2xl font-semibold text-amber-200">{operationsKpis.pendingApprovals}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Documents Awaiting Review</p>
              <p className="mt-2 text-2xl font-semibold text-cyan-200">{operationsKpis.documentsAwaitingReview}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Funding Ready</p>
              <p className="mt-2 text-2xl font-semibold text-emerald-200">{operationsKpis.fundingReady}</p>
            </article>
            <article className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">SLA Breaches</p>
              <p className="mt-2 text-2xl font-semibold text-rose-200">{operationsKpis.slaBreaches}</p>
            </article>
          </div>
        </SectionCard>

        <SectionCard title="Operations Work Queue" icon={Workflow} badge={{ label: "Assignment Driven", variant: "warning" }}>
          {workQueueAssignments.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
              Work queue assignments will appear once opportunities enter active operations.
            </div>
          ) : (
            <WorkQueue assignments={workQueueAssignments} />
          )}
        </SectionCard>

        <SectionCard title="Pending Approvals" icon={BadgeCheck} badge={{ label: "Governance", variant: "warning" }}>
          <ApprovalPanel model={defaultApprovalPanelModel} />
        </SectionCard>

        <OracleSectionCard title="Document Operations" icon="fileText">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-amber-700/50 bg-amber-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-amber-300">Waiting Upload</p>
                <p className="mt-1 text-2xl font-semibold text-amber-100">{documentSummary.waitingUpload}</p>
              </article>
              <article className="rounded-lg border border-cyan-700/50 bg-cyan-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-300">Waiting Review</p>
                <p className="mt-1 text-2xl font-semibold text-cyan-100">{documentSummary.waitingReview}</p>
              </article>
              <article className="rounded-lg border border-rose-700/50 bg-rose-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-rose-300">Rejected</p>
                <p className="mt-1 text-2xl font-semibold text-rose-100">{documentSummary.rejected}</p>
              </article>
              <article className="rounded-lg border border-emerald-700/50 bg-emerald-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-300">Verified</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-100">{documentSummary.verified}</p>
              </article>
            </div>

            <DocumentsPanel model={defaultDocumentsPanelModel} />
          </div>
        </OracleSectionCard>

        <SectionCard title="Workflow Bottlenecks" icon={Clock3} badge={{ label: "Operational Throughput", variant: "warning" }}>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              <article className="rounded-lg border border-rose-700/50 bg-rose-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-rose-300">Blocked Deals</p>
                <p className="mt-1 text-2xl font-semibold text-rose-100">{workflowBottlenecks.blockedDeals.length}</p>
              </article>
              <article className="rounded-lg border border-cyan-700/50 bg-cyan-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-cyan-300">Average Processing Time</p>
                <p className="mt-1 text-2xl font-semibold text-cyan-100">{workflowBottlenecks.averageProcessingDays} days</p>
              </article>
              <article className="rounded-lg border border-slate-700 bg-slate-900/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-400">Current Stage Distribution</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{workflowBottlenecks.stageDistribution.length} active stages</p>
              </article>
            </div>

            <div className="grid gap-3 xl:grid-cols-2">
              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Blocked Deals</p>
                <div className="mt-3 space-y-2">
                  {workflowBottlenecks.blockedDeals.length === 0 ? (
                    <p className="text-sm text-slate-400">No blocked deals in the current operations snapshot.</p>
                  ) : (
                    workflowBottlenecks.blockedDeals.map((context) => (
                      <article key={`${context.workflowId}-${context.opportunityId}`} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                        <p className="text-sm font-semibold text-slate-100">{context.opportunityId}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-rose-300">{context.opportunityLifecycle.replaceAll("_", " ")}</p>
                        <p className="mt-1 text-xs text-slate-400">Owner: {context.currentOwner}</p>
                      </article>
                    ))
                  )}
                </div>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Stage Distribution</p>
                <div className="mt-3 space-y-2">
                  {workflowBottlenecks.stageDistribution.map((item) => (
                    <article key={item.stage} className="rounded-lg border border-slate-800 bg-slate-900/60 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs uppercase tracking-[0.12em] text-slate-400">{item.stage.replaceAll("_", " ")}</p>
                        <p className="text-sm font-semibold text-slate-100">{item.count}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>

            <WorkflowStatus config={workflowPanelConfig} model={defaultWorkflowPanelModel.workflowStatus} />
          </div>
        </SectionCard>

        <SectionCard title="Risk Alerts" icon={AlertTriangle} badge={{ label: "Highest Priority", variant: "error" }}>
          <div className="space-y-4">
            <BusinessPassportSummary passport={passport} />

            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {knowledgeInsights.riskIndicators.slice(0, 4).length === 0 ? (
                <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 md:col-span-2 xl:col-span-4">
                  <p className="text-sm text-slate-400">No priority alerts are currently open across active operations.</p>
                </article>
              ) : (
                knowledgeInsights.riskIndicators.slice(0, 4).map((risk) => (
                  <article key={`${risk.label}-${risk.detail}`} className="rounded-lg border border-rose-700/50 bg-rose-950/20 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-rose-300">Priority Alert</p>
                    <p className="mt-1 text-sm font-semibold text-rose-100">{risk.label}</p>
                    <p className="mt-1 text-xs text-rose-200/85">{risk.detail}</p>
                  </article>
                ))
              )}
            </div>

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
          </div>
        </SectionCard>

        <SectionCard title="Recent Operations Activity" icon={Activity} badge={{ label: `${activityEvents.length} events`, variant: "default" }}>
          <ActivityTimeline title="Operations Activity Timeline" events={activityEvents} />
        </SectionCard>

        <SectionCard title="Quick Actions" icon={FileText} badge={{ label: "Operational", variant: "info" }}>
          <QuickActionBar actions={[...resolvedQuickActions]} />
        </SectionCard>
      </div>
    </div>
  );
}
