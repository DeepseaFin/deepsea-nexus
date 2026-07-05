"use client";

import { PlusCircle } from "lucide-react";
import DealCommandCenter from "@/components/atlas/dashboard/DealCommandCenter";
import FinancialSummary from "@/components/atlas/deal/FinancialSummary";
import PricingEditor from "@/components/atlas/deal/PricingEditor";
import ActionPanel from "@/components/atlas/intelligence/ActionPanel";
import ExecutiveVerdict from "@/components/atlas/intelligence/ExecutiveVerdict";
import FindingsPanel from "@/components/atlas/intelligence/FindingsPanel";
import SectionCard from "@/components/atlas/intelligence/SectionCard";
import TrustScore from "@/components/atlas/intelligence/TrustScore";
import { useDeal } from "@/components/atlas/common/DealContext";
import { useRouter } from "next/navigation";
import DealTimeline from "./DealTimeline";

export default function OverviewWorkspace() {
  const router = useRouter();
  const { deal } = useDeal();

  const dealConfidenceIndex = 88;
  const trustScore = 91;
  const readinessScore = 86;

  const findings = {
    strengths: [
      {
        id: "latest-01",
        text: "Pricing structure remains within approved policy thresholds.",
        severity: "low" as const,
      },
      {
        id: "latest-02",
        text: "Counterparty internal rating supports current funding posture.",
        severity: "low" as const,
      },
    ],
    observations: [
      {
        id: "latest-03",
        text: "Final legal package and completion evidence should be tracked in the next cycle.",
        severity: "medium" as const,
      },
    ],
    risks: [
      {
        id: "risk-01",
        text: "Treasury readiness signal remains pending final confirmation.",
        severity: "high" as const,
      },
      {
        id: "risk-02",
        text: "Funding execution remains contingent on full document closure.",
        severity: "high" as const,
      },
    ],
  };

  const actions = [
    {
      id: "next-01",
      title: "Confirm treasury allocation",
      description: "Secure final allocation window for disbursement readiness.",
      owner: "Treasury Desk",
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      priority: "critical" as const,
      status: "in-progress" as const,
    },
    {
      id: "next-02",
      title: "Close outstanding legal pack",
      description: "Validate legal completion and attach closing evidence.",
      owner: "Legal Team",
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "high" as const,
      status: "pending" as const,
    },
    {
      id: "next-03",
      title: "Prepare funding execution memo",
      description: "Issue final execution note for operations and payments handoff.",
      owner: "Deal Manager",
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      priority: "medium" as const,
      status: "pending" as const,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => router.push("/atlas/deals/new")}
          className="inline-flex items-center gap-2 rounded-xl border border-cyan-700/40 bg-cyan-950/30 px-4 py-2.5 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-900/40"
        >
          <PlusCircle className="h-4 w-4" />
          New Deal
        </button>
      </div>

      <SectionCard title="Deal Context Header">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Stage</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{deal.status}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Client</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{deal.seller.name}</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Product</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">Receivables Financing</p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Country</p>
            <p className="mt-2 text-sm font-semibold text-slate-100">{deal.counterparty.country}</p>
          </div>
        </div>
      </SectionCard>

      <div className="space-y-6">
        <DealCommandCenter
          dealTitle={deal.title}
          dealConfidenceIndex={{
            score: dealConfidenceIndex,
            band: "Strong",
            summary: "Multi-engine confidence remains stable with manageable operational blockers.",
          }}
          executiveVerdict={{
            label: "Proceed with Conditions",
            summary: "Proceed once treasury and legal completion checks are closed.",
            issuedAt: new Date().toISOString(),
          }}
          fundingReadiness={{
            score: readinessScore,
            status: "Conditional",
            eta: "1-2 Business Days",
          }}
          health={{
            documents: { score: 84, status: "Watch", tone: "watch", note: "Final legal artefacts pending." },
            promoter: { score: 90, status: "Healthy", tone: "good", note: "Promoter track record remains stable." },
            collateral: { score: 86, status: "Watch", tone: "watch", note: "Collateral coverage acceptable." },
            legal: { score: 80, status: "Watch", tone: "watch", note: "Final package closure in progress." },
            fraud: { score: 92, status: "Healthy", tone: "good", note: "No active fraud indicators." },
            pricing: { score: 89, status: "Healthy", tone: "good", note: "Pricing remains policy compliant." },
          }}
          criticalBlockers={[
            {
              id: "blk-01",
              title: "Treasury final allocation pending",
              description: "Funding release depends on treasury slot confirmation.",
            },
            {
              id: "blk-02",
              title: "Legal completion evidence required",
              description: "Close legal checklist before execution handoff.",
            },
          ]}
          nextRecommendedAction={{
            title: "Close treasury and legal readiness window",
            description: "Complete final treasury allocation and legal closure to move to funding execution.",
            owner: "Deal Manager",
            dueLabel: "Within 24h",
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <SectionCard title="Deal Confidence Index" className="h-full">
            <p className="text-4xl font-semibold text-emerald-300">{dealConfidenceIndex}%</p>
            <p className="mt-2 text-sm text-slate-400">Consolidated multi-engine confidence for this deal.</p>
          </SectionCard>

          <SectionCard title="Trust Score" className="h-full">
            <TrustScore score={trustScore} label="Institutional Trust" size="sm" />
          </SectionCard>

          <ExecutiveVerdict
            title="Executive Verdict"
            recommendation="Proceed with Conditions"
            overallReadiness={readinessScore}
            riskLevel="Medium"
            criticalBlockers={[
              "Treasury allocation pending",
              "Final legal closure evidence pending",
            ]}
            estimatedFundingTime="1-2 Business Days"
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.8fr)_minmax(320px,1fr)]">
        <div className="space-y-6">
          <FinancialSummary />

          <SectionCard title="Pricing Workspace">
            <PricingEditor />
          </SectionCard>

          <SectionCard title="Deal Timeline">
            <DealTimeline />
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Document Intelligence" badge={{ label: "Connected", variant: "info" }}>
            <p className="text-sm text-slate-300">Document engine integration is available through the Documents workspace.</p>
          </SectionCard>

          <SectionCard title="Promoter Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until promoter intelligence pipeline is enabled.</p>
          </SectionCard>

          <SectionCard title="Counterparty Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until counterparty scoring is integrated.</p>
          </SectionCard>

          <SectionCard title="Collateral Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until collateral valuation signals are connected.</p>
          </SectionCard>

          <SectionCard title="Credit Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until credit intelligence model is wired.</p>
          </SectionCard>

          <SectionCard title="Legal Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until legal intelligence checks are available.</p>
          </SectionCard>

          <SectionCard title="Fraud Intelligence" badge={{ label: "Placeholder", variant: "default" }}>
            <p className="text-sm text-slate-400">Engine placeholder until fraud analytics is connected.</p>
          </SectionCard>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <FindingsPanel findings={findings} />
        </div>

        <SectionCard title="Critical Risks" className="xl:col-span-1">
          <div className="space-y-3">
            {findings.risks.map((risk) => (
              <div key={risk.id} className="rounded-lg border border-rose-900/50 bg-rose-950/20 p-3 text-sm text-rose-100">
                {risk.text}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="xl:col-span-1">
          <ActionPanel actions={actions} title="Next Actions" />
        </div>
      </div>
    </div>
  );
}
