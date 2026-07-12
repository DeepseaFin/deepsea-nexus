import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import type { RelationshipJourneyViewModel } from "@/lib/workspaces/relationshipJourneyViewModel";

function getValue<T>(attribute: { value: T } | undefined, fallback: T): T {
  return attribute?.value ?? fallback;
}

function getTimelineState(index: number): "complete" | "current" | "upcoming" {
  if (index === 0) {
    return "complete";
  }

  if (index === 1) {
    return "complete";
  }

  if (index === 2) {
    return "current";
  }

  return "upcoming";
}

export class RelationshipJourneyAssembler {
  build(
    businessDNA: BusinessDNA,
    fundingAssessment: FundingAssessment,
    relationshipTimeline: RelationshipTimeline,
  ): RelationshipJourneyViewModel {
    const companyName = getValue(businessDNA.identity.legalName, "Unknown Business");
    const documentType = getValue(businessDNA.identity.entityType, "Operating Entity");
    const jurisdiction = getValue(businessDNA.identity.jurisdiction, "Not available");
    const fundingGoal = getValue(businessDNA.financial.fundingNeed, fundingAssessment.recommendation);
    const intelligenceScore = `${businessDNA.intelligence.overallConfidence?.value ?? fundingAssessment.confidence}%`;
    const estimatedResponseTime = fundingAssessment.turnaround;

    return {
      welcomeMessage: `Congratulations, ${companyName}.`,
      businessSummary: {
        companyName,
        documentType,
        jurisdiction,
      },
      intelligenceScore,
      fundingGoal,
      estimatedResponseTime,
      nextSteps: [
        "A Deepsea Relationship Manager can now review your requirements.",
        `The indicative funding recommendation is ${fundingAssessment.recommendedFacility}.`,
        "Prepare for a focused relationship discussion and supporting document review.",
      ],
      timeline: relationshipTimeline.events.map((event, index) => ({
        title: event.title,
        description: event.description,
        state: getTimelineState(index),
      })),
      actions: [
        {
          label: "Schedule a Meeting",
          description: "Move into a live relationship discussion.",
          icon: "calendar",
        },
        {
          label: "Email My Assessment",
          description: "Share the current institutional summary.",
          icon: "mail",
        },
        {
          label: "Download Business Profile",
          description: "Coming Soon",
          icon: "download",
          disabled: true,
          badge: "Coming Soon",
        },
        {
          label: "Ask ORACLE Another Question",
          description: "Coming Soon",
          icon: "message-square",
          disabled: true,
          badge: "Coming Soon",
        },
      ],
    };
  }
}

export const relationshipJourneyAssembler = new RelationshipJourneyAssembler();
