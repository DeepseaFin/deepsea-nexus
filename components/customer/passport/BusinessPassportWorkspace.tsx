"use client";

import { useMemo } from "react";
import ActivitySummary, { type ActivitySummaryItem } from "@/components/customer/passport/ActivitySummary";
import AIInsightPlaceholderPanel from "@/components/customer/passport/AIInsightPlaceholderPanel";
import BusinessIdentityCard from "@/components/customer/passport/BusinessIdentityCard";
import BusinessMetrics, { type BusinessMetric } from "@/components/customer/passport/BusinessMetrics";
import BusinessPassportHeader from "@/components/customer/passport/BusinessPassportHeader";
import ContextNavigation from "@/components/customer/passport/ContextNavigation";
import CustomerJourneyNavigator, { type JourneyStepId } from "@/components/customer/passport/CustomerJourneyNavigator";
import DocumentsSummary, { type DocumentSummaryItem } from "@/components/customer/passport/DocumentsSummary";
import EvidenceSummary, { type EvidenceItem } from "@/components/customer/passport/EvidenceSummary";
import KnowledgeSnapshot, { type KnowledgeSignal } from "@/components/customer/passport/KnowledgeSnapshot";
import PassportQuickActions, { type PassportQuickAction } from "@/components/customer/passport/QuickActions";
import PassportTimeline, { type PassportTimelineEntry } from "@/components/customer/passport/PassportTimeline";
import RelationshipHealthCard from "@/components/customer/passport/RelationshipHealthCard";
import WorkflowSummary, { type WorkflowSummaryItem } from "@/components/customer/passport/WorkflowSummary";
import UICard from "@/components/ui/Card";
import { type BusinessPassportSectionId } from "@/lib/customer/passport/business-passport-workspace-orchestrator.types";
import { defaultPassportPanelModel } from "@/lib/customer/business-passport/passport-panel.config";
import { computeBusinessPassportSectionStates } from "@/lib/customer/passport/business-passport-section-completion-engine";
import { useBusinessPassportWorkspaceOrchestrator } from "@/lib/customer/passport/useBusinessPassportWorkspaceOrchestrator";

export interface BusinessPassportWorkspaceProps {
  readonly currentJourneyStep?: JourneyStepId;
  readonly business?: {
    readonly passportId: string;
    readonly legalName: string;
    readonly legalForm: string;
    readonly jurisdiction: string;
    readonly relationshipManager: string;
    readonly lifecycleStage: string;
    readonly registrationNumber: string;
    readonly tradeLicense: string;
    readonly taxRegistration: string;
    readonly incorporationDate: string;
    readonly sector: string;
    readonly riskBand: string;
  };
  readonly relationshipHealth?: {
    readonly score: number;
    readonly posture: string;
    readonly watchItems: string;
    readonly covenantState: string;
  };
  readonly metrics?: readonly BusinessMetric[];
  readonly documents?: readonly DocumentSummaryItem[];
  readonly knowledgeSignals?: readonly KnowledgeSignal[];
  readonly evidenceItems?: readonly EvidenceItem[];
  readonly workflowStages?: readonly WorkflowSummaryItem[];
  readonly activityItems?: readonly ActivitySummaryItem[];
  readonly timelineEntries?: readonly PassportTimelineEntry[];
  readonly quickActions?: readonly PassportQuickAction[];
}

const defaultBusiness = {
  passportId: "BPP-UAE-2026-0148",
  legalName: "Crescent Trade Holdings Limited",
  legalForm: "Private Limited Company",
  jurisdiction: "Dubai, United Arab Emirates",
  relationshipManager: "Nadia Al Fahim",
  lifecycleStage: "Active Monitoring",
  registrationNumber: "DXB-TR-849133",
  tradeLicense: "TL-9982714",
  taxRegistration: "TRN-100443219800003",
  incorporationDate: "14 Feb 2018",
  sector: "Industrial Trade and Distribution",
  riskBand: "Moderate",
} as const;

const defaultRelationshipHealth = {
  score: 88,
  posture: "Stable",
  watchItems: "2 Active",
  covenantState: "Compliant",
} as const;

const defaultMetrics: readonly BusinessMetric[] = [
  { id: "m-1", label: "Total Exposure", value: "AED 186M", note: "Across active facilities", icon: "exposure" },
  { id: "m-2", label: "Open Activities", value: "14", note: "Current service period", icon: "activity" },
  { id: "m-3", label: "Evidence Coverage", value: "96%", note: "Verified source artifacts", icon: "coverage" },
  { id: "m-4", label: "Compliance Alerts", value: "1", note: "Needs analyst confirmation", icon: "alerts" },
  { id: "m-5", label: "Policy Conformance", value: "High", note: "Latest governance check", icon: "compliance" },
  { id: "m-6", label: "Workflow Readiness", value: "84%", note: "Eligible decision path", icon: "workflow" },
];

const defaultKnowledgeSignals: readonly KnowledgeSignal[] = [
  {
    id: "k-1",
    title: "Counterparty documentation consistency",
    detail: "Document lineage and registration extracts align with current legal profile.",
    confidence: 91,
  },
  {
    id: "k-2",
    title: "Trade volume trend",
    detail: "Recent invoice cadence indicates stable throughput with slight quarter-over-quarter increase.",
    confidence: 83,
  },
  {
    id: "k-3",
    title: "Payment behavior signal",
    detail: "Collections behavior remains within historical tolerance bands for this relationship.",
    confidence: 79,
  },
];

const defaultDocuments: readonly DocumentSummaryItem[] = [
  {
    id: "d-1",
    documentGroup: "Corporate Registry, Ownership, and Governance",
    owner: "Passport Office",
    lastUpdated: "2 days ago",
    status: "current",
  },
  {
    id: "d-2",
    documentGroup: "KYC, Compliance, and Banking Pack",
    owner: "Relationship Desk",
    lastUpdated: "Today",
    status: "review",
  },
  {
    id: "d-3",
    documentGroup: "Security and Legal Opinions",
    owner: "Legal Team",
    lastUpdated: "5 days ago",
    status: "expiring",
  },
];

const defaultEvidenceItems: readonly EvidenceItem[] = [
  { id: "e-1", category: "Corporate Registry", status: "verified", updated: "2 days ago" },
  { id: "e-2", category: "KYC and UBO", status: "review", updated: "Today" },
  { id: "e-3", category: "Bank Account Validation", status: "verified", updated: "6 days ago" },
  { id: "e-4", category: "Compliance Certificate", status: "missing", updated: "Pending upload" },
];

const defaultWorkflowStages: readonly WorkflowSummaryItem[] = [
  { id: "w-1", stage: "Onboarding Review", owner: "Operations", eta: "Today", status: "on_track" },
  { id: "w-2", stage: "Credit Validation", owner: "Credit Desk", eta: "Tomorrow", status: "attention" },
  { id: "w-3", stage: "Legal Packaging", owner: "Legal", eta: "2 days", status: "on_track" },
  { id: "w-4", stage: "Committee Decision", owner: "Approvals", eta: "3 days", status: "blocked" },
];

const defaultActivityItems: readonly ActivitySummaryItem[] = [
  {
    id: "a-1",
    title: "Risk posture refreshed",
    detail: "Periodic assessment completed against latest transaction and behavior context.",
    time: "09:10",
  },
  {
    id: "a-2",
    title: "Evidence package updated",
    detail: "Corporate registry and banking proofs were appended to the passport envelope.",
    time: "10:35",
  },
  {
    id: "a-3",
    title: "Relationship review scheduled",
    detail: "Cross-functional checkpoint booked for covenant and compliance alignment.",
    time: "13:20",
  },
];

const defaultTimelineEntries: readonly PassportTimelineEntry[] = [
  {
    id: "t-1",
    title: "Passport creation",
    detail: "Business identity and primary onboarding profile initialized.",
    date: "11 Jan 2026",
    state: "completed",
  },
  {
    id: "t-2",
    title: "Evidence verification cycle",
    detail: "KYC, legal, and financial artifacts routed for controlled review.",
    date: "18 Jan 2026",
    state: "completed",
  },
  {
    id: "t-3",
    title: "Portfolio health recalibration",
    detail: "Relationship health score and watch posture updated from current period inputs.",
    date: "24 Jul 2026",
    state: "active",
  },
  {
    id: "t-4",
    title: "Decision readiness gate",
    detail: "Final readiness package moves into committee queue once all exceptions close.",
    date: "Planned",
    state: "upcoming",
  },
];

const defaultQuickActions: readonly PassportQuickAction[] = [
  { id: "q-1", label: "Open Relationship Workspace", variant: "primary" },
  { id: "q-3", label: "Start Workflow Review", variant: "secondary" },
  { id: "q-2", label: "Request Evidence Refresh", variant: "ghost" },
  { id: "q-4", label: "Prepare AI Readiness Pack", variant: "ghost" },
];

export default function BusinessPassportWorkspace({
  currentJourneyStep = "business-passport",
  business = defaultBusiness,
  relationshipHealth = defaultRelationshipHealth,
  metrics = defaultMetrics,
  documents = defaultDocuments,
  knowledgeSignals = defaultKnowledgeSignals,
  evidenceItems = defaultEvidenceItems,
  workflowStages = defaultWorkflowStages,
  activityItems = defaultActivityItems,
  timelineEntries = defaultTimelineEntries,
  quickActions = defaultQuickActions,
}: BusinessPassportWorkspaceProps) {
  const computedSectionStates = useMemo(
    () =>
      computeBusinessPassportSectionStates({
        passportPanelModel: defaultPassportPanelModel,
        businessIdentity: {
          legalName: business.legalName,
          registrationNumber: business.registrationNumber,
          jurisdiction: business.jurisdiction,
          country: business.jurisdiction,
          incorporationDate: business.incorporationDate,
          entityType: business.legalForm,
          industry: business.sector,
        },
        documentState: documents.map((item) => ({
          status: item.status,
          name: item.documentGroup,
        })),
        evidenceState: evidenceItems.map((item) => ({
          status: item.status,
          name: item.category,
        })),
        relationshipState: {
          score: relationshipHealth.score,
          posture: relationshipHealth.posture,
          watchItems: relationshipHealth.watchItems,
        },
        workflowState: workflowStages.map((item) => ({
          status: item.status,
          name: item.stage,
        })),
        knowledgeState: knowledgeSignals.map((item) => ({
          confidence: item.confidence,
          title: item.title,
        })),
        activityCount: activityItems.length,
      }),
    [
      activityItems.length,
      business.incorporationDate,
      business.jurisdiction,
      business.legalForm,
      business.legalName,
      business.registrationNumber,
      business.sector,
      documents,
      evidenceItems,
      knowledgeSignals,
      relationshipHealth.posture,
      relationshipHealth.score,
      relationshipHealth.watchItems,
      workflowStages,
    ],
  );

  const orchestrator = useBusinessPassportWorkspaceOrchestrator({
    sectionStates: computedSectionStates,
    initialActiveSection: "identity",
    persistenceKey: "atlas.business-passport.workspace.v1",
    actions: quickActions.map((action) => ({
      id: action.id,
      label: action.label,
      variant: action.variant,
    })),
    initialDirtyBySectionId: {
      documents: true,
    },
    isLoading: false,
  });

  const contextSections = useMemo(
    () =>
      orchestrator.sections.map((section) => ({
        id: section.id,
        label: section.label,
        active: section.active,
        completed: section.completionStatus === "completed",
        disabled: section.disabled,
        dirty: section.dirty,
        validation: section.validationStatus,
        recommended: orchestrator.nextRecommendedSection === section.id,
      })),
    [orchestrator.nextRecommendedSection, orchestrator.sections],
  );

  const actionItems = useMemo<readonly PassportQuickAction[]>(
    () =>
      orchestrator.workspaceActions
        .filter((action) => action.id.startsWith("q-"))
        .map((action) => ({
          id: action.id,
          label: action.label,
          variant: action.variant === "danger" ? "ghost" : action.variant,
          disabled: action.disabled,
        })),
    [orchestrator.workspaceActions],
  );

  const actionById = useMemo(() => {
    return new Map(orchestrator.workspaceActions.map((action) => [action.id, action] as const));
  }, [orchestrator.workspaceActions]);

  const canGoPrevious = useMemo(() => {
    const enabledSections = orchestrator.sections.filter((section) => !section.disabled);
    const activeIndex = enabledSections.findIndex((section) => section.id === orchestrator.activeSection);
    return activeIndex > 0;
  }, [orchestrator.activeSection, orchestrator.sections]);

  const canGoNext = useMemo(() => {
    const enabledSections = orchestrator.sections.filter((section) => !section.disabled);
    const activeIndex = enabledSections.findIndex((section) => section.id === orchestrator.activeSection);
    return activeIndex >= 0 && activeIndex < enabledSections.length - 1;
  }, [orchestrator.activeSection, orchestrator.sections]);

  const jumpToSection = (sectionId: string) => {
    const typedSectionId = sectionId as BusinessPassportSectionId;
    const targetSection = orchestrator.sections.find((section) => section.id === typedSectionId);

    if (!targetSection || targetSection.disabled) {
      return;
    }

    orchestrator.jumpToSection(typedSectionId);
    orchestrator.setSelectedTab(typedSectionId);

    const anchorId = targetSection.anchorId;
    if (!anchorId || typeof document === "undefined") {
      return;
    }

    const sectionElement = document.getElementById(anchorId);
    if (sectionElement) {
      sectionElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <section id="passport-header" aria-label="Business passport header">
        <BusinessPassportHeader
          passportId={business.passportId}
          legalName={business.legalName}
          legalForm={business.legalForm}
          jurisdiction={business.jurisdiction}
          relationshipManager={business.relationshipManager}
          lifecycleStage={business.lifecycleStage}
        />
      </section>

      <section id="passport-journey" aria-label="Customer journey navigation">
        <CustomerJourneyNavigator currentStep={currentJourneyStep} />
      </section>

      <section id="passport-context" aria-label="Business passport context links">
        <ContextNavigation
          items={contextSections}
          onSelectSection={jumpToSection}
          onPreviousSection={orchestrator.goToPreviousSection}
          onNextSection={orchestrator.goToNextSection}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
          recommendedSectionId={orchestrator.nextRecommendedSection}
        />
      </section>

      <UICard variant="subtle" className="p-4 sm:p-5">
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Completion</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{orchestrator.completion.overallPercentage}%</p>
            <p className="text-xs text-slate-400">
              {orchestrator.completion.completedSections}/{orchestrator.completion.totalSections} sections complete
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Validation</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{orchestrator.validation.successSections} Success</p>
            <p className="text-xs text-slate-400">
              {orchestrator.validation.warningSections} warning • {orchestrator.validation.errorSections} error
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
            <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Dirty State</p>
            <p className="mt-1 text-lg font-semibold text-slate-100">{orchestrator.dirtyState.isDirty ? "Changes Pending" : "Clean"}</p>
            <p className="text-xs text-slate-400">
              {orchestrator.dirtyState.dirtySections.length} section{orchestrator.dirtyState.dirtySections.length === 1 ? "" : "s"} marked
            </p>
          </div>
        </div>
      </UICard>

      <section id="passport-metrics" aria-label="Business passport metrics">
        <BusinessMetrics metrics={metrics} />
      </section>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="passport-identity" aria-label="Business identity section">
          <BusinessIdentityCard
            registrationNumber={business.registrationNumber}
            tradeLicense={business.tradeLicense}
            taxRegistration={business.taxRegistration}
            incorporationDate={business.incorporationDate}
            sector={business.sector}
            riskBand={business.riskBand}
          />
        </section>
        <section id="passport-health" aria-label="Relationship health section">
          <RelationshipHealthCard
            healthScore={relationshipHealth.score}
            posture={relationshipHealth.posture}
            watchItems={relationshipHealth.watchItems}
            covenantState={relationshipHealth.covenantState}
          />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="passport-documents" aria-label="Documents section">
          <DocumentsSummary items={documents} />
        </section>
        <section id="passport-evidence" aria-label="Evidence section">
          <EvidenceSummary items={evidenceItems} />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="passport-knowledge" aria-label="Knowledge section">
          <KnowledgeSnapshot signals={knowledgeSignals} />
        </section>
        <section id="passport-workflow" aria-label="Workflow section">
          <WorkflowSummary stages={workflowStages} />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="passport-activity" aria-label="Activity section">
          <ActivitySummary items={activityItems} />
        </section>
        <section id="passport-ai" aria-label="AI insight placeholder section">
          <AIInsightPlaceholderPanel />
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <section id="passport-timeline" aria-label="Passport timeline section">
          <PassportTimeline entries={timelineEntries} />
        </section>
        <section id="passport-actions" aria-label="Passport quick actions section">
          <PassportQuickActions
            actions={actionItems}
            onAction={(actionId) => {
              const action = actionById.get(actionId);
              action?.execute?.();
            }}
          />
        </section>
      </div>
    </div>
  );
}
