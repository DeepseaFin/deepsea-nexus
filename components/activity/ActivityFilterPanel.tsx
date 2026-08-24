"use client";

import SectionCard from "@/components/ui/SectionCard";
import StatusChip from "@/components/ui/StatusChip";
import type { ActivityPresentationModel } from "@/lib/activity/presentation/ActivityPresentationModel";

export interface ActivityFilterPanelProps {
  readonly presentation: ActivityPresentationModel;
  readonly selectedType?: string;
  readonly selectedSeverity?: string;
  readonly selectedModule?: string;
  readonly selectedSource?: string;
  readonly selectedAcknowledgement?: string;
  readonly selectedGroupKey?: string;
  readonly onTypeChange?: (value: string) => void;
  readonly onSeverityChange?: (value: string) => void;
  readonly onModuleChange?: (value: string) => void;
  readonly onSourceChange?: (value: string) => void;
  readonly onAcknowledgementChange?: (value: string) => void;
  readonly onGroupChange?: (groupKey: string) => void;
}

interface FilterSelectProps {
  readonly label: string;
  readonly value?: string;
  readonly options: readonly { value: string; label: string; count: number }[];
  readonly onChange?: (value: string) => void;
}

function FilterSelect({ label, value, options, onChange }: FilterSelectProps) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</span>
      <select
        value={value ?? "all"}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        className="w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
      >
        <option value="all">All</option>
        {options.map((option) => (
          <option key={`${label}-${option.value}`} value={option.value}>
            {option.label} ({option.count})
          </option>
        ))}
      </select>
    </label>
  );
}

export default function ActivityFilterPanel({
  presentation,
  selectedType,
  selectedSeverity,
  selectedModule,
  selectedSource,
  selectedAcknowledgement,
  selectedGroupKey,
  onTypeChange,
  onSeverityChange,
  onModuleChange,
  onSourceChange,
  onAcknowledgementChange,
  onGroupChange,
}: ActivityFilterPanelProps) {
  return (
    <SectionCard title="Filters" subtitle="Filter options and grouped activity collections">
      <div className="grid gap-3 sm:grid-cols-2">
        <FilterSelect label="Type" value={selectedType} options={presentation.filters.options.types} onChange={onTypeChange} />
        <FilterSelect
          label="Severity"
          value={selectedSeverity}
          options={presentation.filters.options.severities}
          onChange={onSeverityChange}
        />
        <FilterSelect
          label="Module"
          value={selectedModule}
          options={presentation.filters.options.modules}
          onChange={onModuleChange}
        />
        <FilterSelect
          label="Source"
          value={selectedSource}
          options={presentation.filters.options.sources}
          onChange={onSourceChange}
        />
        <FilterSelect
          label="Acknowledgement"
          value={selectedAcknowledgement}
          options={presentation.filters.options.acknowledgement}
          onChange={onAcknowledgementChange}
        />
      </div>

      <div className="mt-4 space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Grouped Collections</h4>
        {presentation.filters.groups.length === 0 ? (
          <p className="rounded-xl border border-slate-800 bg-slate-950/50 p-3 text-sm text-slate-400">
            No grouped collections are available.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {presentation.filters.groups.map((group) => (
              <button
                key={group.groupKey}
                type="button"
                onClick={() => onGroupChange?.(group.groupKey)}
                className={`rounded-lg border px-3 py-2 text-left text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/70 ${
                  selectedGroupKey === group.groupKey
                    ? "border-cyan-600/60 bg-cyan-900/30 text-cyan-100"
                    : "border-slate-700 bg-slate-950/60 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="font-semibold uppercase tracking-[0.12em]">{group.groupLabel}</div>
                <div className="mt-1 text-slate-400">{group.countLabel}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedGroupKey ? (
        <div className="mt-4">
          <StatusChip label={`Selected Group: ${selectedGroupKey}`} variant="info" />
        </div>
      ) : null}
    </SectionCard>
  );
}
