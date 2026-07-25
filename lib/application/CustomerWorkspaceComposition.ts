import type { PresentationContext } from "@/lib/presentation/PresentationContext";
import type { PresentationRegistry } from "@/lib/presentation/PresentationRegistry";
import type { PresentationResult } from "@/lib/presentation/PresentationResult";
import type { AiInsightsPresentationViewModel } from "@/lib/presentation/presenters/AiInsightsPresenter";
import type { ApprovalPresentationViewModel } from "@/lib/presentation/presenters/ApprovalPresenter";
import type { BusinessPassportPresentationViewModel } from "@/lib/presentation/presenters/BusinessPassportPresenter";
import type { DocumentsPresentationViewModel } from "@/lib/presentation/presenters/DocumentsPresenter";
import type { FundingPresentationViewModel } from "@/lib/presentation/presenters/FundingPresenter";
import type { InstitutionalTimelinePresentationViewModel } from "@/lib/presentation/presenters/InstitutionalTimelinePresenter";
import type { RelationshipPresentationViewModel } from "@/lib/presentation/presenters/RelationshipPresenter";
import type { WorkflowPresentationViewModel } from "@/lib/presentation/presenters/WorkflowPresenter";
import {
  composeWorkspaceIntelligence,
  type WorkspaceIntelligenceModel,
  type WorkspaceIntelligenceSource,
} from "@/lib/application/WorkspaceIntelligence";
import { defaultPresentationRegistry } from "@/lib/presentation/PresentationRegistry";

export interface CustomerWorkspaceCompositionContext {
  readonly presentationRegistry?: PresentationRegistry;
  readonly presentationContext?: PresentationContext;
}

export interface CustomerWorkspaceComposition {
  resolveBusinessPassportViewModel: (
    projection: unknown,
  ) => PresentationResult<BusinessPassportPresentationViewModel>;
  resolveDocumentsViewModel: (
    projection: unknown,
  ) => PresentationResult<DocumentsPresentationViewModel>;
  resolveRelationshipViewModel: (
    projection: unknown,
  ) => PresentationResult<RelationshipPresentationViewModel>;
  resolveApprovalViewModel: (
    projection: unknown,
  ) => PresentationResult<ApprovalPresentationViewModel>;
  resolveFundingViewModel: (
    projection: unknown,
  ) => PresentationResult<FundingPresentationViewModel>;
  resolveAiInsightsViewModel: (
    projection: unknown,
  ) => PresentationResult<AiInsightsPresentationViewModel>;
  resolveInstitutionalTimelineViewModel: (
    projection: unknown,
  ) => PresentationResult<InstitutionalTimelinePresentationViewModel>;
  resolveWorkflowViewModel: (
    projection: unknown,
  ) => PresentationResult<WorkflowPresentationViewModel>;
  composeWorkspaceIntelligence: (
    source: WorkspaceIntelligenceSource,
  ) => WorkspaceIntelligenceModel;
}

export function createCustomerWorkspaceComposition(
  context: CustomerWorkspaceCompositionContext = {},
): CustomerWorkspaceComposition {
  const presentationRegistry = context.presentationRegistry ?? defaultPresentationRegistry;

  const toPresentationContext = (capability: PresentationContext["capability"]): PresentationContext => ({
    ...(context.presentationContext ?? {}),
    capability,
  });

  return {
    resolveBusinessPassportViewModel(
      projection: unknown,
    ): PresentationResult<BusinessPassportPresentationViewModel> {
      const presentationContext = toPresentationContext("business-passport");
      const presenter = presentationRegistry.getByCapability("business-passport").find((adapter) => adapter.id === "presentation.business-passport.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Business Passport presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Business Passport projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<BusinessPassportPresentationViewModel>;
    },
    resolveDocumentsViewModel(
      projection: unknown,
    ): PresentationResult<DocumentsPresentationViewModel> {
      const presentationContext = toPresentationContext("documents");
      const presenter = presentationRegistry.getByCapability("documents").find((adapter) => adapter.id === "presentation.documents.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Documents presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Documents projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<DocumentsPresentationViewModel>;
    },
    resolveRelationshipViewModel(
      projection: unknown,
    ): PresentationResult<RelationshipPresentationViewModel> {
      const presentationContext = toPresentationContext("relationship");
      const presenter = presentationRegistry.getByCapability("relationship").find((adapter) => adapter.id === "presentation.relationship.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Relationship presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Relationship projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<RelationshipPresentationViewModel>;
    },
    resolveApprovalViewModel(
      projection: unknown,
    ): PresentationResult<ApprovalPresentationViewModel> {
      const presentationContext = toPresentationContext("approval");
      const presenter = presentationRegistry.getByCapability("approval").find((adapter) => adapter.id === "presentation.approval.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Approval presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Approval projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<ApprovalPresentationViewModel>;
    },
    resolveFundingViewModel(
      projection: unknown,
    ): PresentationResult<FundingPresentationViewModel> {
      const presentationContext = toPresentationContext("funding");
      const presenter = presentationRegistry.getByCapability("funding").find((adapter) => adapter.id === "presentation.funding.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Funding presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Funding projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<FundingPresentationViewModel>;
    },
    resolveAiInsightsViewModel(
      projection: unknown,
    ): PresentationResult<AiInsightsPresentationViewModel> {
      const presentationContext = toPresentationContext("ai-insights");
      const presenter = presentationRegistry.getByCapability("ai-insights").find((adapter) => adapter.id === "presentation.ai-insights.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "AI Insights presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "AI Insights projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<AiInsightsPresentationViewModel>;
    },
    resolveInstitutionalTimelineViewModel(
      projection: unknown,
    ): PresentationResult<InstitutionalTimelinePresentationViewModel> {
      const presentationContext = toPresentationContext("timeline");
      const presenter = presentationRegistry.getByCapability("timeline").find((adapter) => adapter.id === "presentation.institutional-timeline.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Institutional Timeline presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Institutional Timeline projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<InstitutionalTimelinePresentationViewModel>;
    },
    resolveWorkflowViewModel(
      projection: unknown,
    ): PresentationResult<WorkflowPresentationViewModel> {
      const presentationContext = toPresentationContext("workflow");
      const presenter = presentationRegistry.getByCapability("workflow").find((adapter) => adapter.id === "presentation.workflow.presenter");

      if (!presenter) {
        return {
          ok: false,
          reason: "Workflow presenter is not registered.",
        };
      }

      if (!presenter.canAdapt || !presenter.canAdapt(projection, presentationContext)) {
        return {
          ok: false,
          reason: "Workflow projection cannot be adapted.",
        };
      }

      const result = presenter.adapt(projection as never, presentationContext);
      return result as PresentationResult<WorkflowPresentationViewModel>;
    },
    composeWorkspaceIntelligence(source: WorkspaceIntelligenceSource): WorkspaceIntelligenceModel {
      return composeWorkspaceIntelligence(source);
    },
  };
}
