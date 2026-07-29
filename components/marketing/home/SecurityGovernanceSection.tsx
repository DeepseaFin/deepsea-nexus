import SectionFrame from "@/components/marketing/home/SectionFrame";

const GOVERNANCE_POINTS = [
  "Structured audit trails across activity and workflow events",
  "Role-conscious workspace boundaries and capability declarations",
  "Policy validation embedded in operational transitions",
  "Evidence traceability for institutional review cycles",
] as const;

export default function SecurityGovernanceSection() {
  return (
    <SectionFrame
      id="security-governance"
      eyebrow="8. Security and Governance"
      title="Institutional Controls Are Native, Not Bolted On"
      description="Deepsea Nexus is engineered for governance-critical environments where auditability, traceability, and control posture are central to execution quality."
    >
      <div className="rounded-2xl border border-slate-700/80 bg-slate-950/60 p-6">
        <ul className="grid gap-3 sm:grid-cols-2">
          {GOVERNANCE_POINTS.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm leading-relaxed text-slate-300">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}
