import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const RESOURCE_COLLECTIONS = [
  {
    title: "Architecture Briefs",
    description:
      "Guides covering workspace core patterns, application layering, and modular domain strategies used to scale institutional features.",
    detail: "Technical reference",
  },
  {
    title: "Operating Playbooks",
    description:
      "Practical playbooks for relationship onboarding, workflow progression, exception handling, and policy-aware execution.",
    detail: "Operations enablement",
  },
  {
    title: "Governance Framework Notes",
    description:
      "Reference material for institutional controls, evidence expectations, and oversight rhythms across finance operations.",
    detail: "Governance alignment",
  },
  {
    title: "Product Release Notes",
    description:
      "Structured release narratives that explain capability additions, quality gates, and readiness implications for operating teams.",
    detail: "Change transparency",
  },
  {
    title: "Knowledge Library Index",
    description:
      "Curated index of domain concepts, architecture decisions, and institutional patterns that power Deepsea Nexus implementations.",
    detail: "Shared vocabulary",
  },
  {
    title: "Executive Briefing Packs",
    description:
      "Concise strategic packs for leadership stakeholders evaluating institutional adoption and transformation pathways.",
    detail: "Decision support",
  },
] as const;

export default function ResourcesPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Resources"
        title="Institutional Knowledge for Teams Building Modern Finance Operations"
        description="Access structured resources that help technology leaders, operating teams, and governance stakeholders evaluate and deploy Deepsea Nexus with confidence."
        primaryCta={{ href: "/contact", label: "Request Resource Access" }}
        secondaryCta={{ href: "/company", label: "Meet the Team" }}
      />

      <FeatureGrid
        title="Resource Streams"
        description="Our resource collections are organized for different stakeholder groups while preserving one shared institutional language."
        items={RESOURCE_COLLECTIONS}
      />

      <CTASection
        title="Need a curated pack for your institution?"
        description="We can assemble domain, architecture, and governance materials aligned to your transformation program and decision timeline."
        primaryCta={{ href: "/contact", label: "Request Curated Briefing" }}
        secondaryCta={{ href: "/platform", label: "Explore Platform" }}
      />
    </div>
  );
}
