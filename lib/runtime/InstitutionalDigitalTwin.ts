import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { InstitutionHealth } from "@/lib/institution/health/domain/InstitutionHealth";
import type { InstitutionIntelligence } from "@/lib/institution/intelligence/domain/InstitutionIntelligence";
import type { InstitutionContext } from "@/lib/workspaces/InstitutionContext";
import type { WorkflowContext } from "@/lib/workflows/WorkflowContext";
import type { RuntimeAuthContext } from "@/lib/supabase/runtimeAuth";

// InstitutionalDigitalTwin is a runtime projection assembled from auth, workflow, and institution context.
// It is read-oriented and consumed by workspaces; it is not a second source of truth or a new domain model.
export interface InstitutionalDigitalTwin {
  readonly authentication: RuntimeAuthContext;
  readonly session: RuntimeAuthContext["session"];
  readonly protection: RuntimeAuthContext["protection"];
  readonly identity: RuntimeAuthContext["identity"];
  readonly permissions: RuntimeAuthContext["permissions"];
  readonly workflow: WorkflowContext;
  readonly institutionContext: InstitutionContext;
  readonly institution: InstitutionContext["institution"];
  readonly passport: InstitutionContext["passport"];
  readonly journey: InstitutionContext["journey"];
  readonly health: InstitutionContext["health"];
  readonly intelligence: InstitutionContext["intelligence"];
  readonly commercialSummary: InstitutionContext["commercialSummary"];
  readonly workflowStatus: InstitutionContext["workflowStatus"];
  readonly assembledAt: string;
}

export interface InstitutionalDigitalTwinInput {
  readonly authentication: RuntimeAuthContext;
  readonly workflow: WorkflowContext;
  readonly institutionContext: InstitutionContext;
}

function toHealthReference(context: InstitutionContext): InstitutionHealth | undefined {
  return context.health;
}

function toIntelligenceReference(context: InstitutionContext): InstitutionIntelligence | undefined {
  return context.intelligence;
}

function toPassportReference(context: InstitutionContext): BusinessPassport | undefined {
  return context.passport;
}

export function createInstitutionalDigitalTwin(
  input: InstitutionalDigitalTwinInput,
): InstitutionalDigitalTwin {
  const { authentication, workflow, institutionContext } = input;

  return Object.freeze({
    authentication,
    session: authentication.session,
    protection: authentication.protection,
    identity: authentication.identity,
    permissions: authentication.permissions,
    workflow,
    institutionContext,
    institution: institutionContext.institution,
    passport: toPassportReference(institutionContext),
    journey: institutionContext.journey,
    health: toHealthReference(institutionContext),
    intelligence: toIntelligenceReference(institutionContext),
    commercialSummary: institutionContext.commercialSummary,
    workflowStatus: institutionContext.workflowStatus,
    assembledAt: institutionContext.assembledAt,
  });
}