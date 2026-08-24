"use client";

import React from "react";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import NextActionsCard from "@/components/customer/relationship/NextActionsCard";
import RelationshipHeader from "@/components/customer/relationship/RelationshipHeader";
import RelationshipHealthCard from "@/components/customer/relationship/RelationshipHealthCard";
import RelationshipInsights from "@/components/customer/relationship/RelationshipInsights";
import RelationshipSummary from "@/components/customer/relationship/RelationshipSummary";
import RelationshipTimeline from "@/components/customer/relationship/RelationshipTimeline";
import {
  relationshipPanelConfig,
} from "@/lib/customer/relationship/relationship-panel.config";
import type {
  RelationshipPanelConfig,
  RelationshipPanelModel,
} from "@/lib/customer/relationship/relationship-panel.types";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import SectionCard from "@/components/ui/SectionCard";

export interface RelationshipPanelProps {
  readonly config?: RelationshipPanelConfig;
  readonly viewModel?: RelationshipPresentationViewModel;
  readonly model?: RelationshipPanelModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function buildRelationshipPanelModel(
  viewModel: RelationshipPresentationViewModel | undefined,
  fallbackModel: RelationshipPanelModel | undefined,
): RelationshipPanelModel | null {
  if (!fallbackModel && !viewModel) {
    return null;
  }

  const model = fallbackModel;

  if (!viewModel) {
    return model ?? null;
  }

  if (!model) {
    return null;
  }

  const workspaceProjection = viewModel.payload.workspaceProjection;

  return {
    ...model,
    summary: {
      ...model.summary,
      relationship: {
        ...model.summary.relationship,
        relationshipId: workspaceProjection.relationship.relationshipId,
        institutionId: workspaceProjection.relationship.institutionId,
        relationshipName: workspaceProjection.relationship.relationshipName,
        status: workspaceProjection.relationship.status,
        stage: workspaceProjection.relationship.stage,
        ownerDisplayName: workspaceProjection.relationship.ownerDisplayName,
        createdDate: workspaceProjection.relationship.createdDate,
        updatedDate: workspaceProjection.relationship.updatedDate,
        summaryMetadata: workspaceProjection.relationship.summaryMetadata,
      },
      contactCount: String(workspaceProjection.contacts.length),
      interactionCount: String(workspaceProjection.interactions.length),
      primaryContactName: workspaceProjection.contacts[0]?.fullName,
    },
    timeline: workspaceProjection.interactions,
  };
}

export default function RelationshipPanel({
  config = relationshipPanelConfig,
  viewModel,
  model,
  isLoading = false,
  error,
}: RelationshipPanelProps) {
  if (isLoading) {
    return <PanelLoadingState title={config.title} subtitle={config.subtitle} />;
  }

  if (error) {
    return <PanelErrorState title={config.title} subtitle={config.subtitle} message={error} />;
  }

  const presentationModel = buildRelationshipPanelModel(viewModel, model);
  if (!presentationModel) {
    return (
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <PanelEmptyState message="Relationship data is not available in the current workspace context." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <RelationshipHeader config={config} summary={presentationModel.summary} />
      <RelationshipHealthCard config={config} health={presentationModel.health} />
      <RelationshipSummary config={config} summary={presentationModel.summary} />
      <RelationshipTimeline config={config} timeline={presentationModel.timeline} />
      <RelationshipInsights config={config} insights={presentationModel.insights} />
      <NextActionsCard config={config} actions={presentationModel.nextActions} />
    </div>
  );
}
