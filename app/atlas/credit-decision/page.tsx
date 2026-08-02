import CreditDecisionWorkspace from "@/components/credit/decision-workspace/CreditDecisionWorkspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Credit Decision Workspace | Deepsea Nexus",
  description: "Credit decisioning workspace for underwriting, governance, and final actioning.",
};

type CreditDecisionPageSearchParams = Promise<{
  opportunityId?: string;
}>;

export default async function CreditDecisionPage({
  searchParams,
}: {
  searchParams?: CreditDecisionPageSearchParams;
}) {
  const params = (await searchParams) ?? {};

  return <CreditDecisionWorkspace opportunityId={params.opportunityId} />;
}
