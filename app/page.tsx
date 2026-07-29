import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const HOME_HIGHLIGHTS = [
  {
    title: "Unified Institutional Workspaces",
    description:
      "Coordinate relationship operations, workflow progression, activity intelligence, and governance from one modular workspace framework.",
    detail: "Cross-team coherence",
  },
  {
    title: "Policy-Aligned Execution",
    description:
      "Surface mandatory controls and readiness gates directly in the operating flow so teams execute with clarity and fewer escalations.",
    detail: "Execution discipline",
  },
  {
    title: "Decision-Ready Evidence",
    description:
      "Link every decision to the right documents, activities, and context for rapid internal review and stronger audit posture.",
    detail: "Institutional trust",
  },
  {
    title: "Registry-Driven Expansion",
    description:
      "Introduce new workspace capabilities through explicit manifests and capabilities while preserving navigation and governance consistency.",
    detail: "Composable scale",
  },
  {
    title: "Timeline and Activity Transparency",
    description:
      "Track what happened, why it happened, and who acted through structured activity and timeline views for operational accountability.",
    detail: "Operational memory",
  },
  {
    title: "Executive Oversight by Design",
    description:
      "Provide leadership with portfolio-level visibility, workflow health indicators, and risk-aware execution context in real time.",
    detail: "Strategic visibility",
  },
] as const;

export default function HomePage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Deepsea Nexus"
        title="The Institutional Operating System for Relationship-Led Finance"
        description="Deepsea Nexus gives financial institutions a disciplined workspace shell for origination, workflow governance, activity intelligence, and decision-quality execution."
        primaryCta={{ href: "/platform", label: "Explore Platform" }}
        secondaryCta={{ href: "/contact", label: "Book Executive Briefing" }}
      />

      <FeatureGrid
        title="Built for Institutional Teams That Need Control and Speed"
        description="From front-office coordination to governance oversight, the platform aligns teams around one operational language and one execution model."
        items={HOME_HIGHLIGHTS}
      />

      <CTASection
        title="Move from fragmented tools to an institutional operating core"
        description="Adopt a website and product shell that transitions seamlessly from public value narrative to production workspaces for operators, risk, and leadership."
        primaryCta={{ href: "/solutions", label: "View Solutions" }}
        secondaryCta={{ href: "/login", label: "Open Client Access" }}
      />
    </div>
  );
}
