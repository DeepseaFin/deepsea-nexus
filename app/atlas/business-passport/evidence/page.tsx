import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import EvidenceSummary from "@/components/customer/passport/EvidenceSummary";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";
import PassportTimeline from "@/components/customer/passport/PassportTimeline";

export default function PassportEvidencePage() {
  return (
    <JourneyScreen>
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Evidence"
        summary="Validated source evidence ensures trust, explainability, and readiness for downstream decisions."
        main={
          <EvidenceSummary
            items={[
              { id: "ev-1", category: "KYC Identity Set", status: "verified", updated: "2 hours ago" },
              { id: "ev-2", category: "UBO Verification", status: "review", updated: "Today" },
              { id: "ev-3", category: "Banking Evidence", status: "verified", updated: "1 day ago" },
              { id: "ev-4", category: "Financial Evidence", status: "missing", updated: "Pending" },
            ]}
          />
        }
        side={
          <PassportTimeline
            entries={[
              {
                id: "ev-t-1",
                title: "Evidence intake completed",
                detail: "Core identity and legal records were attached to the passport timeline.",
                date: "22 Jul 2026",
                state: "completed",
              },
              {
                id: "ev-t-2",
                title: "Extended verification",
                detail: "Enhanced checks running for cross-jurisdiction ownership references.",
                date: "In progress",
                state: "active",
              },
            ]}
          />
        }
      />
      <CustomerJourneyNavigator currentStep="evidence" />
    </JourneyScreen>
  );
}
