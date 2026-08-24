import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const TECHNOLOGY_FOUNDATIONS = [
  {
    title: "Domain-First Architecture",
    description:
      "Core business behavior is defined in explicit domain modules, ensuring policy-aware evolution without coupling execution logic to infrastructure choices.",
    detail: "Long-term maintainability",
  },
  {
    title: "Layered Application Design",
    description:
      "Application and presentation layers transform domain outputs into reusable workspace experiences while preserving strict dependency direction.",
    detail: "Controlled extensibility",
  },
  {
    title: "Workspace Registry Core",
    description:
      "A registry-driven workspace model enables discoverability, capability declarations, and modular composition across institutional teams.",
    detail: "Composable delivery",
  },
  {
    title: "Traceable Activity Surfaces",
    description:
      "Activity feeds and timelines are modeled as first-class capabilities, giving institutions verifiable operating trails from event to decision.",
    detail: "Operational transparency",
  },
  {
    title: "Presentation-Oriented Interfaces",
    description:
      "Immutable view models and presentation assemblers keep UI behavior deterministic and easier to evolve across multiple workspaces.",
    detail: "Reliable experience design",
  },
  {
    title: "Institutional Integration Readiness",
    description:
      "The shell is engineered to integrate with enterprise identity, policy engines, and reporting infrastructure through controlled application boundaries.",
    detail: "Enterprise alignment",
  },
] as const;

export default function TechnologyPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Technology"
        title="Built on a Layered, Institutional-Grade Software Architecture"
        description="Deepsea Nexus is engineered as a modular operating system with clear domain ownership, deterministic presentation contracts, and workspace-driven composition."
        primaryCta={{ href: "/resources", label: "Read Technical Notes" }}
        secondaryCta={{ href: "/contact", label: "Talk to Engineering" }}
      />

      <FeatureGrid
        title="Engineering Principles Behind the Platform"
        description="Every capability is designed for governance-critical environments where maintainability, auditability, and extension speed must coexist."
        items={TECHNOLOGY_FOUNDATIONS}
      />

      <CTASection
        title="Evaluate technical fit with your enterprise architecture"
        description="Engage with our architecture team to map Deepsea Nexus capabilities to your operating constraints, controls, and integration posture."
        primaryCta={{ href: "/contact", label: "Book Architecture Session" }}
        secondaryCta={{ href: "/platform", label: "Return to Platform" }}
      />
    </div>
  );
}
