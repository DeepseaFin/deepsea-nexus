'use client';

import React from 'react';
import {
  Building2,
  FileText,
  Gavel,
  Landmark,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';

export type HealthDomain =
	| 'documents'
	| 'promoter'
	| 'collateral'
	| 'legal'
	| 'fraud'
	| 'pricing';

export type HealthTone = 'good' | 'watch' | 'risk';

export interface HealthMetric {
	score: number;
	status: string;
	note?: string;
	tone?: HealthTone;
}

export interface DealConfidenceIndexView {
	score: number;
	band: string;
	summary: string;
}

export interface ExecutiveVerdictView {
	label: string;
	summary: string;
	issuedAt?: string;
}

export interface FundingReadinessView {
	score: number;
	status: string;
	eta?: string;
}

export interface CriticalBlocker {
	id: string;
	title: string;
	description?: string;
}

export interface RecommendedAction {
	title: string;
	description: string;
	owner?: string;
	dueLabel?: string;
}

export interface DealCommandCenterProps {
	dealTitle?: string;
	dealConfidenceIndex: DealConfidenceIndexView;
	executiveVerdict: ExecutiveVerdictView;
	fundingReadiness: FundingReadinessView;
	health: Record<HealthDomain, HealthMetric>;
	criticalBlockers: CriticalBlocker[];
	nextRecommendedAction: RecommendedAction;
	className?: string;
}

const healthConfig: Record<
	HealthDomain,
	{ label: string; icon: React.ComponentType<{ className?: string }> }
> = {
	documents: { label: 'Documents', icon: FileText },
	promoter: { label: 'Promoter', icon: Building2 },
	collateral: { label: 'Collateral', icon: Landmark },
	legal: { label: 'Legal', icon: Gavel },
	fraud: { label: 'Fraud', icon: ShieldAlert },
	pricing: { label: 'Pricing', icon: TrendingUp },
};

const toneClasses: Record<HealthTone, string> = {
	good: 'border-emerald-800/60 bg-emerald-950/20 text-emerald-300',
	watch: 'border-amber-800/60 bg-amber-950/20 text-amber-300',
	risk: 'border-rose-800/60 bg-rose-950/20 text-rose-300',
};

const executiveVerdictTimestampFormatter = new Intl.DateTimeFormat('en-AE', {
	timeZone: 'UTC',
	year: 'numeric',
	month: 'short',
	day: '2-digit',
	hour: '2-digit',
	minute: '2-digit',
	hour12: true,
});

function formatExecutiveVerdictIssuedAt(value: string): string {
	return executiveVerdictTimestampFormatter.format(new Date(value));
}

/**
 * Presentation-only executive dashboard for a single deal.
 * All values are supplied through props and can later be bound to Decision Orchestrator outputs.
 */
export default function DealCommandCenter({
	dealTitle,
	dealConfidenceIndex,
	executiveVerdict,
	fundingReadiness,
	health,
	criticalBlockers,
	nextRecommendedAction,
	className = '',
}: DealCommandCenterProps) {
	return (
		<section
			className={`rounded-3xl border border-slate-800 bg-slate-950/95 p-4 shadow-2xl sm:p-6 ${className}`}
		>
			<div className="mb-6 flex items-center justify-between gap-4">
				<div>
					<p className="text-xs uppercase tracking-[0.18em] text-cyan-300/70">ATLAS Command Center</p>
					<h2 className="mt-2 text-xl font-semibold text-slate-100 sm:text-2xl">
						{dealTitle ?? 'Deal Command Center'}
					</h2>
				</div>
				<span className="rounded-full border border-cyan-800/60 bg-cyan-950/40 px-3 py-1 text-xs font-semibold text-cyan-200">
					Executive View
				</span>
			</div>

			<div className="space-y-6">
				<div className="grid gap-4 lg:grid-cols-3">
					<SectionCard title="Deal Confidence Index" iconKey="sparkles">
						<div className="space-y-3">
							<p className="text-3xl font-semibold text-emerald-300">{dealConfidenceIndex.score}%</p>
							<p className="inline-flex rounded-full border border-emerald-800/60 bg-emerald-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
								{dealConfidenceIndex.band}
							</p>
							<p className="text-sm leading-relaxed text-slate-300">{dealConfidenceIndex.summary}</p>
						</div>
					</SectionCard>

					<SectionCard title="Executive Verdict" iconKey="badge-check">
						<div className="space-y-3">
							<p className="text-2xl font-semibold text-cyan-200">{executiveVerdict.label}</p>
							<p className="text-sm leading-relaxed text-slate-300">{executiveVerdict.summary}</p>
							{executiveVerdict.issuedAt && (
								<p className="text-xs text-slate-500">
									Issued {formatExecutiveVerdictIssuedAt(executiveVerdict.issuedAt)}
								</p>
							)}
						</div>
					</SectionCard>

					<SectionCard title="Funding Readiness" iconKey="wallet">
						<div className="space-y-3">
							<p className="text-3xl font-semibold text-slate-100">{fundingReadiness.score}%</p>
							<p className="inline-flex rounded-full border border-slate-700 bg-slate-800/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-200">
								{fundingReadiness.status}
							</p>
							{fundingReadiness.eta && (
								<p className="text-sm text-slate-400">Estimated readiness: {fundingReadiness.eta}</p>
							)}
						</div>
					</SectionCard>
				</div>

				<SectionCard title="Engine Health" iconKey="trending-up">
					<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
						{(Object.keys(healthConfig) as HealthDomain[]).map((key) => {
							const metric = health[key];
							const config = healthConfig[key];
							const Icon = config.icon;
							const tone = metric.tone ?? 'watch';

							return (
								<div
									key={key}
									className="rounded-xl border border-slate-800 bg-slate-900/70 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.08)]"
								>
									<div className="mb-3 flex items-center justify-between gap-2">
										<div className="flex items-center gap-2">
											<Icon className="h-4 w-4 text-cyan-300" />
											<p className="text-sm font-semibold text-slate-100">{config.label}</p>
										</div>
										<span className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${toneClasses[tone]}`}>
											{metric.status}
										</span>
									</div>
									<p className="text-2xl font-semibold text-slate-100">{metric.score}%</p>
									{metric.note && <p className="mt-2 text-xs text-slate-400">{metric.note}</p>}
								</div>
							);
						})}
					</div>
				</SectionCard>

				<div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
					<SectionCard title="Critical Blockers" iconKey="alert-triangle">
						{criticalBlockers.length === 0 ? (
							<p className="text-sm text-slate-400">No critical blockers in the current snapshot.</p>
						) : (
							<ul className="space-y-3">
								{criticalBlockers.map((blocker) => (
									<li
										key={blocker.id}
										className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3"
									>
										<p className="text-sm font-semibold text-rose-200">{blocker.title}</p>
										{blocker.description && (
											<p className="mt-1 text-xs leading-relaxed text-rose-100/80">{blocker.description}</p>
										)}
									</li>
								))}
							</ul>
						)}
					</SectionCard>

					<SectionCard title="Next Recommended Action" iconKey="badge-check">
						<div className="space-y-3 rounded-xl border border-cyan-900/50 bg-cyan-950/20 p-4">
							<p className="text-sm font-semibold text-cyan-200">{nextRecommendedAction.title}</p>
							<p className="text-sm leading-relaxed text-slate-300">{nextRecommendedAction.description}</p>
							{(nextRecommendedAction.owner || nextRecommendedAction.dueLabel) && (
								<div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
									{nextRecommendedAction.owner && (
										<span className="rounded-full bg-slate-800 px-2 py-1">
											Owner: {nextRecommendedAction.owner}
										</span>
									)}
									{nextRecommendedAction.dueLabel && (
										<span className="rounded-full bg-slate-800 px-2 py-1">
											Due: {nextRecommendedAction.dueLabel}
										</span>
									)}
								</div>
							)}
						</div>
					</SectionCard>
				</div>
			</div>
		</section>
	);
}
