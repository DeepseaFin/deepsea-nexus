"use client";

import { useMemo, useState } from "react";
import SectionCard from "@/components/ui/SectionCard";
import RelationshipWorkspaceHeader from "@/components/customer/RelationshipWorkspaceHeader";
import RelationshipWorkspaceLayout from "@/components/customer/RelationshipWorkspaceLayout";
import RelationshipWorkspaceNavigation, {
  type RelationshipWorkspaceNavigationItem,
  type RelationshipWorkspaceSectionId,
} from "@/components/customer/RelationshipWorkspaceNavigation";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface RelationshipWorkspaceProps {
  readonly viewModel: RelationshipWorkspaceViewModel;
  readonly initialSection?: RelationshipWorkspaceSectionId;
  readonly renderSection?: (
    section: RelationshipWorkspaceSectionId,
    viewModel: RelationshipWorkspaceViewModel,
  ) => React.ReactNode;
}

const DEFAULT_NAVIGATION_ITEMS: readonly RelationshipWorkspaceNavigationItem[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "timeline", label: "Timeline" },
  { id: "documents", label: "Documents" },
  { id: "evidence", label: "Evidence" },
  { id: "knowledge", label: "Knowledge" },
  { id: "actions", label: "Actions" },
] as const;

function defaultSectionSummary(
  section: RelationshipWorkspaceSectionId,
  viewModel: RelationshipWorkspaceViewModel,
): React.ReactNode {
  if (section === "dashboard") {
    return (
      <SectionCard
        title="Executive Dashboard"
        subtitle={viewModel.executiveDashboard.executiveSummary.headline}
      >
        <p className="text-sm text-slate-300">
          Confidence {viewModel.executiveDashboard.relationshipConfidence.overallScore} and readiness{" "}
          {viewModel.executiveDashboard.readinessStatus.status}.
        </p>
      </SectionCard>
    );
  }

  if (section === "timeline") {
    return (
      <SectionCard
        title="Relationship Timeline"
        subtitle={`${viewModel.timeline.events.length} events available`}
      >
        <p className="text-sm text-slate-300">Timeline data is ready for incremental timeline rendering.</p>
      </SectionCard>
    );
  }

  if (section === "documents") {
    return (
      <SectionCard
        title="Document Explorer"
        subtitle={`${viewModel.documentExplorer.totalDocuments} documents grouped`}
      >
        <p className="text-sm text-slate-300">Document explorer categories are ready for detailed section rendering.</p>
      </SectionCard>
    );
  }

  if (section === "evidence") {
    return (
      <SectionCard
        title="Evidence Explorer"
        subtitle={`${viewModel.evidenceExplorer.totalEvidenceItems} evidence items grouped`}
      >
        <p className="text-sm text-slate-300">Evidence items are linked to supporting documents and related knowledge.</p>
      </SectionCard>
    );
  }

  if (section === "knowledge") {
    return (
      <SectionCard
        title="Knowledge Explorer"
        subtitle={`${viewModel.knowledgeExplorer.totalKnowledgeItems} conclusions grouped`}
      >
        <p className="text-sm text-slate-300">Knowledge conclusions are available for detailed progressive rendering.</p>
      </SectionCard>
    );
  }

  return (
    <SectionCard
      title="Action Center"
      subtitle={`${viewModel.actionCenter.totalActions} actions available`}
    >
      <p className="text-sm text-slate-300">Actions are grouped by category and priority for execution.</p>
    </SectionCard>
  );
}

export default function RelationshipWorkspace({
  viewModel,
  initialSection = "dashboard",
  renderSection,
}: RelationshipWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<RelationshipWorkspaceSectionId>(initialSection);

  const content = useMemo(() => {
    if (renderSection) {
      return renderSection(activeSection, viewModel);
    }

    return defaultSectionSummary(activeSection, viewModel);
  }, [activeSection, renderSection, viewModel]);

  return (
    <RelationshipWorkspaceLayout
      header={<RelationshipWorkspaceHeader viewModel={viewModel} />}
      navigation={
        <RelationshipWorkspaceNavigation
          items={DEFAULT_NAVIGATION_ITEMS}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      }
      content={content}
      rail={
        <SectionCard title="Workspace Snapshot" subtitle="Ready for incremental feature panels">
          <dl className="space-y-2 text-sm text-slate-300">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Timeline Events</dt>
              <dd className="font-semibold text-slate-100">{viewModel.timeline.events.length}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Documents</dt>
              <dd className="font-semibold text-slate-100">{viewModel.documentExplorer.totalDocuments}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Evidence Items</dt>
              <dd className="font-semibold text-slate-100">{viewModel.evidenceExplorer.totalEvidenceItems}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Knowledge Items</dt>
              <dd className="font-semibold text-slate-100">{viewModel.knowledgeExplorer.totalKnowledgeItems}</dd>
            </div>
            <div className="flex items-center justify-between gap-3">
              <dt className="text-slate-400">Open Actions</dt>
              <dd className="font-semibold text-slate-100">{viewModel.actionCenter.totalActions}</dd>
            </div>
          </dl>
        </SectionCard>
      }
    />
  );
}
