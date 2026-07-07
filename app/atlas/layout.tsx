import AtlasSidebar from "@/components/atlas/AtlasSidebar";
import { DealProvider } from "@/components/atlas/common/DealContext";
import AtlasGlobalHeader from "@/components/atlas/design-system/AtlasGlobalHeader";
import { SearchRegistryProvider } from "@/components/atlas/design-system/SearchRegistry";

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealProvider>
      <SearchRegistryProvider>
        <div className="flex min-h-screen bg-slate-950">
          <AtlasSidebar />

          <div className="flex min-w-0 flex-1 flex-col bg-slate-950">
            <AtlasGlobalHeader />
            <main className="atlas-workspace flex-1 bg-slate-950">{children}</main>
          </div>
        </div>
      </SearchRegistryProvider>
    </DealProvider>
  );
}