import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import type { ExecutiveWorkspaceViewModel } from "@/lib/workspaces/executiveWorkspaceViewModel";

function getBusinessCount(businesses: BusinessDNA[]): number {
  return businesses.length;
}

function getFundingPipeline(fundingAssessments: FundingAssessment[]): string {
  const totalAdvanceRate = fundingAssessments.reduce((sum, assessment) => {
    const numeric = Number.parseFloat(assessment.advanceRate);
    return sum + (Number.isNaN(numeric) ? 0 : numeric);
  }, 0);

  return `AED ${Math.round(totalAdvanceRate)}M`;
}

function getRelationshipsAwaitingContact(timelines: RelationshipTimeline[]): number {
  return timelines.filter((timeline) => timeline.events.length > 0).length;
}

function getFirstCompanyName(businesses: BusinessDNA[]): string {
  return businesses[0]?.identity.legalName.value ?? "Deepak";
}

function getExecutiveScore(businesses: BusinessDNA[], fundingAssessments: FundingAssessment[]): string {
  const firstBusiness = businesses[0];
  const firstAssessment = fundingAssessments[0];
  const score = firstBusiness?.intelligence.overallConfidence?.value ?? firstAssessment?.confidence ?? 82;

  return `${score}%`;
}

export class ExecutiveWorkspaceAssembler {
  build(
    businesses: BusinessDNA[],
    fundingAssessments: FundingAssessment[],
    relationshipTimelines: RelationshipTimeline[],
  ): ExecutiveWorkspaceViewModel {
    const companyName = getFirstCompanyName(businesses);

    return {
      greeting: `Good Morning, ${companyName}.`,
      title: "Today's Executive Brief",
      executiveBrief:
        "The portfolio remains stable, onboarding momentum is healthy, and the highest-value relationship opportunities are concentrated in the mid-market segment.",
      kpis: [
        {
          label: "Businesses Onboarded",
          value: String(getBusinessCount(businesses)),
          detail: "+14 this week",
        },
        {
          label: "Funding Pipeline",
          value: getFundingPipeline(fundingAssessments),
          detail: `${fundingAssessments.length} active opportunities`,
        },
        {
          label: "Business Intelligence Score",
          value: getExecutiveScore(businesses, fundingAssessments),
          detail: "Portfolio average",
        },
        {
          label: "Relationships Awaiting Contact",
          value: String(getRelationshipsAwaitingContact(relationshipTimelines)),
          detail: "Requires senior follow-up",
        },
        {
          label: "Today's Priority",
          value: "5",
          detail: "High-priority decisions",
        },
      ],
      aiChiefOfStaff: {
        title: "AI Chief of Staff",
        narrative:
          "The portfolio is stable, the pipeline is active, and the next highest-impact action is to prioritize relationship contact for warm opportunities before executive review.",
      },
      todayPriority: {
        title: "Today's Priority",
        detail: "Focus on relationship follow-up and funding conversion.",
      },
      actions: [
        {
          label: "View New Businesses",
          description: "Inspect the latest onboarded businesses.",
          icon: "sparkles",
        },
        {
          label: "Relationship Workspace",
          description: "Open the relationship management view.",
          icon: "users",
        },
        {
          label: "Portfolio Overview",
          description: "Review portfolio concentration and momentum.",
          icon: "chart",
        },
        {
          label: "Ask ATLAS",
          description: "Request an executive summary.",
          icon: "message-square",
        },
      ],
    };
  }
}

export const executiveWorkspaceAssembler = new ExecutiveWorkspaceAssembler();
