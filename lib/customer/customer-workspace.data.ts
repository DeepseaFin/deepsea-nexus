import { createCustomerWorkspaceComposition, type CustomerWorkspaceComposition } from "@/lib/application/CustomerWorkspaceComposition";
import type { BusinessPassportProjection } from "@/lib/business-passport/projections/BusinessPassportProjection";
import type { BusinessPassportRepository } from "@/lib/business-passport/repositories/BusinessPassportRepository";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type { WorkspaceIntelligenceModel } from "@/lib/application/WorkspaceIntelligence";
import type { ApprovalPanelModel } from "@/lib/customer/approval/approval-panel.types";
import type { PassportPanelModel } from "@/lib/customer/business-passport/passport-panel.types";
import type {
  CustomerWorkspaceRepositoryAdapters,
  CustomerWorkspaceRepositoryContext,
} from "@/lib/customer/customer-workspace.repositories";
import type { CustomerWorkspaceTabId } from "@/lib/customer/customer-workspace.types";
import type { DocumentsPanelModel } from "@/lib/customer/documents/documents-panel.types";
import type { FundingPanelModel } from "@/lib/customer/funding/funding-panel.types";
import type { AiInsightsModel } from "@/lib/customer/insights/insights.types";
import type { RelationshipPanelModel } from "@/lib/customer/relationship/relationship-panel.types";
import type { InstitutionalTimelineModel } from "@/lib/customer/timeline/timeline.types";
import type { WorkflowPanelModel } from "@/lib/customer/workflow/workflow.types";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";

export interface CustomerWorkspaceSourceData {
  readonly businessPassportProjection?: unknown;
  readonly documentsProjection?: unknown;
  readonly relationshipProjection?: unknown;
  readonly approvalProjection?: unknown;
  readonly fundingProjection?: unknown;
  readonly businessPassportPanelModel?: PassportPanelModel;
  readonly documentsPanelModel?: DocumentsPanelModel;
  readonly relationshipPanelModel?: RelationshipPanelModel;
  readonly approvalPanelModel?: ApprovalPanelModel;
  readonly fundingPanelModel?: FundingPanelModel;
  readonly insightsPanelModel?: AiInsightsModel;
  readonly institutionalTimelineModel?: InstitutionalTimelineModel;
  readonly workflowPanelModel?: WorkflowPanelModel;
}

export type CustomerWorkspaceResolvedData = CustomerWorkspaceSourceData;

export interface CustomerWorkspaceDataComposition {
  readonly resolved: CustomerWorkspaceResolvedData;
  readonly viewModels: {
    readonly businessPassport: BusinessPassportPresentationViewModel | null;
    readonly documents: DocumentsPresentationViewModel | null;
    readonly relationship: RelationshipPresentationViewModel | null;
    readonly approvals: ApprovalPresentationViewModel | null;
    readonly funding: FundingPresentationViewModel | null;
    readonly aiInsights: AiInsightsPresentationViewModel | null;
    readonly timeline: InstitutionalTimelinePresentationViewModel | null;
    readonly workflow: WorkflowPresentationViewModel | null;
  };
  readonly workspaceIntelligence: WorkspaceIntelligenceModel;
  readonly errorByTabId: Partial<Record<CustomerWorkspaceTabId, string>>;
}

export interface CustomerWorkspaceDataCompositionInput {
  readonly customerId?: string;
  readonly customerName: string;
  readonly source: CustomerWorkspaceSourceData;
  readonly composition?: CustomerWorkspaceComposition;
}

export interface CustomerWorkspaceDataLoadInput extends CustomerWorkspaceDataCompositionInput {
  readonly repositoryAdapters?: CustomerWorkspaceRepositoryAdapters;
  readonly repositoryContext?: CustomerWorkspaceRepositoryContext;
  readonly businessPassportRepository?: BusinessPassportRepositoryBinding;
}

export interface BusinessPassportRepositoryBinding {
  readonly repository: BusinessPassportRepository;
  readonly resolvePassportId?: (context: CustomerWorkspaceRepositoryContext) => PassportId | string | null | undefined;
  readonly toProjection?: (passport: BusinessPassport) => BusinessPassportProjection;
}

type LoaderEntry = {
  readonly key: keyof CustomerWorkspaceResolvedData;
  readonly tabId: CustomerWorkspaceTabId;
  readonly load: ((context: CustomerWorkspaceRepositoryContext) => Promise<unknown> | unknown) | undefined;
};

function resolvePresentationError(reason: string | undefined): string | undefined {
  if (!reason) {
    return undefined;
  }

  return reason;
}

function toRepositoryLoaderEntries(adapters?: CustomerWorkspaceRepositoryAdapters): readonly LoaderEntry[] {
  if (!adapters) {
    return [];
  }

  return [
    { key: "businessPassportProjection", tabId: "business-passport", load: adapters.businessPassportProjection },
    { key: "documentsProjection", tabId: "documents", load: adapters.documentsProjection },
    { key: "relationshipProjection", tabId: "relationship", load: adapters.relationshipProjection },
    { key: "approvalProjection", tabId: "approvals", load: adapters.approvalProjection },
    { key: "fundingProjection", tabId: "funding", load: adapters.fundingProjection },
    { key: "businessPassportPanelModel", tabId: "business-passport", load: adapters.businessPassportPanelModel },
    { key: "documentsPanelModel", tabId: "documents", load: adapters.documentsPanelModel },
    { key: "relationshipPanelModel", tabId: "relationship", load: adapters.relationshipPanelModel },
    { key: "approvalPanelModel", tabId: "approvals", load: adapters.approvalPanelModel },
    { key: "fundingPanelModel", tabId: "funding", load: adapters.fundingPanelModel },
    { key: "insightsPanelModel", tabId: "ai-insights", load: adapters.insightsPanelModel },
    { key: "institutionalTimelineModel", tabId: "timeline", load: adapters.institutionalTimelineModel },
    { key: "workflowPanelModel", tabId: "overview", load: adapters.workflowPanelModel },
  ].filter((entry) => typeof entry.load === "function");
}

export function getCustomerWorkspaceRepositoryLoadingState(
  adapters?: CustomerWorkspaceRepositoryAdapters,
): Partial<Record<CustomerWorkspaceTabId, boolean>> {
  const loadingState: Partial<Record<CustomerWorkspaceTabId, boolean>> = {};

  for (const entry of toRepositoryLoaderEntries(adapters)) {
    loadingState[entry.tabId] = true;
  }

  return loadingState;
}

function toBusinessPassportProjection(passport: BusinessPassport): BusinessPassportProjection {
  return {
    passportId: passport.passportId,
    status: passport.status,
    lifecycle: passport.lifecycle,
    confidenceScore: passport.confidence.score,
    knowledgeDensityBand: passport.knowledgeDensity.band,
    institutionalPulseState: passport.institutionalPulse.state,
    maturityLevel: passport.maturity.level,
    updatedAt: passport.metadata.audit.updatedAt,
  };
}

function toPassportId(
  value: PassportId | string | null | undefined,
): PassportId | null {
  if (!value) {
    return null;
  }

  if (value instanceof PassportId) {
    return value;
  }

  try {
    return PassportId.fromString(value);
  } catch {
    return null;
  }
}

export function createBusinessPassportRepositoryBackedAdapters(
  binding: BusinessPassportRepositoryBinding,
): Pick<CustomerWorkspaceRepositoryAdapters, "businessPassportProjection"> {
  return {
    async businessPassportProjection(context: CustomerWorkspaceRepositoryContext): Promise<BusinessPassportProjection | undefined> {
      const resolvedPassportId = binding.resolvePassportId
        ? binding.resolvePassportId(context)
        : context.customerId;
      const passportId = toPassportId(resolvedPassportId);

      if (!passportId) {
        return undefined;
      }

      const passport = await binding.repository.findById(passportId);
      if (!passport) {
        return undefined;
      }

      return binding.toProjection ? binding.toProjection(passport) : toBusinessPassportProjection(passport);
    },
  };
}

export function composeCustomerWorkspaceRepositoryAdapters(input: {
  readonly repositoryAdapters?: CustomerWorkspaceRepositoryAdapters;
  readonly businessPassportRepository?: BusinessPassportRepositoryBinding;
}): CustomerWorkspaceRepositoryAdapters {
  const businessPassportRepositoryAdapters = input.businessPassportRepository
    ? createBusinessPassportRepositoryBackedAdapters(input.businessPassportRepository)
    : {};

  return {
    ...input.repositoryAdapters,
    ...businessPassportRepositoryAdapters,
  };
}

async function loadRepositoryData(
  adapters: CustomerWorkspaceRepositoryAdapters | undefined,
  context: CustomerWorkspaceRepositoryContext,
): Promise<{
  readonly resolved: Partial<CustomerWorkspaceResolvedData>;
  readonly errorByTabId: Partial<Record<CustomerWorkspaceTabId, string>>;
}> {
  const loaders = toRepositoryLoaderEntries(adapters);
  if (loaders.length === 0) {
    return {
      resolved: {},
      errorByTabId: {},
    };
  }

  const results = await Promise.all(
    loaders.map(async (loader) => {
      try {
        const value = await loader.load?.(context);
        return { key: loader.key, tabId: loader.tabId, value } as const;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Repository adapter failed to resolve data.";
        return { key: loader.key, tabId: loader.tabId, error: message } as const;
      }
    }),
  );

  const resolved: Partial<CustomerWorkspaceResolvedData> = {};
  const errorByTabId: Partial<Record<CustomerWorkspaceTabId, string>> = {};

  for (const result of results) {
    if ("error" in result) {
      errorByTabId[result.tabId] = result.error;
      continue;
    }

    if (typeof result.value !== "undefined") {
      (resolved as Record<string, unknown>)[result.key] = result.value;
    }
  }

  return {
    resolved,
    errorByTabId,
  };
}

function mergeResolvedData(
  source: CustomerWorkspaceSourceData,
  resolved: Partial<CustomerWorkspaceResolvedData>,
): CustomerWorkspaceResolvedData {
  return {
    businessPassportProjection: resolved.businessPassportProjection ?? source.businessPassportProjection,
    documentsProjection: resolved.documentsProjection ?? source.documentsProjection,
    relationshipProjection: resolved.relationshipProjection ?? source.relationshipProjection,
    approvalProjection: resolved.approvalProjection ?? source.approvalProjection,
    fundingProjection: resolved.fundingProjection ?? source.fundingProjection,
    businessPassportPanelModel: resolved.businessPassportPanelModel ?? source.businessPassportPanelModel,
    documentsPanelModel: resolved.documentsPanelModel ?? source.documentsPanelModel,
    relationshipPanelModel: resolved.relationshipPanelModel ?? source.relationshipPanelModel,
    approvalPanelModel: resolved.approvalPanelModel ?? source.approvalPanelModel,
    fundingPanelModel: resolved.fundingPanelModel ?? source.fundingPanelModel,
    insightsPanelModel: resolved.insightsPanelModel ?? source.insightsPanelModel,
    institutionalTimelineModel: resolved.institutionalTimelineModel ?? source.institutionalTimelineModel,
    workflowPanelModel: resolved.workflowPanelModel ?? source.workflowPanelModel,
  };
}

export function composeCustomerWorkspaceData(
  input: CustomerWorkspaceDataCompositionInput,
): CustomerWorkspaceDataComposition {
  const composition = input.composition ?? createCustomerWorkspaceComposition();
  const resolved = input.source;

  const businessPassportResult = resolved.businessPassportProjection
    ? composition.resolveBusinessPassportViewModel(resolved.businessPassportProjection)
    : null;
  const documentsInput = resolved.documentsProjection ?? resolved.documentsPanelModel;
  const documentsResult = documentsInput ? composition.resolveDocumentsViewModel(documentsInput) : null;
  const relationshipResult = resolved.relationshipProjection
    ? composition.resolveRelationshipViewModel(resolved.relationshipProjection)
    : null;
  const approvalResult = resolved.approvalProjection
    ? composition.resolveApprovalViewModel(resolved.approvalProjection)
    : null;
  const fundingInput = resolved.fundingProjection ?? resolved.fundingPanelModel;
  const fundingResult = fundingInput ? composition.resolveFundingViewModel(fundingInput) : null;
  const insightsResult = resolved.insightsPanelModel
    ? composition.resolveAiInsightsViewModel(resolved.insightsPanelModel)
    : null;
  const timelineResult = resolved.institutionalTimelineModel
    ? composition.resolveInstitutionalTimelineViewModel(resolved.institutionalTimelineModel)
    : null;
  const workflowResult = resolved.workflowPanelModel
    ? composition.resolveWorkflowViewModel(resolved.workflowPanelModel)
    : null;

  const viewModels = {
    businessPassport: businessPassportResult?.ok ? businessPassportResult.viewModel : null,
    documents: documentsResult?.ok ? documentsResult.viewModel : null,
    relationship: relationshipResult?.ok ? relationshipResult.viewModel : null,
    approvals: approvalResult?.ok ? approvalResult.viewModel : null,
    funding: fundingResult?.ok ? fundingResult.viewModel : null,
    aiInsights: insightsResult?.ok ? insightsResult.viewModel : null,
    timeline: timelineResult?.ok ? timelineResult.viewModel : null,
    workflow: workflowResult?.ok ? workflowResult.viewModel : null,
  };

  const workspaceIntelligence = composition.composeWorkspaceIntelligence({
    customer: {
      id: input.customerId,
      name: input.customerName,
    },
    businessPassport: viewModels.businessPassport,
    documents: viewModels.documents,
    relationship: viewModels.relationship,
    approvals: viewModels.approvals,
    funding: viewModels.funding,
    aiInsights: viewModels.aiInsights,
    timeline: viewModels.timeline,
    workflow: viewModels.workflow,
  });

  const errorByTabId: Partial<Record<CustomerWorkspaceTabId, string>> = {
    "business-passport": businessPassportResult && !businessPassportResult.ok
      ? resolvePresentationError(businessPassportResult.reason)
      : undefined,
    documents: documentsResult && !documentsResult.ok ? resolvePresentationError(documentsResult.reason) : undefined,
    relationship: relationshipResult && !relationshipResult.ok
      ? resolvePresentationError(relationshipResult.reason)
      : undefined,
    approvals: approvalResult && !approvalResult.ok ? resolvePresentationError(approvalResult.reason) : undefined,
    funding: fundingResult && !fundingResult.ok ? resolvePresentationError(fundingResult.reason) : undefined,
    "ai-insights": insightsResult && !insightsResult.ok ? resolvePresentationError(insightsResult.reason) : undefined,
    timeline: timelineResult && !timelineResult.ok ? resolvePresentationError(timelineResult.reason) : undefined,
    overview: workflowResult && !workflowResult.ok ? resolvePresentationError(workflowResult.reason) : undefined,
  };

  return {
    resolved,
    viewModels,
    workspaceIntelligence,
    errorByTabId,
  };
}

export async function loadCustomerWorkspaceData(
  input: CustomerWorkspaceDataLoadInput,
): Promise<CustomerWorkspaceDataComposition> {
  const repositoryContext: CustomerWorkspaceRepositoryContext = {
    customerId: input.repositoryContext?.customerId ?? input.customerId,
  };

  const repositoryAdapters = composeCustomerWorkspaceRepositoryAdapters({
    repositoryAdapters: input.repositoryAdapters,
    businessPassportRepository: input.businessPassportRepository,
  });

  const loaded = await loadRepositoryData(repositoryAdapters, repositoryContext);
  const resolved = mergeResolvedData(input.source, loaded.resolved);
  const composed = composeCustomerWorkspaceData({
    customerId: input.customerId,
    customerName: input.customerName,
    source: resolved,
    composition: input.composition,
  });

  const errorByTabId: Partial<Record<CustomerWorkspaceTabId, string>> = {
    ...loaded.errorByTabId,
    ...composed.errorByTabId,
  };

  return {
    ...composed,
    errorByTabId,
  };
}
