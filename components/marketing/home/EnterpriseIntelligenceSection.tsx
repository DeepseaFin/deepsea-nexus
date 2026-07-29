import Card from "@/components/Card";
import SectionFrame from "@/components/marketing/home/SectionFrame";

const INTELLIGENCE_STREAMS = [
  {
    title: "Relationship Signal Mapping",
    description: "Surface patterns in counterparty behavior, readiness shifts, and engagement outcomes across institutional portfolios.",
  },
  {
    title: "Workflow Health Insights",
    description: "Identify stalled transitions, concentrated bottlenecks, and execution drag before throughput is materially impacted.",
  },
  {
    title: "Activity Pattern Detection",
    description: "Translate high-volume operational events into structured narratives for oversight, escalation, and continuous improvement.",
  },
] as const;

export default function EnterpriseIntelligenceSection() {
  return (
    <SectionFrame
      id="enterprise-intelligence"
      eyebrow="6. Enterprise Intelligence"
      title="From Operational Noise to Institutional Intelligence"
      description="Deepsea Nexus turns workflow events, activity streams, and relationship context into actionable institutional intelligence for operators and executives alike."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {INTELLIGENCE_STREAMS.map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
