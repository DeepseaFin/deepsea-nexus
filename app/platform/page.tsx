import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const PLATFORM_PILLARS = [
  {
    title: "Institution Command Layer",
    description:
      "A unified command experience for relationship managers, risk teams, legal operations, and executive leadership, aligned on the same institutional record.",
    detail: "Shared operating context",
  },
  {
    title: "Workflow and Activity Fabrics",
    description:
      "Cross-domain workflow and activity streams provide institutional memory for decisions, approvals, and exceptions from origination to closure.",
    detail: "Continuous auditability",
  },
  {
    title: "Policy-Aware Execution",
    description:
      "Every workspace can surface policy constraints and readiness gates directly where operators work, reducing manual escalation loops.",
    detail: "Embedded governance",
  },
  {
    title: "Evidence-Centered Documentation",
    description:
      "Documents, references, and assessments are linked to business context, enabling teams to defend outcomes with complete evidence trails.",
    detail: "Decision defensibility",
  },
  {
    title: "Institutional Knowledge Graph",
    description:
      "Relationship intelligence, counterparties, and workflow artifacts are connected so teams can move from insight to action without context switching.",
    detail: "Context continuity",
  },
  {
    title: "Composable Workspace Core",
    description:
      "Registry-driven workspace definitions allow institutions to expand capabilities while preserving a consistent navigation and governance model.",
    detail: "Scalable architecture",
  },
] as const;

export default function PlatformPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Platform"
        title="The Operating Core for Institutional Finance Workspaces"
        description="Deepsea Nexus provides a modular operating core that orchestrates relationship context, workflow progression, activity visibility, and institutional governance from one secure control plane."
        primaryCta={{ href: "/contact", label: "Schedule Platform Briefing" }}
        secondaryCta={{ href: "/technology", label: "Explore Technology" }}
      />

      <FeatureGrid
        title="Designed for Institutional Operations at Scale"
        description="Each pillar is built to support regulated collaboration, repeatable execution, and rapid expansion into new products, jurisdictions, and operating models."
        items={PLATFORM_PILLARS}
      />

      <CTASection
        title="Bring your teams onto one institutional operating model"
        description="From front office to governance functions, Deepsea Nexus aligns every participant around shared context, shared controls, and shared execution rhythm."
        primaryCta={{ href: "/contact", label: "Start Platform Evaluation" }}
        secondaryCta={{ href: "/resources", label: "Review Architecture Notes" }}
      />
    </div>
  );
}
