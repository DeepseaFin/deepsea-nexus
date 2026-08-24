"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AiRecommendationCard from "@/components/customer/insights/AiRecommendationCard";
import OpportunityCard from "@/components/customer/insights/OpportunityCard";
import { PanelEmptyState, PanelErrorState, PanelLoadingState } from "@/components/customer/shared/PanelFeedback";
import SectionCard from "@/components/ui/SectionCard";
import { aiInsightsConfig } from "@/lib/customer/insights/insights.config";
import type { AiInsightsConfig, AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";

export interface AiInsightsPanelProps {
  readonly config?: AiInsightsConfig;
  readonly viewModel?: AiInsightsPresentationViewModel;
  readonly model?: AiInsightsModel;
  readonly isLoading?: boolean;
  readonly error?: string;
}

function buildAiInsightsModel(
  viewModel: AiInsightsPresentationViewModel | undefined,
  fallbackModel: AiInsightsModel | undefined,
): AiInsightsModel | null {
  return viewModel?.payload.panelModel ?? fallbackModel ?? null;
}

export default function AiInsightsPanel({
  config = aiInsightsConfig,
  viewModel,
  model,
  isLoading = false,
  error,
}: AiInsightsPanelProps) {
  if (isLoading) {
    return <PanelLoadingState title={config.title} subtitle={config.subtitle} />;
  }

  if (error) {
    return <PanelErrorState title={config.title} subtitle={config.subtitle} message={error} />;
  }

  const presentationModel = buildAiInsightsModel(viewModel, model);
  if (!presentationModel) {
    return (
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <PanelEmptyState message="Insights are not available in the current workspace context." />
      </SectionCard>
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <p className="text-sm text-slate-300">
          {presentationModel.recommendations.length} recommendations and {presentationModel.opportunities.length} opportunities are available for this customer.
        </p>
      </SectionCard>

      <SectionCard title={config.recommendationsTitle} subtitle={config.recommendationsSubtitle}>
        <AnimatePresence>
          <motion.div
            className="space-y-2.5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
              {presentationModel.recommendations.map((recommendation) => (
              <AiRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      <SectionCard title={config.opportunitiesTitle} subtitle={config.opportunitiesSubtitle}>
        <div className="space-y-2.5">
          {presentationModel.opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
