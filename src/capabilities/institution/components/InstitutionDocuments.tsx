import type { InstitutionDocumentItem } from "@/src/capabilities/institution/types/InstitutionWorkspaceState";

type InstitutionDocumentsProps = {
  readonly documents: readonly InstitutionDocumentItem[];
};

export default function InstitutionDocuments({ documents }: InstitutionDocumentsProps) {
  return (
    <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-4">
      <h2 className="text-lg font-semibold text-slate-100">Institution Documents</h2>
      <div className="mt-3 overflow-x-auto">
        <table className="min-w-full text-left text-sm text-slate-300">
          <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
            <tr>
              <th className="px-3 py-2">Document</th>
              <th className="px-3 py-2">Classification</th>
              <th className="px-3 py-2">Version</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Reviewed</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="border-t border-slate-800/80">
                <td className="px-3 py-2 font-medium text-slate-100">{doc.title}</td>
                <td className="px-3 py-2">{doc.classification}</td>
                <td className="px-3 py-2">{doc.version}</td>
                <td className="px-3 py-2 uppercase tracking-[0.1em] text-cyan-300">{doc.status}</td>
                <td className="px-3 py-2 text-slate-400">{doc.reviewedAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
