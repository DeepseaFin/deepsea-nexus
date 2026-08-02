import Institution360Workspace from "@/components/customer/client360/Institution360Workspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institution 360 | Deepsea Nexus",
  description: "Institution-level workspace for passport, opportunities, and relationship execution.",
};

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