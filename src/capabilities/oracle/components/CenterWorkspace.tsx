import { Filter, Search, Upload } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type CenterWorkspaceProps = {
  hasMockSelection: boolean;
  onBrowseMockFiles: () => void;
  onClearMockFiles: () => void;
  queueItems: Array<{
    id: string;
    filename: string;
    type: string;
    size: string;
    aiClassification: string;
    confidence: string;
    status: string;
    progress: number;
  }>;
};

const RECENT_INTAKE_SESSIONS = [
  { id: 'INT-22019', label: 'Murabaha Legal Pack', time: 'Today 09:22' },
  { id: 'INT-22018', label: 'KYC + Trade License Batch', time: 'Today 08:40' },
  { id: 'INT-22017', label: 'Counterparty Onboarding Set', time: 'Yesterday 17:15' },
];

export default function CenterWorkspace({ hasMockSelection, onBrowseMockFiles, onClearMockFiles, queueItems }: CenterWorkspaceProps) {
  return (
    <section className="space-y-2">
      <SectionCard title="Toolbar" icon={Upload}>
        <div className="grid gap-2 sm:grid-cols-[auto_1fr_auto]">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyan-700/40 bg-cyan-950/20 px-3 py-2 text-sm font-semibold text-cyan-200"
          >
            <Upload className="h-4 w-4" />
            Upload
          </button>

          <label className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents"
              className="w-full bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
            />
          </label>

          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-semibold text-slate-200"
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>
      </SectionCard>

      {!hasMockSelection ? (
        <>
          <SectionCard title="Document Intake" icon={Upload}>
            <div className="flex min-h-[640px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-950/70 px-6 text-center">
              <Upload className="h-11 w-11 text-cyan-400" />
              <p className="mt-4 text-2xl font-semibold text-slate-100">Drop Document Pack Here</p>
              <p className="mt-3 text-sm text-slate-500">or</p>
              <button
                type="button"
                onClick={onBrowseMockFiles}
                className="mt-3 rounded-lg border border-cyan-700/40 bg-cyan-950/20 px-4 py-2 text-sm font-semibold text-cyan-200"
              >
                Browse Files
              </button>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs text-slate-300">
                {['PDF', 'DOCX', 'XLSX', 'Images', 'ZIP'].map((format) => (
                  <span key={format} className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5">
                    {format}
                  </span>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Recent Intake Sessions" icon={Upload}>
            <div className="space-y-2">
              {RECENT_INTAKE_SESSIONS.map((session) => (
                <div key={session.id} className="rounded-lg border border-slate-800 bg-slate-950/70 px-3 py-2">
                  <p className="text-sm font-semibold text-slate-100">{session.label}</p>
                  <p className="mt-0.5 text-xs text-slate-400">{session.id} · {session.time}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      ) : (
        <SectionCard title="Processing Queue" icon={Upload} action={{ label: 'Clear', onClick: onClearMockFiles }}>
          <div className="min-h-[640px] overflow-x-auto rounded-lg border border-slate-800 bg-slate-950/60">
            <table className="min-w-full text-left text-sm text-slate-200">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-3 py-2 font-semibold">Filename</th>
                  <th className="px-3 py-2 font-semibold">Type</th>
                  <th className="px-3 py-2 font-semibold">Size</th>
                  <th className="px-3 py-2 font-semibold">AI Classification</th>
                  <th className="px-3 py-2 font-semibold">Confidence</th>
                  <th className="px-3 py-2 font-semibold">Status</th>
                  <th className="px-3 py-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueItems.map((item) => (
                  <tr key={item.id} className="border-t border-slate-800/90 align-top">
                    <td className="px-3 py-2 text-slate-100">
                      <p>{item.filename}</p>
                      <div className="mt-2 h-1.5 w-full rounded bg-slate-800">
                        <div className="h-1.5 rounded bg-cyan-500" style={{ width: `${item.progress}%` }} />
                      </div>
                    </td>
                    <td className="px-3 py-2 text-slate-300">{item.type}</td>
                    <td className="px-3 py-2 text-slate-300">{item.size}</td>
                    <td className="px-3 py-2 text-slate-300">{item.aiClassification}</td>
                    <td className="px-3 py-2 text-slate-300">{item.confidence}</td>
                    <td className="px-3 py-2">
                      <span className="rounded-full border border-cyan-700/40 bg-cyan-950/20 px-2 py-0.5 text-xs text-cyan-200">
                        {item.status}
                      </span>
                    </td>
                    <td className="px-3 py-2">
                      <button type="button" className="rounded border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </section>
  );
}
