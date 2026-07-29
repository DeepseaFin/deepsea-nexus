import ProductHome from "@/components/product/home/ProductHome";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";

export default function DashboardPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <ProductHome />
      <CustomerJourneyNavigator currentStep="dashboard" />
    </div>
  );
}
