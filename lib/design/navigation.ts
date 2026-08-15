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
    id: "atlas",
    label: "ATLAS",
    href: "/atlas",
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
    id: "product-home",
    label: "Product Home",
    href: "/atlas/product-home",
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
    id: "dashboard",
    label: "Dashboard",
    href: "/atlas/dashboard",
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
    roles: ["executive", "relationship_manager", "credit_analyst", "observer"],
  },
  {
    id: "business-passport",
    label: "Business Passport",
    href: "/atlas/business-passport",
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
    id: "deals",
    label: "Deals",
    href: "/atlas/deals",
    icon: "briefcase-business",
    roles: ["executive", "relationship_manager", "credit_analyst", "operations_lead"],
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
    roles: ["executive", "credit_analyst", "operations_lead", "compliance_officer"],
  },
  {
    id: "portfolio",
    label: "Portfolio",
    href: "/atlas/portfolio",
    icon: "pie-chart",
    roles: ["executive", "relationship_manager", "credit_analyst", "observer"],
  },
  {
    id: "reports",
    label: "Reports",
    href: "/atlas/reports",
    icon: "bar-chart-3",
    roles: ["executive", "operations_lead", "compliance_officer", "observer"],
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
