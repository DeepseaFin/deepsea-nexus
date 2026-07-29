import BusinessPassportWorkspace from "@/components/customer/passport/BusinessPassportWorkspace";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";

export default function BusinessPassportPage() {
  return (
    <JourneyScreen>
      <BusinessPassportWorkspace currentJourneyStep="business-passport" />
    </JourneyScreen>
  );
}
