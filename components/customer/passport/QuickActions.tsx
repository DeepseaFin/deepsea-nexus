import UIButton from "@/components/ui/Button";
import UICard from "@/components/ui/Card";

export interface PassportQuickAction {
  readonly id: string;
  readonly label: string;
  readonly variant?: "primary" | "secondary" | "ghost";
  readonly disabled?: boolean;
}

export interface PassportQuickActionsProps {
  readonly actions: readonly PassportQuickAction[];
  readonly onAction?: (actionId: string) => void;
}

export default function PassportQuickActions({ actions, onAction }: PassportQuickActionsProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Quick Actions</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <UIButton
            key={action.id}
            variant={action.variant ?? "ghost"}
            fullWidth
            className="justify-start"
            disabled={action.disabled}
            onClick={() => onAction?.(action.id)}
          >
            {action.label}
          </UIButton>
        ))}
      </div>
    </UICard>
  );
}
