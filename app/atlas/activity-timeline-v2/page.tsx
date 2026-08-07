import type { Metadata } from 'next';
import InstitutionalTimeline from '@/components/workspace/InstitutionalTimeline';

export const metadata: Metadata = {
  title: 'Institutional Activity Timeline v2 | Deepsea Nexus',
  description: 'Chronological institutional activity timeline for DNOS.',
};

export default function ActivityTimelineV2Page() {
  return <InstitutionalTimeline />;
}
