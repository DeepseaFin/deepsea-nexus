"use client";

import React from "react";
import SectionCard from "@/components/ui/SectionCard";
import type {
  PassportPanelConfig,
  PassportPanelModel,
} from "@/lib/customer/business-passport/passport-panel.types";

function renderText(value?: string | number): string {
  if (typeof value === "number") {
    return `${value}`;
  }

  if (value && value.trim().length > 0) {
    return value;
  }

  return "Not available";
}

export interface BusinessPassportSectionsProps {
  readonly config: PassportPanelConfig;
  readonly model: PassportPanelModel;
}

export default function BusinessPassportSections({ config, model }: BusinessPassportSectionsProps) {
  return (
    <div className="space-y-4">
      <SectionCard title={config.identityHeader.title} subtitle={config.identityHeader.subtitle}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Legal Name</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.identityProfile.legalName)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration Number</p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {renderText(model.identityProfile.registrationNumber)}
            </p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Jurisdiction</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.identityProfile.jurisdiction)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Country</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.identityProfile.country)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Entity Type</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.identityProfile.entityType)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Industry</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.identityProfile.industry)}</p>
          </article>
        </div>
      </SectionCard>

      <SectionCard title={config.governanceHeader.title} subtitle={config.governanceHeader.subtitle}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Owner</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.governanceProfile.owner)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Custodian</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.governanceProfile.custodian)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Reviewer</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{renderText(model.governanceProfile.reviewer)}</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Approval Status</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-100">
              {renderText(model.governanceProfile.approvalStatus?.replace(/_/g, " "))}
            </p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Review Frequency</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-100">
              {renderText(model.governanceProfile.reviewFrequency?.replace(/_/g, " "))}
            </p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Policy Version</p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {renderText(model.governanceProfile.policyVersion)}
            </p>
          </article>
        </div>
      </SectionCard>

      <SectionCard title={config.evidenceHeader.title} subtitle={config.evidenceHeader.subtitle}>
        <div className="grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Coverage Score</p>
            <p className="mt-1 text-sm font-medium text-slate-100">
              {renderText(model.evidenceProfile.evidenceCoverageScore)}
            </p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Evidence References</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{model.evidenceProfile.evidence.length}</p>
          </article>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Missing Evidence</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {(model.evidenceProfile.missingEvidenceItems ?? []).length > 0 ? (
                model.evidenceProfile.missingEvidenceItems?.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </article>

          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Stale Evidence</p>
            <ul className="mt-2 space-y-1 text-sm text-slate-300">
              {(model.evidenceProfile.staleEvidenceItems ?? []).length > 0 ? (
                model.evidenceProfile.staleEvidenceItems?.map((item) => <li key={item}>{item}</li>)
              ) : (
                <li>None</li>
              )}
            </ul>
          </article>
        </div>
      </SectionCard>

      <SectionCard title={config.knowledgeHeader.title} subtitle={config.knowledgeHeader.subtitle}>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Confidence Score</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{model.passport.confidence.score}%</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Confidence Band</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-100">
              {renderText(model.passport.confidence.band.replace(/_/g, " "))}
            </p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Knowledge Density</p>
            <p className="mt-1 text-sm font-medium text-slate-100">{model.passport.knowledgeDensity.score}%</p>
          </article>
          <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
            <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Knowledge Band</p>
            <p className="mt-1 text-sm font-medium capitalize text-slate-100">
              {renderText(model.passport.knowledgeDensity.band.replace(/_/g, " "))}
            </p>
          </article>
        </div>
      </SectionCard>
    </div>
  );
}
