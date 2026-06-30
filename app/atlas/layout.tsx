import AtlasSidebar from "@/components/atlas/AtlasSidebar";
import { DealProvider } from "@/components/atlas/common/DealContext";

export default function AtlasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DealProvider>
      <div className="flex min-h-screen bg-slate-950">
        <AtlasSidebar />

        <main className="flex-1 bg-slate-950">
          {children}
        </main>
      </div>
    </DealProvider>
  );
}