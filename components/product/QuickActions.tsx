import { Plus } from "lucide-react";
import UIButton from "@/components/ui/Button";

export interface QuickActionItem {
  readonly actionId: string;
  readonly label: string;
  readonly onSelect?: () => void;
}

export interface QuickActionsProps {
  readonly actions: readonly QuickActionItem[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Quick actions">
      {actions.map((action) => (
        <UIButton key={action.actionId} size="sm" variant="ghost" onClick={action.onSelect}>
          <Plus className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
          {action.label}
        </UIButton>
      ))}
    </div>
  );
}
