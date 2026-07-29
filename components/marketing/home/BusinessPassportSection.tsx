import SectionFrame from "@/components/marketing/home/SectionFrame";

const PASSPORT_SIGNALS = [
  "Identity and ownership fidelity",
  "Financial readiness and funding posture",
  "Policy and documentation completeness",
  "Timeline of critical institutional events",
] as const;

export default function BusinessPassportSection() {
  return (
    <SectionFrame
      id="business-passport"
      eyebrow="5. Business Passport"
      title="Business Passport: The Institutional Source of Truth"
      description="At the center of Deepsea Nexus is the Business Passport: a continuously refreshed institutional profile that anchors decisions, workflows, and governance checks."
    >
      <div className="relative overflow-hidden rounded-3xl border border-cyan-700/50 bg-[radial-gradient(circle_at_80%_18%,rgba(6,182,212,0.26),transparent_45%),linear-gradient(160deg,rgba(7,33,52,0.95),rgba(6,20,35,0.95))] p-6 sm:p-8">
        <div className="absolute -left-10 -top-10 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" aria-hidden="true" />
        <h3 className="text-2xl font-semibold text-cyan-100 sm:text-3xl">Every critical decision starts here.</h3>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Instead of assembling context from disconnected records, teams work from one authoritative passport that evolves with
          each workflow step and institutional interaction.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {PASSPORT_SIGNALS.map((signal) => (
            <li key={signal} className="rounded-xl border border-cyan-800/40 bg-slate-950/40 px-4 py-3 text-sm text-cyan-50">
              {signal}
            </li>
          ))}
        </ul>
      </div>
    </SectionFrame>
  );
}
