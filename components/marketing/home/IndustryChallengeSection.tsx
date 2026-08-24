import Card from "@/components/Card";
import SectionFrame from "@/components/marketing/home/SectionFrame";

const CHALLENGES = [
  {
    title: "Fragmented Execution",
    description:
      "Origination, risk review, legal checkpoints, and documentation often run across disconnected systems, increasing latency and ambiguity.",
  },
  {
    title: "Policy Drift",
    description:
      "Institutional policy intent is frequently separated from day-to-day execution, causing rework, escalation loops, and uneven controls.",
  },
  {
    title: "Thin Operational Memory",
    description:
      "Critical decisions and exceptions are not always captured with context, making post-event analysis and governance defense expensive.",
  },
] as const;

export default function IndustryChallengeSection() {
  return (
    <SectionFrame
      id="industry-challenge"
      eyebrow="1. Industry Challenge"
      title="Institutions Need More Than Digital Screens."
      description="Finance organizations are navigating complexity that legacy CRMs, ticketing boards, and spreadsheet-heavy operating models were never designed to handle."
    >
      <div className="grid gap-4 md:grid-cols-3">
        {CHALLENGES.map((item) => (
          <Card key={item.title}>
            <h3 className="text-lg font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{item.description}</p>
          </Card>
        ))}
      </div>
    </SectionFrame>
  );
}
