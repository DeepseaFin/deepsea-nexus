import { DealProvider } from '@/components/atlas/common/DealContext';
import ClientOpportunityPortal from '@/components/atlas/portal/ClientOpportunityPortal';

export default function PortalPage() {
  return (
    <DealProvider>
      <ClientOpportunityPortal />
    </DealProvider>
  );
}
