import { cookies, headers } from "next/headers";
import CommercialWorkspace from "@/src/capabilities/commercial/components/CommercialWorkspace";
import type { CommercialWorkflowState } from "@/src/capabilities/commercial/types/CommercialWorkflowState";
import { createCanonicalReleaseOneRuntimeComposition } from "@/lib/application/InstitutionRuntimeComposition";
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from "@/lib/supabase/runtimeAuth";
import type { BusinessContext } from "@/lib/workflows/WorkflowContext";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";
import { getDemoScenario } from "@/lib/workflows/DemoScenario";

async function createCookieAdapter(): Promise<RuntimeAuthCookieAdapter> {
  const cookieStore = await cookies();

  return {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
  };
}

const COMMERCIAL_WORKFLOW_STATE: Omit<CommercialWorkflowState, "currentStepId" | "steps"> = {
  workflowId: "COM-ORIG-9001",
  institutionName: "Al Noor Trading LLC",
  businessPassport: {
    passportId: "BPP-2401",
    legalName: "Al Noor Trading LLC",
    jurisdiction: "Dubai Mainland",
    businessType: "General Trading",
    registrationNumber: "REG-554201",
    riskBand: "Moderate",
    readinessScore: 87,
  },
  opportunity: {
    opportunityId: "OPP-7712",
    lifecycleStatus: OpportunityLifecycle.DRAFT,
    product: "Receivables Finance",
    targetAmount: "USD 6,200,000",
    tenor: "180 days",
    relationshipManager: "Layla Rahman",
  },
  receivable: {
    receivableType: "Trade invoices",
    invoiceCount: "42",
    averageInvoiceSize: "USD 147,000",
    obligorSegment: "Investment grade buyers",
    expectedDilution: "2.1%",
  },
  pricing: {
    pricingReference: "PRC-IND-331",
    indicativeMargin: "410 bps",
    indicativeDiscountRate: "8.45%",
    fees: "1.00% arrangement fee",
    notes: [
      "Indicative terms only; no pricing calculation engine used.",
      "Final terms subject to committee and legal confirmation.",
      "Passport risk band incorporated as contextual input only.",
    ],
  },
  termSheet: {
    version: "v0.9-preview",
    governingLaw: "UAE",
    facilityType: "Committed receivables purchase",
    conditions: [
      "Satisfactory KYC and evidence package",
      "Executed assignment and notice terms",
      "Approval committee sign-off",
    ],
  },
};

type CommercialPageProps = {
  searchParams?: Promise<{
    demoScenario?: string;
    institutionName?: string;
    legalName?: string;
    jurisdiction?: string;
    businessType?: string;
    registrationNumber?: string;
    readinessScore?: string;
  }>;
};

export default async function CommercialPage({ searchParams }: CommercialPageProps) {
  const params = (await searchParams) ?? {};
  const demoScenario = getDemoScenario(params.demoScenario);
  const readinessScore = Number(params.readinessScore);

  async function saveWorkflowContext(context: BusinessContext): Promise<void> {
    "use server";

    const requestHeaders = await headers();
    const requestCookies = await createCookieAdapter();
    const runtime = await resolveServerRuntimeAuthContext({
      url: "http://localhost/atlas/commercial",
      method: "POST",
      pathname: "/atlas/commercial",
      headers: requestHeaders,
      searchParams: new URLSearchParams(),
      cookies: requestCookies,
    });

    if (!runtime.session.isAuthenticated || runtime.session.isExpired) {
      throw new Error("Unauthorized");
    }

    const runtimeComposition = createCanonicalReleaseOneRuntimeComposition();
    await runtimeComposition.workflowContextRepository.save(context);
  }

  const initialState: Omit<CommercialWorkflowState, "currentStepId" | "steps"> = {
    ...COMMERCIAL_WORKFLOW_STATE,
    workflowId: demoScenario?.contexts.commercial.workflowId ?? COMMERCIAL_WORKFLOW_STATE.workflowId,
    institutionName: params.institutionName ?? demoScenario?.institutionName ?? COMMERCIAL_WORKFLOW_STATE.institutionName,
    businessPassport: {
      ...COMMERCIAL_WORKFLOW_STATE.businessPassport,
      legalName: params.legalName ?? COMMERCIAL_WORKFLOW_STATE.businessPassport.legalName,
      jurisdiction: params.jurisdiction ?? COMMERCIAL_WORKFLOW_STATE.businessPassport.jurisdiction,
      businessType: params.businessType ?? COMMERCIAL_WORKFLOW_STATE.businessPassport.businessType,
      registrationNumber: params.registrationNumber ?? COMMERCIAL_WORKFLOW_STATE.businessPassport.registrationNumber,
      readinessScore: Number.isFinite(readinessScore)
        ? readinessScore
        : COMMERCIAL_WORKFLOW_STATE.businessPassport.readinessScore,
    },
    opportunity: {
      ...COMMERCIAL_WORKFLOW_STATE.opportunity,
      opportunityId: demoScenario?.opportunityId ?? COMMERCIAL_WORKFLOW_STATE.opportunity.opportunityId,
      targetAmount: demoScenario?.fundingAmount ?? COMMERCIAL_WORKFLOW_STATE.opportunity.targetAmount,
      lifecycleStatus: demoScenario?.contexts.commercial.opportunityLifecycle ?? COMMERCIAL_WORKFLOW_STATE.opportunity.lifecycleStatus,
    },
  };

  return <CommercialWorkspace initialState={initialState} saveWorkflowContext={saveWorkflowContext} />;
}
