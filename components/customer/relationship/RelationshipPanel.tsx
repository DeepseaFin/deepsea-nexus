"use client";

import React from "react";
import NextActionsCard from "@/components/customer/relationship/NextActionsCard";
import RelationshipHeader from "@/components/customer/relationship/RelationshipHeader";
import RelationshipHealthCard from "@/components/customer/relationship/RelationshipHealthCard";
import RelationshipInsights from "@/components/customer/relationship/RelationshipInsights";
import RelationshipSummary from "@/components/customer/relationship/RelationshipSummary";
import RelationshipTimeline from "@/components/customer/relationship/RelationshipTimeline";
import {
  defaultRelationshipPanelModel,
  relationshipPanelConfig,
} from "@/lib/customer/relationship/relationship-panel.config";
import type {
  RelationshipPanelConfig,
  RelationshipPanelModel,
} from "@/lib/customer/relationship/relationship-panel.types";

export interface RelationshipPanelProps {
  readonly config?: RelationshipPanelConfig;
  readonly model?: RelationshipPanelModel;
}

export default function RelationshipPanel({
  config = relationshipPanelConfig,
  model = defaultRelationshipPanelModel,
}: RelationshipPanelProps) {
  return (
    <div className="space-y-4">
      <RelationshipHeader config={config} summary={model.summary} />
      <RelationshipHealthCard config={config} health={model.health} />
      <RelationshipSummary config={config} summary={model.summary} />
      <RelationshipTimeline config={config} timeline={model.timeline} />
      <RelationshipInsights config={config} insights={model.insights} />
      <NextActionsCard config={config} actions={model.nextActions} />
    </div>
  );
}
