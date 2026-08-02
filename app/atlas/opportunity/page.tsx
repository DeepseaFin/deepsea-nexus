import Opportunity360Workspace from "@/components/deal/opportunity360/Opportunity360Workspace";
import { getOperationsCenterContexts } from "@/lib/workflows/DemoScenario";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Opportunity 360 | Deepsea Nexus",
  description: "Opportunity-level workspace for workflow, intelligence, and operational execution.",
};

type OpportunityPageSearchParams = Promise<{
  opportunityId?: string;
  workflowId?: string;
}>;

function resolveOpportunityId(opportunityId: string | undefined, workflowId: string | undefined): string | undefined {
  if (opportunityId) {
    return opportunityId;
  }

  if (!workflowId) {
    return undefined;
  }

  return getOperationsCenterContexts().find((context) => context.workflowId === workflowId)?.opportunityId;
}

export default async function OpportunityPage({
  searchParams,
}: {
  searchParams?: OpportunityPageSearchParams;
}) {
  const params = (await searchParams) ?? {};
  const resolvedOpportunityId = resolveOpportunityId(params.opportunityId, params.workflowId);

  return <Opportunity360Workspace opportunityId={resolvedOpportunityId} />;
}
