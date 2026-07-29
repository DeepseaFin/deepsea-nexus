import ActivitySummary from "@/components/customer/passport/ActivitySummary";
import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import KnowledgeSnapshot from "@/components/customer/passport/KnowledgeSnapshot";

export default function PassportKnowledgePage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Knowledge"
        summary="Evidence-backed institutional knowledge assembled around one customer context for consistent decisions."
        main={
          <KnowledgeSnapshot
            signals={[
              {
                id: "kn-1",
                title: "Obligor consistency signal",
                detail: "Ownership, registration, and legal filings are coherent across known data sources.",
                confidence: 90,
              },
              {
                id: "kn-2",
                title: "Payment behavior interpretation",
                detail: "Recent repayment windows remain close to long-term observed customer behavior.",
                confidence: 84,
              },
              {
                id: "kn-3",
                title: "Document freshness signal",
                detail: "Most source artifacts are current for this review period; one filing is pending refresh.",
                confidence: 78,
              },
            ]}
          />
        }
        side={
          <ActivitySummary
            items={[
              {
                id: "kn-act-1",
                title: "Knowledge graph refreshed",
                detail: "Customer context graph rebuilt from current evidence package.",
                time: "10:20",
              },
              {
                id: "kn-act-2",
                title: "Analyst annotations captured",
                detail: "Narrative recommendations were saved into the knowledge review stream.",
                time: "12:40",
              },
            ]}
          />
        }
      />
      <CustomerJourneyNavigator currentStep="knowledge" />
    </div>
  );
}
