export type NodeType =
  | 'Client'
  | 'Buyer'
  | 'Seller'
  | 'Counterparty'
  | 'Bank'
  | 'Collection Account'
  | 'Facility'
  | 'Invoice'
  | 'Director'
  | 'Shareholder'
  | 'Parent Company'
  | 'Subsidiary'
  | 'Ultimate Beneficial Owner'
  | 'Guarantor'
  | 'Insurance Company'
  | 'Legal Counsel'
  | 'Auditor'
  | 'Broker'
  | 'Collection Agent'
  | 'SPV'
  | 'Trust'
  | 'Document'
  | 'Legal Case'
  | 'Court Matter';

export type EdgeType =
  | 'Owns'
  | 'Controls'
  | 'Guarantees'
  | 'Funds'
  | 'Purchases'
  | 'Sells'
  | 'Assigns'
  | 'Collects'
  | 'Represents'
  | 'Insures'
  | 'Audits'
  | 'Finances'
  | 'Reports To'
  | 'Related Party'
  | 'Family Relationship'
  | 'Board Member';

export type RiskRating = 'Low' | 'Medium' | 'High';

export type EntityNode = {
  id: string;
  name: string;
  type: NodeType;
  country: string;
  industry: string;
  riskRating: RiskRating;
  exposure: number;
  currency: 'AED' | 'USD' | 'SAR' | 'QAR';
  relationshipScore: number;
  outstandingCollections: number;
  facilities: number;
  connectedDeals: number;
  banks: number;
  legalMatters: number;
  documents: number;
  legalStatus: 'Clear' | 'Pending' | 'Disputed';
  collectionStatus: 'Current' | 'Monitoring' | 'Overdue';
  fundingStatus: 'Active' | 'Scheduled' | 'Paused';
  recentActivity: string;
};

export type RelationshipEdge = {
  id: string;
  from: string;
  to: string;
  type: EdgeType;
  strength: number;
};

export const NODE_TYPES: NodeType[] = [
  'Client',
  'Buyer',
  'Seller',
  'Counterparty',
  'Bank',
  'Collection Account',
  'Facility',
  'Invoice',
  'Director',
  'Shareholder',
  'Parent Company',
  'Subsidiary',
  'Ultimate Beneficial Owner',
  'Guarantor',
  'Insurance Company',
  'Legal Counsel',
  'Auditor',
  'Broker',
  'Collection Agent',
  'SPV',
  'Trust',
  'Document',
  'Legal Case',
  'Court Matter',
];

export const EDGE_TYPES: EdgeType[] = [
  'Owns',
  'Controls',
  'Guarantees',
  'Funds',
  'Purchases',
  'Sells',
  'Assigns',
  'Collects',
  'Represents',
  'Insures',
  'Audits',
  'Finances',
  'Reports To',
  'Related Party',
  'Family Relationship',
  'Board Member',
];

const COUNTRIES = ['UAE', 'Saudi Arabia', 'Qatar', 'Bahrain', 'Kuwait', 'Oman', 'UK', 'Singapore'];
const INDUSTRIES = ['Trade Finance', 'Logistics', 'Energy', 'Healthcare', 'Retail', 'Infrastructure', 'Banking', 'Legal'];
const LEGAL_STATUS: EntityNode['legalStatus'][] = ['Clear', 'Pending', 'Disputed'];
const COLLECTION_STATUS: EntityNode['collectionStatus'][] = ['Current', 'Monitoring', 'Overdue'];
const FUNDING_STATUS: EntityNode['fundingStatus'][] = ['Active', 'Scheduled', 'Paused'];
const CURRENCIES: EntityNode['currency'][] = ['AED', 'USD', 'SAR', 'QAR'];

const coreNodes: EntityNode[] = [
  {
    id: 'client-abc',
    name: 'ABC Limited',
    type: 'Client',
    country: 'UAE',
    industry: 'Trade Finance',
    riskRating: 'Medium',
    exposure: 18_600_000,
    currency: 'AED',
    relationshipScore: 84,
    outstandingCollections: 2_900_000,
    facilities: 4,
    connectedDeals: 6,
    banks: 3,
    legalMatters: 2,
    documents: 19,
    legalStatus: 'Pending',
    collectionStatus: 'Monitoring',
    fundingStatus: 'Active',
    recentActivity: 'Facility RF-880 funding approval completed.',
  },
  {
    id: 'buyer-orion',
    name: 'Orion Buyer Group',
    type: 'Buyer',
    country: 'Saudi Arabia',
    industry: 'Retail',
    riskRating: 'High',
    exposure: 6_300_000,
    currency: 'SAR',
    relationshipScore: 63,
    outstandingCollections: 3_800_000,
    facilities: 2,
    connectedDeals: 4,
    banks: 1,
    legalMatters: 3,
    documents: 11,
    legalStatus: 'Disputed',
    collectionStatus: 'Overdue',
    fundingStatus: 'Scheduled',
    recentActivity: 'Collections escalated after delayed remittance.',
  },
  {
    id: 'bank-adcb',
    name: 'ADCB Institutional',
    type: 'Bank',
    country: 'UAE',
    industry: 'Banking',
    riskRating: 'Low',
    exposure: 21_200_000,
    currency: 'AED',
    relationshipScore: 91,
    outstandingCollections: 0,
    facilities: 0,
    connectedDeals: 8,
    banks: 0,
    legalMatters: 0,
    documents: 8,
    legalStatus: 'Clear',
    collectionStatus: 'Current',
    fundingStatus: 'Active',
    recentActivity: 'Line utilization rebalance completed.',
  },
  {
    id: 'facility-rf880',
    name: 'Facility RF-880',
    type: 'Facility',
    country: 'UAE',
    industry: 'Trade Finance',
    riskRating: 'Medium',
    exposure: 8_700_000,
    currency: 'AED',
    relationshipScore: 78,
    outstandingCollections: 1_300_000,
    facilities: 1,
    connectedDeals: 1,
    banks: 2,
    legalMatters: 1,
    documents: 7,
    legalStatus: 'Pending',
    collectionStatus: 'Monitoring',
    fundingStatus: 'Active',
    recentActivity: 'Guarantee pack update submitted to legal.',
  },
  {
    id: 'director-lina',
    name: 'Lina Al Noor',
    type: 'Director',
    country: 'UAE',
    industry: 'Infrastructure',
    riskRating: 'Low',
    exposure: 0,
    currency: 'AED',
    relationshipScore: 88,
    outstandingCollections: 0,
    facilities: 0,
    connectedDeals: 0,
    banks: 0,
    legalMatters: 0,
    documents: 2,
    legalStatus: 'Clear',
    collectionStatus: 'Current',
    fundingStatus: 'Active',
    recentActivity: 'Board structure amendment approved.',
  },
  {
    id: 'guarantor-gulf',
    name: 'Gulf Trade Holdings',
    type: 'Guarantor',
    country: 'Bahrain',
    industry: 'Infrastructure',
    riskRating: 'Medium',
    exposure: 7_900_000,
    currency: 'USD',
    relationshipScore: 76,
    outstandingCollections: 0,
    facilities: 3,
    connectedDeals: 3,
    banks: 2,
    legalMatters: 1,
    documents: 8,
    legalStatus: 'Pending',
    collectionStatus: 'Current',
    fundingStatus: 'Scheduled',
    recentActivity: 'Guarantee validity requires renewal in 21 days.',
  },
];

const coreEdges: RelationshipEdge[] = [
  { id: 'e-core-1', from: 'client-abc', to: 'facility-rf880', type: 'Assigns', strength: 5 },
  { id: 'e-core-2', from: 'bank-adcb', to: 'facility-rf880', type: 'Funds', strength: 5 },
  { id: 'e-core-3', from: 'guarantor-gulf', to: 'facility-rf880', type: 'Guarantees', strength: 5 },
  { id: 'e-core-4', from: 'buyer-orion', to: 'client-abc', type: 'Purchases', strength: 3 },
  { id: 'e-core-5', from: 'director-lina', to: 'client-abc', type: 'Board Member', strength: 4 },
];

export function money(value: number, currency: EntityNode['currency'] = 'AED'): string {
  return `${currency} ${Math.round(value).toLocaleString('en-US')}`;
}

export function buildRelationshipDataset(scale: number = 900): { nodes: EntityNode[]; edges: RelationshipEdge[] } {
  const nodes = [...coreNodes];
  const edges = [...coreEdges];

  for (let index = 0; index < scale; index += 1) {
    const type = NODE_TYPES[index % NODE_TYPES.length];
    const country = COUNTRIES[index % COUNTRIES.length];
    const industry = INDUSTRIES[index % INDUSTRIES.length];
    const riskRating: RiskRating = index % 11 === 0 ? 'High' : index % 3 === 0 ? 'Medium' : 'Low';
    const legalStatus = LEGAL_STATUS[index % LEGAL_STATUS.length];
    const collectionStatus = COLLECTION_STATUS[index % COLLECTION_STATUS.length];
    const fundingStatus = FUNDING_STATUS[index % FUNDING_STATUS.length];
    const currency = CURRENCIES[index % CURRENCIES.length];

    const nodeId = `syn-${type.toLowerCase().replace(/[^a-z]/g, '-')}-${index}`;
    const exposure = type === 'Director' || type === 'Legal Counsel' || type === 'Auditor'
      ? 0
      : 900_000 + ((index * 193_000) % 9_100_000);

    nodes.push({
      id: nodeId,
      name: `${type} ${index + 1}`,
      type,
      country,
      industry,
      riskRating,
      exposure,
      currency,
      relationshipScore: 55 + (index % 45),
      outstandingCollections: Math.round(exposure * ((index % 4) * 0.07)),
      facilities: index % 5,
      connectedDeals: index % 7,
      banks: index % 4,
      legalMatters: index % 3,
      documents: 2 + (index % 10),
      legalStatus,
      collectionStatus,
      fundingStatus,
      recentActivity: `${type} ${index + 1} relationship profile updated by ATLAS AI.`,
    });

    const hub = index % 2 === 0 ? 'client-abc' : 'facility-rf880';
    edges.push({
      id: `syn-e-${index}-a`,
      from: nodeId,
      to: hub,
      type: EDGE_TYPES[index % EDGE_TYPES.length],
      strength: 1 + (index % 5),
    });

    if (index % 3 === 0) {
      edges.push({
        id: `syn-e-${index}-b`,
        from: nodeId,
        to: 'bank-adcb',
        type: index % 2 === 0 ? 'Finances' : 'Reports To',
        strength: 2 + (index % 4),
      });
    }
  }

  return { nodes, edges };
}
