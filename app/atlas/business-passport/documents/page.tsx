import ActivitySummary from "@/components/customer/passport/ActivitySummary";
import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import EvidenceSummary from "@/components/customer/passport/EvidenceSummary";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";

export default function PassportDocumentsPage() {
  return (
    <JourneyScreen>
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Documents"
        summary="All customer-critical legal, compliance, and commercial artifacts in one institutional envelope."
        main={
          <EvidenceSummary
            items={[
              { id: "doc-1", category: "Corporate Charter Documents", status: "verified", updated: "1 day ago" },
              { id: "doc-2", category: "Facility Agreement Pack", status: "review", updated: "Today" },
              { id: "doc-3", category: "Security Documents", status: "verified", updated: "3 days ago" },
              { id: "doc-4", category: "Jurisdiction Opinions", status: "review", updated: "Today" },
            ]}
          />
        }
        side={
          <ActivitySummary
            items={[
              {
                id: "doc-act-1",
                title: "Legal packet synchronized",
                detail: "The latest version set was associated with the customer passport context.",
                time: "09:30",
              },
              {
                id: "doc-act-2",
                title: "Compliance review initiated",
                detail: "Jurisdiction and governance checks were queued for analyst validation.",
                time: "11:05",
              },
            ]}
          />
        }
      />
      <CustomerJourneyNavigator currentStep="documents" />
    </JourneyScreen>
  );
}
