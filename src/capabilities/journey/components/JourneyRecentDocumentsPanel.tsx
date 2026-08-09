import { Clock3, HardDrive, Layers, UserCircle2 } from "lucide-react";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import type { JourneyRecentDocumentsViewModel } from "@/src/capabilities/journey/adapters/getJourneyRecentDocumentsProjection";

type JourneyRecentDocumentsPanelProps = {
  readonly documents: JourneyRecentDocumentsViewModel;
  readonly isLoading?: boolean;
};

function statusTone(status: string): string {
  const normalized = status.toUpperCase();

  if (normalized === "UPLOADED" || normalized === "COMPLETED") {
    return "border-emerald-700/40 bg-emerald-950/20 text-emerald-200";
  }

  if (normalized === "PENDING" || normalized === "PROCESSING") {
    return "border-amber-700/40 bg-amber-950/20 text-amber-200";
  }

  if (normalized === "FAILED" || normalized === "ERROR") {
    return "border-rose-700/40 bg-rose-950/20 text-rose-200";
  }

  return "border-cyan-700/40 bg-cyan-950/25 text-cyan-200";
}

function formatUploadDate(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function JourneyRecentDocumentsPanel({ documents, isLoading = false }: JourneyRecentDocumentsPanelProps) {
  return (
    <SectionCard
      title="Recent Documents"
      iconKey="file-text"
      badge={{
        label: isLoading ? "Loading" : `${documents.length} Items`,
        variant: "info",
      }}
      action={{
        label: "Action Placeholder",
        onClick: () => {},
      }}
    >
      <p className="mb-4 text-sm text-slate-400">
        ORACLE-uploaded document metadata surfaced for journey-stage operational review.
      </p>

      {isLoading ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4" aria-live="polite">
          <p className="text-sm font-medium text-slate-300">Loading recent documents...</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Projection in progress</p>
        </div>
      ) : documents.length === 0 ? (
        <div className="rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-4">
          <p className="text-sm font-medium text-slate-300">No recent documents are currently available.</p>
          <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">ORACLE metadata placeholder state</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => (
            <article
              key={document.id}
              className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 transition-colors hover:border-slate-700"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">{document.documentCode}</p>
                  <h4 className="mt-1 truncate text-sm font-semibold text-slate-200">{document.name}</h4>
                </div>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${statusTone(document.uploadStatus)}`}>
                  {document.uploadStatus}
                </span>
              </div>

              <dl className="mt-3 grid gap-2 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <Layers className="h-3 w-3 text-cyan-300" /> Type
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-slate-300">{document.type}</dd>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <Clock3 className="h-3 w-3 text-cyan-300" /> Upload Date
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-slate-300">{formatUploadDate(document.uploadDate)}</dd>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <UserCircle2 className="h-3 w-3 text-cyan-300" /> Source
                  </dt>
                  <dd className="mt-1 truncate text-xs font-medium text-slate-300">{document.source}</dd>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2">
                  <dt className="flex items-center gap-1 text-[11px] uppercase tracking-[0.12em] text-slate-500">
                    <HardDrive className="h-3 w-3 text-cyan-300" /> Metadata State
                  </dt>
                  <dd className="mt-1 text-xs font-medium text-slate-300">Available</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </SectionCard>
  );
}