import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BriefcaseBusiness,
  ShieldAlert,
  Workflow,
} from "lucide-react";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import ActivityTimeline from "@/components/atlas/design-system/ActivityTimeline";
import QuickActionBar, { type QuickAction } from "@/components/atlas/design-system/QuickActionBar";
import DealCommandCenter, { type DealCommandCenterProps } from "@/components/atlas/dashboard/DealCommandCenter";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import DocumentsPanel from "@/components/customer/documents/DocumentsPanel";
import RelationshipEvidenceExplorer from "@/components/customer/evidence/RelationshipEvidenceExplorer";
import RelationshipKnowledgeExplorer from "@/components/customer/knowledge/RelationshipKnowledgeExplorer";
import ApprovalStageTimeline from "@/components/customer/approval/ApprovalStageTimeline";
import StatusBadge from "@/components/customer/shared/StatusBadge";
import WorkflowStatus from "@/components/customer/workflow/WorkflowStatus";
import { defaultApprovalPanelModel, approvalPanelConfig } from "@/lib/customer/approval/approval-panel.config";
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
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle, type OpportunityLifecycle as OpportunityLifecycleType } from "@/lib/workflows/WorkflowTransition";
import { getJourneyBusinessPassportProjection } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import { getJourneyEvidenceProjectionResults } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";
import { getJourneyKnowledgeInsightsProjection } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";
import OracleSectionCard from "@/app/atlas/oracle/OracleSectionCard";

const OPPORTUNITY_VALUES: Readonly<Record<string, number>> = {
  "OPP-7712": 6200000,
  "OPP-8801": 3800000,
  "OPP-8802": 5100000,
  "OPP-8803": 4400000,
  "OPP-8804": 3600000,
  "OPP-8805": 2900000,
  "OPP-8806": 2500000,
  "OPP-8807": 2100000,
};

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

export interface Opportunity360WorkspaceProps {
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

function formatLifecycle(value: OpportunityLifecycleType): string {
  return value.replaceAll("_", " ");
}

function compareLifecycle(left: OpportunityLifecycleType, right: OpportunityLifecycleType): number {
  return LIFECYCLE_ORDER.indexOf(left) - LIFECYCLE_ORDER.indexOf(right);
}

function getOpportunityValue(opportunityId: string): number {
  return OPPORTUNITY_VALUES[opportunityId] ?? 3000000;
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
      headline: "Opportunity intelligence is aligned for executive decisioning.",
      confidenceSnapshot: "High confidence across identity and evidence-backed facts.",
      evidenceSnapshot: `${resultsLength} evidence projections synchronized from ORACLE-aligned deal documents.`,
      riskSnapshot: "Open compliance refresh items remain active in the current cycle.",
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
        { code: "document_lineage", message: "Recent ORACLE processing preserved clear lineage across evidence references." },
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
      const key = fact.factName;
      const existing = factsByName.get(key);
      if (!existing) {
        factsByName.set(key, {
          fact: key,
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

  return {
    knowledgeExplorer,
    evidenceExplorer,
  };
}

function buildAiRecommendations(): readonly JourneyRecommendation[] {
  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();

  return [
    ...knowledgeInsights.riskIndicators.slice(0, 2).map((item) => ({
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
  return defaultInstitutionalTimelineModel.events.slice(0, 7).map((event) => ({
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

function buildDealCommandCenterProps(context: ContextRecord): DealCommandCenterProps {
  const opportunityValue = getOpportunityValue(context.opportunityId);

  return {
    dealTitle: `${context.opportunityId} • ${formatLifecycle(context.opportunityLifecycle)}`,
    dealConfidenceIndex: {
      score: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? 78 : 86,
      band: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Moderate" : "High",
      summary: `Opportunity owned by ${context.currentOwner} in ${context.currentWorkspace} with face value ${formatMoney(opportunityValue)}.`,
    },
    executiveVerdict: {
      label: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Executive Review Required" : "Operationally Progressing",
      summary: `Lifecycle is ${formatLifecycle(context.opportunityLifecycle)} and remains in the active operating chain.`,
      issuedAt: new Date().toISOString(),
    },
    fundingReadiness: {
      score: context.opportunityLifecycle === OpportunityLifecycle.APPROVED ? 82 : context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? 94 : 61,
      status: context.opportunityLifecycle === OpportunityLifecycle.FUNDING_ALLOCATED ? "Ready" : "Review",
      eta: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "2 business days" : "In active progression",
    },
    health: {
      documents: { score: 82, status: "Healthy", tone: "good", note: "ORACLE and document checks are synchronized." },
      promoter: { score: 79, status: "Watch", tone: "watch", note: "Coverage remains relationship-led." },
      collateral: { score: 76, status: "Healthy", tone: "good", note: "Institutional support remains in expected range." },
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
      description: `Open ${context.currentWorkspace} workspace and progress from ${formatLifecycle(context.opportunityLifecycle)}.`,
      owner: context.currentOwner,
      dueLabel: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Today" : "This week",
    },
  };
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

function statusToneByLifecycle(stage: OpportunityLifecycleType): "success" | "warning" | "info" {
  if (stage === OpportunityLifecycle.APPROVED || stage === OpportunityLifecycle.FUNDING_ALLOCATED || stage === OpportunityLifecycle.RELEASED_FOR_PURCHASE) {
    return "success";
  }

  if (stage === OpportunityLifecycle.UNDER_REVIEW || stage === OpportunityLifecycle.SETTLING) {
    return "warning";
  }

  return "info";
}

function summarizeDocumentBuckets() {
  const statuses = defaultDocumentsPanelModel.statuses;
  const received = statuses.filter((item) => item.uiStatus === "Uploaded" || item.uiStatus === "Verified").length;
  const pending = statuses.filter((item) => item.uiStatus === "Processing").length;
  const rejected = statuses.filter((item) => item.uiStatus === "Rejected").length;
  const missing = defaultDocumentsPanelModel.missingDocuments.length;

  return {
    received,
    pending,
    missing,
    rejected,
  };
}

function summarizeWorkflowStages() {
  const stages = defaultApprovalPanelModel.stages;
  const current = stages.find((stage) => stage.state === "In Review" || stage.state === "Pending") ?? stages[0];
  const currentIndex = stages.findIndex((stage) => stage.id === current.id);
  const completed = stages.slice(0, currentIndex).map((stage) => stage.title);
  const next = stages[currentIndex + 1];

  return {
    current,
    completed,
    next,
  };
}

export default function Opportunity360Workspace({
  opportunityId,
  quickActions,
}: Opportunity360WorkspaceProps) {
  const passport = getJourneyBusinessPassportProjection();
  const contexts = dedupeLatestContexts(getOperationsCenterContexts());
  const selectedContext = opportunityId
    ? contexts.find((context) => context.opportunityId === opportunityId) ?? contexts[0]
    : contexts[0];

  if (!selectedContext) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
          <SectionCard title="Opportunity 360" icon={BriefcaseBusiness} badge={{ label: "Deal Cockpit", variant: "info" }}>
            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-5 text-sm text-slate-300">
              No active opportunity context is currently available.
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();
  const recommendations = buildAiRecommendations();
  const { knowledgeExplorer, evidenceExplorer } = buildKnowledgeAndEvidence();
  const activityEvents = buildActivityEvents(selectedContext.opportunityId);
  const documentSummary = summarizeDocumentBuckets();
  const workflowSummary = summarizeWorkflowStages();

  const clientName = passport.profiles.identityProfile.legalName ?? defaultRelationshipPanelModel.summary.relationship.relationshipName;
  const dealValue = getOpportunityValue(selectedContext.opportunityId);
  const product = toProductLabel(selectedContext.opportunityLifecycle);
  const statusLabel = formatLifecycle(selectedContext.opportunityLifecycle);
  const resolvedQuickActions = quickActions ?? [
    { label: "Open Credit Decision", href: `/atlas/credit-decision?opportunityId=${selectedContext.opportunityId}` },
    { label: "Open Institution 360", href: `/atlas/institution-home?opportunityId=${selectedContext.opportunityId}` },
    { label: "Approve", href: `/atlas/credit-decision?opportunityId=${selectedContext.opportunityId}` },
    { label: "Send Back", href: `/atlas/credit-decision?opportunityId=${selectedContext.opportunityId}` },
    { label: "Request Information", href: "/atlas/clients" },
    { label: "Upload Documents", href: "/atlas/oracle" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
        <SectionCard title="Opportunity 360" icon={BriefcaseBusiness} badge={{ label: "Deal Cockpit", variant: "info" }}>
          <p className="mb-4 text-sm text-slate-400">
            You are in Opportunity 360. Workflow progress, risk signals, and documents are live, and the next step is to open Credit Decision for approval action.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-8">
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Opportunity Number</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{selectedContext.opportunityId}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Institution</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{clientName}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Deal Value</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">{formatMoney(dealValue)}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Product</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{product}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current Stage</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{formatLifecycle(selectedContext.opportunityLifecycle)}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current Owner</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{selectedContext.currentOwner}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4 xl:col-span-2">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Overall Status</p>
              <div className="mt-2">
                <StatusBadge label={statusLabel} tone={statusToneByLifecycle(selectedContext.opportunityLifecycle)} />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Executive Decision Panel" icon={ArrowUpRight} badge={{ label: "Command", variant: "warning" }}>
          <DealCommandCenter {...buildDealCommandCenterProps(selectedContext)} />
        </SectionCard>

        <BusinessPassportSummary passport={passport} />

        <SectionCard title="Workflow Progress" icon={Workflow} badge={{ label: "In Motion", variant: "info" }}>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Stage</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{workflowSummary.current.title}</p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Completed Stages</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{workflowSummary.completed.length}</p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Next Stage</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{workflowSummary.next?.title ?? "Finalized"}</p>
              </article>
              <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Current Owner</p>
                <p className="mt-1 text-sm font-semibold text-slate-100">{workflowSummary.current.owner ?? selectedContext.currentOwner}</p>
              </article>
            </div>

            <WorkflowStatus config={workflowPanelConfig} model={defaultWorkflowPanelModel.workflowStatus} />
            <ApprovalStageTimeline config={approvalPanelConfig} stages={defaultApprovalPanelModel.stages} />
          </div>
        </SectionCard>

        <SectionCard title="Risk and Intelligence" icon={ShieldAlert} badge={{ label: "Live Signals", variant: "warning" }}>
          <div className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {knowledgeInsights.riskIndicators.slice(0, 4).length === 0 ? (
                <article className="rounded-lg border border-slate-800 bg-slate-950/70 p-4 md:col-span-2 xl:col-span-4">
                  <p className="text-sm text-slate-400">No risk indicators are currently flagged for this opportunity.</p>
                </article>
              ) : (
                knowledgeInsights.riskIndicators.slice(0, 4).map((risk) => (
                  <article key={`${risk.label}-${risk.detail}`} className="rounded-lg border border-amber-700/50 bg-amber-950/20 p-3">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-amber-300">Risk Indicator</p>
                    <p className="mt-1 text-sm font-semibold text-amber-100">{risk.label}</p>
                    <p className="mt-1 text-xs text-amber-200/85">{risk.detail}</p>
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

        <OracleSectionCard title="Documents" icon="fileText">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <article className="rounded-lg border border-emerald-700/50 bg-emerald-950/20 p-3">
                <p className="text-[11px] uppercase tracking-[0.12em] text-emerald-300">Received</p>
                <p className="mt-1 text-2xl font-semibold text-emerald-100">{documentSummary.received}</p>
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

        <SectionCard title="Timeline" icon={Activity} badge={{ label: `${activityEvents.length} events`, variant: "default" }}>
          <ActivityTimeline title="Opportunity Activity Timeline" events={activityEvents} />
        </SectionCard>

        <SectionCard title="Quick Actions" icon={BadgeCheck} badge={{ label: "Operational", variant: "info" }}>
          <QuickActionBar actions={[...resolvedQuickActions]} />
        </SectionCard>
      </div>
    </div>
  );
}
