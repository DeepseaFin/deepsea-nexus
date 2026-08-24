import type { UserRole } from "@/lib/design/roles";

export const NAV_ICON_KEYS = [
  "layout-dashboard",
  "building-2",
  "briefcase-business",
  "files",
  "check-circle-2",
  "pie-chart",
  "bar-chart-3",
] as const;

export type NavigationIconKey = (typeof NAV_ICON_KEYS)[number];

export interface NavigationItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly icon: NavigationIconKey;
  readonly roles: readonly UserRole[];
}

export const primaryNavigation: readonly NavigationItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/atlas/institution-home",
    icon: "layout-dashboard",
    roles: [
      "executive",
      "relationship_manager",
      "credit_analyst",
      "operations_lead",
      "compliance_officer",
      "observer",
    ],
  },
  {
    id: "customers",
    label: "Customers",
    href: "/atlas/clients",
    icon: "building-2",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead", "compliance_officer"],
  },
  {
    id: "relationships",
    label: "Relationships",
    href: "/atlas/relationship-intelligence",
    icon: "building-2",
    roles: [
      "executive",
      "relationship_manager",
      "credit_analyst",
      "operations_lead",
      "compliance_officer",
      "observer",
    ],
  },
  {
    id: "opportunities",
    label: "Opportunities",
    href: "/atlas/opportunity",
    icon: "briefcase-business",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead", "compliance_officer", "observer"],
  },
  {
    id: "work-queue",
    label: "Work Queue",
    href: "/atlas/work-queue",
    icon: "layout-dashboard",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead", "compliance_officer"],
  },
  {
    id: "documents",
    label: "Documents",
    href: "/atlas/documents",
    icon: "files",
    roles: [
      "executive",
      "relationship_manager",
      "credit_analyst",
      "operations_lead",
      "compliance_officer",
      "observer",
    ],
  },
  {
    id: "approvals",
    label: "Approvals",
    href: "/atlas/approval-center",
    icon: "check-circle-2",
    roles: ["executive", "credit_analyst", "operations_lead", "compliance_officer", "observer"],
  },
  {
    id: "intelligence",
    label: "Intelligence",
    href: "/atlas/intelligence",
    icon: "pie-chart",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead", "compliance_officer"],
  },
  {
    id: "settings",
    label: "Settings",
    href: "/atlas/settings",
    icon: "bar-chart-3",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead", "compliance_officer", "observer"],
  },
];

export function getNavigationForRole(role: UserRole): readonly NavigationItem[] {
  return primaryNavigation.filter((item) => item.roles.includes(role));
}

export function getNavigationHomeHrefForRole(
  role: UserRole,
  fallbackHref = "/atlas/dashboard",
): string {
  const homeItem = getNavigationForRole(role).find((item) => item.id === "home");
  return homeItem?.href ?? fallbackHref;
}
