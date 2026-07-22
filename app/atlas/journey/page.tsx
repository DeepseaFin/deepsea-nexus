import {
  ConfidenceBand,
} from "@/lib/business-passport/types/Confidence";
import {
  KnowledgeDensityBand,
} from "@/lib/business-passport/types/KnowledgeDensity";
import {
  JourneyStatus,
  JourneyStep,
  type JourneyRecommendation,
  type JourneyState,
  type JourneyTimelineEvent,
} from "@/lib/journey";
import { PassportStatus } from "@/lib/business-passport/constants/PassportStatus";
import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type { IdentityProfile } from "@/lib/business-passport/domain/Profiles";
import EvidencePanel from "@/components/atlas/intelligence/EvidencePanel";
import type { ComponentProps } from "react";
import JourneyWorkspace from "@/src/capabilities/journey/components/JourneyWorkspace";

type JourneyWorkspaceBusinessPassport = Pick<BusinessPassport, "status" | "metadata"> & {
  readonly profiles: {
    readonly identityProfile: IdentityProfile;
  };
};

type JourneyWorkspaceEvidence = ComponentProps<typeof EvidencePanel>["evidence"];

const JOURNEY_STEPS: readonly JourneyStep[] = [
  JourneyStep.BeginRelationship,
  JourneyStep.Identity,
  JourneyStep.DocumentCollection,
  JourneyStep.OracleProcessing,
  JourneyStep.EvidenceValidation,
  JourneyStep.KnowledgeGeneration,
  JourneyStep.BusinessPassport,
  JourneyStep.CreditReadiness,
  JourneyStep.Approval,
  JourneyStep.Completed,
];

const JOURNEY_STATE: JourneyState = {
  journeyId: "JRN-2401",
  businessId: "BUS-1190",
  status: JourneyStatus.InProgress,
  currentStep: JourneyStep.EvidenceValidation,
  completedSteps: [
    JourneyStep.BeginRelationship,
    JourneyStep.Identity,
    JourneyStep.DocumentCollection,
    JourneyStep.OracleProcessing,
  ],
  startedAt: "2026-07-12T08:10:00Z",
  lastUpdated: "2026-07-13T09:20:00Z",
};

const RECOMMENDATIONS: readonly JourneyRecommendation[] = [
  {
    title: "Confirm Evidence Set Completeness",
    description: "Validate that mandatory corporate and financial evidence is present before knowledge generation.",
    priority: "high",
    generatedAt: "2026-07-13T09:18:00Z",
  },
  {
    title: "Prepare Credit Readiness Notes",
    description: "Draft exceptions and mitigation notes to accelerate downstream credit review.",
    priority: "medium",
    generatedAt: "2026-07-13T09:19:00Z",
  },
];

const TIMELINE: readonly JourneyTimelineEvent[] = [
  {
    timestamp: "2026-07-12T08:10:00Z",
    event: "Journey initiated",
    performedBy: "RM Desk",
    notes: "Relationship kickoff completed.",
  },
  {
    timestamp: "2026-07-12T10:25:00Z",
    event: "Identity completed",
    performedBy: "Compliance Analyst",
    notes: "Identity package validated.",
  },
  {
    timestamp: "2026-07-12T14:45:00Z",
    event: "Document collection finalized",
    performedBy: "Operations",
    notes: "Initial evidence set available.",
  },
  {
    timestamp: "2026-07-13T08:35:00Z",
    event: "Oracle processing completed",
    performedBy: "ORACLE Pipeline",
    notes: "Structured artifacts ready for validation.",
  },
  {
    timestamp: "2026-07-13T09:20:00Z",
    event: "Evidence validation started",
    performedBy: "Journey Operator",
    notes: "Reviewing confidence and missing items.",
  },
];

const MISSING_ITEMS: readonly string[] = [
  "Counterparty aging report for Q2.",
  "Signed board resolution addendum.",
  "Insurance endorsement reference for active facility.",
];

const ACTIONS: readonly string[] = [
  "Run evidence checklist review",
  "Escalate missing board resolution",
  "Prepare handoff for knowledge generation",
];

const BUSINESS_PASSPORT: JourneyWorkspaceBusinessPassport = {
  status: PassportStatus.UnderReview,
  metadata: {
    audit: {
      createdAt: "2026-07-10T10:00:00Z",
      createdBy: "Identity Service",
      updatedAt: "2026-07-13T09:20:00Z",
      updatedBy: "Journey Operator",
    },
    lineage: {
      sourceSystems: ["DNOS-ONBOARDING"],
      sourceReferences: ["BUS-1190"],
      ingestedAt: "2026-07-10T10:05:00Z",
    },
    version: {
      aggregateVersion: 3,
      schemaVersion: "1.0.0",
      modelVersion: "1.0.0",
    },
  },
  profiles: {
    identityProfile: {
      profileCode: "IDENTITY",
      lastUpdatedAt: "2026-07-13T09:20:00Z",
      confidence: {
        score: 88,
        band: ConfidenceBand.High,
        assessedAt: "2026-07-13T09:15:00Z",
        breakdown: [],
      },
      knowledgeDensity: {
        score: 76,
        band: KnowledgeDensityBand.Established,
        assessedAt: "2026-07-13T09:15:00Z",
        dimensions: [],
      },
      evidence: [],
      legalName: "Northstar Exports LLC",
      registrationNumber: "REG-77421",
      jurisdiction: "UAE",
      incorporationDate: "2017-03-22",
      entityType: "Limited Liability Company",
    },
  },
};

const EVIDENCE: JourneyWorkspaceEvidence = [
  {
    id: "ev-001",
    title: "Certificate of Incorporation",
    description: "Verified legal incorporation artifact aligned with identity profile.",
    source: "Document Collection",
    confidence: 91,
  },
  {
    id: "ev-002",
    title: "Trade License",
    description: "Current operating license extracted and normalized for review.",
    source: "ORACLE Processing",
    confidence: 87,
  },
  {
    id: "ev-003",
    title: "Board Resolution",
    description: "Supporting governance artifact pending final completeness confirmation.",
    source: "Evidence Validation",
    confidence: 79,
  },
];

export default function JourneyPage() {
  return (
    <JourneyWorkspace
      journeyState={JOURNEY_STATE}
      steps={JOURNEY_STEPS}
      recommendations={RECOMMENDATIONS}
      missingItems={MISSING_ITEMS}
      nextAction="Complete evidence validation and route to Knowledge Generation."
      actions={ACTIONS}
      timeline={TIMELINE}
      businessPassport={BUSINESS_PASSPORT}
      evidence={EVIDENCE}
    />
  );
}