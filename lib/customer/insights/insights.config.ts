import type { AiInsightsConfig, AiInsightsModel } from "@/lib/customer/insights/insights.types";

export const aiInsightsConfig: AiInsightsConfig = {
  title: "AI Insights",
  subtitle: "Framework recommendations and opportunities for customer operations",
  recommendationsTitle: "Recommendations",
  recommendationsSubtitle: "Generic recommendation cards with confidence and action guidance",
  opportunitiesTitle: "Opportunities",
  opportunitiesSubtitle: "Opportunity framing for relationship and funding progression",
};

export const defaultAiInsightsModel: AiInsightsModel = {
  recommendations: [
    {
      id: "rec-1",
      title: "Close compliance evidence gap",
      summary: "One required compliance artifact remains incomplete before approval progression.",
      confidence: "88%",
      priority: "high",
      category: "Approvals",
      recommendedAction: "Request updated compliance certificate",
      riskLevel: "High",
    },
    {
      id: "rec-2",
      title: "Accelerate funding readiness handoff",
      summary: "Relationship and credit handoff is available for faster funding preparation.",
      confidence: "81%",
      priority: "medium",
      category: "Funding",
      recommendedAction: "Schedule funding readiness review",
      riskLevel: "Medium",
    },
    {
      id: "rec-3",
      title: "Strengthen relationship continuity",
      summary: "Recent activity indicates strong engagement but follow-up window is narrowing.",
      confidence: "76%",
      priority: "low",
      category: "Relationship",
      recommendedAction: "Create next stakeholder touchpoint",
      riskLevel: "Low",
    },
  ],
  opportunities: [
    {
      id: "opp-1",
      title: "Expand facility utilization",
      summary: "Available limit can support near-term invoice cycle demand.",
      category: "Funding",
      priority: "medium",
      recommendedAction: "Open facility expansion review",
    },
    {
      id: "opp-2",
      title: "Fast-track approval package",
      summary: "Submission is close to ready with minimal additional evidence updates.",
      category: "Approvals",
      priority: "high",
      recommendedAction: "Trigger approval package final check",
    },
  ],
};
