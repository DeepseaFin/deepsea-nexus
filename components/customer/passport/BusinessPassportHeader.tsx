import StatusChip from "@/components/ui/StatusChip";

export interface BusinessPassportHeaderProps {
  readonly passportId: string;
  readonly legalName: string;
  readonly legalForm: string;
  readonly jurisdiction: string;
  readonly relationshipManager: string;
  readonly lifecycleStage: string;
}

export default function BusinessPassportHeader({
  passportId,
  legalName,
  legalForm,
  jurisdiction,
  relationshipManager,
  lifecycleStage,
}: BusinessPassportHeaderProps) {
  return (
    <header className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Business Passport</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">{legalName}</h2>
          <p className="mt-1 text-sm text-slate-400">{passportId}</p>
        </div>
        <StatusChip label={lifecycleStage} variant="info" />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Legal Form</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{legalForm}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Jurisdiction</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{jurisdiction}</p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3">
          <p className="text-[11px] uppercase tracking-[0.12em] text-slate-500">Relationship Manager</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{relationshipManager}</p>
        </div>
      </div>
    </header>
  );
}
