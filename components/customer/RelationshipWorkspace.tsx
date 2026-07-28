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
import WorkflowWorkspace from "@/components/workflow/WorkflowWorkspace";
import RelationshipWorkspaceHeader from "@/components/customer/RelationshipWorkspaceHeader";
import RelationshipWorkspaceLayout from "@/components/customer/RelationshipWorkspaceLayout";
import RelationshipWorkspaceNavigation, {
  type RelationshipWorkspaceNavigationItem,
  type RelationshipWorkspaceSectionId,
} from "@/components/customer/RelationshipWorkspaceNavigation";
import type { RelationshipWorkspaceViewModel } from "@/lib/customer/RelationshipWorkspaceViewModel";
import type { WorkflowPresentationModel } from "@/lib/workflow/presentation/WorkflowPresentationModel";

export interface RelationshipWorkspaceProps {
  readonly viewModel?: RelationshipWorkspaceViewModel | null;
  readonly workflowPresentation?: WorkflowPresentationModel | null;
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
  workflowPresentation?: WorkflowPresentationModel | null,
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

  if (section === "workflow") {
    return <WorkflowWorkspace presentation={workflowPresentation} />;
  }

  return <RelationshipActionCenter actionCenter={viewModel.actionCenter} />;
}

export default function RelationshipWorkspace({
  viewModel,
  workflowPresentation,
  initialSection = "dashboard",
  isLoading = false,
  error,
  emptyMessage = "Relationship workspace data is not available.",
  renderSection,
}: RelationshipWorkspaceProps) {
  const navigationItems = useMemo<readonly RelationshipWorkspaceNavigationItem[]>(() => {
    if (!workflowPresentation) {
      return DEFAULT_NAVIGATION_ITEMS;
    }

    return [...DEFAULT_NAVIGATION_ITEMS, { id: "workflow", label: "Workflow" }];
  }, [workflowPresentation]);

  const effectiveInitialSection = useMemo<RelationshipWorkspaceSectionId>(() => {
    if (initialSection === "workflow" && !workflowPresentation) {
      return "dashboard";
    }

    return initialSection;
  }, [initialSection, workflowPresentation]);

  const [activeSection, setActiveSection] = useState<RelationshipWorkspaceSectionId>(effectiveInitialSection);
  const resolvedSection: RelationshipWorkspaceSectionId =
    activeSection === "workflow" && !workflowPresentation ? "dashboard" : activeSection;

  const content = useMemo<React.ReactNode>(() => {
    if (!viewModel) {
      return (
        <SectionCard title="Relationship Workspace" subtitle="No relationship data is currently available">
          <PanelEmptyState message={emptyMessage} />
        </SectionCard>
      );
    }

    if (renderSection) {
      return renderSection(resolvedSection, viewModel);
    }

    return defaultSectionSummary(resolvedSection, viewModel, workflowPresentation);
  }, [emptyMessage, renderSection, resolvedSection, viewModel, workflowPresentation]);

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
          items={navigationItems}
          activeSection={resolvedSection}
          onSectionChange={(section) => {
            if (section === "workflow" && !workflowPresentation) {
              setActiveSection("dashboard");
              return;
            }

            setActiveSection(section);
          }}
        />
      }
      content={
        <section
          id={`relationship-workspace-panel-${resolvedSection}`}
          role="tabpanel"
          aria-labelledby={`relationship-workspace-tab-${resolvedSection}`}
        >
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
