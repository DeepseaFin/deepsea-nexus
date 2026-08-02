import Institution360Workspace from "@/components/customer/client360/Institution360Workspace";

type InstitutionHomePageSearchParams = Promise<{
  opportunityId?: string;
}>;

export default async function AtlasInstitutionHomePage({
  searchParams,
}: {
  searchParams?: InstitutionHomePageSearchParams;
}) {
  const params = (await searchParams) ?? {};

  return <Institution360Workspace opportunityId={params.opportunityId} />;
}