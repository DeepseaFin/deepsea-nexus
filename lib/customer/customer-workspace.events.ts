import type {
  CustomerWorkspaceActionEvent,
  CustomerWorkspaceTabId,
} from "@/lib/customer/customer-workspace.types";

export const CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT = "customer-workspace:navigate-tab";
export const CUSTOMER_WORKSPACE_ACTION_EVENT = "customer-workspace:action";

export interface CustomerWorkspaceNavigateTabEventDetail {
  readonly tabId: CustomerWorkspaceTabId;
  readonly source: "command-palette" | "workspace";
}

export function dispatchCustomerWorkspaceTabNavigation(
  detail: CustomerWorkspaceNavigateTabEventDetail,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CustomerWorkspaceNavigateTabEventDetail>(
      CUSTOMER_WORKSPACE_NAVIGATE_TAB_EVENT,
      {
        detail,
      },
    ),
  );
}

export function dispatchCustomerWorkspaceActionEvent(
  detail: CustomerWorkspaceActionEvent,
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<CustomerWorkspaceActionEvent>(CUSTOMER_WORKSPACE_ACTION_EVENT, {
      detail,
    }),
  );
}
