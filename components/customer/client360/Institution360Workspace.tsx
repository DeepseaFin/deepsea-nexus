import {
  Activity,
  ArrowUpRight,
  BadgeCheck,
  BookOpenText,
  Building2,
  FolderOpen,
  Network,
} from "lucide-react";
import Link from "next/link";
import BusinessPassportSummary from "@/components/atlas/business-passport/BusinessPassportSummary";
import ActivityTimeline from "@/components/atlas/design-system/ActivityTimeline";
import QuickActionBar, { type QuickAction } from "@/components/atlas/design-system/QuickActionBar";
import DealCommandCenter, { type DealCommandCenterProps } from "@/components/atlas/dashboard/DealCommandCenter";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import DocumentsPanel from "@/components/customer/documents/DocumentsPanel";
import RelationshipKnowledgeExplorer from "@/components/customer/knowledge/RelationshipKnowledgeExplorer";
import RelationshipHeader from "@/components/customer/relationship/RelationshipHeader";
import RelationshipHealthCard from "@/components/customer/relationship/RelationshipHealthCard";
import RelationshipSummary from "@/components/customer/relationship/RelationshipSummary";
import StatusBadge from "@/components/customer/shared/StatusBadge";
import { defaultDocumentsPanelModel } from "@/lib/customer/documents/documents-panel.config";
import { createRelationshipKnowledgeExplorer } from "@/lib/customer/RelationshipKnowledgeExplorer";
import type { RelationshipWorkspaceIntelligenceViewModel } from "@/lib/customer/RelationshipWorkspaceIntelligenceViewModel";
import { defaultRelationshipPanelModel, relationshipPanelConfig } from "@/lib/customer/relationship/relationship-panel.config";
import { defaultInstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.config";
import { JourneyStatus, type JourneyRecommendation } from "@/lib/journey";
import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";
import {
  dedupeLatestOpportunityContexts,
  formatOpportunityLifecycle,
  getOpportunityValue,
} from "@/lib/workflows/OpportunityWorkspaceHelpers";
import { getJourneyBusinessPassportProjection } from "@/src/capabilities/journey/adapters/getJourneyBusinessPassportProjection";
import { getJourneyEvidenceProjectionResults } from "@/src/capabilities/journey/adapters/getJourneyEvidenceProjection";
import { getJourneyKnowledgeInsightsProjection } from "@/src/capabilities/journey/adapters/getJourneyKnowledgeInsightsProjection";
import JourneyAiPanel from "@/src/capabilities/journey/components/JourneyAiPanel";

export interface Institution360WorkspaceProps {
  readonly opportunityId?: string;
  readonly institutionName?: string;
  readonly industry?: string;
  readonly country?: string;
  readonly relationshipManager?: string;
  readonly currentStatus?: string;
  readonly overallHealth?: string;
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

function buildKnowledgeExplorer() {
  const results = getJourneyEvidenceProjectionResults();
  const passport = getJourneyBusinessPassportProjection();
  const explorer = createRelationshipKnowledgeExplorer();
  const generatedAt = results[results.length - 1]?.passport.metadata.audit.updatedAt ?? new Date().toISOString();

  const intelligence: RelationshipWorkspaceIntelligenceViewModel = {
    generatedAt,
    executiveSummary: {
      headline: "Evidence-backed institutional knowledge is ready for executive review.",
      confidenceSnapshot: "High confidence across identity and document-backed facts.",
      evidenceSnapshot: `${results.length} evidence projections synchronized from ORACLE-aligned onboarding documents.`,
      riskSnapshot: "Residual gaps remain in compliance refresh and governance artifacts.",
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

  return explorer.buildViewModel({
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
}

function buildActivityEvents() {
  return defaultInstitutionalTimelineModel.events.slice(0, 6).map((event) => ({
    time: new Date(event.occurredAt).toLocaleString([], {
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }),
    title: event.title,
    detail: `${event.description} ${event.actor ? `Owner: ${event.actor}.` : ""}`.trim(),
  }));
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

function buildDealCommandCenterProps(context: BusinessContext): DealCommandCenterProps {
  const opportunityValue = getOpportunityValue(context.opportunityId);

  return {
    dealTitle: `${context.opportunityId} • ${formatOpportunityLifecycle(context.opportunityLifecycle)}`,
    dealConfidenceIndex: {
      score: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? 78 : 86,
      band: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Moderate" : "High",
      summary: `Institutional opportunity owned by ${context.currentOwner} in the ${context.currentWorkspace} workspace with current face value ${formatMoney(opportunityValue)}.`,
    },
    executiveVerdict: {
      label: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Executive Review Required" : "Operationally Progressing",
      summary: `Current lifecycle is ${formatOpportunityLifecycle(context.opportunityLifecycle)} and the opportunity remains visible in the institutional operating chain.`,
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
      pricing: { score: 81, status: "Healthy", tone: "good", note: "Pricing posture remains inside current tolerance." },
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
      description: `Open the ${context.currentWorkspace} workspace and progress the opportunity from ${formatOpportunityLifecycle(context.opportunityLifecycle)}.`,
      owner: context.currentOwner,
      dueLabel: context.opportunityLifecycle === OpportunityLifecycle.UNDER_REVIEW ? "Today" : "This week",
    },
  };
}

export default function Institution360Workspace({
  opportunityId,
  institutionName,
  industry,
  country,
  relationshipManager,
  currentStatus,
  overallHealth,
  quickActions,
}: Institution360WorkspaceProps) {
  const passport = getJourneyBusinessPassportProjection();
  const relationshipModel = defaultRelationshipPanelModel;
  const contexts = dedupeLatestOpportunityContexts(getOperationsCenterContexts());
  const selectedOpportunity = opportunityId
    ? contexts.find((context) => context.opportunityId === opportunityId)
    : undefined;
  const primaryOpportunity = selectedOpportunity ?? contexts[0];
  const activityEvents = buildActivityEvents();
  const knowledgeExplorer = buildKnowledgeExplorer();
  const aiRecommendations = buildAiRecommendations();
  const knowledgeInsights = getJourneyKnowledgeInsightsProjection();

  const resolvedInstitutionName = institutionName ?? passport.profiles.identityProfile.legalName ?? relationshipModel.summary.relationship.relationshipName;
  const resolvedIndustry = industry ?? passport.profiles.identityProfile.industry ?? "Institutional Trade";
  const resolvedCountry = country ?? passport.profiles.identityProfile.country ?? passport.profiles.identityProfile.jurisdiction ?? "UAE";
  const resolvedRelationshipManager = relationshipManager ?? relationshipModel.summary.relationship.ownerDisplayName;
  const resolvedStatus = currentStatus ?? passport.status.replace(/_/g, " ");
  const resolvedOverallHealth = overallHealth ?? `${relationshipModel.health.status} (${relationshipModel.health.score})`;
  const missingInformationCount = knowledgeInsights.missingInformation.length;
  const complianceRiskCount = knowledgeInsights.riskIndicators.length;
  const missingDocumentCount = defaultDocumentsPanelModel.missingDocuments.length;
  const resolvedQuickActions = quickActions ?? [
    {
      label: "Open Opportunity 360",
      href: primaryOpportunity
        ? `/atlas/opportunity?opportunityId=${primaryOpportunity.opportunityId}`
        : "/atlas/opportunity",
    },
    {
      label: "Open Passport",
      href: primaryOpportunity
        ? `/atlas/business-passport?opportunityId=${primaryOpportunity.opportunityId}`
        : "/atlas/business-passport",
    },
    { label: "Relationship Journey", href: "/atlas/journey" },
    { label: "Upload Documents", href: "/atlas/oracle" },
    { label: "New Deal", href: "/atlas/deals/new" },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.48),transparent_42%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1880px] space-y-5 pb-10">
        <SectionCard title="Institution 360" icon={Building2} badge={{ label: "Institution 360", variant: "info" }}>
          <p className="mb-4 text-sm text-slate-400">
            You are in Institution 360. Relationship health and active opportunities are shown below, and the next step is to open Opportunity 360 or Business Passport for action.
          </p>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Institution Name</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{resolvedInstitutionName}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Industry</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{resolvedIndustry}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Country</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{resolvedCountry}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Relationship Manager</p>
              <p className="mt-2 text-sm font-semibold text-slate-100">{resolvedRelationshipManager}</p>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Current Status</p>
              <div className="mt-2">
                <StatusBadge label={resolvedStatus} tone="info" />
              </div>
            </div>
            <div className="h-full rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Overall Health</p>
              <p className="mt-2 text-sm font-semibold text-emerald-300">{resolvedOverallHealth}</p>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Institution Readiness" icon={BadgeCheck} badge={{ label: "Business Completeness", variant: "warning" }}>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Identity</p>
              <p className="mt-2 text-sm font-semibold text-emerald-200">Verified</p>
              <p className="mt-1 text-xs text-slate-400">{passport.profiles.identityProfile.registrationNumber ?? "Institution profile available"}</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Ownership</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">Assigned</p>
              <p className="mt-1 text-xs text-slate-400">Relationship owner: {resolvedRelationshipManager}</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">KYC</p>
              <p className={`mt-2 text-sm font-semibold ${missingInformationCount > 0 ? "text-amber-200" : "text-emerald-200"}`}>
                {missingInformationCount > 0 ? "Attention" : "Current"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{missingInformationCount} outstanding information item(s)</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Compliance</p>
              <p className={`mt-2 text-sm font-semibold ${complianceRiskCount > 0 ? "text-amber-200" : "text-emerald-200"}`}>
                {complianceRiskCount > 0 ? "Monitored" : "Current"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{complianceRiskCount} active compliance indicator(s)</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Banking</p>
              <p className="mt-2 text-sm font-semibold text-cyan-200">Connected</p>
              <p className="mt-1 text-xs text-slate-400">Banking evidence is linked through ORACLE documents.</p>
            </article>
            <article className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-slate-500">Documents</p>
              <p className={`mt-2 text-sm font-semibold ${missingDocumentCount > 0 ? "text-amber-200" : "text-emerald-200"}`}>
                {missingDocumentCount > 0 ? "Action Required" : "Current"}
              </p>
              <p className="mt-1 text-xs text-slate-400">{missingDocumentCount} required document(s) missing</p>
            </article>
          </div>
        </SectionCard>

        <BusinessPassportSummary passport={passport} />

        <SectionCard title="Active Opportunities" icon={ArrowUpRight} badge={{ label: `${contexts.length} live`, variant: "warning" }}>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            {primaryOpportunity ? <DealCommandCenter {...buildDealCommandCenterProps(primaryOpportunity)} /> : null}

            <div className="space-y-3">
              {contexts.length === 0 ? (
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-sm text-slate-400">
                  No active opportunities are available for this institution yet.
                </div>
              ) : (
                contexts.slice(0, 4).map((context) => (
                  <Link
                    key={context.opportunityId}
                    href={`/atlas/opportunity?opportunityId=${context.opportunityId}`}
                    className="block rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition hover:border-cyan-700/40"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-100">{context.opportunityId}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-slate-500">{formatOpportunityLifecycle(context.opportunityLifecycle)}</p>
                      </div>
                      <p className="text-sm font-semibold text-cyan-200">{formatMoney(getOpportunityValue(context.opportunityId))}</p>
                    </div>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Workspace</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">{context.currentWorkspace}</p>
                      </div>
                      <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                        <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Owner</p>
                        <p className="mt-1 text-sm font-semibold text-slate-100">{context.currentOwner}</p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Relationship Journey" icon={Network} badge={{ label: relationshipModel.health.status, variant: "success" }}>
          <div className="space-y-4">
            <RelationshipHeader config={relationshipPanelConfig} summary={relationshipModel.summary} />
            <RelationshipHealthCard config={relationshipPanelConfig} health={relationshipModel.health} />
            <RelationshipSummary config={relationshipPanelConfig} summary={relationshipModel.summary} />
          </div>
        </SectionCard>

        <SectionCard title="Documents" icon={FolderOpen} badge={{ label: defaultDocumentsPanelModel.missingDocuments.length ? "Action required" : "Current", variant: "warning" }}>
          <DocumentsPanel model={defaultDocumentsPanelModel} />
        </SectionCard>

        <SectionCard title="Knowledge and AI" icon={BookOpenText} badge={{ label: `${knowledgeExplorer.totalKnowledgeItems} facts`, variant: "info" }}>
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_320px]">
            <RelationshipKnowledgeExplorer explorer={knowledgeExplorer} />
            <JourneyAiPanel
              recommendations={aiRecommendations}
              missingItems={knowledgeInsights.missingInformation.map((item) => item.detail).slice(0, 4)}
              nextAction={relationshipModel.nextActions[0]?.title ?? "Review the highest-priority relationship action."}
              status={JourneyStatus.InProgress}
            />
          </div>
        </SectionCard>

        <SectionCard title="Recent Activity Timeline" icon={Activity} badge={{ label: `${activityEvents.length} events`, variant: "default" }}>
          <ActivityTimeline title="Institutional Activity Timeline" events={activityEvents} />
        </SectionCard>

        <SectionCard title="Quick Actions" icon={BadgeCheck} badge={{ label: "Operational", variant: "info" }}>
          <QuickActionBar actions={[...resolvedQuickActions]} />
        </SectionCard>
      </div>
    </div>
  );
}