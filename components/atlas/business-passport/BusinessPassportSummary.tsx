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
      title="Business Passport"
      icon={BadgeCheck}
      badge={{
        label: 'Primary',
        variant: 'info',
      }}
      action={{
        label: 'Action Placeholder',
        onClick: () => {},
      }}
      className={className}
    >
      <p className="mb-4 text-sm text-slate-400">
        Canonical institutional identity snapshot used by all downstream operational capabilities.
      </p>
      <BusinessIdentityCard passport={passport} />
    </SectionCard>
  );
}
