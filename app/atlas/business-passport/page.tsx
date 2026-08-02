import BusinessPassportWorkspace from "@/components/customer/passport/BusinessPassportWorkspace";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business Passport | Deepsea Nexus",
  description: "Institution identity and readiness workspace for relationship, evidence, workflow, and decision support.",
};

export default function BusinessPassportPage() {
  return (
    <JourneyScreen>
      <BusinessPassportWorkspace currentJourneyStep="business-passport" />
    </JourneyScreen>
  );
}
