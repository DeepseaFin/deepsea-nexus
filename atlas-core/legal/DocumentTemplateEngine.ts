export type LegalSectionName =
  | 'Definitions'
  | 'Commercial Terms'
  | 'Representations'
  | 'Undertakings'
  | 'Conditions Precedent'
  | 'Events of Default'
  | 'Security'
  | 'Guarantees'
  | 'Collections'
  | 'Payment Waterfall'
  | 'Governing Law'
  | 'Dispute Resolution'
  | 'Execution'
  | 'Schedules'
  | 'Annexures'
  | 'Signature Blocks';

export interface LegalDocumentTemplate {
  name: string;
  sequence: number;
  preparedBy: string;
  sectionOrder: LegalSectionName[];
  primaryOwner: string;
  editableSections: LegalSectionName[];
}

const STANDARD_SECTION_ORDER: LegalSectionName[] = [
  'Definitions',
  'Commercial Terms',
  'Representations',
  'Undertakings',
  'Conditions Precedent',
  'Events of Default',
  'Security',
  'Guarantees',
  'Collections',
  'Payment Waterfall',
  'Governing Law',
  'Dispute Resolution',
  'Execution',
  'Schedules',
  'Annexures',
  'Signature Blocks',
];

export const LEGAL_DOCUMENT_TEMPLATES: LegalDocumentTemplate[] = [
  {
    name: 'Receivables Purchase Agreement',
    sequence: 1,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Commercial Terms', 'Conditions Precedent', 'Events of Default', 'Execution'],
  },
  {
    name: 'Assignment Agreement',
    sequence: 2,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Definitions', 'Security', 'Execution'],
  },
  {
    name: 'Notice of Assignment',
    sequence: 3,
    preparedBy: 'Deepsea Nexus Operations Legal',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Operations',
    editableSections: ['Collections', 'Execution'],
  },
  {
    name: 'Payment Direction Letter',
    sequence: 4,
    preparedBy: 'Deepsea Nexus Operations Legal',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Operations',
    editableSections: ['Collections', 'Payment Waterfall', 'Execution'],
  },
  {
    name: 'Collection Account Agreement',
    sequence: 5,
    preparedBy: 'Deepsea Nexus Treasury Legal',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Treasury',
    editableSections: ['Collections', 'Payment Waterfall', 'Execution'],
  },
  {
    name: 'Corporate Guarantee',
    sequence: 6,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Guarantees', 'Security', 'Events of Default'],
  },
  {
    name: 'Personal Guarantee',
    sequence: 7,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Guarantees', 'Execution'],
  },
  {
    name: 'Board Resolution',
    sequence: 8,
    preparedBy: 'Deepsea Nexus Corporate Secretariat',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Client',
    editableSections: ['Execution', 'Schedules'],
  },
  {
    name: 'Promissory Note',
    sequence: 9,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Commercial Terms', 'Payment Waterfall', 'Execution'],
  },
  {
    name: 'Security Assignment',
    sequence: 10,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Security', 'Governing Law', 'Execution'],
  },
  {
    name: 'Power of Attorney',
    sequence: 11,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Execution', 'Annexures'],
  },
  {
    name: 'Undertaking Letter',
    sequence: 12,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Undertakings', 'Conditions Precedent', 'Execution'],
  },
  {
    name: 'Legal Opinion Request',
    sequence: 13,
    preparedBy: 'Deepsea Nexus Legal Structuring',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Governing Law', 'Dispute Resolution', 'Annexures'],
  },
  {
    name: 'Conditions Precedent Checklist',
    sequence: 14,
    preparedBy: 'Deepsea Nexus Legal Closing Desk',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Legal',
    editableSections: ['Conditions Precedent', 'Schedules', 'Annexures'],
  },
  {
    name: 'Closing Checklist',
    sequence: 15,
    preparedBy: 'Deepsea Nexus Closing Desk',
    sectionOrder: STANDARD_SECTION_ORDER,
    primaryOwner: 'Operations',
    editableSections: ['Execution', 'Schedules', 'Annexures'],
  },
];

export const DocumentTemplateEngine = {
  getTemplates(): LegalDocumentTemplate[] {
    return LEGAL_DOCUMENT_TEMPLATES;
  },
};