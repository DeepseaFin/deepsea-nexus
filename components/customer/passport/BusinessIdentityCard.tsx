import UICard from "@/components/ui/Card";

export interface BusinessIdentityCardProps {
  readonly registrationNumber: string;
  readonly tradeLicense: string;
  readonly taxRegistration: string;
  readonly incorporationDate: string;
  readonly sector: string;
  readonly riskBand: string;
}

export default function BusinessIdentityCard({
  registrationNumber,
  tradeLicense,
  taxRegistration,
  incorporationDate,
  sector,
  riskBand,
}: BusinessIdentityCardProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Business Identity</h3>
      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Registration Number</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{registrationNumber}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Trade License</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{tradeLicense}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Tax Registration</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{taxRegistration}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Incorporation Date</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{incorporationDate}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Sector</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{sector}</dd>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
          <dt className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Risk Band</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">{riskBand}</dd>
        </div>
      </dl>
    </UICard>
  );
}
