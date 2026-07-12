import { BadgeCheck } from 'lucide-react';
import SectionCard from '@/components/atlas/intelligence/SectionCard';
import BusinessIdentityCard from '@/components/atlas/business-passport/BusinessIdentityCard';
import type { BusinessPassport } from '@/lib/business-passport/domain/BusinessPassport';
import type { IdentityProfile } from '@/lib/business-passport/domain/Profiles';

interface BusinessPassportSummaryProps {
  passport: Pick<BusinessPassport, 'status' | 'metadata'> & {
    readonly profiles: {
      readonly identityProfile: IdentityProfile;
    };
  };
  className?: string;
}

export default function BusinessPassportSummary({ passport, className }: BusinessPassportSummaryProps) {
  return (
    <SectionCard
      title="Business Passport Identity"
      icon={BadgeCheck}
      badge={{
        label: 'Read Only',
        variant: 'info',
      }}
      className={className}
    >
      <BusinessIdentityCard passport={passport} />
    </SectionCard>
  );
}
