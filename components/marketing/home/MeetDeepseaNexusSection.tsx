import SectionFrame from "@/components/marketing/home/SectionFrame";

export default function MeetDeepseaNexusSection() {
  return (
    <SectionFrame
      id="meet-deepsea"
      eyebrow="2. Meet Deepsea Nexus"
      title="A Unified Institutional Operating Layer"
      description="Deepsea Nexus is designed as the institutional layer between strategy and execution, connecting teams through shared context, structured workflows, and explainable decision trails."
    >
      <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
        <article className="rounded-2xl border border-slate-700/70 bg-[#0a1c30]/80 p-6">
          <h3 className="text-xl font-semibold text-slate-100">One Operational Language</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Relationship, risk, legal, compliance, and operations collaborate on one institutional record. Every action,
            transition, and exception is contextualized, reducing handoff friction and improving decision clarity.
          </p>
        </article>
        <article className="rounded-2xl border border-cyan-800/60 bg-cyan-950/20 p-6">
          <h3 className="text-xl font-semibold text-cyan-200">Designed for Governance-Critical Environments</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-200">
            The platform is structured for institutions where execution speed must coexist with policy integrity,
            defensible evidence, and consistent oversight.
          </p>
        </article>
      </div>
    </SectionFrame>
  );
}
