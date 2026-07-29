export interface PublicNavigationItem {
  readonly href: string;
  readonly label: string;
}

export const PUBLIC_NAVIGATION_ITEMS: readonly PublicNavigationItem[] = [
  { href: "/", label: "Home" },
  { href: "/platform", label: "Platform" },
  { href: "/solutions", label: "Solutions" },
  { href: "/technology", label: "Technology" },
  { href: "/resources", label: "Resources" },
  { href: "/company", label: "Company" },
  { href: "/contact", label: "Contact" },
] as const;

export const PUBLIC_PATHS = new Set<string>([
  "/",
  "/platform",
  "/solutions",
  "/technology",
  "/resources",
  "/company",
  "/contact",
  "/login",
]);
