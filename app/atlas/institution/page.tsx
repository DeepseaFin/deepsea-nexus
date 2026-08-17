import { cookies, headers } from "next/headers";
import InstitutionWorkspace from "@/src/capabilities/institution/components/InstitutionWorkspace";
import { createInstitutionWorkspaceState } from "@/src/capabilities/institution/services/InstitutionWorkspaceAssembler";
import type { InstitutionWorkspaceState } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";
import { createInstitutionRuntimeFacade } from "@/lib/application/InstitutionRuntimeFacade";
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from "@/lib/supabase/runtimeAuth";
import { createInstitutionContextSummaryBuilder } from "@/lib/workspaces/InstitutionContextSummary";
import { workflowContextRepository } from "@/lib/workflows/WorkflowContext";
import { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import { InstitutionType } from "@/lib/institution/constants/InstitutionType";
import { WorkflowRunState } from "@/lib/workflows/WorkflowExecutionState";
import { WorkflowStep } from "@/lib/workflows/WorkflowStep";

type InstitutionPageSearchParams = Promise<{
  workflowId?: string;
}>;

async function createCookieAdapter(): Promise<RuntimeAuthCookieAdapter> {
  const cookieStore = await cookies();

  return {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
  };
}

function resolveBusinessContext(workflowId: string | undefined) {
  if (workflowId) {
    const byWorkflowId = workflowContextRepository.findByWorkflowId(workflowId);
    if (byWorkflowId) {
      return byWorkflowId;
    }
  }

  const [latest] = workflowContextRepository.list();
  return latest;
}

export default async function InstitutionPage({ searchParams }: { searchParams?: InstitutionPageSearchParams }) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const requestCookies = await createCookieAdapter();
  const runtime = await resolveServerRuntimeAuthContext({
    url: "http://localhost/atlas/institution",
    method: "GET",
    pathname: "/atlas/institution",
    headers: requestHeaders,
    searchParams: new URLSearchParams(params.workflowId ? { workflowId: params.workflowId } : {}),
    cookies: requestCookies,
  });
  const businessContext = resolveBusinessContext(params.workflowId);
  const timestamp = runtime.session.snapshot.metadata.lastRefreshedAt
    ?? runtime.session.snapshot.metadata.issuedAt
    ?? new Date().toISOString();

  const runtimeFacade = createInstitutionRuntimeFacade();
  const institutionContext = runtimeFacade.provideInstitutionContext({
    institution: {
      identity: {
        institutionId: businessContext?.institutionId ?? runtime.identity.identity.identityId,
        legalName: runtime.identity.identity.displayName ?? runtime.identity.identity.email ?? businessContext?.institutionId ?? "Live Institution",
        displayName: runtime.identity.identity.displayName ?? runtime.identity.identity.email ?? businessContext?.institutionId ?? "Live Institution",
        institutionType: InstitutionType.Corporate,
        jurisdiction: (runtime.identity.identity.metadata.jurisdiction as string | undefined) ?? "Live Runtime",
        registrationNumber: businessContext?.workflowId ?? runtime.identity.identity.identityId,
      },
      status: runtime.session.isAuthenticated ? InstitutionStatus.Active : InstitutionStatus.Draft,
      profile: {
        legalForm: runtime.identity.identity.memberships[0] ?? "Institution Runtime",
        businessActivity: businessContext ? `Live workflow ${businessContext.workflowId}` : "Runtime session",
        establishedOn: runtime.session.snapshot.metadata.issuedAt ?? timestamp,
        references: {
          businessPassportId: businessContext?.opportunityId,
          timelineId: businessContext?.workflowId,
          journeyId: businessContext?.workflowId,
          evidenceIds: businessContext ? [businessContext.opportunityId] : [],
          knowledgeIds: businessContext ? [businessContext.workflowId] : [],
        },
      },
      metadata: {
        createdAt: runtime.session.snapshot.metadata.issuedAt ?? timestamp,
        createdBy: runtime.identity.identity.identityId,
        updatedAt: timestamp,
        updatedBy: runtime.identity.identity.identityId,
        source: "runtime-auth",
      },
    },
    workflowExecutionState: {
      workflowId: businessContext?.workflowId ?? "institution-runtime",
      executionId: `${runtime.identity.identity.identityId}:${businessContext?.workflowId ?? "institution"}`,
      runState: WorkflowRunState.Completed,
      currentStep: WorkflowStep.InstitutionIntelligence,
      completedSteps: [WorkflowStep.InstitutionIntelligence],
      pendingSteps: [],
      startedAt: runtime.session.snapshot.metadata.issuedAt ?? timestamp,
      completedAt: timestamp,
      lastEventAt: timestamp,
    },
    totalWorkflowSteps: 1,
    assembledAt: timestamp,
  });

  const summary = createInstitutionContextSummaryBuilder().build(institutionContext);
  const initialState: InstitutionWorkspaceState = createInstitutionWorkspaceState({
    runtime,
    institutionContext,
    summary,
    businessContext,
  });

  return <InstitutionWorkspace initialState={initialState} />;
}
