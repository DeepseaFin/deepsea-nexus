import { ConfidenceBand } from "@/lib/business-passport/types/Confidence";
import { PassportLifecycle } from "@/lib/business-passport/constants/PassportLifecycle";
import { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import { KnowledgeDensityBand } from "@/lib/business-passport/types/KnowledgeDensity";
import { PassportId } from "@/lib/business-passport/value-objects/PassportId";
import type {
  PassportPanelConfig,
  PassportPanelModel,
  PassportPanelStatus,
} from "@/lib/customer/business-passport/passport-panel.types";

export const passportPanelConfig: PassportPanelConfig = {
  heading: "Business Passport",
  subtitle: "Canonical institutional profile reused inside the customer workspace",
  statusLabel: "Passport Workspace Status",
  progressHeader: {
    title: "Completion Progress",
    subtitle: "Readiness supplied by upstream capability and passed through as presentation data",
  },
  identityHeader: {
    title: "Identity Summary",
    subtitle: "Institution identity context from passport profile",
  },
  governanceHeader: {
    title: "Governance Summary",
    subtitle: "Accountability and review state from governance profile",
  },
  evidenceHeader: {
    title: "Evidence Summary",
    subtitle: "Coverage posture and outstanding evidence signals",
  },
  knowledgeHeader: {
    title: "Knowledge Summary",
    subtitle: "Confidence and knowledge density posture from canonical passport",
  },
  insightsHeader: {
    title: "Institutional Insights",
    subtitle: "Framework-only recommendations for future intelligence composition",
  },
};

export const defaultPassportPanelStates: readonly PassportPanelStatus[] = [
  "Draft",
  "In Review",
  "Verified",
  "Approved",
  "Archived",
];

export const defaultPassportPanelModel: PassportPanelModel = {
  panelStatus: "In Review",
  completionPercent: 68,
  completionLabel: "68% complete",
  passport: {
    passportId: PassportId.fromString("BPP-CUST-24001"),
    status: PassportStatus.UnderReview,
    lifecycle: PassportLifecycle.Institutionalization,
    confidence: {
      score: 81,
      band: ConfidenceBand.High,
      assessedAt: "2026-07-24T00:00:00.000Z",
      breakdown: [
        {
          dimension: "identity",
          score: 84,
          weight: 0.4,
        },
        {
          dimension: "governance",
          score: 79,
          weight: 0.35,
        },
        {
          dimension: "evidence",
          score: 80,
          weight: 0.25,
        },
      ],
    },
    knowledgeDensity: {
      score: 73,
      band: KnowledgeDensityBand.Established,
      assessedAt: "2026-07-24T00:00:00.000Z",
      dimensions: [
        {
          dimension: "identity",
          score: 78,
        },
        {
          dimension: "financial",
          score: 70,
        },
        {
          dimension: "evidence",
          score: 72,
        },
      ],
    },
    metadata: {
      audit: {
        createdAt: "2026-06-03T09:15:00.000Z",
        createdBy: "rm.ariane",
        updatedAt: "2026-07-21T16:40:00.000Z",
        updatedBy: "ops.supervisor",
      },
      lineage: {
        sourceSystems: ["onboarding", "documents", "relationship"],
        sourceReferences: ["NB-7781", "DOC-99213"],
        ingestedAt: "2026-07-21T16:38:00.000Z",
      },
      version: {
        aggregateVersion: 8,
        schemaVersion: "1.0.0",
        modelVersion: "2026.07",
      },
    },
  },
  identityProfile: {
    profileCode: "identity",
    lastUpdatedAt: "2026-07-21T16:30:00.000Z",
    confidence: {
      score: 84,
      band: ConfidenceBand.High,
      assessedAt: "2026-07-21T16:30:00.000Z",
      breakdown: [],
    },
    knowledgeDensity: {
      score: 76,
      band: KnowledgeDensityBand.Established,
      assessedAt: "2026-07-21T16:30:00.000Z",
      dimensions: [],
    },
    evidence: [],
    legalName: "Northwind Maritime Holdings",
    registrationNumber: "SG-1998-4401",
    jurisdiction: "Singapore",
    country: "Singapore",
    entityType: "Private Limited",
    industry: "Maritime Logistics",
  },
  governanceProfile: {
    profileCode: "governance",
    lastUpdatedAt: "2026-07-21T16:32:00.000Z",
    confidence: {
      score: 79,
      band: ConfidenceBand.Moderate,
      assessedAt: "2026-07-21T16:32:00.000Z",
      breakdown: [],
    },
    knowledgeDensity: {
      score: 69,
      band: KnowledgeDensityBand.Emerging,
      assessedAt: "2026-07-21T16:32:00.000Z",
      dimensions: [],
    },
    evidence: [],
    owner: "Ariane D.",
    custodian: "Ops Governance",
    reviewer: "Compliance Lead",
    approvalStatus: "pending",
    reviewFrequency: "quarterly",
    policyVersion: "v3.2",
  },
  evidenceProfile: {
    profileCode: "evidence",
    lastUpdatedAt: "2026-07-21T16:34:00.000Z",
    confidence: {
      score: 80,
      band: ConfidenceBand.High,
      assessedAt: "2026-07-21T16:34:00.000Z",
      breakdown: [],
    },
    knowledgeDensity: {
      score: 71,
      band: KnowledgeDensityBand.Established,
      assessedAt: "2026-07-21T16:34:00.000Z",
      dimensions: [],
    },
    evidence: [],
    evidenceCoverageScore: 74,
    missingEvidenceItems: ["Latest audited financials", "Ultimate beneficial ownership declaration"],
    staleEvidenceItems: ["Sanctions screening record older than 90 days"],
  },
  aiProfile: {
    profileCode: "ai",
    lastUpdatedAt: "2026-07-21T16:35:00.000Z",
    confidence: {
      score: 77,
      band: ConfidenceBand.Moderate,
      assessedAt: "2026-07-21T16:35:00.000Z",
      breakdown: [],
    },
    knowledgeDensity: {
      score: 68,
      band: KnowledgeDensityBand.Emerging,
      assessedAt: "2026-07-21T16:35:00.000Z",
      dimensions: [],
    },
    evidence: [],
    orchestratorConfidence: 77,
    insightCount: 12,
    unresolvedConflicts: 1,
  },
  insights: [
    {
      id: "insight-evidence-refresh",
      title: "Refresh stale compliance evidence",
      summary: "Schedule updated sanctions screening evidence before final approval routing.",
      category: "Evidence",
      priority: "high",
      actionLabel: "Schedule refresh",
    },
    {
      id: "insight-governance-review",
      title: "Complete governance reviewer attestation",
      summary: "Reviewer assignment exists but attestation signature is not yet marked complete.",
      category: "Governance",
      priority: "medium",
      actionLabel: "Open governance checklist",
    },
  ],
};
