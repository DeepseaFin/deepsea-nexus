import ActivitySummary from "@/components/customer/passport/ActivitySummary";
import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import PassportQuickActions from "@/components/customer/passport/QuickActions";

export default function PassportActivityPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Activity"
        summary="Recent customer actions, review outcomes, and operational follow-ups in one institutional activity stream."
        main={
          <ActivitySummary
            items={[
              {
                id: "ac-1",
                title: "Committee memo updated",
                detail: "Relationship and exposure notes aligned to current workflow posture.",
                time: "09:45",
              },
              {
                id: "ac-2",
                title: "Evidence exception raised",
                detail: "Additional proof requested for one compliance-sensitive document family.",
                time: "11:30",
              },
              {
                id: "ac-3",
                title: "Passport health recalculated",
                detail: "Composite customer health score refreshed from latest context signals.",
                time: "14:20",
              },
            ]}
          />
        }
        side={
          <PassportQuickActions
            actions={[
              { id: "act-q-1", label: "Open Business Passport", variant: "secondary" },
              { id: "act-q-2", label: "Request Review Follow-up", variant: "ghost" },
              { id: "act-q-3", label: "Prepare Next Stage Brief", variant: "primary" },
            ]}
          />
        }
      />
      <CustomerJourneyNavigator currentStep="activity" />
    </div>
  );
}
