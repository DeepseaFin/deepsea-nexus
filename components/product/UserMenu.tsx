import UICard from "@/components/ui/Card";

export interface ProductUserOption {
  readonly id: string;
  readonly label: string;
  readonly onSelect?: () => void;
}

export interface ProductUserSummary {
  readonly name: string;
  readonly roleLabel?: string;
  readonly email?: string;
}

export interface UserMenuProps {
  readonly open: boolean;
  readonly user: ProductUserSummary;
  readonly options: readonly ProductUserOption[];
  readonly onClose: () => void;
}

export default function UserMenu({ open, user, options, onClose }: UserMenuProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute right-0 top-12 z-40 w-[280px] max-w-[calc(100vw-2rem)]">
      <UICard variant="elevated" className="p-4">
        <header className="border-b border-slate-800 pb-3">
          <p className="text-sm font-semibold text-slate-100">{user.name}</p>
          {user.roleLabel ? <p className="mt-1 text-xs text-slate-400">{user.roleLabel}</p> : null}
          {user.email ? <p className="mt-1 text-xs text-slate-500">{user.email}</p> : null}
        </header>

        <ul className="mt-3 space-y-1">
          {options.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onClick={() => {
                  option.onSelect?.();
                  onClose();
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 ds-motion hover:bg-slate-900/70 hover:text-slate-100"
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      </UICard>
    </div>
  );
}
