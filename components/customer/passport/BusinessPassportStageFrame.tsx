import UICard from "@/components/ui/Card";

export interface BusinessPassportStageFrameProps {
  readonly stageLabel: string;
  readonly title: string;
  readonly summary: string;
  readonly main: React.ReactNode;
  readonly side?: React.ReactNode;
}

export default function BusinessPassportStageFrame({
  stageLabel,
  title,
  summary,
  main,
  side,
}: BusinessPassportStageFrameProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <UICard variant="subtle" className="p-5 sm:p-6">
        <p className="text-xs uppercase tracking-[0.16em] text-slate-500">{stageLabel}</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">{summary}</p>
      </UICard>

      <div className={`grid gap-4 ${side ? "xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]" : ""}`}>
        {main}
        {side ? side : null}
      </div>
    </div>
  );
}
