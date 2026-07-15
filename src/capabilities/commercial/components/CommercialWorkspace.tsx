"use client";

import EmptyState from "@/components/atlas/design-system/EmptyState";
import WorkflowTimelinePanel from "@/components/atlas/workflows/WorkflowTimelinePanel";
import {
  createBusinessContext,
  serializeBusinessContext,
  workflowContextRepository,
} from "@/lib/workflows/WorkflowContext";
import { buildMockWorkflowEvents } from "@/lib/workflows/WorkflowTimeline";
import {
  OpportunityLifecycle,
  transitionOpportunityLifecycle,
} from "@/lib/workflows/WorkflowTransition";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import CommercialCompletion from "@/src/capabilities/commercial/components/CommercialCompletion";
import CommercialFooter from "@/src/capabilities/commercial/components/CommercialFooter";
import CommercialHeader from "@/src/capabilities/commercial/components/CommercialHeader";
import CommercialProgress from "@/src/capabilities/commercial/components/CommercialProgress";
import CommercialSidebar from "@/src/capabilities/commercial/components/CommercialSidebar";
import InstitutionSummaryCard from "@/src/capabilities/commercial/components/InstitutionSummaryCard";
import OpportunityForm from "@/src/capabilities/commercial/components/OpportunityForm";
import PricingSummary from "@/src/capabilities/commercial/components/PricingSummary";
import ReceivableDetailsForm from "@/src/capabilities/commercial/components/ReceivableDetailsForm";
import TermSheetPreview from "@/src/capabilities/commercial/components/TermSheetPreview";
import { useCommercialWorkflow } from "@/src/capabilities/commercial/hooks/useCommercialWorkflow";
import type { CommercialWorkflowState } from "@/src/capabilities/commercial/types/CommercialWorkflowState";

type CommercialWorkspaceProps = {
  readonly initialState: Omit<CommercialWorkflowState, "currentStepId" | "steps">;
};

export default function CommercialWorkspace({ initialState }: CommercialWorkspaceProps) {
  const router = useRouter();
  const {
    state,
    isFirstStep,
    isLastStep,
    goToStep,
    goToNext,
    goToPrevious,
  } = useCommercialWorkflow({ initialState });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const isWorkflowStateValid = useMemo(() => {
    if (!state.workflowId.trim()) return false;
    if (!state.institutionName.trim()) return false;
    if (!state.businessPassport.registrationNumber.trim()) return false;
    if (!state.opportunity.opportunityId.trim()) return false;
    if (!state.opportunity.relationshipManager.trim()) return false;
    return true;
  }, [
    state.businessPassport.registrationNumber,
    state.institutionName,
    state.opportunity.opportunityId,
    state.opportunity.relationshipManager,
    state.workflowId,
  ]);

  if (!state.steps.length) {
    return (
      <div className="min-h-screen p-6 sm:p-8">
        <div className="mx-auto max-w-5xl">
          <EmptyState
            title="Commercial workflow is empty"
            message="No workflow steps are available right now. Refresh the workspace and try again."
          />
        </div>
      </div>
    );
  }

  const currentStep = state.steps.find((step) => step.id === state.currentStepId) ?? state.steps[0];
  const resolvedIndex = state.steps.findIndex((step) => step.id === state.currentStepId);
  const currentIndex = resolvedIndex < 0 ? 0 : resolvedIndex;
  const workflowEvents = buildMockWorkflowEvents({
    institutionName: state.institutionName,
    opportunityReference: state.opportunity.opportunityId,
    fundingAmount: state.opportunity.targetAmount,
    submittedBy: state.opportunity.relationshipManager,
  });

  const handleSubmitForApproval = (): void => {
    if (isSubmitting) {
      return;
    }

    if (!isWorkflowStateValid) {
      setValidationMessage("Unable to submit: required institution or opportunity fields are missing.");
      return;
    }

    setValidationMessage(null);
    setIsSubmitting(true);

    const submissionDate = new Date().toISOString();
    try {
      const submittedLifecycle = transitionOpportunityLifecycle(
        state.opportunity.lifecycleStatus,
        OpportunityLifecycle.SUBMITTED,
      );

      const businessContext = createBusinessContext({
        institutionId: state.businessPassport.registrationNumber,
        opportunityId: state.opportunity.opportunityId,
        workflowId: state.workflowId,
        opportunityLifecycle: submittedLifecycle,
        currentOwner: state.opportunity.relationshipManager,
        currentWorkspace: "commercial",
      });

      workflowContextRepository.save(businessContext);

      const params = new URLSearchParams({
        businessContext: serializeBusinessContext(businessContext),
        workflowId: businessContext.workflowId,
        institutionName: state.institutionName,
        opportunityId: state.opportunity.opportunityId,
        product: state.opportunity.product,
        targetAmount: state.opportunity.targetAmount,
        tenor: state.opportunity.tenor,
        currentStatus: submittedLifecycle,
        submittedBy: state.opportunity.relationshipManager,
        submissionDate,
      });

      setFeedbackMessage("Submission successful. Routing to Executive workspace...");
      router.push(`/executive?${params.toString()}`);
    } catch {
      setValidationMessage("Unable to submit due to an invalid lifecycle transition.");
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep.id) {
      case "institution_summary":
        return (
          <InstitutionSummaryCard
            businessPassport={state.businessPassport}
          />
        );
      case "create_opportunity":
        return <OpportunityForm opportunity={state.opportunity} />;
      case "receivable_details":
        return <ReceivableDetailsForm receivable={state.receivable} />;
      case "indicative_pricing":
        return <PricingSummary pricing={state.pricing} />;
      case "term_sheet_preview":
        return <TermSheetPreview termSheet={state.termSheet} />;
      case "ready_for_approval":
      default:
        return (
          <CommercialCompletion
            onSubmitForApproval={handleSubmitForApproval}
            isSubmitting={isSubmitting}
            feedbackMessage={feedbackMessage ?? undefined}
            validationMessage={validationMessage ?? undefined}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.45),transparent_40%),linear-gradient(180deg,#020617_0%,#020617_45%,#030712_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1920px] space-y-4 pb-10">
        <CommercialHeader
          workflowId={state.workflowId}
          institutionName={state.institutionName}
          currentStep={currentStep}
        />

        <div className="grid gap-3 xl:grid-cols-[280px_minmax(0,1fr)]">
          <CommercialSidebar
            steps={state.steps}
            currentStepId={state.currentStepId}
            onSelect={goToStep}
          />

          <main className="space-y-3">
            <CommercialProgress steps={state.steps} />
            {renderCurrentStep()}
            <CommercialFooter
              currentStepIndex={currentIndex}
              totalSteps={state.steps.length}
              isFirstStep={isFirstStep}
              isLastStep={isLastStep}
              isProcessing={isSubmitting}
              onPrevious={goToPrevious}
              onNext={goToNext}
            />
            <WorkflowTimelinePanel events={workflowEvents} compact title="Workflow Timeline" />
          </main>
        </div>
      </div>
    </div>
  );
}
