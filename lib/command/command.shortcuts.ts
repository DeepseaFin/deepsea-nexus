export interface CommandShortcutConfig {
  readonly openKey: string;
  readonly closeKey: string;
}

export const COMMAND_SHORTCUTS: CommandShortcutConfig = {
  openKey: "k",
  closeKey: "Escape",
};

export function isOpenCommandShortcut(event: KeyboardEvent): boolean {
  return (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === COMMAND_SHORTCUTS.openKey;
}

export function isCloseCommandShortcut(event: KeyboardEvent): boolean {
  return event.key === COMMAND_SHORTCUTS.closeKey;
}
