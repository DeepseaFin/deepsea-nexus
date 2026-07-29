import ProductHome from "@/components/product/home/ProductHome";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";

export default function ProductHomePage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <ProductHome
        welcome={{
          greeting: "Welcome",
          headline: "Deepsea Nexus Product Home",
          summary:
            "Start in a single operational view, then move into dashboard controls, customer context, and the Business Passport workspace.",
          context: "Journey context: Website / Login / Product Home",
          chips: ["Institutional", "Connected Journey", "State-Aware"],
          primaryActionLabel: "Open Dashboard",
          secondaryActionLabel: "Continue to Clients",
        }}
      />
      <CustomerJourneyNavigator currentStep="product-home" />
    </div>
  );
}
