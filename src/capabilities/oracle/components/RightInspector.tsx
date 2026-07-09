import { Activity, GitBranch, History, Info } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type InspectorData = {
  metadata: Array<{ key: string; value: string }>;
  relationships: string[];
  versions: string[];
  timeline: string[];
};

type RightInspectorProps = {
  data: InspectorData;
  selectedDocumentName: string | null;
  intakeSummary: {
    files: number;
    estimatedProcessingTime: string;
    detectedClients: number;
    detectedDeals: number;
    potentialIssues: number;
  } | null;
};

export default function RightInspector({ data, selectedDocumentName, intakeSummary }: RightInspectorProps) {
  return (
    <aside className="w-full space-y-2 xl:w-[360px]">
      {intakeSummary && (
        <SectionCard title="Intake Summary" icon={Info}>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-300">Files: {intakeSummary.files}</p>
            <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-300">ETA: {intakeSummary.estimatedProcessingTime}</p>
            <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-300">Detected Clients: {intakeSummary.detectedClients}</p>
            <p className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1 text-slate-300">Detected Deals: {intakeSummary.detectedDeals}</p>
            <p className="col-span-2 rounded border border-amber-700/40 bg-amber-950/25 px-2 py-1 text-amber-200">Potential Issues: {intakeSummary.potentialIssues}</p>
          </div>
        </SectionCard>
      )}

      <SectionCard title="Metadata" icon={Info}>
        {!selectedDocumentName ? (
          <p className="text-sm text-slate-400">Select a document to inspect metadata.</p>
        ) : (
          <div className="space-y-1 text-sm">
            {data.metadata.map((item) => (
              <p key={item.key} className="text-slate-300">
                <span className="text-slate-500">{item.key}:</span> {item.value}
              </p>
            ))}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Relationships" icon={GitBranch}>
        <div className="space-y-1 text-sm text-slate-300">
          {data.relationships.map((item) => (
            <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Version History" icon={History}>
        <div className="space-y-1 text-sm text-slate-300">
          {data.versions.map((item) => (
            <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Activity Timeline" icon={Activity}>
        <div className="space-y-1 text-sm text-slate-300">
          {data.timeline.map((item) => (
            <p key={item} className="rounded border border-slate-800 bg-slate-950/70 px-2 py-1">{item}</p>
          ))}
        </div>
      </SectionCard>
    </aside>
  );
}
