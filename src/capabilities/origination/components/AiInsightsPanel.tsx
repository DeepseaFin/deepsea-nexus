import { AlertTriangle, CheckCircle2, FileWarning, Sparkles } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

type AiInsightsPanelProps = {
  insights: {
    highRisk: string[];
    lowConfidence: string[];
    missingDocuments: string[];
    suggestedActions: string[];
  };
};

export default function AiInsightsPanel({ insights }: AiInsightsPanelProps) {
  return (
    <aside className="space-y-2 xl:w-[360px]">
      <SectionCard title="AI Insights" icon={Sparkles}>
        <div className="space-y-3 text-sm">
          <div>
            <p className="mb-1 inline-flex items-center gap-1 font-semibold text-rose-200"><AlertTriangle className="h-4 w-4" />High Risk</p>
            <div className="space-y-1 text-slate-300">
              {insights.highRisk.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>

          <div>
            <p className="mb-1 inline-flex items-center gap-1 font-semibold text-amber-200"><FileWarning className="h-4 w-4" />Low Confidence</p>
            <div className="space-y-1 text-slate-300">
              {insights.lowConfidence.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>

          <div>
            <p className="mb-1 font-semibold text-cyan-200">Missing Documents</p>
            <div className="space-y-1 text-slate-300">
              {insights.missingDocuments.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>

          <div>
            <p className="mb-1 inline-flex items-center gap-1 font-semibold text-emerald-200"><CheckCircle2 className="h-4 w-4" />Suggested Actions</p>
            <div className="space-y-1 text-slate-300">
              {insights.suggestedActions.map((item) => <p key={item}>{item}</p>)}
            </div>
          </div>
        </div>
      </SectionCard>
    </aside>
  );
}
