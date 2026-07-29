import ProductHome from "@/components/product/home/ProductHome";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";

export default function ProductHomePage() {
  return (
    <JourneyScreen>
      <ProductHome
        welcome={{
          greeting: "Welcome",
          headline: "Deepsea Nexus Product Home",
          summary:
            "Start in a single operational view, then move into dashboard controls, customer context, and the Business Passport workspace.",
          context: "Journey context: Website / Login / Product Home",
          chips: ["Institutional", "Connected Journey", "State-Aware"],
          primaryActionLabel: "",
          secondaryActionLabel: "",
        }}
      />
      <CustomerJourneyNavigator currentStep="product-home" />
    </JourneyScreen>
  );
}
