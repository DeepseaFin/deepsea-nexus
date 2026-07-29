import { DealProvider } from "@/components/atlas/common/DealContext";
import { SearchRegistryProvider } from "@/components/atlas/design-system/SearchRegistry";

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealProvider>
      <SearchRegistryProvider>
        {children}
      </SearchRegistryProvider>
    </DealProvider>
  );
}