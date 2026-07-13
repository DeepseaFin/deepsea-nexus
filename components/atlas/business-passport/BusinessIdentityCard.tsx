import ConfidenceBadge from '@/components/atlas/intelligence/ConfidenceBadge';
import StatusBadge from '@/components/atlas/design-system/StatusBadge';
import type { BusinessPassport } from '@/lib/business-passport/domain/BusinessPassport';
import type { IdentityProfile } from '@/lib/business-passport/domain/Profiles';

interface BusinessIdentityCardProps {
  passport: Pick<BusinessPassport, 'status' | 'metadata'> & {
    readonly profiles: {
      readonly identityProfile: IdentityProfile;
    };
  };
}

function formatDate(value?: string): string {
  if (!value) {
    return 'Not available';
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

function formatDateTime(value: string): string {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleString([], {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusTone(status: BusinessPassport['status']) {
  switch (status) {
    case 'active':
      return 'success' as const;
    case 'under_review':
      return 'warning' as const;
    case 'restricted':
    case 'suspended':
      return 'danger' as const;
    case 'archived':
      return 'neutral' as const;
    default:
      return 'info' as const;
  }
}

function renderValue(value?: string): string {
  return value && value.trim().length > 0 ? value : 'Not available';
}

export default function BusinessIdentityCard({ passport }: BusinessIdentityCardProps) {
  const identityProfile = passport.profiles.identityProfile;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <StatusBadge label={passport.status.replace(/_/g, ' ')} tone={statusTone(passport.status)} />
        <ConfidenceBadge score={identityProfile.confidence.score} size="sm" />
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Legal Name</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{renderValue(identityProfile.legalName)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Registration Number</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{renderValue(identityProfile.registrationNumber)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Jurisdiction</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{renderValue(identityProfile.jurisdiction)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Entity Type</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{renderValue(identityProfile.entityType)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Incorporation Date</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{formatDate(identityProfile.incorporationDate)}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Passport Status</p>
          <p className="mt-1 text-sm font-semibold capitalize text-slate-100">{passport.status.replace(/_/g, ' ')}</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Knowledge Confidence</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{identityProfile.confidence.score}%</p>
        </article>

        <article className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3">
          <p className="text-xs uppercase tracking-[0.12em] text-slate-500">Last Updated</p>
          <p className="mt-1 text-sm font-semibold text-slate-100">{formatDateTime(identityProfile.lastUpdatedAt || passport.metadata.audit.updatedAt)}</p>
        </article>
      </div>
    </div>
  );
}
