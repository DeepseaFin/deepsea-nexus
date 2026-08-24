import { iconForProductNavigation } from "@/components/product/ProductShell";
import type { ProductBreadcrumbItem } from "@/components/product/Breadcrumbs";
import type { ProductSidebarItem } from "@/components/product/ProductSidebar";
import type { NavigationItem } from "@/lib/design/navigation";
import {
  getNavigationForRole,
  getNavigationHomeHrefForRole,
} from "@/lib/design/navigation";
import { type UserRole } from "@/lib/design/roles";

export interface ShellNavigationInput {
  readonly role: UserRole;
  readonly pathname: string;
}

export interface ShellNavigation {
  readonly currentItem?: NavigationItem;
  readonly activeSidebarItemId?: string;
  readonly sidebarItems: readonly ProductSidebarItem[];
  readonly breadcrumbs: readonly ProductBreadcrumbItem[];
}

function toTitle(segment: string): string {
  return segment
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveCurrentItem(role: UserRole, pathname: string): NavigationItem | undefined {
  const items = getNavigationForRole(role);

  const matchingItems = items.filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`));
  if (matchingItems.length === 0) {
    return undefined;
  }

  return matchingItems.sort((left, right) => right.href.length - left.href.length)[0];
}

function createSidebarItems(role: UserRole): readonly ProductSidebarItem[] {
  return getNavigationForRole(role).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    icon: iconForProductNavigation(item.icon),
  }));
}

function createBreadcrumbs(role: UserRole, pathname: string): readonly ProductBreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);
  const generated = segments.map((segment, index) => ({
    label: toTitle(segment),
    href: `/${segments.slice(0, index + 1).join("/")}`,
  }));

  return [{ label: "Home", href: getNavigationHomeHrefForRole(role) }, ...generated];
}

export function createShellNavigation(input: ShellNavigationInput): ShellNavigation {
  const currentItem = resolveCurrentItem(input.role, input.pathname);

  return {
    currentItem,
    activeSidebarItemId: currentItem?.id,
    sidebarItems: createSidebarItems(input.role),
    breadcrumbs: createBreadcrumbs(input.role, input.pathname),
  };
}