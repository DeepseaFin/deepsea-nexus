import type { BusinessDNA } from "@/lib/knowledge/businessDNA";
import type { FundingAssessment } from "@/lib/business/fundingAssessmentService";
import type { RelationshipTimeline } from "@/lib/relationship/relationshipTimeline";
import type { WorkspaceAction, WorkspaceTask } from "@/lib/workspaces/businessWorkspaceViewModel";
import type { RelationshipWorkspaceViewModel } from "@/lib/workspaces/relationshipWorkspaceViewModel";

function getValue<T>(attribute: { value: T } | undefined, fallback: T): T {
  return attribute?.value ?? fallback;
}

function buildTasks(timeline: RelationshipTimeline): WorkspaceTask[] {
  const followUps = timeline.events.length;

  return [
    {
      label: "Follow Ups",
      value: String(followUps),
      detail: "Awaiting response after relationship review",
    },
    {
      label: "Pending Documents",
      value: "1",
      detail: "Recent invoice still requested",
    },
    {
      label: "Book Meetings",
      value: "1",
      detail: "Schedule a relationship manager call",
    },
    {
      label: "Notes",
      value: "3",
      detail: "Business understanding complete; proceed with outreach",
    },
  ];
}

function buildActions(): WorkspaceAction[] {
  return [
    {
      label: "Schedule a Meeting",
      description: "Move the customer into a live conversation.",
      icon: "calendar",
    },
    {
      label: "Email My Assessment",
      description: "Share the current assessment summary.",
      icon: "mail",
    },
  ];
}

export class RelationshipWorkspaceAssembler {
  build(
    businessDNA: BusinessDNA,
    fundingAssessment: FundingAssessment,
    relationshipTimeline: RelationshipTimeline,
  ): RelationshipWorkspaceViewModel {
    const companyName = getValue(businessDNA.identity.legalName, "Unknown Business");
    const intelligenceScore = businessDNA.intelligence.overallConfidence?.value ?? fundingAssessment.confidence;
    const relationshipStage = getValue(businessDNA.relationship.relationshipStage, "Discovery");
    const lastActivity = relationshipTimeline.events[0]?.description ?? "No recent activity";

    return {
      greeting: "Good Morning, Sarah.",
      title: "Today's Portfolio",
      subtitle: "Relationship oversight and customer engagement priorities.",
      portfolioSummary: {
        activeClients: 42,
        awaitingFirstContact: 9,
        meetingsToday: 7,
        fundingPipeline: "AED 24.8M",
        todaysPriority: "High-touch clients",
      },
      relationshipCard: {
        companyName,
        businessIntelligenceScore: `${intelligenceScore}%`,
        fundingGoal: fundingAssessment.advanceRate,
        status: relationshipStage,
        nextBestAction: fundingAssessment.recommendation,
        lastActivity,
      },
      aiRelationshipCoach: {
        title: "AI Relationship Coach",
        narrative:
          "The customer is warm and financially qualified. Lead with a concise relationship call, confirm the funding goal, and then move quickly to a meeting invite once the customer responds.",
      },
      taskPanel: {
        title: "Task Panel",
        tasks: buildTasks(relationshipTimeline),
      },
      actions: buildActions(),
    };
  }
}

export const relationshipWorkspaceAssembler = new RelationshipWorkspaceAssembler();
