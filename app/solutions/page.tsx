import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const SOLUTION_AREAS = [
  {
    title: "Relationship Origination Workspace",
    description:
      "Capture counterparties, structure opportunities, and coordinate early assessment with institution-ready documentation and transparent ownership.",
    detail: "Front-office velocity",
  },
  {
    title: "Credit and Policy Readiness",
    description:
      "Operationalize risk and policy checks as part of daily workflow, reducing handoff delays and ensuring gate criteria are explicit.",
    detail: "Governance confidence",
  },
  {
    title: "Execution and Exception Handling",
    description:
      "Track every task, assignment, and transition while surfacing blocked conditions before they create expensive escalations.",
    detail: "Execution resilience",
  },
  {
    title: "Document and Evidence Control",
    description:
      "Maintain defensible evidence sets linked to every decision so legal, compliance, and audit teams can validate outcomes rapidly.",
    detail: "Audit readiness",
  },
  {
    title: "Activity and Timeline Intelligence",
    description:
      "Convert fragmented operational events into coherent institutional timelines for operational review and leadership reporting.",
    detail: "Operational visibility",
  },
  {
    title: "Executive Portfolio Oversight",
    description:
      "Surface portfolio-level risk, workflow health, and institutional throughput through summary views tuned for decision velocity.",
    detail: "Strategic control",
  },
] as const;

export default function SolutionsPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Solutions"
        title="Operational Solutions for Structured Finance Institutions"
        description="Deepsea Nexus solutions are built around real institutional motions: sourcing relationships, validating readiness, executing workflows, and preserving decision quality at scale."
        primaryCta={{ href: "/contact", label: "Discuss Use Cases" }}
        secondaryCta={{ href: "/platform", label: "See Platform Foundation" }}
      />

      <FeatureGrid
        title="Coverage Across the End-to-End Institutional Lifecycle"
        description="Each solution area can operate independently or as part of a connected operating model, allowing phased rollout without architectural fragmentation."
        items={SOLUTION_AREAS}
      />

      <CTASection
        title="Match the operating model to your institution"
        description="Our team maps solution components to your existing process architecture, governance obligations, and growth objectives."
        primaryCta={{ href: "/contact", label: "Request Solution Workshop" }}
        secondaryCta={{ href: "/resources", label: "Read Operating Playbooks" }}
      />
    </div>
  );
}
