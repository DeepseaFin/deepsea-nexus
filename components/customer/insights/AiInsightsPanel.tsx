"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import AiRecommendationCard from "@/components/customer/insights/AiRecommendationCard";
import OpportunityCard from "@/components/customer/insights/OpportunityCard";
import SectionCard from "@/components/ui/SectionCard";
import { aiInsightsConfig, defaultAiInsightsModel } from "@/lib/customer/insights/insights.config";
import type { AiInsightsConfig, AiInsightsModel } from "@/lib/customer/insights/insights.types";

export interface AiInsightsPanelProps {
  readonly config?: AiInsightsConfig;
  readonly model?: AiInsightsModel;
}

export default function AiInsightsPanel({ config = aiInsightsConfig, model = defaultAiInsightsModel }: AiInsightsPanelProps) {
  return (
    <div className="space-y-4">
      <SectionCard title={config.title} subtitle={config.subtitle}>
        <p className="text-sm text-slate-300">
          Presentation-only recommendation surface prepared for future live AI and intelligence services.
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
            {model.recommendations.map((recommendation) => (
              <AiRecommendationCard key={recommendation.id} recommendation={recommendation} />
            ))}
          </motion.div>
        </AnimatePresence>
      </SectionCard>

      <SectionCard title={config.opportunitiesTitle} subtitle={config.opportunitiesSubtitle}>
        <div className="space-y-2.5">
          {model.opportunities.map((opportunity) => (
            <OpportunityCard key={opportunity.id} opportunity={opportunity} />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
