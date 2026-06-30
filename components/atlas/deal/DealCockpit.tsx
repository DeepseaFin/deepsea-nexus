import FinancialSummary from "./FinancialSummary";
import DealOverview from "./DealOverview";
import DealHeader from "./DealHeader";
import DealKPIs from "./DealKPIs";
import DealTabs from "./DealTabs";
import PricingEditor from "./PricingEditor";
import DealWorkspace from "@/components/atlas/workspace/DealWorkspace";

export default function DealCockpit() {
  return (
    <div className="space-y-8">

      <DealHeader />

      <DealKPIs />

      <DealTabs />
      <DealWorkspace />
      <PricingEditor />
      <DealOverview />
      <FinancialSummary />

    </div>
  );
}