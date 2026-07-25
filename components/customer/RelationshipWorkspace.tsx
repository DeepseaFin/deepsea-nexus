"use client";

import { useMemo, useState } from "react";
import ExecutiveDashboard from "@/components/customer/dashboard/ExecutiveDashboard";
import RelationshipActionCenter from "@/components/customer/actions/RelationshipActionCenter";
import RelationshipDocumentExplorer from "@/components/customer/documents/RelationshipDocumentExplorer";
import RelationshipEvidenceExplorer from "@/components/customer/evidence/RelationshipEvidenceExplorer";
import RelationshipKnowledgeExplorer from "@/components/customer/knowledge/RelationshipKnowledgeExplorer";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import RelationshipTimeline from "@/components/customer/timeline/RelationshipTimeline";
import SectionCard from "@/components/ui/SectionCard";
import RelationshipWorkspaceHeader from "@/components/customer/RelationshipWorkspaceHeader";
import RelationshipWorkspaceLayout from "@/components/customer/RelationshipWorkspaceLayout";
import RelationshipWorkspaceNavigation, {
  type RelationshipWorkspaceNavigationItem,
  type RelationshipWorkspaceSectionId,
} from "@/components/customer/RelationshipWorkspaceNavigation";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";

export interface RelationshipWorkspaceProps {
  readonly viewModel?: RelationshipWorkspaceViewModel | null;
  readonly initialSection?: RelationshipWorkspaceSectionId;
  readonly isLoading?: boolean;
  readonly error?: string;
  readonly emptyMessage?: string;
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
    return <ExecutiveDashboard dashboard={viewModel.executiveDashboard} workspace={viewModel} />;
  }

  if (section === "timeline") {
    return <RelationshipTimeline timeline={viewModel.timeline} />;
  }

  if (section === "documents") {
    return <RelationshipDocumentExplorer explorer={viewModel.documentExplorer} />;
  }

  if (section === "evidence") {
    return <RelationshipEvidenceExplorer explorer={viewModel.evidenceExplorer} />;
  }

  if (section === "knowledge") {
    return <RelationshipKnowledgeExplorer explorer={viewModel.knowledgeExplorer} />;
  }

  return <RelationshipActionCenter actionCenter={viewModel.actionCenter} />;
}

export default function RelationshipWorkspace({
  viewModel,
  initialSection = "dashboard",
  isLoading = false,
  error,
  emptyMessage = "Relationship workspace data is not available.",
  renderSection,
}: RelationshipWorkspaceProps) {
  const [activeSection, setActiveSection] = useState<RelationshipWorkspaceSectionId>(initialSection);

  const content = useMemo<React.ReactNode>(() => {
    if (!viewModel) {
      return (
        <SectionCard title="Relationship Workspace" subtitle="No relationship data is currently available">
          <PanelEmptyState message={emptyMessage} />
        </SectionCard>
      );
    }

    if (renderSection) {
      return renderSection(activeSection, viewModel);
    }

    return defaultSectionSummary(activeSection, viewModel);
  }, [activeSection, emptyMessage, renderSection, viewModel]);

  if (isLoading) {
    return <PanelLoadingState title="Relationship Workspace" subtitle="Loading workspace modules" />;
  }

  if (error) {
    return <PanelErrorState title="Relationship Workspace" subtitle="Unable to render workspace" message={error} />;
  }

  if (!viewModel) {
    return content;
  }

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
      content={
        <section id={`relationship-workspace-panel-${activeSection}`} role="tabpanel" aria-labelledby={`relationship-workspace-tab-${activeSection}`}>
          {content}
        </section>
      }
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
