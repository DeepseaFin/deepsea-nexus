import BusinessPassportWorkspace from "@/components/customer/passport/BusinessPassportWorkspace";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";

export default function BusinessPassportPage() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <BusinessPassportWorkspace />
      <CustomerJourneyNavigator currentStep="business-passport" />
    </div>
  );
}
