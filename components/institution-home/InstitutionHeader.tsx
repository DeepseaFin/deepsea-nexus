import type { InstitutionHeaderProps } from "./types";

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

function Placeholder({ label }: { readonly label: string }) {
  return (
    <div className="inline-flex min-h-10 min-w-[10rem] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-900/70 px-3 text-xs font-medium uppercase tracking-wide text-slate-400">
      {label}
    </div>
  );
}

export function InstitutionHeader({
  institutionName,
  institutionSubtitle,
  personaSlot,
  searchSlot,
  notificationsSlot,
  className,
}: InstitutionHeaderProps) {
  return (
    <div className={withClassName("flex w-full items-center justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institution Home</p>
        <h1 className="mt-1 truncate text-xl font-semibold text-slate-100">{institutionName}</h1>
        {institutionSubtitle ? <p className="mt-1 truncate text-sm text-slate-400">{institutionSubtitle}</p> : null}
      </div>

      <div className="flex flex-wrap items-center justify-end gap-2">
        {searchSlot ?? <Placeholder label="Global Search Placeholder" />}
        {personaSlot ?? <Placeholder label="Current Persona Placeholder" />}
        {notificationsSlot ?? <Placeholder label="Notifications Placeholder" />}
      </div>
    </div>
  );
}