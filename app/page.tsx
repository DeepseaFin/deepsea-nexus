import AtlasSection from "@/components/marketing/home/AtlasSection";
import BusinessPassportSection from "@/components/marketing/home/BusinessPassportSection";
import DnosSection from "@/components/marketing/home/DnosSection";
import EnterpriseCapabilitiesSection from "@/components/marketing/home/EnterpriseCapabilitiesSection";
import EnterpriseIntelligenceSection from "@/components/marketing/home/EnterpriseIntelligenceSection";
import FinalCtaSection from "@/components/marketing/home/FinalCtaSection";
import HomeHeroSection from "@/components/marketing/home/HomeHeroSection";
import IndustryChallengeSection from "@/components/marketing/home/IndustryChallengeSection";
import MeetDeepseaNexusSection from "@/components/marketing/home/MeetDeepseaNexusSection";
import SecurityGovernanceSection from "@/components/marketing/home/SecurityGovernanceSection";

export default function HomePage() {
  return (
    <div className="space-y-10 lg:space-y-12">
      <HomeHeroSection />
      <IndustryChallengeSection />
      <MeetDeepseaNexusSection />
      <AtlasSection />
      <DnosSection />
      <BusinessPassportSection />
      <EnterpriseIntelligenceSection />
      <EnterpriseCapabilitiesSection />
      <SecurityGovernanceSection />
      <FinalCtaSection />
    </div>
  );
}
