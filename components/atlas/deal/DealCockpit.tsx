import FinancialSummary from "./FinancialSummary";
import DealOverview from "./DealOverview";
import DealHeader from "./DealHeader";
import DealKPIs from "./DealKPIs";
import DealTabs from "./DealTabs";

export default function DealCockpit() {
  return (
    <div className="space-y-8">

      <DealHeader />

      <DealKPIs />

      <DealTabs />
      <DealOverview />
      <FinancialSummary />

    </div>
  );
}