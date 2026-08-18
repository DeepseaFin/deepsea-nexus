import { cookies, headers } from "next/headers";
import { InstitutionStatus } from "@/lib/institution/constants/InstitutionStatus";
import { InstitutionType } from "@/lib/institution/constants/InstitutionType";
import { createInstitutionalDigitalTwin, type InstitutionalDigitalTwin } from "@/lib/runtime/InstitutionalDigitalTwin";
import { resolveServerRuntimeAuthContext, type RuntimeAuthCookieAdapter } from "@/lib/supabase/runtimeAuth";
import { createInstitutionRuntimeComposition } from "@/lib/application/InstitutionRuntimeComposition";
import { createInstitutionContextSummaryBuilder } from "@/lib/workspaces/InstitutionContextSummary";
import {
  createBusinessContext,
  parseBusinessContext,
  workflowContextRepository,
  type BusinessContext,
  type CustomerOnboardingWorkflowInput,
  type WorkflowContext,
  type WorkflowContextServices,
} from "@/lib/workflows/WorkflowContext";
import { WorkflowRunState } from "@/lib/workflows/WorkflowExecutionState";
import { WorkflowStep } from "@/lib/workflows/WorkflowStep";
import { OpportunityLifecycle } from "@/lib/workflows/WorkflowTransition";
import RelationshipIntelligenceWorkspace from "@/components/atlas/relationship-intelligence/RelationshipIntelligenceWorkspace";
import { createRelationshipIntelligenceWorkspaceState } from "@/src/capabilities/relationship-intelligence/services/RelationshipIntelligenceWorkspaceAssembler";

type RelationshipIntelligencePageProps = {
  readonly searchParams?: Promise<{
    businessContext?: string;
    workflowId?: string;
  }>;
};

async function createCookieAdapter(): Promise<RuntimeAuthCookieAdapter> {
  const cookieStore = await cookies();

  return {
    get(name: string): string | undefined {
      return cookieStore.get(name)?.value;
    },
  };
}

function resolveBusinessContext(workflowId: string | undefined): BusinessContext | undefined {
  if (workflowId) {
    const byWorkflowId = workflowContextRepository.findByWorkflowId(workflowId);
    if (byWorkflowId) {
      return byWorkflowId;
    }
  }

  const [latest] = workflowContextRepository.list();
  return latest;
}

function createLiveWorkflowContext(input: { readonly workflowId: string }): WorkflowContext {
  return {
    workflowId: input.workflowId,
    executionId: `exec-${input.workflowId}`,
    currentStep: WorkflowStep.InstitutionIntelligence,
    services: {} as WorkflowContextServices,
    input: {} as CustomerOnboardingWorkflowInput,
  } as WorkflowContext;
}

function createLiveInstitutionContext(input: {
  readonly runtime: Awaited<ReturnType<typeof resolveServerRuntimeAuthContext>>;
  readonly businessContext: BusinessContext;
  readonly workflowId: string;
  readonly timestamp: string;
}) {
  const runtimeComposition = createInstitutionRuntimeComposition();

  return runtimeComposition.facade.provideInstitutionContext({
    institution: {
      identity: {
        institutionId: input.businessContext.institutionId,
        legalName: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.email ?? input.businessContext.institutionId,
        displayName: input.runtime.identity.identity.displayName ?? input.runtime.identity.identity.email ?? input.businessContext.institutionId,
        institutionType: InstitutionType.Corporate,
        jurisdiction: (input.runtime.identity.identity.metadata.jurisdiction as string | undefined) ?? "Live Runtime",
        registrationNumber: input.workflowId,
      },
      status: input.runtime.session.isAuthenticated ? InstitutionStatus.Active : InstitutionStatus.Draft,
      profile: {
        legalForm: input.runtime.identity.identity.memberships[0] ?? "Relationship Runtime",
        businessActivity: `Live relationship explorer for ${input.businessContext.opportunityId}`,
        establishedOn: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
        references: {
          businessPassportId: input.businessContext.opportunityId,
          timelineId: input.businessContext.workflowId,
          journeyId: input.businessContext.workflowId,
          evidenceIds: [input.businessContext.opportunityId],
          knowledgeIds: [input.businessContext.workflowId],
        },
      },
      metadata: {
        createdAt: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
        createdBy: input.runtime.identity.identity.identityId,
        updatedAt: input.timestamp,
        updatedBy: input.runtime.identity.identity.identityId,
        source: "runtime-auth",
      },
    },
    commercialSummary: {
      opportunityId: input.businessContext.opportunityId,
      product: "Relationship Intelligence",
      indicativeAmount: input.businessContext.receivableId ? `Receivable ${input.businessContext.receivableId}` : `Opportunity ${input.businessContext.opportunityId}`,
      indicativeTenor: input.businessContext.opportunityLifecycle,
      stage: input.businessContext.opportunityLifecycle,
      readyForApproval: input.businessContext.opportunityLifecycle === OpportunityLifecycle.APPROVED,
    },
    workflowExecutionState: {
      workflowId: input.workflowId,
      executionId: `exec-${input.workflowId}`,
      runState: WorkflowRunState.Completed,
      currentStep: WorkflowStep.InstitutionIntelligence,
      completedSteps: [WorkflowStep.InstitutionIntelligence],
      pendingSteps: [],
      startedAt: input.runtime.session.snapshot.metadata.issuedAt ?? input.timestamp,
      completedAt: input.timestamp,
      lastEventAt: input.timestamp,
    },
    totalWorkflowSteps: 1,
    assembledAt: input.timestamp,
  });
}

export default async function RelationshipIntelligencePage({ searchParams }: RelationshipIntelligencePageProps) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const requestCookies = await createCookieAdapter();
  const runtime = await resolveServerRuntimeAuthContext({
    url: "http://localhost/atlas/relationship-intelligence",
    method: "GET",
    pathname: "/atlas/relationship-intelligence",
    headers: requestHeaders,
    searchParams: new URLSearchParams(params.workflowId ? { workflowId: params.workflowId } : {}),
    cookies: requestCookies,
  });

  const parsedBusinessContext = parseBusinessContext(params.businessContext);
  const repositoryBusinessContext = resolveBusinessContext(params.workflowId);
  const businessContext = repositoryBusinessContext ?? parsedBusinessContext ?? createBusinessContext({
    institutionId: runtime.identity.identity.identityId,
    opportunityId: params.workflowId ? `OPP-${params.workflowId}` : `OPP-${runtime.identity.identity.identityId}`,
    workflowId: params.workflowId ?? `REL-${runtime.identity.identity.identityId}`,
    opportunityLifecycle: OpportunityLifecycle.UNDER_REVIEW,
    currentOwner: runtime.identity.identity.displayName ?? runtime.identity.identity.identityId,
    currentWorkspace: "executive",
  });

  if (parsedBusinessContext && !repositoryBusinessContext) {
    workflowContextRepository.save(parsedBusinessContext);
  }

  if (!repositoryBusinessContext) {
    workflowContextRepository.save(businessContext);
  }

  const timestamp = runtime.session.snapshot.metadata.lastRefreshedAt
    ?? runtime.session.snapshot.metadata.issuedAt
    ?? new Date().toISOString();
  const workflowId = businessContext.workflowId;
  const institutionContext = createLiveInstitutionContext({
    runtime,
    businessContext,
    workflowId,
    timestamp,
  });
  const summary = createInstitutionContextSummaryBuilder().build(institutionContext);
  const workflow = createLiveWorkflowContext({
    workflowId,
  });
  const digitalTwin: InstitutionalDigitalTwin = createInstitutionalDigitalTwin({
    authentication: runtime,
    workflow,
    institutionContext,
  });

  const workspaceState = createRelationshipIntelligenceWorkspaceState({
    runtime,
    digitalTwin,
    institutionContext,
    summary,
    businessContext,
    timestamp,
  });

  return (
    <RelationshipIntelligenceWorkspace
      dataset={workspaceState.dataset}
      statusMessage={workspaceState.status}
      workspaceSummary={workspaceState.workspaceSummary}
      timelineRows={workspaceState.timelineRows}
    />
  );
}