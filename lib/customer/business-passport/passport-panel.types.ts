import type { BusinessPassport } from "@/lib/business-passport/domain/BusinessPassport";
import type {
  AIProfile,
  EvidenceProfile,
  GovernanceProfile,
  IdentityProfile,
} from "@/lib/business-passport/domain/Profiles";

export const PASSPORT_PANEL_STATUS_STATES = [
  "Draft",
  "In Review",
  "Verified",
  "Approved",
  "Archived",
] as const;

export type PassportPanelStatus = (typeof PASSPORT_PANEL_STATUS_STATES)[number];

export type PassportPanelPassport = Pick<
  BusinessPassport,
  "passportId" | "status" | "lifecycle" | "metadata" | "confidence" | "knowledgeDensity"
>;

export interface PassportPanelSectionHeader {
  readonly title: string;
  readonly subtitle?: string;
}

export interface PassportPanelRecommendation {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly category?: string;
  readonly priority?: "low" | "medium" | "high";
  readonly actionLabel?: string;
}

export interface PassportPanelConfig {
  readonly heading: string;
  readonly subtitle: string;
  readonly statusLabel: string;
  readonly progressHeader: PassportPanelSectionHeader;
  readonly identityHeader: PassportPanelSectionHeader;
  readonly governanceHeader: PassportPanelSectionHeader;
  readonly evidenceHeader: PassportPanelSectionHeader;
  readonly knowledgeHeader: PassportPanelSectionHeader;
  readonly insightsHeader: PassportPanelSectionHeader;
}

export interface PassportPanelModel {
  readonly panelStatus: PassportPanelStatus;
  readonly completionPercent: number;
  readonly completionLabel: string;
  readonly passport: PassportPanelPassport;
  readonly identityProfile: IdentityProfile;
  readonly governanceProfile: GovernanceProfile;
  readonly evidenceProfile: EvidenceProfile;
  readonly aiProfile?: AIProfile;
  readonly insights: readonly PassportPanelRecommendation[];
}
