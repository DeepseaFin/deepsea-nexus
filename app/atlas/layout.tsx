import { DealProvider } from "@/components/atlas/common/DealContext";
import { SearchRegistryProvider } from "@/components/atlas/design-system/SearchRegistry";
import DNOSShell from "@/components/layout/DNOSShell";

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealProvider>
      <SearchRegistryProvider>
        <DNOSShell>{children}</DNOSShell>
      </SearchRegistryProvider>
    </DealProvider>
  );
}