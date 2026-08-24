import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const COMPANY_VALUES = [
  {
    title: "Institutional Discipline",
    description:
      "We design for environments where governance quality and execution quality are inseparable from commercial outcomes.",
    detail: "Quality as a default",
  },
  {
    title: "Domain Fidelity",
    description:
      "Our products are grounded in operational realities of trade finance, receivables structuring, and relationship-led decision making.",
    detail: "Built by practitioners",
  },
  {
    title: "Architectural Clarity",
    description:
      "Clear module boundaries, immutable contracts, and registry-driven composition ensure the platform scales without losing coherence.",
    detail: "Engineered for scale",
  },
  {
    title: "Partnership Orientation",
    description:
      "We collaborate with institutions to map capabilities to operating models, rather than forcing one-size-fits-all transformation paths.",
    detail: "Co-built outcomes",
  },
  {
    title: "Evidence-Led Delivery",
    description:
      "Implementation progress is measured through concrete workflow throughput, governance readiness, and measurable operational lift.",
    detail: "Outcome accountability",
  },
  {
    title: "Long-Term Stewardship",
    description:
      "Deepsea Nexus is built to become a durable institutional layer that evolves with your product stack and regulatory landscape.",
    detail: "Strategic durability",
  },
] as const;

export default function CompanyPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Company"
        title="A Product and Engineering Team Focused on Institutional Finance"
        description="Deepsea Nexus combines domain expertise and software craftsmanship to modernize how institutions execute relationship-led finance operations."
        primaryCta={{ href: "/contact", label: "Connect With Our Team" }}
        secondaryCta={{ href: "/resources", label: "Explore Knowledge Library" }}
      />

      <FeatureGrid
        title="How We Work"
        description="Our operating principles shape every sprint, architecture decision, and implementation partnership."
        items={COMPANY_VALUES}
      />

      <CTASection
        title="Build your next institutional operating chapter with us"
        description="From early architecture alignment to capability rollout, we partner with institutions committed to operational excellence."
        primaryCta={{ href: "/contact", label: "Start Conversation" }}
        secondaryCta={{ href: "/solutions", label: "View Solutions" }}
      />
    </div>
  );
}
