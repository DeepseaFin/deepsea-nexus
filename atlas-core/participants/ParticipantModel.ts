import type { DealModel } from '@/atlas-core/deals/DealModel';

export interface ParticipantParty {
  companyName: string;
  country: string;
  industry: string;
  existingRelationship: string;
  existingExposure: string;
  kycStatus: string;
  previousTransactions: string;
}

export interface ParticipantModel {
  client: ParticipantParty;
  counterparty: ParticipantParty;
}

export function buildParticipantModel(deal: DealModel): ParticipantModel {
  return {
    client: {
      companyName: deal.client.legalName,
      country: deal.client.country,
      industry: deal.client.industry,
      existingRelationship: deal.client.relationshipStatus || 'Placeholder',
      existingExposure: 'Placeholder',
      kycStatus: 'Placeholder',
      previousTransactions: 'Placeholder',
    },
    counterparty: {
      companyName: deal.counterparty.name,
      country: deal.counterparty.country,
      industry: deal.counterparty.industry || 'Placeholder',
      existingRelationship: deal.counterparty.relationshipType || 'Placeholder',
      existingExposure: deal.counterparty.existingExposure || 'Placeholder',
      kycStatus: 'Placeholder',
      previousTransactions: 'Placeholder',
    },
  };
}
