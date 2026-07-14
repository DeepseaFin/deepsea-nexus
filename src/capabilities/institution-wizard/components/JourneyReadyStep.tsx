import BusinessPassportCard from "@/src/capabilities/institution-wizard/components/BusinessPassportCard";
import type { BusinessPassportSummary } from "@/src/capabilities/institution-wizard/types/BusinessPassportSummary";

type JourneyReadyStepProps = {
  readinessNotes: readonly string[];
  passport: BusinessPassportSummary;
};

export default function JourneyReadyStep({ readinessNotes, passport }: JourneyReadyStepProps) {
  return (
    <div className="space-y-2">
      <section className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
        <h2 className="text-lg font-semibold text-slate-100">Relationship Journey Ready</h2>
        <p className="mt-1 text-sm text-slate-400">Institution profile is ready to enter the relationship journey workflow.</p>

        <div className="mt-4 space-y-2">
          {readinessNotes.map((note) => (
            <p key={note} className="rounded border border-emerald-700/30 bg-emerald-950/20 px-3 py-2 text-sm text-emerald-100">
              {note}
            </p>
          ))}
        </div>
      </section>

      <BusinessPassportCard passport={passport} />
    </div>
  );
}