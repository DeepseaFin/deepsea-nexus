import { Mail, Phone, UserRound } from "lucide-react";
import type { InstitutionalContactProjection } from "@/src/capabilities/relationship/projections/InstitutionalContactProjection";

interface InstitutionalContactDirectoryProps {
  readonly contacts: readonly InstitutionalContactProjection[];
  readonly className?: string;
}

function withClassName(base: string, className?: string): string {
  return className ? `${base} ${className}` : base;
}

export default function InstitutionalContactDirectory({
  contacts,
  className,
}: InstitutionalContactDirectoryProps) {
  return (
    <section className={withClassName("rounded-2xl border border-slate-800/90 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.92))] p-6 shadow-[0_14px_32px_rgba(2,6,23,0.22)]", className)} aria-label="Institutional contact directory">
      <header className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">Institutional Contacts</p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-100">Contact Directory</h2>
          <p className="mt-2 text-sm text-slate-400">Canonical relationship stakeholders mapped for institutional operating visibility.</p>
        </div>
        <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-cyan-200">
          {contacts.length} Contacts
        </div>
      </header>

      {contacts.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No institutional contacts are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Projection empty state</p>
        </div>
      ) : (
        <ul className="grid gap-3 xl:grid-cols-2">
          {contacts.map((contact) => (
            <li key={contact.contactId} className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-slate-100">{contact.fullName}</p>
                  <p className="mt-1 text-xs text-slate-400">{contact.designation}</p>
                </div>
                <div className="rounded-full border border-cyan-700/40 bg-cyan-950/30 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-cyan-200">
                  {contact.status}
                </div>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                  <UserRound className="mr-1 inline h-3 w-3 text-cyan-300" /> {contact.role}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                  Relationship: {contact.relationshipId}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                  <Mail className="mr-1 inline h-3 w-3 text-cyan-300" /> {contact.email}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-xs text-slate-300">
                  <Phone className="mr-1 inline h-3 w-3 text-cyan-300" /> {contact.phone}
                </p>
              </div>

              <div className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                  Source: {contact.summaryMetadata.sourceSystem}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                  Reference: {contact.summaryMetadata.sourceReference}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                  Tags: {contact.summaryMetadata.tags.length}
                </p>
                <p className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-[11px] text-slate-400">
                  Attributes: {contact.summaryMetadata.attributeCount}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
