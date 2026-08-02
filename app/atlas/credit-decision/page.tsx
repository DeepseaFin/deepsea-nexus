import CreditDecisionWorkspace from "@/components/credit/decision-workspace/CreditDecisionWorkspace";

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
