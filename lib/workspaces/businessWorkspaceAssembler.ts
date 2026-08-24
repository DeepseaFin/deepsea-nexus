import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import type { BusinessWorkspaceViewModel } from "@/lib/workspaces/businessWorkspaceViewModel";

function getAttributeValue<T>(attribute: { value: T } | undefined, fallback: T): T {
  return attribute?.value ?? fallback;
}

function getFundingGoal(
  businessDNA: BusinessDNA,
  fundingAssessment: FundingAssessment,
): string {
  return businessDNA.financial.fundingNeed?.value ?? fundingAssessment.recommendation;
}

function buildTimelineEvents(timeline: RelationshipTimeline): Array<{
  title: string;
  description: string;
  status?: string;
}> {
  return timeline.events.map((event) => ({
    title: event.title,
    description: event.description,
    status: event.category,
  }));
}

export class BusinessWorkspaceAssembler {
  build(
    businessDNA: BusinessDNA,
    fundingAssessment: FundingAssessment,
    relationshipTimeline: RelationshipTimeline,
  ): BusinessWorkspaceViewModel {
    const companyName = getAttributeValue(businessDNA.identity.legalName, "Unknown Business");
    const documentType = getAttributeValue(businessDNA.identity.entityType, "Operating Entity");
    const jurisdiction = getAttributeValue(businessDNA.identity.jurisdiction, "Not available");
    const businessIntelligenceScore = businessDNA.intelligence.overallConfidence?.value ?? fundingAssessment.confidence;
    const progressValue = businessDNA.intelligence.profileCompleteness?.value ?? 82;

    return {
      greeting: `Welcome, ${companyName}`,
      title: "Your Business Workspace has been created.",
      subtitle: "ORACLE has completed your initial business understanding.",
      businessProfile: {
        companyName,
        documentType,
        jurisdiction,
      },
      fundingReadiness: {
        fundingGoal: getFundingGoal(businessDNA, fundingAssessment),
        progressLabel: "Current Progress",
        progressValue,
        completedItems: ["Business Understood"],
        pendingItems: ["One Recent Invoice"],
        guidance: "Uploading one recent invoice will significantly improve your funding assessment.",
      },
      documents: {
        title: "Documents",
        description: "Workspace document center is ready for your next uploads.",
      },
      relationshipTimeline: {
        heading: "Relationship Timeline",
        events: buildTimelineEvents(relationshipTimeline),
      },
      aiAdvisor: {
        title: "AI Advisor",
        narrative:
          "I've understood your business. Uploading one recent invoice will allow me to prepare a much more accurate funding assessment.",
      },
      actions: [
        {
          label: "Continue",
          description: "Move into the relationship experience.",
          icon: "arrow-right",
        },
      ],
      relationshipCard: {
        companyName,
        businessIntelligenceScore: `${businessIntelligenceScore}%`,
        fundingGoal: getFundingGoal(businessDNA, fundingAssessment),
        status: fundingAssessment.riskLevel,
        nextBestAction: fundingAssessment.recommendation,
        lastActivity: relationshipTimeline.events[0]?.description ?? "No recent activity",
      },
    };
  }
}

export const businessWorkspaceAssembler = new BusinessWorkspaceAssembler();
