import UIButton from "@/components/ui/Button";
import UICard from "@/components/ui/Card";

export interface HomeQuickAction {
  readonly id: string;
  readonly label: string;
  readonly tone?: "primary" | "secondary" | "ghost";
}

export interface HomeQuickActionsProps {
  readonly actions: readonly HomeQuickAction[];
}

export default function HomeQuickActions({ actions }: HomeQuickActionsProps) {
  return (
    <UICard variant="subtle" className="p-5 sm:p-6">
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-slate-300">Quick Actions</h3>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {actions.map((action) => (
          <UIButton key={action.id} variant={action.tone ?? "ghost"} className="justify-start" fullWidth>
            {action.label}
          </UIButton>
        ))}
      </div>
    </UICard>
  );
}
