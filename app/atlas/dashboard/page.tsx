import ProductHome from "@/components/product/home/ProductHome";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";

export default function DashboardPage() {
  return (
    <JourneyScreen>
      <ProductHome
        welcome={{
          greeting: "Operational View",
          headline: "ATLAS Dashboard",
          summary: "Portfolio and execution overview in the connected customer journey.",
          context: "Journey context: ATLAS / Dashboard",
          chips: ["Institutional", "Portfolio", "Execution"],
          primaryActionLabel: "",
          secondaryActionLabel: "",
        }}
      />
      <CustomerJourneyNavigator currentStep="atlas" />
    </JourneyScreen>
  );
}
