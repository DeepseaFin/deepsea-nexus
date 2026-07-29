import BusinessPassportStageFrame from "@/components/customer/passport/BusinessPassportStageFrame";
import BusinessIdentityCard from "@/components/customer/passport/BusinessIdentityCard";
import CustomerJourneyNavigator from "@/components/customer/passport/CustomerJourneyNavigator";
import JourneyScreen from "@/components/customer/passport/JourneyScreen";
import RelationshipHealthCard from "@/components/customer/passport/RelationshipHealthCard";

export default function PassportRelationshipWorkspacePage() {
  return (
    <JourneyScreen>
      <BusinessPassportStageFrame
        stageLabel="Business Passport"
        title="Relationship Workspace"
        summary="A consolidated relationship command surface anchored to customer identity, risk posture, and service continuity."
        main={
          <RelationshipHealthCard
            healthScore={89}
            posture="Stable"
            watchItems="2 Active"
            covenantState="Compliant"
          />
        }
        side={
          <BusinessIdentityCard
            registrationNumber="DXB-TR-849133"
            tradeLicense="TL-9982714"
            taxRegistration="TRN-100443219800003"
            incorporationDate="14 Feb 2018"
            sector="Industrial Trade and Distribution"
            riskBand="Moderate"
          />
        }
      />
      <CustomerJourneyNavigator currentStep="business-passport" />
    </JourneyScreen>
  );
}
