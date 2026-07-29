import CTASection from "@/components/marketing/CTASection";
import FeatureGrid from "@/components/marketing/FeatureGrid";
import PageHero from "@/components/marketing/PageHero";

const CONTACT_CHANNELS = [
  {
    title: "Platform Briefing",
    description:
      "Book a strategic walkthrough to align platform capabilities with your institutional operating priorities and governance requirements.",
    detail: "Leadership audience",
  },
  {
    title: "Architecture Session",
    description:
      "Engage engineering and architecture leads for deep dives on modular design, registry composition, and integration readiness.",
    detail: "Technology audience",
  },
  {
    title: "Operational Workshop",
    description:
      "Map real workflow states, handoffs, and control obligations into an implementation path tailored to your teams.",
    detail: "Operations audience",
  },
] as const;

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <PageHero
        eyebrow="Contact"
        title="Start a Deepsea Nexus Conversation"
        description="Tell us about your institutional goals, and we will coordinate the right briefing format for your leadership, operations, and technology teams."
        primaryCta={{ href: "mailto:partnerships@deepseanexus.com", label: "Email Partnerships" }}
        secondaryCta={{ href: "/resources", label: "Review Resources First" }}
      />

      <FeatureGrid
        title="Engagement Paths"
        description="Choose the conversation that best matches your current stage, whether evaluating strategic fit or planning implementation detail."
        items={CONTACT_CHANNELS}
      />

      <section className="rounded-3xl border border-slate-700/70 bg-[linear-gradient(165deg,rgba(11,19,33,0.95),rgba(8,16,28,0.95))] p-8 sm:p-10">
        <h2 className="text-2xl font-semibold text-slate-100 sm:text-3xl">Contact Request</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">
          Submit your details and our team will follow up with a tailored briefing agenda.
        </p>

        <form className="mt-6 grid gap-4 sm:grid-cols-2" aria-label="Contact request form">
          <label className="space-y-1">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Full Name</span>
            <input
              type="text"
              name="name"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="space-y-1">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Work Email</span>
            <input
              type="email"
              name="email"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">Institution</span>
            <input
              type="text"
              name="institution"
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <label className="space-y-1 sm:col-span-2">
            <span className="text-xs uppercase tracking-[0.12em] text-slate-400">What would you like to discuss?</span>
            <textarea
              name="brief"
              rows={5}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
            />
          </label>

          <button
            type="button"
            className="sm:col-span-2 inline-flex w-full items-center justify-center rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-300"
          >
            Submit Request
          </button>
        </form>
      </section>

      <CTASection
        title="Prefer a direct briefing request?"
        description="Reach our partnerships desk directly for urgent leadership or architecture discussions."
        primaryCta={{ href: "mailto:partnerships@deepseanexus.com", label: "Contact Partnerships Desk" }}
      />
    </div>
  );
}
