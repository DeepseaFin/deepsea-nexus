import { DealProvider } from '@/components/atlas/common/DealContext';
import ClientOpportunityIntakePortal from '@/components/atlas/intake/ClientOpportunityIntakePortal';

export default function OpportunityIntakePage() {
  return (
    <DealProvider>
      <ClientOpportunityIntakePortal />
    </DealProvider>
  );
}
