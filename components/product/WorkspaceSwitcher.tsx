import SelectInput from "@/components/ui/SelectInput";

export interface WorkspaceSwitcherItem {
  readonly workspaceId: string;
  readonly label: string;
}

export interface WorkspaceSwitcherProps {
  readonly items: readonly WorkspaceSwitcherItem[];
  readonly activeWorkspaceId?: string;
  readonly onWorkspaceChange?: (workspaceId: string) => void;
}

export default function WorkspaceSwitcher({
  items,
  activeWorkspaceId,
  onWorkspaceChange,
}: WorkspaceSwitcherProps) {
  return (
    <div className="min-w-[180px] max-w-[260px]">
      <label className="sr-only" htmlFor="workspace-switcher">
        Switch workspace
      </label>
      <SelectInput
        id="workspace-switcher"
        name="workspace"
        value={activeWorkspaceId ?? items[0]?.workspaceId ?? ""}
        onChange={(event) => onWorkspaceChange?.(event.currentTarget.value)}
        options={items.map((item) => ({ value: item.workspaceId, label: item.label }))}
      />
    </div>
  );
}
