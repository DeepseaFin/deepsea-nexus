import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import WorkflowSummary from "@/components/customer/passport/WorkflowSummary";

export default function PassportWorkflowPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Workflow"
        summary="Customer lifecycle progression across onboarding, credit, legal, approvals, and release checkpoints."
        main={
          <WorkflowSummary
            stages={[
              { id: "wf-1", stage: "Onboarding Review", owner: "Operations", eta: "Today", status: "on_track" },
              { id: "wf-2", stage: "Credit Validation", owner: "Credit", eta: "Tomorrow", status: "attention" },
              { id: "wf-3", stage: "Legal Structuring", owner: "Legal", eta: "2 days", status: "on_track" },
              { id: "wf-4", stage: "Approval Decision", owner: "Committee", eta: "3 days", status: "blocked" },
            ]}
          />
        }
      />
      <CustomerJourneyNavigator currentStep="workflow" />
    </div>
  );
}
